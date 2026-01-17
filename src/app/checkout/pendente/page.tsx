"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, ArrowLeft, Mail, RefreshCw } from "lucide-react";

export default function CheckoutPendentePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-yellow-500/5 p-4">
      <div className="w-full max-w-md text-center">
        {/* Pending Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/10 mb-4">
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <Card className="border-yellow-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-500">
              Pagamento Pendente
            </CardTitle>
            <CardDescription>
              Estamos aguardando a confirmação do pagamento
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">
                    Se você pagou via boleto ou PIX, aguarde alguns instantes.
                    Você receberá um email assim que o pagamento for confirmado.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Verificar status
              </Button>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao início
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                O processamento pode levar até 72 horas para boletos bancários.
                Pagamentos via PIX são processados em poucos minutos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
