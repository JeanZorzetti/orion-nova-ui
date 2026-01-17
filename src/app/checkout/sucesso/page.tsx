import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowRight, Rocket } from "lucide-react";

export default function CheckoutSucessoPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-green-500/5 p-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <Card className="border-green-500/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-green-500">
              Pagamento Confirmado!
            </CardTitle>
            <CardDescription>
              Sua assinatura foi ativada com sucesso
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-green-500" />
                <div className="text-left">
                  <p className="font-medium">Bem-vindo ao Orion!</p>
                  <p className="text-sm text-muted-foreground">
                    Agora você tem acesso a todos os recursos do seu plano.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full" size="lg">
                  Acessar Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/assinaturas">
                <Button variant="outline" className="w-full">
                  Ver minha assinatura
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground mt-6">
          Você receberá um email de confirmação em breve.
        </p>
      </div>
    </div>
  );
}
