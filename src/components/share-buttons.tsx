"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Linkedin,
  Facebook,
  Link2,
  Mail,
  MessageCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact" | "vertical";
  showLabels?: boolean;
}

export function ShareButtons({
  url,
  title,
  description,
  className,
  variant = "default",
  showLabels = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Use current URL if not provided
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "Confira este conteúdo";
  const shareDescription = description || "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareTitle)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
      href: `https://wa.me/?text=${encodeURIComponent(
        `${shareTitle} ${shareUrl}`
      )}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "hover:bg-muted hover:text-foreground",
      href: `mailto:?subject=${encodeURIComponent(
        shareTitle
      )}&body=${encodeURIComponent(`${shareDescription}\n\n${shareUrl}`)}`,
    },
  ];

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {shareLinks.slice(0, 3).map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            size="icon"
            className={cn("w-8 h-8", link.color)}
            asChild
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Compartilhar no ${link.name}`}
            >
              <link.icon className="w-4 h-4" />
            </a>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 hover:bg-muted"
          onClick={handleCopyLink}
          aria-label="Copiar link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
        </Button>
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="sm"
            className={cn("justify-start", link.color)}
            asChild
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              <link.icon className="w-4 h-4 mr-2" />
              {link.name}
            </a>
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="justify-start hover:bg-muted"
          onClick={handleCopyLink}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Link Copiado!
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4 mr-2" />
              Copiar Link
            </>
          )}
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size={showLabels ? "default" : "icon"}
          className={cn(link.color)}
          asChild
        >
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${link.name}`}
          >
            <link.icon className={cn("w-4 h-4", showLabels && "mr-2")} />
            {showLabels && link.name}
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size={showLabels ? "default" : "icon"}
        className="hover:bg-muted"
        onClick={handleCopyLink}
        aria-label="Copiar link"
      >
        {copied ? (
          <>
            <Check className={cn("w-4 h-4", showLabels && "mr-2")} />
            {showLabels && "Copiado!"}
          </>
        ) : (
          <>
            <Link2 className={cn("w-4 h-4", showLabels && "mr-2")} />
            {showLabels && "Copiar Link"}
          </>
        )}
      </Button>
    </div>
  );
}
