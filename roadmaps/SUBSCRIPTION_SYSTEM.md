# Sistema de Subscription - Orion ERP

**Data de criação:** 17/01/2026
**Modelo:** Trial de 30 dias + Assinatura Paga

---

## 🎯 Visão Geral

O Orion ERP usa um modelo de subscription baseado em **tempo** (não em features limitadas):

- ✅ **Trial de 30 dias**: Acesso completo a todos os recursos
- ✅ **Após trial**: Necessário assinar para continuar usando
- ✅ **Sem limites durante trial**: Usuário pode usar tudo

---

## 📋 Status de Subscription

### Estados Possíveis

| Status | Descrição | Pode Acessar? |
|--------|-----------|---------------|
| `TRIAL` | Trial ativo (dentro dos 30 dias) | ✅ Sim |
| `ACTIVE` | Assinatura paga ativa | ✅ Sim |
| `EXPIRED` | Trial ou assinatura expirada | ❌ Não |
| `CANCELLED` | Assinatura cancelada pelo usuário | ❌ Não |

---

## 🛠️ Implementação Técnica

### Banco de Dados (Prisma)

**Modelo `User` atualizado:**

```prisma
model User {
  // ... campos existentes ...

  // Trial e Subscription
  subscriptionStatus SubscriptionUserStatus @default(TRIAL)
  trialEndsAt        DateTime?              // Data de expiração do trial

  // ... relações ...
}

enum SubscriptionUserStatus {
  TRIAL       // Trial de 30 dias (acesso completo)
  ACTIVE      // Assinatura ativa (paga)
  EXPIRED     // Trial ou assinatura expirada
  CANCELLED   // Assinatura cancelada
}
```

---

### Arquivos Criados

#### **1. `src/lib/subscription.ts`**
Utilitários para verificar status de subscription.

**Funções principais:**
- `checkSubscriptionStatus(user)`: Verifica status atual
- `calculateTrialEndDate(createdAt)`: Calcula fim do trial (30 dias)
- `getSubscriptionMessage(info)`: Retorna mensagem descritiva
- `getSubscriptionBadgeColor(info)`: Retorna cor do badge

**Exemplo de uso:**
```typescript
import { checkSubscriptionStatus } from "@/lib/subscription";

const info = checkSubscriptionStatus(user);
console.log(info.canAccess); // true ou false
console.log(info.daysRemaining); // dias restantes do trial
```

---

#### **2. `src/hooks/use-subscription.ts`**
Hook React para usar em componentes client-side.

**Exemplo de uso:**
```typescript
"use client";
import { useSubscription } from "@/hooks/use-subscription";

export function MyComponent() {
  const { canAccess, daysRemaining, message } = useSubscription();

  if (!canAccess) {
    return <div>Trial expirado</div>;
  }

  return <div>Dias restantes: {daysRemaining}</div>;
}
```

---

#### **3. `src/components/subscription-banner.tsx`**
Banner no topo da página alertando sobre trial próximo do fim.

**Comportamento:**
- Não aparece se subscription está `ACTIVE`
- Aparece quando faltam 7 dias ou menos
- Aparece quando trial expirou
- Pode ser fechado (exceto se expirado)
- Link para página de preços

---

#### **4. `src/components/subscription-gate.tsx`**
Modal que bloqueia acesso quando trial expira.

**Comportamento:**
- Aparece quando `canAccess === false`
- Não pode ser fechado (modal sem botão X)
- Mostra benefícios do plano pago
- Botões: "Voltar ao Dashboard" e "Ver Planos"

---

#### **5. `src/components/dashboard-subscription-wrapper.tsx`**
Wrapper que adiciona banner de subscription ao dashboard.

---

## 🔄 Fluxo do Usuário

### 1. Registro Novo Usuário

```
Usuário se registra
    ↓
subscriptionStatus = TRIAL
trialEndsAt = createdAt + 30 dias
    ↓
Acesso completo por 30 dias
```

