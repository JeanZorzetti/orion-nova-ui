"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "compact" | "card";
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
}

export function NewsletterForm({
  className,
  variant = "default",
  title = "Newsletter",
  description = "Receba dicas de gestão e novidades direto no seu email.",
  placeholder = "Seu melhor email",
  buttonText = "Inscrever-se",
  successMessage = "Inscrito com sucesso!",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Por favor, insira seu email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor, insira um email válido.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, call your API:
      // await fetch("/api/newsletter", {
      //   method: "POST",
      //   body: JSON.stringify({ email }),
      // });

      setIsSuccess(true);
      setEmail("");
    } catch {
      setError("Erro ao inscrever. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className={cn(
          "text-center py-4",
          variant === "card" &&
            "bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6",
          className
        )}
      >
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{successMessage}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Verifique sua caixa de entrada para confirmar.
        </p>
        <Button
          variant="link"
          size="sm"
          onClick={() => setIsSuccess(false)}
          className="mt-2"
        >
          Inscrever outro email
        </Button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={cn("space-y-2", className)}>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6",
          className
        )}
      >
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Inscrevendo...
              </>
            ) : (
              buttonText
            )}
          </Button>
          {error && <p className="text-xs text-destructive text-center">{error}</p>}
        </form>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Sem spam. Cancele quando quiser.
        </p>
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder={placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              buttonText
            )}
          </Button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground">
          Sem spam. Cancele quando quiser.
        </p>
      </form>
    </div>
  );
}
