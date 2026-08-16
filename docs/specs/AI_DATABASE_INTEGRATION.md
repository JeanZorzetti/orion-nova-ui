# Integração IA + Banco de Dados - Orion ERP

## Visão Geral

A Orion AI está conectada ao banco de dados PostgreSQL do sistema, permitindo que ela forneça respostas **personalizadas e contextuais** baseadas nos dados reais de cada cliente.

## Como Funciona

### 1. Contexto Automático

Quando você conversa com a Orion AI, ela automaticamente:

- ✅ Acessa seus dados do banco de dados
- ✅ Analisa estatísticas do seu negócio
- ✅ Identifica problemas e oportunidades
- ✅ Fornece insights baseados em dados reais

### 2. Dados Disponíveis para a IA

A IA tem acesso aos seguintes dados (sempre filtrados por usuário logado):

#### Estatísticas Gerais
- Total de clientes ativos
- Total de produtos cadastrados
- Total de vendas realizadas
- Volume total de vendas
- Total de transações financeiras

#### Situação Financeira
- Contas a receber pendentes
- Contas a pagar pendentes
- Saldo projetado (receber - pagar)
- Contas em atraso

#### Clientes
- **Clientes cadastrados na última semana**
- Informações: nome, tipo (PF/PJ), email, telefone
- Data de cadastro
- Filtro: últimos 7 dias

#### Produtos
- **Produtos com estoque baixo** (≤ estoque mínimo)
- Informações: nome, SKU, quantidade atual, quantidade mínima
- Alertas automáticos de estoque
- Sem limite de tempo (sempre relevante)

#### Vendas
- **Vendas realizadas na última semana**
- Informações: número do pedido, cliente, valor, status, data
- Status traduzido para português
- Filtro: últimos 7 dias

#### Contas a Receber (próximos 30 dias)
- **Todas as contas a receber** com vencimento nos próximos 30 dias
- Descrição, cliente, valor, data de vencimento
- Dias até o vencimento
- Filtro: próximos 30 dias

#### Contas a Pagar (próximos 30 dias)
- **Todas as contas a pagar** com vencimento nos próximos 30 dias
- Descrição, valor, data de vencimento
- Dias até o vencimento
- Filtro: próximos 30 dias

## Exemplos de Uso

### Perguntas que a IA pode responder com dados reais:

**Sobre Clientes:**
- "Quantos clientes eu tenho cadastrados?"
- "Quais foram meus últimos clientes cadastrados?"
- "Mostre informações dos meus clientes mais recentes"

**Sobre Produtos:**
- "Quais produtos estão com estoque baixo?"
- "Tenho algum produto zerado?"
- "Quantos produtos tenho cadastrados?"

**Sobre Vendas:**
- "Qual foi meu faturamento total até agora?"
- "Mostre minhas vendas recentes"
- "Quantas vendas já realizei?"

**Sobre Financeiro:**
- "Qual meu saldo projetado?"
- "Quanto tenho a receber?"
- "Quanto tenho a pagar?"
- "Tenho contas atrasadas?"
- "Quais contas vencem nos próximos dias?"

**Análises Estratégicas:**
- "Como está a saúde financeira do meu negócio?"
- "O que devo fazer para melhorar meu fluxo de caixa?"
- "Preciso repor estoque de algum produto?"
- "Quais são os principais alertas do meu negócio?"

## Segurança

### Isolamento de Dados
- ✅ Cada usuário vê APENAS seus próprios dados
- ✅ Filtragem por `userId` em todas as queries
- ✅ Autenticação obrigatória via NextAuth

### Permissões
- ✅ Acesso somente leitura ao banco de dados
- ✅ IA não pode modificar, deletar ou criar dados
- ✅ IA apenas informa e orienta

### Privacidade
- ✅ Dados não são compartilhados entre usuários
- ✅ Groq AI não treina com seus dados (privacy by design)
- ✅ Conversas não são armazenadas permanentemente

## Arquitetura Técnica

### Arquivos Principais

**`src/lib/ai-context.ts`**
- Função `getUserContextForAI(userId)` busca e formata dados
- Queries otimizadas com `Promise.all` (execução paralela)
- Formatação de dados para contexto legível pela IA

**`src/app/api/ai/chat/route.ts`**
- Endpoint que recebe mensagens do chat
- Injeta contexto do usuário no prompt da IA
- Combina SYSTEM_PROMPT + contexto + mensagens do usuário

### Fluxo de Dados

```
Usuário → Frontend (ai-assistant.tsx)
    ↓
API Route (/api/ai/chat)
    ↓
getUserContextForAI(userId) → Busca dados do PostgreSQL
    ↓
Contexto + SYSTEM_PROMPT + Mensagens → Groq AI (LLaMA 3.3 70B)
    ↓
Resposta Personalizada → Usuário
```

## Performance

### Otimizações Implementadas

1. **Queries Paralelas**: Uso de `Promise.all` para buscar múltiplos dados simultaneamente
2. **Limites de Dados**:
   - Máximo 5 clientes recentes
   - Máximo 10 produtos com estoque baixo
   - Máximo 5 vendas recentes
   - Máximo 5 contas a receber/pagar
3. **Índices no Banco**: Schema Prisma com índices apropriados
4. **Cache de Prisma**: Cliente Prisma reutilizado (singleton pattern)

### Tempo de Resposta Esperado

- Busca de contexto: ~100-300ms
- Chamada Groq AI: ~500-1500ms (ultra rápido graças ao Groq)
- **Total**: ~600-1800ms por resposta

## Expansões Futuras

### Dados Adicionais que Podem Ser Integrados

- [ ] Análise de produtos mais vendidos
- [ ] Ticket médio por cliente
- [ ] Taxa de conversão de pedidos
- [ ] Projeção de fluxo de caixa (30/60/90 dias)
- [ ] Comparativos mês a mês (MoM)
- [ ] Comparativos ano a ano (YoY)
- [ ] Análise de sazonalidade
- [ ] Curva ABC de clientes
- [ ] Curva ABC de produtos
- [ ] Margem de contribuição por produto
- [ ] Indicadores de inadimplência

### Funcionalidades Avançadas

- [ ] IA sugere ações proativas (ex: "Repor produto X que está em falta")
- [ ] Relatórios automáticos gerados pela IA
- [ ] Previsão de demanda com ML
- [ ] Detecção de anomalias em vendas/financeiro
- [ ] Recomendação de produtos para upsell/cross-sell

## Manutenção

### Logs de Debug

Em desenvolvimento, o sistema gera logs:

```
Recebido no backend: {...}
✅ Contexto do usuário carregado com sucesso
```

### Tratamento de Erros

Se houver erro ao buscar dados:
- Sistema não quebra
- Retorna mensagem genérica: "Não foi possível carregar os dados do usuário no momento."
- Erro é logado no console do servidor

## Conclusão

A integração da IA com o banco de dados transforma a Orion AI de um chatbot genérico em um **verdadeiro assistente inteligente de negócios**, capaz de fornecer insights específicos, identificar problemas reais e sugerir ações baseadas nos dados únicos de cada cliente.

---

**Powered by:**
- 🤖 Groq AI (LLaMA 3.3 70B Versatile)
- 🗄️ PostgreSQL + Prisma ORM
- ⚡ Next.js 15 + TypeScript