**Implementação no registro:**
```typescript
// Em src/app/api/auth/register/route.ts (ou similar)
const user = await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    subscriptionStatus: "TRIAL",
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
  },
});
```

---

### 2. Durante Trial (Dias 1-23)

```
Usuário usa sistema normalmente
    ↓
Sem banners ou avisos
    ↓
Acesso total a todos os recursos
```

---

### 3. Final do Trial (Dias 24-30)

```
7 dias antes do fim
    ↓
Banner aparece no topo: "Seu trial expira em X dias"
    ↓
Botão "Ver Planos" visível
    ↓
Usuário pode fechar banner
```

---

### 4. Trial Expirado (Dia 31+)

```
Trial expira
    ↓
subscriptionStatus automaticamente muda para EXPIRED
    ↓
Ao tentar acessar dashboard:
  - Banner vermelho no topo (não pode fechar)
  - Modal bloqueando acesso aparece
    ↓
Usuário DEVE fazer upgrade para continuar
```

---

### 5. Após Pagamento

```
Pagamento confirmado (webhook Stripe/Mercado Pago)
    ↓
subscriptionStatus = ACTIVE
    ↓
Acesso liberado novamente
    ↓
Sem banners ou restrições
```

---

## 🎨 Interface Visual

### Banner de Trial (7 dias ou menos)

```
┌─────────────────────────────────────────────────────────┐
│ 👑 Seu trial expira em 5 dias. Faça upgrade para...    │
│                                    [Ver Planos]  [X]    │
└─────────────────────────────────────────────────────────┘
```

### Banner de Expirado

```
┌─────────────────────────────────────────────────────────┐
│ ⚠️ Seu trial expirou. Faça upgrade para continuar.     │
│                                    [Fazer Upgrade Agora]│
└─────────────────────────────────────────────────────────┘
```

### Modal de Bloqueio

```
┌──────────────────────────────────────┐
│           🔒                         │
│     Acesso Limitado                  │
│                                      │
│  Seu trial expirou. Faça upgrade... │
│                                      │
│  👑 Com Orion ERP Premium:           │
│  • Acesso ilimitado                  │
│  • Clientes sem limites              │
│  • IA integrada                      │
│  • Suporte prioritário               │
│                                      │
│  [Voltar]  [Ver Planos e Preços]    │
└──────────────────────────────────────┘
```

---

## 📊 Página de Configurações

Em **Configurações > Sistema**, mostrar:

```
┌─────────────────────────────────────┐
│ Assinatura                          │
├─────────────────────────────────────┤
│ Status: Trial ⏳                    │
│ Expira em: 25/02/2026 (15 dias)    │
│                                      │
│ [Fazer Upgrade]                     │
└─────────────────────────────────────┘
```

Ou se ativo:

```
┌─────────────────────────────────────┐
│ Assinatura                          │
├─────────────────────────────────────┤
│ Status: Ativa ✅                    │
│ Próxima cobrança: 15/02/2026        │
│ Plano: Professional                 │
│                                      │
│ [Gerenciar Assinatura]              │
└─────────────────────────────────────┘
```

---

## 🔧 Tarefas de Implementação

### ✅ Concluído

- [x] Atualizar schema do Prisma (User model)
- [x] Criar enum `SubscriptionUserStatus`
- [x] Criar `src/lib/subscription.ts` (utilitários)
- [x] Criar `src/hooks/use-subscription.ts` (hook React)
- [x] Criar `subscription-banner.tsx` (banner de aviso)
- [x] Criar `subscription-gate.tsx` (modal de bloqueio)
- [x] Criar `dashboard-subscription-wrapper.tsx` (wrapper)

### 🔄 Pendente

