# ESPECIFICAÇÃO TÉCNICA E PROMPT DE EXECUÇÃO: OPERAÇÃO ORION ERP
**ID do Projeto:** `orion-nova-ui` | **Ref:** `dossie-orion-16-08-2026`  
**Autor:** Arquiteto de Produto, Especialista em UX/UI e Engenheiro de Front-end de Elite  
**Status:** PRONTO PARA EXECUÇÃO (Main Única, Deploy Contínuo)

---

## 1. Visão e Estratégia de Produto (HEART / G5 Alignment)

O principal objetivo de negócio do **Orion ERP** é obter a primeira assinatura **ACTIVE** paga de um cliente externo até **01/11/2026**, com permanência mínima de 30 dias [3]. Atualmente, o produto possui **0 clientes pagantes** [2, 24]. Para evitar o critério de desligamento do produto (*kill decision*) na data limite [3], todos os esforços de engenharia de software e design de interface devem ser afunilados na meta **G5: Tempo-até-Primeiro-Valor (Time-to-Value) ≤ 10 minutos** [3, 4].

A meta G5 é medida operacionalmente através da jornada: **Criar Conta → Cadastrar 1 Cliente → Cadastrar 1 Produto → Emitir 1 Pedido de Venda → Gerar 1 Relatório de Vendas** [4, 21].

### Mapeamento do Google HEART para o Fluxo G5

Para monitorar e otimizar essa conversão crítica, o sistema usará a instrumentação existente (GA4, GTM e Microsoft Clarity) [11, 27] juntamente com os hooks nativos de telemetria da plataforma (`useTimeTracking` e `useScrollTracking`) [19, 27] sob as seguintes definições táticas:

| Pilar HEART | Sinal de UX Observável | Métrica de Telemetria (Fórmula / Evento) | Canal de Captura |
| :--- | :--- | :--- | :--- |
| **Task Success**  *(Sucesso na Tarefa)* | Conclusão sem erros do fluxo G5 em menos de 10 minutos por novos usuários [3, 4]. | **Completion Rate (CR):** % de sessões de trial que concluem o ciclo completo de 4 passos sem disparar erros HTTP 500 [4].<br>**SEQ (Single Ease Question):** Pontuação média de facilidade de uso $\ge 5.5 / 7.0$ disparada em popover síncrono imediatamente após a visualização do primeiro relatório [46, 51]. | - Eventos customizados do GA4: `g5_step_completed` (passos 1 a 4), `g5_flow_success`, `g5_flow_failed` [27].<br>- Histogramas de tempo do hook `useTimeTracking` [19, 27]. |
| **Retention** *(Retenção)* | Transição de usuários trial para assinantes recorrentes no checkout Stripe [11, 10]. | **Trial-to-Paid Conversion Rate (TPCR):** % de contas criadas que adicionam cartão e faturam a primeira mensalidade ativa sem cancelamento em 30 dias [3, 11].<br>**SUS (System Usability Scale):** Mapeamento atitudinal pós-onboarding focado em atingir score $> 84.1$ (Excelente) para neutralizar churn antes do gate de 30 dias [47, 50]. | - Eventos de checkout Stripe via Webhook (`invoice.payment_succeeded`, `customer.subscription.created`) [11, 19].<br>- Clarity Session Recordings para análise de abandono e rage clicks no checkout [11, 27]. |
| **Adoption** *(Adoção)* | Ativação imediata de dados reais ou dados simulados estruturados para quebrar a inércia [8, 21]. | **Activation Rate (AR):** % de novas contas que utilizam o `sample-data-manager` ou executam as primeiras mutações de dados reais nas primeiras 2 horas [8, 21]. | - Evento GA4 `sample_data_populated` e `migration_started` [21, 27]. |

---

## 2. Diretrizes de UX e Arquitetura de Interface

