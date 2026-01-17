"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEMO_RESPONSES: Record<string, string> = {
  default: "Olá! Sou a Orion AI, sua assistente inteligente de ERP. Pergunte sobre gestão empresarial, clientes, estoque, vendas ou financeiro. **Cadastre-se para ter acesso completo com seus dados reais!**",

  clientes: "Com o Orion ERP, você pode gerenciar todos os seus clientes em um só lugar! Cadastre informações completas (PF/PJ), histórico de compras, e acompanhe o relacionamento. A IA integrada analisa seus dados reais e fornece insights personalizados. **Experimente grátis por 30 dias!**",

  estoque: "O módulo de Estoque do Orion permite controle total de produtos, alertas automáticos de estoque baixo, e gestão de múltiplos fornecedores. Você pode categorizar produtos, definir estoque mínimo, e receber notificações quando precisar repor. **Faça seu cadastro e gerencie seu estoque agora!**",

  vendas: "Registre pedidos, acompanhe o funil de vendas, e analise métricas em tempo real! O Orion ERP integra vendas com estoque e financeiro automaticamente. Você pode criar orçamentos, emitir notas, e ter visão 360° do seu negócio. **Comece seu trial gratuito de 30 dias!**",

  financeiro: "Controle total de contas a pagar e receber, fluxo de caixa, DRE, e muito mais! A Orion AI te avisa sobre contas próximas do vencimento e sugere ações para melhorar seu fluxo de caixa. **Cadastre-se e tenha acesso completo ao módulo financeiro!**",

  ia: "A Orion AI é uma assistente especializada em ERP que está **conectada ao seu banco de dados**. Ela responde perguntas sobre seus clientes, alerta sobre produtos com estoque baixo, mostra vendas recentes e muito mais - tudo com seus dados reais! **Esta é apenas uma preview. Cadastre-se para conversar com a IA integrada aos seus dados!**",

  preco: "O Orion ERP oferece **30 dias de trial gratuito** com acesso completo a todos os recursos! Após o trial, planos a partir de R$ 49,90/mês. Sem burocracia, sem cartão de crédito no cadastro. **Comece agora gratuitamente!**",
};

const SUGGESTED_QUESTIONS = [
  "Como gerenciar clientes?",
  "O que é a IA integrada?",
  "Como funciona o estoque?",
  "Quanto custa o Orion ERP?",
];

export default function AIPreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: DEMO_RESPONSES.default,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxMessages = 3; // Limite de 3 perguntas

  const userMessagesCount = messages.filter((m) => m.role === "user").length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("cliente") || input.includes("gerenciar")) {
      return DEMO_RESPONSES.clientes;
    }
    if (input.includes("estoque") || input.includes("produto")) {
      return DEMO_RESPONSES.estoque;
    }
    if (input.includes("venda") || input.includes("pedido")) {
      return DEMO_RESPONSES.vendas;
    }
    if (input.includes("financeiro") || input.includes("conta") || input.includes("fluxo de caixa")) {
      return DEMO_RESPONSES.financeiro;
    }
    if (input.includes("ia") || input.includes("inteligência") || input.includes("assistente")) {
      return DEMO_RESPONSES.ia;
    }
    if (input.includes("preço") || input.includes("quanto custa") || input.includes("valor") || input.includes("plano")) {
      return DEMO_RESPONSES.preco;
    }

    return "Ótima pergunta! Com o Orion ERP você pode gerenciar todo o seu negócio: clientes, produtos, vendas e financeiro - tudo integrado com IA. **Cadastre-se grátis para ter acesso completo e conversar com a IA sobre seus dados reais!**";
  };

  const handleSend = () => {
    if (!input.trim() || isLocked) return;

    if (userMessagesCount >= maxMessages) {
      setIsLocked(true);
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const assistantMessage: Message = {
      role: "assistant",
      content: getResponse(input),
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput("");

    if (userMessagesCount + 1 >= maxMessages) {
      setTimeout(() => {
        setIsLocked(true);
      }, 500);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (userMessagesCount >= maxMessages || isLocked) return;
    setInput(question);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">IA Integrada</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Converse com a Orion AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experimente nossa assistente inteligente especializada em ERP.
            Esta é uma preview limitada - cadastre-se para ter acesso completo com seus dados reais!
          </p>
        </div>

        {/* Chat Preview */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-primary/5 border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Orion AI</h3>
                    <p className="text-xs text-muted-foreground">
                      Preview Demo • {maxMessages - userMessagesCount} {maxMessages - userMessagesCount === 1 ? "pergunta restante" : "perguntas restantes"}
                    </p>
                  </div>
                </div>
                {isLocked && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full">
                    <Lock className="w-3 h-3 text-destructive" />
                    <span className="text-xs font-medium text-destructive">Preview Limitada</span>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLocked && (
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 max-w-md">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold">Preview Limitada Atingida</h4>
                      <p className="text-sm text-muted-foreground">
                        Você usou suas 3 perguntas grátis. Cadastre-se para ter acesso ilimitado e conversar com a IA sobre seus dados reais!
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/register">
                          Criar Conta Grátis
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions (only show if not locked) */}
            {!isLocked && userMessagesCount === 0 && (
              <div className="px-6 pb-4">
                <p className="text-xs text-muted-foreground mb-2">Perguntas sugeridas:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder={
                    isLocked
                      ? "Cadastre-se para continuar..."
                      : "Pergunte sobre ERP, gestão empresarial..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  disabled={isLocked}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLocked}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {!isLocked && (
                <p className="text-xs text-muted-foreground mt-2">
                  {maxMessages - userMessagesCount} {maxMessages - userMessagesCount === 1 ? "pergunta restante" : "perguntas restantes"} na preview
                </p>
              )}
            </div>
          </div>

          {/* CTA Below Chat */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Esta é apenas uma preview. Cadastre-se para conversar com a IA integrada aos seus dados!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/register">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Começar Trial Gratuito (30 dias)
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/recursos">
                  Ver Todos os Recursos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
