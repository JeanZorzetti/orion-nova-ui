"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Package, ShoppingCart, DollarSign, CheckCircle2, Database, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);
  const [hasSampleData, setHasSampleData] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se já viu o onboarding
    const seen = localStorage.getItem("orion-onboarding-seen");
    if (!seen) {
      setHasSeenOnboarding(false);
      setIsOpen(true);
    }

    // Verificar se tem dados de exemplo
    checkSampleData();
  }, []);

  const checkSampleData = async () => {
    try {
      const response = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const data = await response.json();
      setHasSampleData(data.exists);
    } catch (error) {
      console.error("Erro ao verificar dados de exemplo:", error);
    }
  };

  const handleAddSampleData = async () => {
    setIsLoadingSample(true);
    try {
      const response = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "populate" }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "✅ Dados de exemplo adicionados!",
          description: `${data.data.customers} clientes, ${data.data.products} produtos, ${data.data.salesOrders} vendas e ${data.data.financialTransactions} transações financeiras criadas.`,
        });
        setHasSampleData(true);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar dados",
        description: error.message || "Não foi possível adicionar os dados de exemplo.",
      });
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleRemoveSampleData = async () => {
    setIsLoadingSample(true);
    try {
      const response = await fetch("/api/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🗑️ Dados de exemplo removidos!",
          description: `${data.data.customers} clientes, ${data.data.products} produtos, ${data.data.salesOrders} vendas e ${data.data.financialTransactions} transações removidas.`,
        });
        setHasSampleData(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover dados",
        description: error.message || "Não foi possível remover os dados de exemplo.",
      });
    } finally {
      setIsLoadingSample(false);
    }
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Bem-vindo ao Orion ERP! 🚀",
      description: "Seu sistema completo de gestão empresarial",
      icon: <Sparkles className="w-12 h-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            O <strong>Orion ERP</strong> é uma plataforma completa para gerenciar seu negócio.
            Vamos fazer um tour rápido pelos principais recursos!
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h4 className="font-medium">Clientes</h4>
                <p className="text-sm text-muted-foreground">Gerencie sua base de clientes</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-medium">Produtos</h4>
                <p className="text-sm text-muted-foreground">Controle seu estoque</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShoppingCart className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Vendas</h4>
                <p className="text-sm text-muted-foreground">Registre pedidos e vendas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-yellow-500 mt-1" />
              <div>
                <h4 className="font-medium">Financeiro</h4>
                <p className="text-sm text-muted-foreground">Contas a pagar e receber</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Assistente IA Integrado 🤖",
      description: "Sua assistente inteligente conectada aos seus dados",
      icon: <Sparkles className="w-12 h-12 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            A <strong>Orion AI</strong> é sua assistente inteligente que está{" "}
            <span className="text-primary font-semibold">conectada ao seu banco de dados</span>.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              O que ela pode fazer:
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground ml-6">
              <li>• Responder perguntas sobre <strong>seus clientes</strong></li>
              <li>• Alertar sobre <strong>produtos com estoque baixo</strong></li>
              <li>• Mostrar <strong>vendas recentes</strong> e métricas</li>
              <li>• Informar sobre <strong>contas a pagar e receber</strong></li>
              <li>• Dar <strong>insights sobre seu negócio</strong></li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Clique no ícone <Sparkles className="w-4 h-4 inline text-primary" /> no canto inferior direito
            para conversar com a Orion AI a qualquer momento!
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "Dados de Exemplo 📊",
      description: "Explore o sistema com dados pré-configurados",
      icon: <Database className="w-12 h-12 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Para facilitar seu aprendizado, podemos adicionar <strong>dados de exemplo</strong> ao sistema.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Os dados incluem:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>3 clientes</strong> de exemplo (PF e PJ)</li>
              <li>• <strong>4 produtos</strong> (incluindo serviços)</li>
              <li>• <strong>2 pedidos de venda</strong> com diferentes status</li>
              <li>• <strong>6 transações financeiras</strong> (a receber e a pagar)</li>
              <li>• Produtos com <strong>estoque baixo</strong> para alertas</li>
              <li>• Uma conta <strong>atrasada</strong> para demonstração</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Todos os dados de exemplo são marcados com <code className="bg-muted px-1 rounded">[EXEMPLO]</code>{" "}
            e podem ser removidos a qualquer momento.
          </p>
          <div className="flex gap-3 mt-6">
            {hasSampleData ? (
              <Button
                onClick={handleRemoveSampleData}
                disabled={isLoadingSample}
                variant="destructive"
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isLoadingSample ? "Removendo..." : "Remover Dados de Exemplo"}
              </Button>
            ) : (
              <Button
                onClick={handleAddSampleData}
                disabled={isLoadingSample}
                className="flex-1"
              >
                <Database className="w-4 h-4 mr-2" />
                {isLoadingSample ? "Adicionando..." : "Adicionar Dados de Exemplo"}
              </Button>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Tudo Pronto! 🎉",
      description: "Comece a usar o Orion ERP agora",
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Você está pronto para começar a usar o <strong>Orion ERP</strong>!
          </p>
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4 space-y-3">
            <h4 className="font-medium">Próximos passos:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Explore os módulos através do menu lateral</li>
              <li>• Use <kbd className="bg-muted px-2 py-1 rounded text-xs">Ctrl/Cmd + K</kbd> para busca rápida</li>
              <li>• Converse com a Orion AI para tirar dúvidas</li>
              <li>• Cadastre seus primeiros clientes e produtos</li>
              <li>• Configure seu perfil nas Configurações</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            Você pode rever este tutorial a qualquer momento clicando no seu perfil e selecionando "Tutorial".
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem("orion-onboarding-seen", "true");
    setHasSeenOnboarding(true);
    setIsOpen(false);
    toast({
      title: "✨ Bem-vindo ao Orion ERP!",
      description: "Aproveite sua experiência conosco.",
    });
  };

  const handleSkip = () => {
    localStorage.setItem("orion-onboarding-seen", "true");
    setHasSeenOnboarding(true);
    setIsOpen(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {currentStepData.icon}
          </div>
          <DialogTitle className="text-center text-2xl">
            {currentStepData.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentStepData.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {currentStepData.content}
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Pular Tutorial
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                Anterior
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente para reabrir o onboarding manualmente
export function ReopenOnboarding({ children }: { children: React.ReactNode }) {
  const handleClick = () => {
    localStorage.removeItem("orion-onboarding-seen");
    window.location.reload();
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}
