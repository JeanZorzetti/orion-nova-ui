"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { getLocaleDisplayName } from "@/lib/i18n";

const locales = [
  { code: "pt-BR", name: "Português (BR)", flag: "🇧🇷" },
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
];

interface LocaleSwitcherProps {
  currentLocale?: string;
}

export default function LocaleSwitcher({
  currentLocale = "pt-BR",
}: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [locale, setLocale] = useState(currentLocale);

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      setLocale(newLocale);

      // Salvar preferência no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("preferredLocale", newLocale);
      }

      // Recarregar a página com o novo locale
      // Nota: Em uma implementação completa com rotas i18n,
      // seria necessário atualizar a URL para incluir o locale
      router.refresh();
    });
  };

  const currentLocaleData = locales.find((l) => l.code === locale) || locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isPending}>
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{currentLocaleData.name}</span>
          <span className="sm:hidden">{currentLocaleData.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className="cursor-pointer"
          >
            <span className="mr-2">{loc.flag}</span>
            <span className="flex-1">{loc.name}</span>
            {locale === loc.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
