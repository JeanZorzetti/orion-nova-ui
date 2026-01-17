# Integração Groq AI - Orion ERP

## Visão Geral

O Orion ERP inclui um assistente de IA especializado em gestão empresarial e ERP, alimentado pelo **Groq** - a plataforma de inferência de IA mais rápida do mundo.

## Configuração

### 1. Obter API Key do Groq

1. Acesse https://console.groq.com/
2. Crie uma conta ou faça login
3. Navegue até "API Keys"
4. Clique em "Create API Key"
5. Copie a chave gerada (formato: gsk_...)

### 2. Configurar Variáveis de Ambiente

No arquivo .env.local:

GROQ_API_KEY="gsk_sua-chave-aqui"

### 3. Modelo Utilizado

Modelo padrão: llama-3.1-70b-versatile

Outros modelos disponíveis:
- llama-3.1-8b-instant (mais rápido)
- mixtral-8x7b-32768 (contexto longo)
- gemma2-9b-it (eficiente)

Para trocar, edite src/app/api/ai/chat/route.ts

## Vantagens do Groq

- Ultra-rápido (até 18x mais rápido)
- Tier gratuito generoso
- Privado (não treina com seus dados)
- Open Source models
- Baixa latência

Powered by Groq - The Fastest AI Inference
