import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";

export default function CheckoutErroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-red-500/5 p-4">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <Card className="border-red-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500">
              Pagamento não realizado
            </CardTitle>
            <CardDescription>
              Houve um problema ao processar seu pagamento
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-sm text-muted-foreground">
                Isso pode acontecer por diversos motivos: cartão recusado, saldo
                insuficiente, dados incorretos, etc.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/precos">
                <Button className="w-full" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao início
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t">
              <Link
                href="/suporte"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Precisa de ajuda? Fale conosco
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
