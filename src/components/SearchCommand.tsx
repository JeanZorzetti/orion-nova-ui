import { Search, Sparkles } from "lucide-react";

const SearchCommand = () => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card px-4 py-3 flex items-center gap-3 cursor-pointer hover-glow transition-all duration-300 group">
        <div className="relative">
          <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <span className="text-muted-foreground text-sm flex-1">
          Pergunte à Orion AI ou busque módulos...
        </span>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent animate-pulse-glow" />
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-border bg-muted px-2 text-xs text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default SearchCommand;
