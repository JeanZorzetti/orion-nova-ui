"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SubscriptionGateProps {
  isBlocked: boolean;
  reason: string;
}

export function SubscriptionGate({ isBlocked, reason }: SubscriptionGateProps) {
  const router = useRouter();

  if (!isBlocked) {
    return null;
  }

  return (
    <Dialog open={isBlocked} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Acesso Limitado
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            Com o Orion ERP Premium você tem:
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Acesso ilimitado a todos os módulos</li>
            <li>• Clientes, produtos e vendas sem limites</li>
            <li>• Assistente IA com dados do seu negócio</li>
            <li>• Suporte prioritário</li>
            <li>• Relatórios avançados</li>
            <li>• Backup automático diário</li>
          </ul>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="w-full sm:w-auto"
          >
            Voltar ao Dashboard
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/precos">
              <Crown className="w-4 h-4 mr-2" />
              Ver Planos e Preços
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
