# Handoff — NF-e no modelo BYO (04/08/2026, sessão 8)

Leia o [HANDOFF.md](HANDOFF.md) para o estado geral e
[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md) para as
metas. Este documento trata só do **G8 — emissão de NF-e**.

> ⚠️ O [HANDOFF-NFE.md](HANDOFF-NFE.md) está **superado**. Ele recomenda
> PlugNotas e o modelo de revenda, os dois abandonados — leia só se quiser o
> levantamento dos campos fiscais, que continua correto. As decisões válidas
> estão aqui.

**Diferente do anterior, aqui tem código no ar.** Deploy verde, migration
aplicada em produção.

---

## As duas decisões que definem tudo

**1. Modelo BYO, não revenda.** Contratar provedor fiscal é contrato B2B e exige
a ROI Labs enquadrada — inviável hoje por custo, e **nenhum provedor contorna
isso**. No BYO quem contrata é o cliente; a Orion guarda só o token dele.

**2. Provedor: Focus NFe.** [Cadastro self-service](https://focusnfe.com.br/cadastro/),
30 dias de teste, preço público (Solo R$ 89,90/mês, 100 notas, R$ 0,10 a extra).
O cliente sobe o próprio certificado A1 no painel dele — **a Orion nunca vê um
`.pfx`**, que era o critério eliminatório do documento anterior.

Por que os outros saíram:
- **PlugNotas** era a escolha certa na revenda e é a errada aqui: contact-sales,
  o cliente final não contrata sozinho.
- **Nuvem Fiscal**: serviço desativado em 31/07/2026. Anunciado no site deles.
- **Brasil NFe** (R$ 49,90/mês, ilimitado) ficou como plano B **não verificado** —
  não achei webhook nem fluxo de certificado documentados. Se o custo do cliente
  virar objeção de venda, é por aí que se investiga.

### O que o BYO custou, e foi assumido de olho aberto

"Conecte sua conta de emissão fiscal" vende pior que "emita NF-e pela Orion", e o
cliente ainda paga R$ 89,90 por fora. O G8 nasceu para dar ao Professional um
módulo exclusivo que justificasse R$ 189 — ele entrega a feature, **não o
argumento de venda inteiro**. Não redescubra isso e reabra a discussão: já foi
pesado e decidido.

---

## O que já está pronto

| Peça | Onde | O que faz |
|---|---|---|
| Schema fiscal | [prisma/schema.prisma](prisma/schema.prisma) | Campos em `Company`, `Customer` e `Product`; model `NotaFiscal` |
| Validação | [src/lib/fiscal.ts](src/lib/fiscal.ts) | NCM/CEST/CFOP/IBGE/chave de 44 dígitos, `usaCsosn()`, `pendenciasEmitente/Produto`. **Agnóstico de provedor** — sobrevive à troca |
| Cifra | [src/lib/crypto.ts](src/lib/crypto.ts) | AES-256-GCM sobre `node:crypto`. Sem dependência nova |
| Cliente Focus | [src/lib/focus-nfe.ts](src/lib/focus-nfe.ts) | HTTP Basic, valida o token antes de guardar, recusa o token master |
| Conexão | [api/fiscal/conexao](src/app/api/fiscal/conexao/route.ts) + [ConexaoFiscal](src/components/fiscal/ConexaoFiscal.tsx) | Conectar / status / desconectar. Só o dono da conta |
| Tela | [configuracoes/fiscal](src/app/dashboard/configuracoes/fiscal/page.tsx) | Enquadramento + conexão + pendências |

19 testes em `src/lib/__tests__/{fiscal,crypto}.test.ts`.

**Já aplicado em produção:** a migration `20260803210000_add_fiscal_nfe`.
`ENCRYPTION_KEY` configurada na Vercel **e no `.env` local com o mesmo valor** —
dev e prod compartilham o banco, chave diferente = token que não decifra.

---

## NFS-e Nacional — por que existe, decidido em 04/08

**O CNPJ disponível não emite NF-e, e nunca vai.** É um MEI de serviço
(CNAEs 7319-0/02, 5819-1/00, 8219-9/99), sem inscrição estadual — e sem direito
a uma, porque IE é registro de contribuinte de **ICMS** e ele não circula
mercadoria. Sem IE não há credenciamento na SEFAZ, e sem credenciamento a NF-e
modelo 55 é rejeitada **inclusive em homologação**. Comprar um certificado A1
para esse CNPJ não resolveria nada.

O documento fiscal dele é **NFS-e**. Daí o módulo.

**Padrão Nacional (`/v2/nfsen`), não municipal (`/v2/nfse`).** O municipal exige
integração por prefeitura, cada uma com suas regras; o Nacional é um endpoint só
para o país e o MEI já é obrigado a ele. Não reabra sem um município que force.

| Peça | Onde |
|---|---|
| `TipoNota` + `NotaFiscal.tipo` | [schema.prisma](prisma/schema.prisma) — uma coluna, não uma segunda tabela |
| Numeração da DPS (`serieDps`, `proximoNumeroDps`) | idem — sequência **própria**, compartilhar com a NF-e furaria as duas |
| `codigoTributacaoNacionalISS`, `aliquotaIss` em `Product` | idem — o código do ISS é o NCM do serviço |
| `pendenciasPrestador`, `pendenciasServico`, `opcaoSimplesNacional` | [fiscal.ts](src/lib/fiscal.ts) |
| `emitirNfseNacional`, `consultarNfseNacional` | [focus-nfe.ts](src/lib/focus-nfe.ts) |
| Passo 1 do módulo | [scripts/nfse-homologacao.sh](scripts/nfse-homologacao.sh) |

Migration `20260804120000_add_nfse_nacional` **aplicada**, `migrate diff` devolve
migration vazia. 19 testes em `fiscal.test.ts`.

**Inscrição municipal não é exigida.** No padrão Nacional o prestador é
identificado por `cnpj_prestador` + `codigo_municipio_emissora`; o payload do DPS
não tem campo para IM. Quem a exige é a NFS-e **municipal** (`Prestador` →
`required: [cnpj, inscricao_municipal]`), que não é o caminho. Cobrá-la travaria
o MEI que nunca abriu cadastro mobiliário na prefeitura — a maioria.

**A armadilha que isto expôs, e que já estava no código:** `pendenciasEmitente`
cobra inscrição **estadual**. Reusá-la para NFS-e bloquearia todo MEI de serviço
— ou seja, o público mais provável do Orion. Por isso `pendenciasPrestador` é
função separada, e há um teste fixando que o mesmo MEI passa numa e é recusado
na outra. Se um dia alguém "simplificar" unificando as duas, o teste quebra.

**O que falta:** tela, emissão a partir do pedido e webhook — os mesmos passos 2
a 4 da tabela abaixo, e na mesma ordem. **O passo 1 continua sendo o primeiro:**
rodar o script e ver o que o ambiente nacional cobra além do que a doc diz. Dois
valores do script são chute documentado e são os primeiros suspeitos numa
rejeição: `COD_ISS=170600` (17.06, propaganda) e `OPCAO_SN=2` (optante MEI).

---

## O próximo passo, em ordem

| # | Passo | Custo |
|---|---|---|
| 1 | **Criar a conta na Focus** e emitir uma nota de homologação no `curl` | 0,5 dia |
| 2 | Campos fiscais em `Product` e `Customer` na UI + preenchimento em massa | 1,5 dia |
| 3 | Rota de emissão + webhook de retorno | 1,5 dia |
| 4 | Botão "Emitir NF-e" no pedido: status, DANFE, XML, cancelamento, carta de correção | 1,5 dia |
| 5 | Homologação real na SEFAZ | 1 dia+, imprevisível |
| 6 | Textos públicos | 0,5 dia |

**Comece pelo passo 1 e não pule.** Meia hora emitindo na mão revela a lista real
de campos obrigatórios, que é maior do que qualquer documentação faz parecer, e
todo o resto depende dela estar certa. Os campos do schema saíram de levantamento,
não de uma nota que passou.

**A conta na Focus já existe** (criada em 04/08, sessão 8) e o passo 1 já tem
ferramenta — [scripts/nfe-homologacao.sh](scripts/nfe-homologacao.sh) emite uma
nota e faz o poll até a SEFAZ responder:

```bash
FOCUS_TOKEN=<token de homologação> CNPJ_EMITENTE=<14 dígitos> \
  bash scripts/nfe-homologacao.sh
```

O que falta para rodá-lo é **uma empresa cadastrada com certificado A1** — ver a
armadilha 7. O payload dele já cobre todos os campos que o OpenAPI da Focus marca
como obrigatórios; o que ele existe para descobrir é o que a **SEFAZ** exige além
disso.

Base URLs e auth (confirmados na doc):
```
Homologação: https://homologacao.focusnfe.com.br
Produção:    https://api.focusnfe.com.br
Auth:        HTTP Basic — token no usuário, senha vazia (curl -u "TOKEN:")
```

---

## As armadilhas — leia antes de codar

**1. A recusa do token master — a doc sustenta, o token real ainda não.** Em
[focus-nfe.ts](src/lib/focus-nfe.ts), a lógica que distingue o token master do
token da empresa saiu da documentação, sem token real. O OpenAPI de
[criar_empresa](https://doc.focusnfe.com.br/reference/criar_empresa.md) **reforça
a premissa**: o `EmpresaResponse` devolve `token_producao` e `token_homologacao`,
então listar empresas é mesmo operação de conta, não de empresa. **Ainda assim
confirme na primeira conexão de verdade** — doc concordar não é o mesmo que a API
responder. Se a Focus responder outra coisa, o pior caso é aceitar um master, que
emite nota para qualquer CNPJ da conta do cliente.

**2. O webhook vai receber callback de N contas diferentes.** No BYO cada cliente
tem a própria conta na Focus, todas apontando para a mesma URL da Orion. **Sem
segredo por conta, qualquer um forja um retorno de autorização.** O padrão a
copiar é o webhook da Stripe ([G2](src/app/api/webhooks/stripe/route.ts)):
validação de assinatura + idempotência. `NotaFiscal.providerRef` já é `@unique`
exatamente para isso.

**3. NCM em massa ou a feature morre no onboarding.** Cliente com 200 produtos
vai ter que preencher NCM em 200 produtos. Planeje importação em massa e default
por categoria **antes** de expor a tela, não depois.

**4. Emissão é assíncrona.** `PENDENTE → AUTORIZADA | REJEITADA`, fechado por
webhook. Nunca um `await` travando a tela — a SEFAZ leva de segundos a minutos e
pode rejeitar.

**5. Quando a emissão entrar, três textos precisam mudar no mesmo commit:**
- `notYet` em [features/page.tsx](src/app/features/page.tsx) — hoje lista
  "Emissão de NF-e ou NFS-e", e está **correto** enquanto não emite
- [solucoes/[slug]](src/app/solucoes/[slug]/page.tsx) — mesma lista por segmento
- "O QUE O ORION NÃO FAZ" em [api/ai/chat](src/app/api/ai/chat/route.ts) — já tem
  a exceção que reconhece a tela de configuração; **a emissão continua negada lá**

Se isso não andar junto, o assistente dentro do produto pago nega uma
funcionalidade que o cliente acabou de comprar. Foi o problema que o G4 gastou
uma sessão inteira limpando.

**7. Sem certificado A1 não existe passo 1 — e ele custa dinheiro.** A conta na
Focus é grátis por 30 dias, mas emitir em homologação exige uma empresa cadastrada
com certificado digital: a API recebe o PFX em `arquivo_certificado_base64` +
`senha_certificado`, e a SEFAZ de homologação **assina de verdade**. Um A1 custa
na faixa de R$ 150–250/ano e sai no CNPJ. Enquanto não houver um, o passo 1 não
roda, e os passos 2 a 4 ficam construindo sobre campos não confirmados. **Este é
o gargalo do G8, não a Focus.**

**6. Reforma tributária.** O layout da NF-e está mudando para IBS/CBS. Terceirizar
para provedor é justamente o que reduz esse risco — a atualização é problema
deles. Confirme o calendário vigente antes de modelar campo novo.

---

## Duas pegadinhas operacionais que já morderam

**Nunca grave arquivo com `Out-File -Encoding utf8` no PowerShell 5.1.** Ele
escreve BOM. Um BOM no início de um `migration.sql` derruba o deploy com P3009 —
já aconteceu nesta sessão, custou um build. Use redirect do Bash. Confira com
`head -c 8 arquivo | xxd`: tem que começar em `2d2d` (`--`), não `efbbbf`.

**`prisma migrate status` mente sobre drift.** Depois de um `migrate resolve` ele
respondeu "Database schema is up to date!" enquanto o `migrate diff` apontava 30
mudanças pendentes. **Confie no `migrate diff`**, não no `status`:
```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma --script
```
Sem drift ele devolve `-- This is an empty migration.`

---

## Decisões tomadas — não reabrir sem motivo novo

1. **BYO, não revenda.** Só muda se a ROI Labs se enquadrar.
2. **Focus NFe.** Brasil NFe só se o custo virar objeção real de venda.
3. **Sem cota por plano.** No BYO o custo por documento é do cliente, direto no
   provedor. A Orion não tem custo marginal — o mecanismo do `maxAiMessages`
   **não** precisa ser copiado.
4. **Preço de tabela fica em 89/189/349.** Tração vem de cupom de fundador na
   Stripe (`allow_promotion_codes` já ligado no
   [checkout](src/app/api/checkout/route.ts)), com `max_redemptions` — não de
   corte de tabela, que é porta de uma via só e exige 3 prices novos. Reabrir só
   com resistência a preço em conversa real de venda.
5. **Um provedor, sem abstração.** Não crie interface de provedor antes do
   segundo provedor existir. As colunas se chamam `focusNfeToken` de propósito.

---

## O que bloqueia mais que isto

O G8 **não é a prioridade**. O G3 é a primeira compra real e nunca foi feito:
ninguém nunca provou que produção cobra.

A sessão 8 tirou o que bloqueava o G3 — `RESEND_API_KEY` está em produção e um
e-mail disparado pela app chegou ao Gmail (detalhes no
[HANDOFF.md](HANDOFF.md)). **Não sobrou desculpa técnica: o G3 agora é passar o
cartão.**

**Se você tem uma tarde, gaste no G3, não aqui.**
