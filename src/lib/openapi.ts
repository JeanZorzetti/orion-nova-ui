/**
 * OpenAPI 3.0 Specification for Orion ERP
 */

export const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Orion ERP API",
    version: "1.0.0",
    description: "API completa do sistema Orion ERP para gestão empresarial",
    contact: {
      name: "ROI Labs",
      url: "https://orion.roilabs.com.br",
      email: "contato@roilabs.com.br",
    },
    license: {
      name: "Proprietary",
    },
  },
  servers: [
    {
      url: "https://orion.roilabs.com.br/api",
      description: "Produção",
    },
    {
      url: "http://localhost:3000/api",
      description: "Desenvolvimento",
    },
  ],
  tags: [
    { name: "Auth", description: "Autenticação e autorização" },
    { name: "Customers", description: "Gestão de clientes" },
    { name: "Products", description: "Gestão de produtos e serviços" },
    { name: "Sales", description: "Vendas e pedidos" },
    { name: "Financial", description: "Financeiro e transações" },
    { name: "Reports", description: "Relatórios e analytics" },
    { name: "Users", description: "Gestão de usuários" },
  ],
  paths: {
    "/customers": {
      get: {
        tags: ["Customers"],
        summary: "Listar clientes",
        description: "Retorna lista paginada de clientes",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Número da página",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            description: "Itens por página",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Buscar por nome ou email",
          },
        ],
        responses: {
          "200": {
            description: "Lista de clientes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    customers: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Customer" },
                    },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                  },
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
      post: {
        tags: ["Customers"],
        summary: "Criar cliente",
        description: "Cria um novo cliente no sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CustomerInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cliente criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Customer" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { $ref: "#/components/responses/Unauthorized" },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
    },
    "/customers/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Buscar cliente por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Cliente encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Customer" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
      put: {
        tags: ["Customers"],
        summary: "Atualizar cliente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CustomerInput" },
            },
          },
        },
        responses: {
          "200": {
            description: "Cliente atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Customer" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
      delete: {
        tags: ["Customers"],
        summary: "Deletar cliente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "Cliente deletado" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Listar produtos",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": {
            description: "Lista de produtos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                    total: { type: "integer" },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
      post: {
        tags: ["Products"],
        summary: "Criar produto",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Produto criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
    },
    "/orders": {
      get: {
        tags: ["Sales"],
        summary: "Listar pedidos",
        parameters: [
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Lista de pedidos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
    },
    "/financial": {
      get: {
        tags: ["Financial"],
        summary: "Buscar transações financeiras",
        parameters: [
          {
            name: "type",
            in: "query",
            schema: { type: "string", enum: ["INCOME", "EXPENSE"] },
          },
          {
            name: "startDate",
            in: "query",
            schema: { type: "string", format: "date" },
          },
          {
            name: "endDate",
            in: "query",
            schema: { type: "string", format: "date" },
          },
        ],
        responses: {
          "200": {
            description: "Transações financeiras",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Transaction" },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }, { apiKeyAuth: [] }],
      },
    },
  },
  components: {
    schemas: {
      Customer: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          document: { type: "string" },
          type: { type: "string", enum: ["PF", "PJ"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CustomerInput: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          phone: { type: "string" },
          document: { type: "string" },
          type: { type: "string", enum: ["PF", "PJ"] },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number", format: "double" },
          stock: { type: "integer" },
          category: { type: "string" },
          active: { type: "boolean" },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "price"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number", minimum: 0 },
          stock: { type: "integer", minimum: 0, default: 0 },
          category: { type: "string" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          customerId: { type: "string" },
          total: { type: "number" },
          status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
          },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      OrderItem: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "integer" },
          price: { type: "number" },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["INCOME", "EXPENSE"] },
          amount: { type: "number" },
          description: { type: "string" },
          category: { type: "string" },
          date: { type: "string", format: "date" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
          statusCode: { type: "integer" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Não autorizado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
            example: {
              error: "Unauthorized",
              message: "Token inválido ou expirado",
              statusCode: 401,
            },
          },
        },
      },
      BadRequest: {
        description: "Requisição inválida",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
      NotFound: {
        description: "Recurso não encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Error" },
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtido via autenticação",
      },
      apiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description:
          "API key gerada em /dashboard/configuracoes/api-keys. Sem ela (ou com chave inválida/expirada) a resposta é 401.",
      },
    },
  },
};
