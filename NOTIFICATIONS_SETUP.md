# Sistema Avançado de Notificações - Orion ERP

## 🎉 Funcionalidades Implementadas

### ✅ 1. Emails Automáticos com Resend
- Templates de email profissionais para todas as notificações
- Envio automático de emails em conjunto com notificações in-app
- Templates incluídos:
  - Trial expirando (7 e 3 dias)
  - Trial expirado
  - Boas-vindas
  - Onboarding concluído
  - Venda paga
  - Notificações genéricas

### ✅ 2. Notificações de Onboarding
- Notificação automática ao completar cada etapa do onboarding
- Email especial ao concluir todas as etapas obrigatórias
- Mensagens personalizadas para cada step

### ✅ 3. Notificações de Vendas
- Alerta automático quando uma venda é marcada como paga
- Informações detalhadas: valor, cliente, número do pedido
- Email de confirmação para o vendedor

### ✅ 4. Web Push Notifications
- Notificações do navegador mesmo com app fechado
- Service Worker configurado
- Gerenciamento de subscrições push
- Integração automática com sistema de notificações

### ✅ 5. Admin Dashboard
- Painel para enviar notificações em massa
- Segmentação de público-alvo:
  - Todos os usuários
  - Usuários em trial
  - Assinantes ativos
  - Trials expirados
- Envio simultâneo: in-app + email + push

---

## 🚀 Setup - Passo a Passo

### 1. Configurar Resend (Email)

