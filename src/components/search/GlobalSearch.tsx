"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  FolderOpen,
  File,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { trackSearch } from "@/lib/analytics";

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  excerpt?: string;
  url: string;
  type: "post" | "category" | "page";
  category?: { name: string };
  _count?: { posts: number };
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    posts?: SearchResult[];
    categories?: SearchResult[];
    staticPages?: SearchResult[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 2) {
        setResults({});
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok) {
          setResults(data.results);
          trackSearch(query);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(performSearch, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (url: string) => {
    router.push(url);
    onOpenChange(false);
    setQuery("");
    setResults({});
  };

  const totalResults =
    (results.posts?.length || 0) +
    (results.categories?.length || 0) +
    (results.staticPages?.length || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        {/* Search Input */}
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar no site..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          {query.length < 2 ? (
            <div className="text-center text-muted-foreground py-8">
              <Search className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Digite pelo menos 2 caracteres para buscar</p>
            </div>
          ) : totalResults === 0 && !isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              <Search className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Nenhum resultado encontrado para &quot;{query}&quot;</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Posts */}
              {results.posts && results.posts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Artigos do Blog</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {results.posts.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {results.posts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => handleSelect(post.url)}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate group-hover:text-primary transition-colors">
                              {post.title}
                            </div>
                            {post.excerpt && (
                              <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {post.excerpt}
                              </div>
                            )}
                            {post.category && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {post.category.name}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories && results.categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Categorias</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {results.categories.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {results.categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleSelect(category.url)}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate group-hover:text-primary transition-colors">
                              {category.title}
                            </div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {category.description}
                              </div>
                            )}
                            {category._count && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {category._count.posts} posts
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Static Pages */}
              {results.staticPages && results.staticPages.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Páginas</h3>
                    <Badge variant="secondary" className="ml-auto">
                      {results.staticPages.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {results.staticPages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => handleSelect(page.url)}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate group-hover:text-primary transition-colors">
                              {page.title}
                            </div>
                            {page.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {page.description}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalResults > 0 && (
          <div className="border-t p-3 text-xs text-muted-foreground text-center">
            {totalResults} resultado{totalResults !== 1 ? "s" : ""} encontrado{totalResults !== 1 ? "s" : ""}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
