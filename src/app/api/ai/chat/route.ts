import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const GROK_API_URL = "https://api.x.ai/v1/chat/completions";
const GROK_API_KEY = process.env.GROK_API_KEY;

// Sistema de prompt especializado em ERP
const SYSTEM_PROMPT = `Você é Orion AI, um assistente especializado em ERP e gestão empresarial integrado ao sistema Orion ERP.

**Sua expertise inclui:**
- Gestão financeira e contábil
- Controle de estoque e inventário
- Gestão de vendas e pedidos
- Relacionamento com clientes (CRM)
- Análise de métricas e KPIs empresariais
- Fluxo de caixa e contas a pagar/receber
- Planejamento estratégico empresarial
- Otimização de processos operacionais
- Compliance fiscal e tributário
- Gestão de fornecedores

**Diretrizes de resposta:**
1. Seja direto e objetivo nas respostas
2. Use dados e métricas quando relevante
3. Ofereça insights práticos e acionáveis
4. Sugira melhores práticas do mercado
5. Adapte a linguagem ao contexto empresarial brasileiro
6. Quando mencionar recursos do sistema, seja específico sobre funcionalidades do Orion ERP
7. Priorize soluções que melhorem eficiência operacional e rentabilidade

**Módulos disponíveis no Orion ERP:**
- Dashboard com métricas em tempo real
- Cadastro e gestão de clientes
- Catálogo de produtos e serviços
- Gestão de vendas e pedidos
- Controle financeiro (contas a pagar e receber)
- Relatórios gerenciais (vendas, clientes, financeiro)
- Configurações do sistema

Sempre contextualize suas respostas ao cenário de pequenas e médias empresas brasileiras.`;

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    if (!GROK_API_KEY) {
      return NextResponse.json(
        { error: "GROK_API_KEY não configurada no servidor" },
        { status: 500 }
      );
    }

    const { messages, temperature = 0.7 } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 }
      );
    }

    // Adiciona o system prompt no início
    const fullMessages: Message[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages,
    ];

    // Chamada para a API do Grok
    const response = await fetch(GROK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: fullMessages,
        temperature,
        max_tokens: 2000,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na API do Grok:", errorData);
      return NextResponse.json(
        { error: "Erro ao comunicar com Grok AI", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extrai a resposta do assistente
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "Resposta inválida da API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Erro no endpoint de chat:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
