# Sistema de Onboarding e Dados de Exemplo - Orion ERP

## Visão Geral

O Orion ERP possui um **sistema completo de onboarding interativo** e **gerenciamento de dados de exemplo** para facilitar a primeira experiência dos usuários e permitir exploração do sistema sem comprometer dados reais.

---

## 🎯 Onboarding Interativo

### Funcionalidades

O onboarding é apresentado automaticamente na primeira vez que o usuário acessa o dashboard. Possui 4 etapas guiadas:

#### **Etapa 1: Bem-vindo ao Orion ERP**
- Apresentação dos módulos principais
- Visão geral de Clientes, Produtos, Vendas e Financeiro
- Primeira impressão do sistema

#### **Etapa 2: Assistente IA Integrado**
- Explicação da Orion AI conectada ao banco de dados
- Demonstração dos recursos da IA
- Como usar: perguntas, insights, alertas

#### **Etapa 3: Dados de Exemplo**
- Opção de adicionar dados de demonstração
- Explicação do que será criado
- Botão para adicionar/remover dados
- Todos os dados marcados com `[EXEMPLO]`

#### **Etapa 4: Tudo Pronto**
- Próximos passos sugeridos
- Atalhos do teclado (Ctrl/Cmd + K)
- Como reabrir o tutorial

### Como Usar

#### **Primeira Visualização**
O onboarding aparece automaticamente na primeira vez que o usuário acessa `/dashboard`.

#### **Reabrir o Tutorial**
1. Clique no seu perfil (ícone do usuário no canto superior direito)
2. Selecione **"Tutorial"** no menu dropdown
3. O sistema recarrega e mostra o onboarding novamente

#### **Pular Tutorial**
- Clique em **"Pular Tutorial"** no rodapé do diálogo
- O tutorial não será exibido novamente automaticamente

### Armazenamento

O sistema usa `localStorage` para rastrear se o usuário já viu o onboarding:

```javascript
localStorage.getItem("orion-onboarding-seen")
localStorage.setItem("orion-onboarding-seen", "true")
localStorage.removeItem("orion-onboarding-seen") // Para reabrir
```

---

## 📊 Sistema de Dados de Exemplo

### O que São Dados de Exemplo?

Dados de exemplo são registros pré-configurados que permitem explorar o sistema sem precisar cadastrar informações manualmente. São úteis para:

- **Novos usuários**: Explorar funcionalidades sem esforço inicial
- **Demonstrações**: Apresentar o sistema para clientes/equipe
- **Testes**: Verificar integrações e funcionalidades
- **Treinamento**: Aprender a usar o sistema com dados realistas

### Dados Incluídos

Quando você adiciona dados de exemplo, o sistema cria:

#### **3 Clientes**
1. **[EXEMPLO] João Silva** (Pessoa Física)
   - Email: joao.silva@exemplo.com
   - Telefone: (11) 98765-4321
   - CPF: 123.456.789-00
   - Endereço: São Paulo, SP

2. **[EXEMPLO] Tech Solutions LTDA** (Pessoa Jurídica)
   - Email: contato@techsolutions.exemplo.com
   - Telefone: (11) 3456-7890
   - CNPJ: 12.345.678/0001-90
   - Endereço: São Paulo, SP

3. **[EXEMPLO] Maria Santos** (Pessoa Física)
   - Email: maria.santos@exemplo.com
   - Telefone: (21) 99876-5432
   - CPF: 987.654.321-00
   - Endereço: Rio de Janeiro, RJ

#### **4 Produtos**
1. **[EXEMPLO] Notebook Dell Inspiron 15**
   - SKU: NB-DELL-001
   - Categoria: Informática
   - Preço: R$ 3.500,00
   - Estoque: 15 unidades

2. **[EXEMPLO] Mouse Logitech MX Master 3**
   - SKU: MSE-LOG-001
   - Categoria: Periféricos
   - Preço: R$ 450,00
   - Estoque: **3 unidades** (⚠️ Abaixo do mínimo de 10)