- [ ] Criar migration do Prisma (`npx prisma migrate dev --name add_subscription_fields`)
- [ ] Atualizar código de registro para definir `trialEndsAt`
- [ ] Atualizar `src/lib/auth.ts` para incluir campos no session
- [ ] Adicionar `SubscriptionBanner` no dashboard layout
- [ ] Criar página `/precos` com planos
- [ ] Integrar Stripe ou Mercado Pago
- [ ] Criar webhook de pagamento
- [ ] Criar cron job para expirar trials automaticamente
- [ ] Adicionar seção de subscription em Configurações
- [ ] Testes end-to-end do fluxo

---

## 🎯 Próximos Passos

### Passo 1: Rodar Migration

```bash
cd orion-nova-ui-main
npx prisma migrate dev --name add_subscription_fields
npx prisma generate
```

### Passo 2: Atualizar NextAuth Session

Em `src/lib/auth.ts`, adicionar campos ao callback:

```typescript
callbacks: {
  async session({ session, user }) {
    if (session.user) {
      session.user.id = user.id;
      session.user.role = user.role;
      session.user.subscriptionStatus = user.subscriptionStatus;
      session.user.trialEndsAt = user.trialEndsAt;
      session.user.createdAt = user.createdAt;
    }
    return session;
  },
}
```

### Passo 3: Criar Página de Preços

Criar `src/app/precos/page.tsx` com:
- 3 planos (Starter, Professional, Enterprise)
- Preços mensais/anuais
- Comparação de features
- Botão de checkout

### Passo 4: Integração de Pagamento

Escolher entre:
- **Stripe**: Internacional, mais recursos
- **Mercado Pago**: Brasil, mais familiar para usuários BR

### Passo 5: Webhook de Pagamento

Criar endpoint `/api/webhooks/payment` que:
1. Recebe notificação de pagamento
2. Verifica assinatura no gateway
3. Atualiza `subscriptionStatus = ACTIVE`
4. Envia email de confirmação

### Passo 6: Cron Job (Opcional)

Criar job diário que:
1. Busca usuários com `trialEndsAt < now()` e `status = TRIAL`
2. Atualiza para `status = EXPIRED`
3. Envia email notificando expiração

**Alternativa:** Verificar no login e atualizar status dinamicamente

---

## 📧 Emails Automáticos

### Trial Iniciado
```
Assunto: Bem-vindo ao Orion ERP! Seu trial de 30 dias começou

Olá [Nome],

Seu trial gratuito começou! Você tem acesso completo a todos os recursos por 30 dias.

Expira em: [Data]

[Começar a Usar]
```

### 7 Dias Antes do Fim
```
Assunto: Seu trial expira em 7 dias

Olá [Nome],

Seu trial do Orion ERP expira em 7 dias. Faça upgrade para continuar usando.

[Ver Planos]
```

### Trial Expirado
```
Assunto: Seu trial do Orion ERP expirou

Olá [Nome],

Seu trial expirou. Faça upgrade para continuar gerenciando seu negócio.

[Fazer Upgrade Agora]
```

---

## 🔒 Segurança

- ✅ Verificação server-side (não apenas client)
- ✅ Validação em API routes
- ✅ Proteção de rotas no middleware
- ✅ Não confiar em localStorage/cookies para controle de acesso

---

## 💰 Modelo de Preços Sugerido

| Plano | Preço/mês | Recursos |
|-------|-----------|----------|
| **Starter** | R$ 49,90 | Até 100 clientes, 1 usuário, recursos básicos |
| **Professional** | R$ 99,90 | Ilimitado, 3 usuários, IA completa |
| **Enterprise** | R$ 199,90 | Ilimitado, usuários ilimitados, suporte prioritário |

**Trial:** 30 dias grátis, todos os recursos do Professional

---

## 📊 Métricas para Acompanhar

- **Taxa de conversão trial → pago**
- **Tempo médio de uso durante trial**
- **Features mais usadas durante trial**
- **Taxa de cancelamento**
- **MRR (Monthly Recurring Revenue)**
- **Churn rate**

---

**Última atualização:** 17/01/2026
**Status:** 🚧 Em implementação