A interface do Orion ERP é governada pelo tema de assinatura **"Orion Deep Space"** (Glassmorphism, gradientes ciano$\rightarrow$roxo, glow neon, star field) [15, 16] e deve respeitar estritamente as leis psicológicas de design e heurísticas de usabilidade para reduzir a carga cognitiva do operador não-técnico (microempresas operando em Excel) [5, 15]:

### 2.1 Funil Público (`/`, `/produto`, `/precos`)
*   **Lei de Fitts & Scrollytelling:** Os CTAs de conversão primária ("Começar Trial Gratuito") devem possuir *hitboxes* táteis de tamanho $\ge 48px$ (dispositivos móveis) [56] e estar fixados na barra de cabeçalho responsiva flutuante. O scrollytelling deve utilizar o componente `ScrollReveal` com *stagger* de $0.08s$ a $0.1s$ [23] respeitando as propriedades viscoelásticas (curva de easing *"The ROI Flow"*: `cubic-bezier(0.25, 0.1, 0.25, 1)`) [16, 71] para guiar o olhar sem gerar ruído gráfico.
*   **Correspondência com o Mundo Real (G4 Compliance):** **Fica terminantemente proibido reintroduzir qualquer prova social fabricada** (número de clientes falsos, logos de terceiros que não usam o ERP ou depoimentos falsificados) [6, 24, 28]. Toda e qualquer métrica de marketing deve refletir estritamente o estado real do produto [28]. No comparador antes/depois (`BeforeAfterComparison`), a interface deve ilustrar o contraste realista entre uma planilha desorganizada e a clareza do banco estruturado [23].

### 2.2 Cadastro e Onboarding (Redução da Latência de Decisão)
*   **Lei de Hick-Hyman & Miller:** O cadastro inicial solicita apenas e-mail, senha e nome da empresa. Ao entrar na rota `/dashboard`, o `OnboardingChecklist` [18] deve assumir o papel de direcionamento. Em vez de exigir o cadastro manual exaustivo de dados de infraestrutura, a interface deve exibir em destaque o `sample-data-manager` com o CTA secundário *"Popular com Dados de Demonstração"* [18, 21]. Isso permite que o usuário veja a aplicação totalmente funcional em menos de 10 segundos, aplicando o **Efeito Zeigarnik** ao exibir um progresso de onboarding parcialmente concluído (ex: "40% concluído - Seus dados de exemplo estão prontos!") [61].

### 2.3 Dashboard e Fluxos do Ciclo Básico (G5 Core)
Para otimizar o fluxo G5, os quatro ecrãs de inserção e leitura de dados devem ser desprovidos de atrito mnemônico, aplicando a heurística de **Reconhecimento em vez de Recordação** [40]:
*   **`/dashboard/clientes/novo`:** Máscara de entrada síncrona para CNPJ/CPF com autopovoamento de dados cadastrais via API pública de dados de empresas ao digitar o CNPJ, evitando digitação manual [39].
*   **`/dashboard/produtos/novo`:** Campo unificado para Produtos e Serviços com toggle explícito. O foco do cursor é injetado automaticamente no primeiro campo de texto útil no carregamento da página [39].
*   **`/dashboard/vendas/novo`:** Seleção de clientes e produtos através de dropdown preditivo com busca integrada via `cmdk` [17] e cálculo matemático de totais do pedido atualizado no estado local em tempo real (Doherty Threshold $\le 100ms$) [59].
*   **`/dashboard/relatorios/vendas`:** Renderização instantânea baseada em filtros padrão de período (Últimos 30 dias). O relatório em PDF (`jspdf`) ou CSV (`xlsx`) [8] deve ser compilado em segundo plano e renderizar um indicador de progresso ativo até a conclusão [35].