3. **[EXEMPLO] Consultoria em TI**
   - SKU: SRV-CONS-001
   - Tipo: Serviço
   - Preço: R$ 200,00/hora

4. **[EXEMPLO] Teclado Mecânico Keychron K2**
   - SKU: TEC-KEY-001
   - Categoria: Periféricos
   - Preço: R$ 650,00
   - Estoque: **0 unidades** (🔴 SEM ESTOQUE)

#### **2 Pedidos de Venda**
1. **PV-2026-001**
   - Cliente: João Silva
   - Produto: 1x Notebook Dell
   - Valor: R$ 3.500,00
   - Status: ✅ Concluído (pago há 1 dia)

2. **PV-2026-002**
   - Cliente: Tech Solutions LTDA
   - Valor: R$ 1.000,00 (R$ 1.100,00 - R$ 100,00 desconto)
   - Status: ⏳ Confirmado (pagamento pendente)

#### **6 Transações Financeiras**

**Contas a Receber:**
- R$ 3.500,00 - Pedido PV-2026-001 (✅ Pago)
- R$ 1.000,00 - Pedido PV-2026-002 (⏳ Vence em 10 dias)
- R$ 2.400,00 - Consultoria em TI - Projeto XYZ (⏳ Vence em 15 dias)

**Contas a Pagar:**
- R$ 5.000,00 - Fornecedor TechSupply (⏳ Vence em 7 dias)
- R$ 3.000,00 - Aluguel Janeiro 2026 (⏳ Vence em 20 dias)
- R$ 850,00 - DAS Simples Nacional (🔴 **Atrasado há 2 dias**)

### Como Gerenciar

#### **Adicionar Dados de Exemplo**

**Opção 1: Durante o Onboarding**
1. No Passo 3 do onboarding
2. Clique em **"Adicionar Dados de Exemplo"**
3. Aguarde confirmação

**Opção 2: Nas Configurações**
1. Acesse **Configurações** (menu lateral)
2. Role até a seção **"Dados de Exemplo"**
3. Clique em **"Adicionar Dados de Exemplo"**
4. Aguarde confirmação

#### **Remover Dados de Exemplo**

**Via Configurações:**
1. Acesse **Configurações**
2. Na seção **"Dados de Exemplo"**
3. Clique em **"Remover Dados de Exemplo"**
4. Confirme a ação no diálogo de confirmação
5. ⚠️ **Esta ação não pode ser desfeita**

### Identificação

Todos os dados de exemplo são marcados com o prefixo `[EXEMPLO]` no nome/descrição:
- Clientes: `[EXEMPLO] João Silva`
- Produtos: `[EXEMPLO] Notebook Dell Inspiron 15`
- Transações: `[EXEMPLO] Pagamento Pedido PV-2026-001`

### Segurança

✅ **Isolamento por usuário**: Cada usuário tem seus próprios dados de exemplo
✅ **Remoção em cascata**: Ao remover, deleta todos os relacionamentos (pedidos, transações, etc.)
✅ **Validação**: Não permite adicionar se já existem dados de exemplo
✅ **Confirmação**: Diálogo de confirmação antes de remover

---

## 🛠️ Arquitetura Técnica

### Arquivos Principais

#### **`src/lib/sample-data.ts`**
- `populateSampleData(userId)`: Cria todos os dados de exemplo
- `clearSampleData(userId)`: Remove todos os dados de exemplo
- `hasSampleData(userId)`: Verifica se existem dados de exemplo

#### **`src/app/api/sample-data/route.ts`**
- API POST com ações: `populate`, `clear`, `check`
- Autenticação obrigatória
- Retorna detalhes da operação

#### **`src/components/onboarding.tsx`**
- Componente principal do onboarding
- 4 etapas com navegação
- Integração com dados de exemplo
- Armazenamento em localStorage

