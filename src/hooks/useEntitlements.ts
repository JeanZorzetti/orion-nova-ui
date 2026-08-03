"use client";

import { useEffect, useState } from "react";
import type { Entitlements } from "@/lib/account";

/**
 * O que o plano da conta libera, para as telas do dashboard.
 *
 * Devolve `null` enquanto carrega. Trate `null` como liberado: piscar o botão
 * de exportar para fora e para dentro a cada carregamento é pior que mostrá-lo
 * um instante antes da resposta.
 */
export function useEntitlements(): Entitlements | null {
  const [dados, setDados] = useState<Entitlements | null>(null);

  useEffect(() => {
    let ativo = true;
    fetch("/api/account/entitlements")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => ativo && setDados(d))
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  return dados;
}
