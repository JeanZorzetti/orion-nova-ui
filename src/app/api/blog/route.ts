import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/blog - Listar posts do blog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "PUBLISHED";
    const tag = searchParams.get("tag") || "";

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    // Se não for admin, mostrar apenas publicados
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";

    if (!isAdmin) {
      where.status = "PUBLISHED";
    } else if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            slug: tag,
          },
        },
      };
    }

    // Buscar posts
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // Formatar resposta
    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: post.tags.map((t) => t.tag),
    }));

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar posts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog - Criar novo post (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      categoryId,
      status,
      publishedAt,
      metaTitle,
      metaDescription,
      metaKeywords,
      tags,
    } = body;

    // Validações básicas
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Título, slug e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se já existe post com esse slug
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "Já existe um post com este slug" },
        { status: 400 }
      );
    }

    // Processar tags (criar se não existirem)
    const tagConnections = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName.trim()) continue;

        const tagSlug = tagName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Buscar ou criar tag
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName.trim(),
            slug: tagSlug,
          },
        });

        tagConnections.push({
          tag: {
            connect: { id: tag.id },
          },
        });
      }
    }

    // Criar post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        authorId: session.user.id,
        categoryId,
        status: status || "DRAFT",
        publishedAt: publishedAt ? new Date(publishedAt) : status === "PUBLISHED" ? new Date() : null,
        metaTitle,
        metaDescription,
        metaKeywords,
        tags: tagConnections.length > 0 ? {
          create: tagConnections,
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json(
      { error: "Erro ao criar post" },
      { status: 500 }
    );
  }
}

// PUT /api/blog - Atualizar post (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, tagIds, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do post é obrigatório" },
        { status: 400 }
      );
    }

    // Se estiver publicando, definir publishedAt
    if (data.status === "PUBLISHED" && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    // Atualizar tags se fornecidas
    if (tagIds) {
      await prisma.tagOnPost.deleteMany({
        where: { postId: id },
      });

      if (tagIds.length > 0) {
        await prisma.tagOnPost.createMany({
          data: tagIds.map((tagId: string) => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar post" },
      { status: 500 }
    );
  }
}

// DELETE /api/blog - Deletar post (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do post é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Post deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return NextResponse.json(
      { error: "Erro ao deletar post" },
      { status: 500 }
    );
  }
}