#### 1.1. Criar conta no Resend
1. Acesse [https://resend.com](https://resend.com)
2. Crie uma conta gratuita (100 emails/dia no plano free)
3. Verifique seu domínio ou use o domínio de teste

#### 1.2. Obter API Key
1. No dashboard do Resend, vá em "API Keys"
2. Clique em "Create API Key"
3. Copie a chave gerada

#### 1.3. Adicionar ao .env
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="Orion ERP <noreply@seudominio.com>"
```

### 2. Configurar Web Push Notifications

#### 2.1. Gerar VAPID Keys
Execute o script para gerar as chaves:
```bash
node scripts/generate-vapid-keys.js
```

#### 2.2. Adicionar ao .env
Copie as chaves geradas e adicione ao `.env`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BKxxx...
VAPID_PRIVATE_KEY=xxx...
VAPID_EMAIL=mailto:contato@seudominio.com
```

⚠️ **IMPORTANTE**: A chave pública precisa do prefixo `NEXT_PUBLIC_` para estar disponível no frontend.

#### 2.3. Atualizar o banco de dados
Execute a migration para criar a tabela `push_subscriptions`:
```bash
npx prisma migrate dev --name add_push_subscriptions
```

### 3. Configurar URLs do App

Adicione a URL do seu app ao `.env`:
```env
NEXT_PUBLIC_APP_URL=https://seudominio.com
# OU em desenvolvimento:
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Cron Job (Opcional)

Para verificações diárias de trials, configure um cron job que chame:
```
GET https://seudominio.com/api/cron/trial-notifications
Authorization: Bearer SEU_CRON_SECRET
```

No `.env`:
```env
CRON_SECRET=sua-chave-secreta-aqui
```

**Opções de Cron:**
- **Vercel Cron**: Adicione no `vercel.json`
- **GitHub Actions**: Workflow agendado
- **Cron-job.org**: Serviço externo gratuito

---

## 📝 Como Usar

### Notificações In-App

As notificações aparecem automaticamente no sino do header. Clique para:
- Ver todas as notificações
- Marcar como lidas
- Deletar notificações
- Navegar para links relacionados

### Ativar Web Push

1. Adicione o componente `PushNotificationButton` em qualquer página:
```tsx
import PushNotificationButton from "@/components/notifications/PushNotificationButton";

// No seu componente:
<PushNotificationButton />
```

2. O usuário verá um botão "Ativar Notificações Push"
3. Ao clicar, o navegador pedirá permissão
4. Após permitir, o usuário receberá notificações mesmo offline

### Admin Dashboard

Acesse `/admin/notifications` para:
1. Escolher público-alvo
2. Selecionar tipo de notificação
3. Escrever título e mensagem
4. Opcionalmente enviar email junto
5. Preview antes de enviar

**Controle de Acesso:**
Por padrão, apenas emails listados em `adminEmails` podem acessar.
Edite em: `src/app/api/admin/notifications/broadcast/route.ts`

---

## 🔧 Arquivos Criados/Modificados

### Novos Arquivos
```
src/lib/email/
  ├── resend.ts                  # Cliente Resend
  ├── templates.tsx              # Templates de email
  └── send.tsx                   # Funções de envio

src/lib/web-push.ts              # Utilitários Web Push

src/app/api/push/
  ├── subscribe/route.ts         # Subscrever push
  └── unsubscribe/route.ts       # Cancelar push

src/app/api/admin/notifications/
  └── broadcast/route.ts         # Envio em massa

src/app/admin/notifications/
  └── page.tsx                   # UI Admin Dashboard

src/components/notifications/
  └── PushNotificationButton.tsx # Botão ativar push

public/sw.js                     # Service Worker
scripts/generate-vapid-keys.js   # Gerador VAPID
```

### Arquivos Modificados
```
src/lib/notifications.ts         # +200 linhas (emails + push)
src/app/api/user/onboarding/route.ts  # Notificações onboarding
src/app/api/orders/[id]/payment/route.ts  # Notificações vendas
prisma/schema.prisma             # Modelo PushSubscription
```

---

## 📊 Estatísticas

**Total de código adicionado:**
- ~1.500 linhas de TypeScript/React
- 7 templates de email
- 5 API routes
- 3 bibliotecas principais
- 1 service worker

**Tipos de notificações:**
- 8 tipos: INFO, SUCCESS, WARNING, ERROR, PAYMENT, SUBSCRIPTION, SUPPORT, SYSTEM

**Canais de entrega:**
- In-app (sempre)
- Email (opcional)
- Web Push (opcional)

---

## 🧪 Testando

### Testar Email
```bash
# Via console do navegador (após login):
fetch('/api/user/onboarding', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ stepId: 'welcome', action: 'complete' })
})
```

### Testar Web Push
1. Ative as notificações via botão
2. Feche o navegador completamente
3. Via API, envie uma notificação
4. Você receberá o push mesmo com app fechado

### Testar Admin Broadcast
1. Acesse `/admin/notifications`
2. Selecione "Usuários em Trial"
3. Preencha título e mensagem
4. Marque "Enviar também por email"
5. Clique em "Enviar Notificações"

---

## 🔒 Segurança

- ✅ Autenticação obrigatória em todas as rotas
- ✅ Validação de ownership de notificações
- ✅ VAPID keys nunca expostas no frontend (exceto pública)
- ✅ Tokens de cron protegidos por Bearer token
- ✅ Admin dashboard com whitelist de emails

---

## 🚨 Troubleshooting

### Emails não são enviados
- Verifique se `RESEND_API_KEY` está correta
- Confirme que o email "from" está verificado no Resend
- Cheque logs do servidor: `[Email] Resend não configurado...`

### Push não funciona
- Verifique se as VAPID keys estão corretas
- Confirme que o service worker está registrado (DevTools > Application)
- Push notifications só funcionam em HTTPS (exceto localhost)
- Alguns navegadores (Safari) têm suporte limitado

### Notificações não aparecem
- Verifique se o usuário está autenticado
- Confirme que as funções de notificação são chamadas
- Cheque o banco de dados: tabela `notifications`

---

## 📚 Recursos Adicionais

- [Resend Docs](https://resend.com/docs)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 🎯 Próximos Passos Sugeridos

1. **Analytics**: Rastrear taxa de abertura de notificações
2. **Preferências**: Permitir usuários desativarem tipos específicos
3. **Agendamento**: Agendar notificações para horários específicos
4. **Templates customizáveis**: Admin poder editar templates
5. **Notificações por SMS**: Integrar Twilio para SMS críticos

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para Orion ERP**
