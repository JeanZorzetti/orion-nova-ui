"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Circle, Database, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/lib/analytics";
import { progressoG5, rotuloG5, type G5Flags } from "@/lib/g5";

// Curva "The ROI Flow" do tema Orion Deep Space.
const ROI_FLOW: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface StepTrackerProps {
  flags: G5Flags | null;
  /** Recarrega os dados do dashboard depois de popular os dados de exemplo. */
  onRefresh: () => void | Promise<void>;
}

export default function StepTracker({ flags, onRefresh }: StepTrackerProps) {
  const [populando, setPopulando] = useState(false);
  const sucessoDisparado = useRef(false);
  const concluidosAnteriores = useRef<number | null>(null);

  const progresso = flags ? progressoG5(flags) : null;
  const completo = progresso?.completo ?? false;
  const concluidos = progresso?.concluidos ?? null;

  // g5_step_completed a cada passo que fecha; g5_flow_success uma única vez,
  // no instante em que o 4º fecha.
  useEffect(() => {
    if (concluidos === null) return;

    const anterior = concluidosAnteriores.current;
    concluidosAnteriores.current = concluidos;
    if (anterior !== null && concluidos > anterior) {
      trackEvent({ action: "g5_step_completed", category: "activation", value: concluidos });
    }

    if (completo && !sucessoDisparado.current) {
      sucessoDisparado.current = true;
      trackEvent({ action: "g5_flow_success", category: "activation", value: 4 });
    }
  }, [concluidos, completo]);

  // Concluído o ciclo, o tracker some: o Zeigarnik já fez o trabalho dele.
  if (!progresso || completo) return null;

  async function popularDadosDeExemplo() {
    setPopulando(true);
    try {
      const res = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "populate" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Falha ao popular");

      trackEvent({ action: "sample_data_populated", category: "activation" });
      await onRefresh();
      toast.success(
        "Seu ERP foi populado com dados de demonstração. Explore os relatórios agora!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Não foi possível popular os dados."
      );
    } finally {
      setPopulando(false);
    }
  }

  return (
    <Card className="mb-6 border-primary/30 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold">Comece a usar em 10 minutos</h2>
            <p className="text-sm text-muted-foreground">{rotuloG5(progresso)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={popularDadosDeExemplo}
              disabled={populando}
              className="min-h-[48px]"
            >
              {populando ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Database className="mr-2 h-4 w-4" />
              )}
              {populando ? "Populando..." : "Popular com Dados de Demonstração"}
            </Button>

            {progresso.proximo && (
              <Button asChild className="min-h-[48px]">
                <Link href={progresso.proximo.link}>
                  {progresso.proximo.titulo}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Barra de progresso: cor do tema (OKLCH via --primary do Tailwind),
            nunca hex cru — o primaryColor da conta muda a variável, não o CSS. */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
            initial={false}
            animate={{ width: `${progresso.percentual}%` }}
            transition={{ duration: 0.3, ease: ROI_FLOW }}
          />
        </div>

        {populando ? (
          // Skeleton com a mesma grade dos 4 passos: a tela não pisca de layout
          // quando os dados chegam.
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {progresso.passos.map((p) => (
              <Skeleton key={p.id} className="h-[52px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {progresso.passos.map((passo, i) => (
              <motion.div
                key={passo.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: ROI_FLOW, delay: i * 0.08 }}
              >
                <Link
                  href={passo.link}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                    passo.concluido
                      ? "border-green-500/30 bg-green-500/5 text-muted-foreground"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {passo.concluido ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={passo.concluido ? "line-through" : ""}>
                    {passo.titulo}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