### 2.4 Padrões de Generative UI para o Orion AI (`ai-assistant`)
O assistente de inteligência baseado em Groq e LLM de última geração opera em interface híbrida de **Dissociação Tática (Split-Screen / Chat+)** [8, 11, 75]:
1.  **Canal de Conversação (Chat):** Ocupa a barra lateral direita ou painel flutuante retrátil. Exibe o consumo de mensagens mensal do plano em tempo real (evitando estouro silencioso da cota do usuário) [10, 23].
2.  **Canal de Canvas (Visualização Estendida):** Ocupa a viewport central paralela. Quando o usuário pede um relatório analítico para a IA, ela não deve cuspir texto Markdown puro no chat. O sistema deve acionar o protocolo **AG-UI** via streaming de metadados JSON estruturados (A2UI) [73, 74]. A interface intercepta o payload e instancia dinamicamente componentes de domínio reais (ex: gráficos do `Recharts` hidratados de forma síncrona ou tabelas interativas filtráveis) no Canvas central [7, 75].
3.  **Blindagem do Modelo Mental e Limites de Conhecimento:** Como a IA possui um system prompt contendo as restrições rígidas do que o Orion **NÃO FAZ** [23], ela é proibida de instruir o usuário a buscar rotas ou processos fiscais, de comissão, de conciliação ou estoque avançado que não existam no código [9, 23]. Se provocado, o componente de chat deve renderizar um bloco estático personalizado de interface: *"O Orion ERP é focado em simplicidade. Essa funcionalidade não está disponível no momento. Deseja ver nosso roadmap ou entrar em contato com o suporte?"* ancorado com ações sugeridas baseadas em rotas reais (Ex: `/dashboard/suporte`) [9, 23, 30].

---

## 3. Arquitetura de Interface e Componentes Core

### 3.1 Inventário e Reaproveitamento Técnico
Nenhum componente gráfico novo deve ser adicionado ao ecossistema fora do design system **"Orion Deep Space"** baseado nos primitivos de Radix UI e Tailwind CSS [11, 15, 28].

```
┌────────────────────────────────────────────────────────────────────────┐
│  Componentes Reaproveitados e Estendidos (Seção 9.1 & 9.2)             │
├───────────────────────┬──────────────────────┬─────────────────────────┤
│ Primitivo Shadcn      │ Domínio (Orion)      │ Estratégia de Extensão  │
├───────────────────────┼──────────────────────┼─────────────────────────┤
│ `components/ui/dialog`│ `GlobalSearch`       │ Integrar atalho global   │
│                       │                      │ Ctrl+K para busca e     │
│                       │                      │ comandos da IA [18, 41] │
├───────────────────────┼──────────────────────┼─────────────────────────┤
│ `components/ui/card`  │ `DashboardStats`     │ Adicionar micro-glow e  │
│                       │                      │ pulse-glow nas bordas   │
│                       │                      │ nos alertas [15, 16]    │
├───────────────────────┼──────────────────────┼─────────────────────────┤
│ `components/ui/chart` │ `RevenueChart`       │ Transicionar de HSL     │
│                       │                      │ para OKLCH em Tailwind  │
│                       │                      │ v4 dinâmico [11, 68]    │
└───────────────────────┴──────────────────────┴─────────────────────────┘
```

### 3.2 Padronização Sistemática de Estados de Interface (Falta de Estados Conhecida)
Todo componente interativo do fluxo ERP deve ter seus estados declarados de forma determinística na máquina de estados de UI:

1.  **Empty State (Estado Vazio):** Aplicável a Clientes, Produtos, Vendas e Transações Financeiras. Nunca exibir tabela em branco ou tela cinza sem contexto. O estado vazio deve renderizar o ícone do domínio correspondente (Lucide), uma mensagem educacional concisa (Ex: *"Nenhum cliente cadastrado ainda. Para emitir uma venda em menos de 10 minutos, adicione seu primeiro cliente agora"*), e um botão de ação primária em destaque para criação [44, 51].
2.  **Loading/Skeleton State (Carregamento Progressivo):** Nas visualizações de tabelas, gráficos de receita e relatórios, exibir loaders skeletons estruturados reproduzindo perfeitamente a grade do componente final em vez de loaders spinners genéricos girando. O tempo máximo de animação do pulso do skeleton deve ser de $1.5s$, respeitando o **Limiar de Doherty** para manter o foco do usuário ativo [35, 59].
3.  **Error State (Recuperação de Erro Fatais):** Se um endpoint falhar ou o Prisma disparar um erro HTTP 500, a tela não deve quebrar com tela branca. Renderizar o componente de boundary de erro que captura a falha, exibe a explicação em linguagem natural (omitindo logs crus do Prisma ou queries SQL), preserva o payload digitado no formulário atual na memória local (`sessionStorage` ou estado do React Hook Form) e oferece um botão *"Tentar Novamente"* com estratégia de retentativa exponencial *back-off* [39, 43].
4.  **Limit of Plan Reached (Limite de Plano):** Conforme definido em `src/lib/account.ts`, os limites contratuais por plano (Starter: 500 clientes/200 produtos; Professional: 5000 clientes/2000 produtos) são aplicados por código [10]. Caso o usuário tente criar um registro que exceda essa cota, o botão de submissão do formulário deve ser renderizado desativado com um `Tooltip` informativo explicativo e o formulário apresentará um banner contextual com o CTA primário *"Upgrade de Plano"* redirecionando para `/dashboard/configuracoes/assinatura` [10, 19, 39].
5.  **Trial Expiring (Trial Expirando):** O gate de trial de 30 dias é avaliado no server-side layout do dashboard [11, 13]. Se o trial estiver ativo e restarem menos de 7 dias, renderizar un banner persistente no topo do dashboard com fundo em gradiente ciano-roxo discreto (sem quebrar o fluxo de trabalho) exibindo os dias restantes e um link direto para o checkout Stripe com suporte ao cupom de fundador (`allow_promotion_codes`) [11, 18]. Se expirado, o wrapper do dashboard bloqueia totalmente o conteúdo e exibe a tela de gate com o botão exclusivo de checkout [11, 18].
6.  **Feature Under Construction (Funcionalidade Fiscal - G8):** Na sub-rota `/dashboard/configuracoes/fiscal`, o enquadramento fiscal e a conexão Focus NFe estão operacionais [8, 9, 26]. No entanto, a emissão direta de NF-e a partir de pedidos de venda não existe no código [9, 26]. Para alinhar as expectativas e não violar o G4 [6, 28]: ao carregar a tela Fiscal, renderizar um card destacado com o status: **"Configuração Ativa para Emissão via Integração. Emissão direta pelo Painel de Pedidos prevista para a versão Professional"** [10]. No painel de pedidos de venda, o botão "Emitir NF-e" deve ser renderizado com um badge discreto *"Em Breve"* e, ao ser clicado, abrir um Dialog explicativo convidando a agendar o trial do plano Professional, em vez de disparar uma rota quebrada [9, 26].

---

## 4. Plano de Ação: Tarefas de Execução (Roteiro Técnico)

As tarefas a seguir abordam tanto os requisitos da meta **G5** de ativação rápida quanto a resolução cirúrgica das dívidas críticas de UX identificadas no código que quebram as heurísticas de visibilidade do sistema e prevenção de erros [3, 4, 25, 26].

### Épico I: Ativação G5 e Engenharia de Onboarding (Prioridade Máxima)

#### [ ] Task 1: Implementação do StepTracker de Ativação do Fluxo G5
*   **Requisitos Funcionais:** Criar um componente de acompanhamento visual do onboarding de ativação (`StepTracker`) exibido em destaque no topo da dashboard principal. Ele deve ler o estado atual do banco de dados (UserOnboarding / conta) para determinar a conclusão dos 4 passos-chave: (1) Cliente cadastrado, (2) Produto cadastrado, (3) Venda emitida, (4) Primeiro relatório gerado [4, 21].
*   **Requisitos de UX/UI:** 
    *   Exibir uma barra de progresso horizontal persistente baseada no espaço cromático OKLCH dinâmico (calculando contraste perfeito) [67, 68].
    *   Sinalizar o progresso cumulativo em percentuais (ex: "Passo 2 de 4: 50% concluído") aplicando o **Efeito Zeigarnik** [61].
    *   Usar micro-interações de transição via `Framer Motion` (durabilidade: $300ms$, easing: `"The ROI Flow"`) [16] para animar a transição entre etapas.