#### **`src/components/sample-data-manager.tsx`**
- UI para gerenciar dados de exemplo
- Mostra status atual (ativo/inativo)
- Botões de adicionar/remover
- Feedback com toasts

#### **`src/app/dashboard/layout.tsx`**
- Integração do componente Onboarding
- Menu "Tutorial" no dropdown do usuário

#### **`src/app/dashboard/configuracoes/page.tsx`**
- Seção de gerenciamento de dados de exemplo
- Integração do SampleDataManager

---

## 📈 Fluxo de Uso

```
Novo Usuário → Primeiro Acesso
    ↓
Onboarding Automático (4 passos)
    ↓
Passo 3: Adicionar Dados de Exemplo? [Sim/Não]
    ↓
    ├─→ SIM: Dados criados → Explorar sistema com dados
    │
    └─→ NÃO: Continuar sem dados → Cadastrar manualmente

Após explorar:
    ↓
Configurações → Dados de Exemplo → Remover
    ↓
Sistema limpo para dados reais
```

---

## 🎨 Componentes UI

### Onboarding
- **Dialog** full-screen com navegação
- **Progress indicators** (bolinhas na parte inferior)
- **Ícones** representativos de cada etapa
- **Botões**: Anterior, Próximo, Pular, Finalizar

### Sample Data Manager
- **Card** com status visual
- **AlertDialog** para confirmação de remoção
- **Toast** com feedback detalhado
- **Loading states** durante operações

---

## 🧪 Testando

### Testar Onboarding
1. Limpar localStorage:
   ```javascript
   localStorage.removeItem("orion-onboarding-seen")
   ```
2. Recarregar página
3. Onboarding deve aparecer automaticamente

### Testar Dados de Exemplo
1. Adicionar dados via onboarding ou configurações
2. Verificar nos módulos:
   - Clientes: Ver 3 clientes com `[EXEMPLO]`
   - Produtos: Ver 4 produtos (2 com alerta de estoque)
   - Vendas: Ver 2 pedidos
   - Financeiro: Ver 6 transações (1 atrasada)
3. Testar IA:
   - "Quais produtos estão com estoque baixo?"
   - "Tenho contas atrasadas?"
   - "Mostre meus clientes"
4. Remover dados nas configurações
5. Verificar que tudo foi removido

---

## 💡 Benefícios

### Para Novos Usuários
- ✅ Tour guiado do sistema
- ✅ Dados prontos para exploração
- ✅ Reduz curva de aprendizado
- ✅ Melhora first-time experience

### Para Demonstrações
- ✅ Dados realistas pré-configurados
- ✅ Cenários variados (sucesso, alertas, problemas)
- ✅ Fácil reset entre demonstrações

### Para Desenvolvedores
- ✅ Ambiente de teste consistente
- ✅ Dados de seed para desenvolvimento
- ✅ Facilita debugging

---

## 🔮 Expansões Futuras

- [ ] Múltiplos conjuntos de dados (pequeno, médio, grande)
- [ ] Dados específicos por segmento (varejo, serviços, indústria)
- [ ] Importar dados de exemplo de arquivo JSON
- [ ] Tour guiado por módulo (não apenas no início)
- [ ] Vídeos tutoriais integrados
- [ ] Gamificação do onboarding (conquistas, progresso)

---

## 📚 Conclusão

O sistema de onboarding e dados de exemplo do Orion ERP oferece uma experiência de primeira classe para novos usuários, permitindo exploração rápida e eficiente do sistema sem comprometer dados reais. A integração perfeita entre tutorial interativo e dados de demonstração cria um ambiente de aprendizado ideal.

---

**Powered by:**
- 🎨 Radix UI (Dialog, AlertDialog)
- 🎯 React Hooks (useState, useEffect)
- 💾 LocalStorage (persistência de estado)
- 🗄️ Prisma ORM (gerenciamento de dados)
- 🎉 Sonner Toasts (feedback visual)
