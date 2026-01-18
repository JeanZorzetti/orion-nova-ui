import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RelatedItem {
  title: string;
  href: string;
  excerpt?: string;
  category?: string;
  date?: string;
  readTime?: string;
  image?: string;
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
  variant?: "blog" | "card" | "list";
  className?: string;
  showAll?: boolean;
  maxItems?: number;
}

export function RelatedContent({
  items,
  title = "Conteúdo Relacionado",
  variant = "card",
  className,
  showAll = false,
  maxItems = 3,
}: RelatedContentProps) {
  const displayItems = showAll ? items : items.slice(0, maxItems);

  if (items.length === 0) {
    return null;
  }

  if (variant === "blog") {
    return (
      <div className={className}>
        <h3 className="text-2xl font-bold mb-6">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors h-full">
                {item.image ? (
                  <div
                    className="aspect-video bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="p-5">
                  {item.category && (
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                  )}
                  <h3 className="font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.excerpt}
                    </p>
                  )}
                  {(item.date || item.readTime) && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                      )}
                      {item.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.readTime}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={className}>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <ul className="space-y-3">
          {displayItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
              >
                <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  {item.category && (
                    <span className="text-xs text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        {!showAll && items.length > maxItems && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="#">
              Ver Todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors h-full">
              {item.category && (
                <Badge variant="secondary" className="mb-3">
                  {item.category}
                </Badge>
              )}
              <h4 className="font-semibold mb-2 line-clamp-2">{item.title}</h4>
              {item.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {item.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Skeleton loader for related content
export function RelatedContentSkeleton({
  variant = "card",
  count = 3,
  className,
}: {
  variant?: "blog" | "card" | "list";
  count?: number;
  className?: string;
}) {
  if (variant === "blog") {
    return (
      <div className={className}>
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                <div className="h-5 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={className}>
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4" />
        <ul className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 p-3">
              <div className="w-4 h-4 bg-muted rounded animate-pulse flex-shrink-0" />
              <div className="h-4 bg-muted rounded animate-pulse flex-1" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
            <div className="h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