*   **Critérios de Aceite:**
    1. O tracker atualiza o estado instantaneamente quando qualquer uma das 4 tabelas correspondentes (`Customer`, `Product`, `SalesOrder`, relatório visualizado) transiciona de vazia para maior que zero [7, 8, 19, 21].
    2. O componente é ocultado automaticamente assim que os 4 passos são concluídos, gerando o evento `g5_flow_success` no Google Analytics 4 [4, 27].

#### [ ] Task 2: Setup do Componente `sample-data-manager` e Ativação Rápida
*   **Requisitos Funcionais:** Garantir que o botão *"Popular com Dados de Exemplo"* do onboarding execute uma chamada POST síncrona para `/api/sample-data` [18, 21]. A rota deve popular instantaneamente as tabelas do ERP com 3 clientes fictícios, 5 produtos, 2 pedidos de venda e 4 transações financeiras simuladas de forma idempotente, sem duplicar dados se clicado repetidamente [8, 19, 21].
*   **Requisitos de UX/UI:**
    *   Durante a requisição ao servidor, o botão entra em estado carregando (`loading`), desativa cliques subsequentes (prevenção de erros de Hick) [39, 57] e exibe um skeleton loader completo hidratando a tela em segundo plano.
    *   Ao concluir, dispara uma notificação de sucesso síncrona via `Sonner` (`toast.success("Seu ERP foi populado com dados de demonstração. Explore os relatórios agora!")`) [17, 35].
*   **Critérios de Aceite:**
    1. Executar o povoamento completo em menos de $1.2s$ em conexões estáveis [59].
    2. O clique no botão preenche as tabelas de forma que o `StepTracker` pule imediatamente para 100% de conclusão, desbloqueando a visualização dos relatórios instantaneamente para o usuário de trial [4, 21].

---

### Épico II: Saneamento de UX e Remoção de Elementos Decorativos Quebrados

#### [ ] Task 3: Eliminação das Rotas e Componentes Órfãos
*   **Requisitos Funcionais:** Excluir fisicamente do diretório de páginas do Next.js as rotas legadas e mockadas que foram detectadas pela auditoria como geradoras de erros cognitivos severos e desinformação [25, 26]:
    *   `/app/onboarding/brand-assets/page.tsx`
    *   Páginas e referências órfãs de plataformas legadas.
*   **Requisitos de UX/UI:** 
    *   Garantir que links de navegação interna apontando para essas rotas sejam desativados ou redirecionados síncronamente para a home ou dashboard correspondente.
    *   Aplicar a Heurística de Correspondência com o Mundo Real [36], limpando a interface de falsas promessas de funcionalidades inoperantes [28].
*   **Critérios de Aceite:**
    1. Exclusão física dos arquivos executada com sucesso.
    2. Nenhuma página pública ou interna do dashboard deve possuir hiperlinks quebrados que resultem em erro HTTP 404 [25, 26].

#### [ ] Task 4: Acoplamento do Botão "Alterar Senha" nas Configurações de Segurança
*   **Requisitos Funcionais:** O botão *"Alterar Senha"* presente na sub-rota `/dashboard/configuracoes/seguranca` atualmente é inoperante (decorativo) [25]. Integrar o botão à infraestrutura existente de envio de e-mails via `/esqueci-senha` (gerido pela stack NextAuth v5 + Resend) [11, 25].
*   **Requisitos de UX/UI:**
    *   Ao clicar no botão *"Alterar Senha"*, a interface dispara um modal de confirmação (`components/ui/alert-dialog`) [17] informando: *"Enviaremos um link de redefinição de senha seguro para seu e-mail de cadastro [e-mail]. Deseja continuar?"*
    *   Ao confirmar, exibe um spinner interno de carregamento no botão do modal e fecha-o exibindo um toast de sucesso indicando que o e-mail foi enviado.
