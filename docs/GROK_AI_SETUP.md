# Integração Grok AI - Orion ERP

## Visão Geral

O Orion ERP inclui um assistente de IA especializado em gestão empresarial e ERP, alimentado pelo **Grok** da xAI. Este assistente oferece insights inteligentes, análises de dados e recomendações personalizadas para otimizar a operação do seu negócio.

## Características da Orion AI

### Expertise Especializada
- **Gestão Financeira**: Análise de fluxo de caixa, contas a pagar/receber
- **Vendas e Marketing**: Estratégias de crescimento, otimização de conversão
- **Operações**: Processos, estoque, fornecedores
- **Métricas e KPIs**: Interpretação de dados, dashboards, relatórios
- **Compliance**: Orientações fiscais e tributárias para o mercado brasileiro

### Funcionalidades
- ✅ Chat em tempo real com contexto de ERP
- ✅ Sugestões rápidas contextualizadas
- ✅ Histórico de conversas
- ✅ Interface flutuante não-intrusiva
- ✅ Suporte aos temas claro e escuro
- ✅ Respostas otimizadas para PMEs brasileiras

## Configuração

### 1. Obter API Key do Grok

1. Acesse [console.x.ai](https://console.x.ai/)
2. Faça login com sua conta X (Twitter)
3. Navegue até "API Keys"
4. Clique em "Create New Key"
5. Copie a chave gerada (formato: `xai-...`)

### 2. Configurar Variáveis de Ambiente

No arquivo `.env.local` (criar se não existir):

```bash
# Grok AI (xAI)
GROK_API_KEY="xai-sua-chave-aqui"
```

### 3. Testar a Integração

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse o dashboard do ERP
3. Clique no botão flutuante com ícone de estrelas (canto inferior direito)
4. Inicie uma conversa com a Orion AI

## Exemplos de Uso

### Análise Financeira
```
"Como está meu fluxo de caixa este mês?"
"Sugira formas de reduzir custos operacionais"
"Qual o ticket médio dos meus clientes?"
```

### Otimização de Vendas
```
"Dicas para aumentar minhas vendas"
"Como melhorar a taxa de conversão?"
"Analise o desempenho de vendas do último trimestre"
```

### Gestão Operacional
```
"Como otimizar meu estoque?"
"Quais produtos têm maior margem de lucro?"
"Estratégias para melhorar relacionamento com clientes"
```

### Métricas e Relatórios
```
"Analise as métricas do dashboard"
"Interprete meus KPIs principais"
"O que os dados de vendas indicam?"
```

## Personalização

### Ajustar Temperatura da IA

No arquivo `src/app/api/ai/chat/route.ts`:

```typescript
// Temperatura mais criativa (0.8-1.0)
temperature: 0.9

// Temperatura mais conservadora (0.3-0.5)
temperature: 0.4

// Padrão balanceado
temperature: 0.7
```

### Modificar System Prompt

Edite o `SYSTEM_PROMPT` em `src/app/api/ai/chat/route.ts` para ajustar:
- Tom de voz
- Área de especialização
- Contexto do negócio
- Diretrizes de resposta

### Adicionar Sugestões Rápidas

Em `src/components/ai-assistant.tsx`:

```typescript
const QUICK_PROMPTS = [
  "Sua sugestão personalizada 1",
  "Sua sugestão personalizada 2",
  // ... adicione mais
];
```

## Custos e Limites

- **Modelo**: `grok-beta`
- **Custo**: Consulte [x.ai/pricing](https://x.ai/pricing)
- **Rate Limits**: Definidos pela xAI (consulte documentação oficial)
- **Tokens por Resposta**: Máximo 2000 tokens (configurável)

## Troubleshooting

### Erro: "GROK_API_KEY não configurada"
- Verifique se a variável está no `.env.local`
- Reinicie o servidor de desenvolvimento
- Confirme que o formato está correto (`xai-...`)

### Erro: "Não autorizado" (401)
- Verifique se a API key é válida
- Confirme que a conta xAI está ativa
- Verifique se há créditos disponíveis

### Erro: "Rate limit exceeded"
- Aguarde alguns minutos antes de tentar novamente
- Considere fazer upgrade do plano xAI
- Implemente cache de respostas

### IA não responde ou demora muito
- Verifique sua conexão com internet
- Confirme status da API em [status.x.ai](https://status.x.ai)
- Reduza o `max_tokens` se necessário

## Segurança

⚠️ **IMPORTANTE:**

- **NUNCA** commit a API key no repositório
- **SEMPRE** use `.env.local` (incluído no `.gitignore`)
- **ROTACIONE** a chave periodicamente
- **LIMITE** acesso apenas a usuários autenticados
- **MONITORE** o uso para detectar anomalias

## Roadmap Futuro

- [ ] Cache de respostas para reduzir custos
- [ ] Análise de contexto do ERP (dados reais)
- [ ] Geração de relatórios automáticos
- [ ] Comandos de voz
- [ ] Integração com módulos específicos
- [ ] Sugestões proativas baseadas em padrões
- [ ] Multi-idioma

## Suporte

Para problemas com a integração:
1. Verifique este guia primeiro
2. Consulte a [documentação oficial do Grok](https://docs.x.ai/)
3. Abra uma issue no repositório do projeto

---

**Desenvolvido com ❤️ para pequenas e médias empresas brasileiras**