*   **Critérios de Aceite:**
    1. O clique dispara a mutation de redefinição de senha real de forma segura.
    2. Envia o e-mail transacional via Resend em menos de $800ms$ após a confirmação [11, 59].

#### [ ] Task 5: Correção e Ativação dos Toggles de Configurações de Notificação
*   **Requisitos Funcionais:** Ligar os 3 toggles decorativos de `/dashboard/configuracoes/notificacoes` (que hoje não realizam nada no banco de dados) [25] a uma mutation de atualização parcial do modelo `User` ou tabela de preferências do banco via Prisma ORM [11, 19].
*   **Requisitos de UX/UI:**
    *   Usar o componente primitivo `components/ui/switch` [17] estilizado com contraste de foco e hover perceptível baseados no espaço de cores OKLCH [67, 68].
    *   Cada mudança de toggle deve salvar automaticamente o estado no banco de dados em segundo plano (atualização otimista na UI com o Switch trocando de estado instantaneamente) [60]. Em caso de queda de rede, reverte o estado visual e exibe um toast de erro com botão de retentativa [43, 60].
*   **Critérios de Aceite:**
    1. Os valores booleanos dos 3 toggles são persistidos fielmente no banco de dados.
    2. Atualizações consecutivas rápidas não causam condições de corrida no banco de dados (implementar debounce simples no handler de persistência).

#### [ ] Task 6: Implementação da Tela de Histórico e Acompanhamento de Migração de Dados
*   **Requisitos Funcionais:** Atualmente, a rota `/api/migration` processa o upload em formato POST de arquivos, mas ignora o select `"Tipo de Dados"` da interface e não possui visualização de histórico ou tela de acompanhamento [25]. A tarefa consiste em:
    1. Modificar a API `/api/migration` para aceitar e persistir o campo `Tipo de Dados` (mapeado nos Enums do Prisma correspondentes ao sistema de origem) [19, 20].
    2. Criar a tela de histórico em `/dashboard/configuracoes/migracao` lendo as transações registradas na tabela `DataMigration` [19].
*   **Requisitos de UX/UI:**
    *   Substituir o select ignorado por um formulário tipado com validação via `Zod` e feedback síncrono em campos inválidos [11, 39].
    *   Exibir uma tabela estruturada do histórico de migrações contendo colunas: *Data*, *Sistema de Origem*, *Tipo de Dados*, *Status* (Enum `MigrationStatus`: PENDING, SUCCESS, FAILED) e *Registros Importados* [20].
    *   Se houver migração pendente, renderizar uma barra de progresso real com atualizações periódicas de progresso consumindo a rota de status via polling ou SSE existente [8, 14, 35].
*   **Critérios de Aceite:**
    1. O select da UI passa a ser transmitido e gravado corretamente no banco de dados através da rota POST `/api/migration`.
    2. A listagem de migrações reflete em tempo real o status atual de processamento do job.

#### [ ] Task 7: Sincronização e Validação de API Keys
*   **Requisitos Funcionais:** Corrigir a inoperabilidade das API Keys geradas na interface [25]. A rota de middleware ou handlers de rotas públicas de dados expostos do ERP deve passar a verificar sistematicamente a presença e validade do header `x-api-key` contra as chaves gravadas de forma criptografada de cada conta (`ApiKey` / `User.accountId` no banco) [12, 19, 25].
*   **Requisitos de UX/UI:**
    *   Na página de gerenciamento de chaves, os tokens brutos criados devem ser exibidos em formato oculto (substituídos por asteriscos), permitindo a visualização e cópia para o clipboard apenas no momento da criação inicial (**Prevenção de Erros de Segurança**).
    *   Se a chave de API for gerada mas nunca utilizada, a UI apresenta um badge de aviso informando que a chave está *"Ociosa - Aguardando primeira chamada"*.
*   **Critérios de Aceite:**
    1. Qualquer chamada externa às APIs de importação/exportação de dados sem a chave correspondente no header `x-api-key` deve retornar HTTP 401 Unauthorized.
    2. A listagem de chaves de API na interface atualiza síncronamente o contador de *"Último Uso"* baseado nas requisições reais autorizadas no back-end.

---

## 5. Master Prompt de Execução (Roteiro para IA de Código)

Cole o prompt estruturado abaixo na sua ferramenta de inteligência artificial ou agente de desenvolvimento autônomo para iniciar a codificação dos componentes e correção dos defeitos da plataforma Orion com fidelidade cirúrgica:

```text
Você é um Engenheiro de Front-end sênior de elite e Arquiteto de Software especializado na stack Next.js 16 (App Router, RSC), Tailwind CSS v4, shadcn/ui e Prisma 5. Seu objetivo é executar a refatoração do Orion ERP (repositório: `orion-nova-ui`) focando na meta de usabilidade G5 (Time-to-Value <= 10min) e na correção das dívidas de UX identificadas na base de dados e rotas públicas.

### DIRETRIZES TÉCNICAS RÍGIDAS DE CODIFICAÇÃO
1. Identidade de Conta na Sessão (Crucial): Toda query, mutação e exibição de dados deve ler session.user.accountId para carregar os registros da conta correspondente. NUNCA use o ID do usuário logado (session.user.id) para filtrar tabelas do ERP (como Customer, Product, SalesOrder ou FinancialTransaction), pois a plataforma é multi-usuário corporativa.
2. Limites de Prisma: Lembre-se de que o Prisma não funciona dentro de middlewares do Next.js. Toda validação de trial ou checagem de plano de assinatura deve ser efetuada nas páginas ou em layouts do App Router usando Server Components estruturados, sem tentar acionar o ORM na borda do proxy de rotas.
3. Tratamento de Promises Assíncronas em Next.js 16: Lembre-se de que as propriedades de rotas dinâmicas como `params` e `searchParams` em Server Components e Route Handlers agora são tratadas como Promises. Você deve usar `await params` antes de ler suas chaves (Ex: const { id } = await params) para prevenir warnings e quebras no build do Next 16.
4. UI Parametrizada e OKLCH: Evite cores codificadas em HSL bruto para novos elementos interativos. Utilize as variáveis do Tailwind associadas ao espaço de cores OKLCH dinâmico para garantir contrastes WCAG/APCA automáticos ao ler o primaryColor customizado de cada conta.

### IMPLEMENTAÇÕES PRIORITÁRIAS A EXECUTAR

1. Crie o tracker visual de onboarding `StepTracker` na dashboard principal. Ele lê o progresso da conta (UserOnboarding) de forma reativa a partir de 4 marcos: a presença de registros em Customer, Product, SalesOrder e a geração de relatórios. Use Framer Motion para transição suave em 300ms com curva cubic-bezier(0.25, 0.1, 0.25, 1).
2. Integre o botão de ação rápida de dados simulados (POST `/api/sample-data`). Durante o carregamento, a interface exibe skeletons loaders progressivos mimetizando as tabelas finais.
3. Desative e remova do código as páginas mortas ou decorativas detectadas: `/app/onboarding/brand-assets/page.tsx` e referências a rotas órfãs.
4. Acople o Switch de configurações de notificação à mutation do Prisma de forma otimista. Em caso de falha de persistência, desfaça a animação visual e exiba um toast via Sonner com botão de retentativa imediata.
5. Ligue o botão de redefinição de senha na tela de configurações de segurança ao endpoint transacional existente que envia o link via Resend.
6. Ajuste a rota de upload `/api/migration` para capturar o valor selecionado no select "Tipo de Dados" e crie a visualização histórica de logs baseada na tabela `DataMigration` exibindo status ativos de migração e progresso em tempo real.
7. Garanta que as API Keys geradas sejam armazenadas de forma segura e validadas contra o header `x-api-key` nas rotas públicas.

Não adicione bibliotecas externas de estilo ou interface além das já presentes no inventário (shadcn, Radix, Tailwind v3/v4). Escreva código limpo, componentizado, fortemente tipado em TypeScript e auto-explicativo.
```