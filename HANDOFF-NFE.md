# Handoff — Emissão de NF-e por integração (aberto em 03/08/2026, sessão 7)

Documento de decisão para uma sessão nova. Leia o [HANDOFF.md](HANDOFF.md)
primeiro para o estado geral do projeto; este aqui trata de **um** assunto.

**Nada foi implementado.** Isto é levantamento e recomendação.

---

## As duas perguntas que originaram este documento

> **1. Mesmo que a Orion não emita NF-e, ela pode oferecer integração com pelo
> menos 3 emissoras?**

**Pode, e é assim que o mercado inteiro funciona.** Nenhum ERP de PME fala com a
SEFAZ direto — todos usam um provedor de API fiscal. Bling, Tiny e Omie
incluídos. Existem bem mais de 3 provedores no Brasil com API REST madura.

Mas a resposta útil é outra: **oferecer 3 é feature para você, não para o
cliente.** Quem compra um ERP de R$ 89 quer clicar em "emitir nota", não
escolher gateway fiscal. Um provedor cobre NF-e, NFC-e e NFS-e de todos os
municípios. O único motivo real para suportar dois é o cliente que **já paga**
uma emissora e quer reaproveitar o contrato — e com 0 clientes hoje, isso é
especulação.

**Recomendação: integre 1, anuncie 1.** Mantenha a chamada isolada num módulo
para que um segundo seja possível, mas **não construa a abstração de provedor
antes do segundo provedor existir.**

> **2. Tem alguma que trabalha em background e emita a nota pelo frontend da
> Orion, como se fosse a Orion emitindo?**

**Sim — esse é o modo padrão de operação de todas elas.** São APIs headless: a
Orion faz `POST` com um JSON do pedido, o provedor monta o XML, assina com o
certificado, transmite para a SEFAZ e devolve chave de acesso, XML autorizado e
o PDF do DANFE. O cliente nunca vê o provedor, nunca sai da Orion, nunca cria
conta em lugar nenhum.

Três ressalvas que precisam estar claras antes de vender isso:

1. **"Como se fosse a Orion" é UX, não é situação jurídica.** O emitente é
   sempre o cliente: CNPJ dele, certificado digital dele, responsabilidade
   fiscal dele. A Orion é o software que aperta o botão. Isso é normal e é
   exatamente o que Bling e Tiny fazem — mas **nunca escreva no site que "a
   Orion emite sua nota fiscal"**. Escreva "emita sua NF-e pela Orion".
2. **A emissão é assíncrona.** A SEFAZ pode levar de segundos a minutos, e pode
   rejeitar. O fluxo tem que ser `PENDENTE → AUTORIZADA | REJEITADA`, com
   webhook do provedor, não um `await` que trava a tela.
3. **O DANFE pode vazar a marca do provedor.** Verifique isso na escolha. Se
   vazar, dá para gerar o DANFE por conta própria a partir do XML — este repo
   já tem `jspdf` + `jspdf-autotable` e um
   [pdf-generator.ts](src/lib/pdf-generator.ts) que monta o PDF do pedido.

---

## ⚠️ Antes de qualquer coisa: isto está fora de escopo hoje

[roadmaps/GOAL-PRIMEIRO-PAGANTE.md](roadmaps/GOAL-PRIMEIRO-PAGANTE.md) lista,
em "Fora de escopo (até 01/11)", a linha **"integrações fiscais"** — junto com
"módulo novo de ERP". A meta em vigor é *um* cliente pagante até 01/11/2026, e o
G3 (a primeira compra real, com cartão de verdade) **ainda não foi feito**.

A estimativa honesta abaixo é de **6 a 9 dias de trabalho**. Isso não cabe antes
do G3 sem empurrar a meta.

**Então a primeira decisão desta sessão não é técnica: é se o arquivo de metas
muda.** Não comece a codar sem essa decisão tomada e escrita lá.

### O argumento a favor de reabrir o escopo

A auditoria da sessão 6 concluiu que o Orion **não compete na faixa de R$ 199-249**
(Omie, Bling Pro) porque nessa faixa NF-e, estoque e conciliação são preço de
entrada, não diferencial. Hoje o Professional custa R$ 189 e entrega o mesmo
produto do Starter com mais volume — nenhum módulo exclusivo.

**NF-e é o único item da lista que muda isso e que não exige construir um módulo
de ERP do zero**, porque o trabalho pesado é do provedor. É, de longe, a maior
alavanca comercial disponível por unidade de esforço.

### O argumento contra

O gargalo hoje **não é feature, é prova**: ninguém nunca pagou o Orion. O G3
custa uma tarde e prova que a cobrança funciona ponta a ponta. Nove dias em
NF-e antes disso é construir em cima de uma esteira nunca testada.

**Recomendação: G3 primeiro, NF-e depois.** Eles não competem — o G3 é uma
tarde. Mas a ordem importa.

---

## O que realmente custa: não é a API, são os campos que faltam

Integrar a API é a parte fácil. O caro é que **o schema atual não tem quase
nenhum dado que uma NF-e exige**. Levantado de
[prisma/schema.prisma](prisma/schema.prisma):

### Product — hoje tem 0 campos fiscais

| Tem hoje | Falta para NF-e |
|---|---|
| `name`, `sku`, `description`, `type`, `category`, `price`, `cost`, `stockQuantity`, `minStock`, `unit`, `isActive`, `image` | **`ncm`** (8 dígitos, obrigatório) · **`cfop`** · **`cest`** (se ST) · **`origem`** (0-8) · **`cstIcms`** ou **`csosn`** (depende do regime) · `cstPisCofins` · `aliquotaIcms` · `unidadeTributavel` |

Sem NCM não sai nota. Se o cliente tem 200 produtos cadastrados, ele vai ter que
preencher NCM em 200 produtos — **planeje a importação em massa e um default por
categoria**, ou a feature morre no onboarding.

### Customer — falta o destinatário fiscal

| Tem hoje | Falta |
|---|---|
| `name`, `cpfCnpj`, `email`, `phone`, `address`, `city`, `state`, `zipCode` | **`inscricaoEstadual`** · **`indIEDest`** (1 contribuinte / 2 isento / 9 não contribuinte) · **`codigoMunicipioIBGE`** · `numero` e `bairro` separados (hoje `address` é um campo de texto só) |

O `codigoMunicipioIBGE` é obrigatório e não dá para deduzir de `city` + `state`
com segurança. Tem tabela pública do IBGE; alguns provedores derivam do CEP.

### Company — o emitente quase não existe

| Tem hoje | Falta |
|---|---|
| `companyName`, `tradeName`, `cnpj`, `phone`, `email`, `address`, `city`, `state`, `zipCode` | **`inscricaoEstadual`** · **`regimeTributario`** (Simples / Presumido / Real) · `cnae` · `codigoMunicipioIBGE` · `serieNfe` · `proximoNumeroNfe` · `ambiente` (homologação/produção) |

O **regime tributário muda tudo**: Simples Nacional usa CSOSN, os demais usam
CST. É a primeira pergunta do onboarding fiscal, e ela redefine metade dos
campos do produto.

### Não existe model de nota fiscal

Precisa de um `NotaFiscal`: `orderId`, `status`, `numero`, `serie`, `chaveAcesso`
(44 dígitos), `protocolo`, `xmlUrl`, `danfeUrl`, `motivoRejeicao`,
`providerId`, `emitidaEm`, `canceladaEm`, `justificativaCancelamento`.

### E o certificado digital A1

Cada cliente precisa subir o `.pfx` dele + a senha. **É o dado mais sensível que
o sistema jamais vai guardar** — com ele se assina qualquer documento em nome
da empresa.

**A saída barata: não guarde.** Vários provedores aceitam o upload do
certificado via API/painel deles e passam a gerenciá-lo. A Orion recebe o
arquivo, repassa e não persiste nada. **Esse deve ser um critério eliminatório
na escolha do provedor.**

> Correção a uma afirmação da auditoria da sessão 6: ela diz que "nenhuma rota
> aceita `multipart`". Está errado —
> [api/migration/route.ts:15](src/app/api/migration/route.ts) já faz
> `req.formData()` com limite de 10 MB. O que não existe é **persistência** de
> arquivo (S3/blob). Para o certificado, é o padrão dessa rota que você copia.

---

## As candidatas

Todas têm API REST, sandbox de homologação e cobrem NF-e + NFC-e + NFS-e.
**Os dados abaixo são de conhecimento até maio/2026 — preço e recurso mudam.
Confirme tudo na fonte antes de fechar.**

| Provedor | Site | Perfil |
|---|---|---|
| **Focus NFe** | focusnfe.com.br | A mais usada por dev. API simples, doc boa, webhook de retorno. Cobre NFe/NFCe/NFSe/CTe/MDFe |
| **Nuvem Fiscal** | nuvemfiscal.com.br | Pay-as-you-go, preço por documento, orientada a desenvolvedor |
| **PlugNotas** (Tecnospeed) | plugnotas.com.br | Vendida explicitamente para *software houses*. Discurso white-label é o produto deles |
| **eNotas** | enotas.com.br | Também mira SaaS/plataformas. Forte em NFS-e municipal |
| **Webmania** | webmaniabr.com | Popular no e-commerce, API enxuta |

### Critérios de escolha, em ordem de peso

1. **Aceita o certificado A1 pela API deles?** Se não, a Orion vira depositária
   de `.pfx` de cliente. Eliminatório.
2. **DANFE sem marca do provedor?** Se marcar, o "como se fosse a Orion" quebra.
3. **Webhook de autorização/rejeição?** Sem isso vira polling.
4. **Custo por documento**, e existe plano sem mensalidade mínima? Com 1 cliente,
   mensalidade fixa é o pior modelo.
5. **NFS-e no município dos seus primeiros clientes.** NF-e é nacional; NFS-e é
   municipal e a cobertura varia de provedor para provedor. Se o alvo é
   prestador de serviço, isto sobe para o topo da lista.
6. **Sandbox de homologação** com CNPJ de teste.

**Escolha uma e feche.** Comparar cinco por duas semanas é o gargalo mais caro
aqui.

---

## A pegadinha comercial: é o primeiro custo por uso do produto

Todas cobram **por documento emitido**. Hoje **nenhuma feature do Orion tem
custo marginal** — a conta é fixa, o cliente usar mais não custa mais.

NF-e quebra isso. Consequências:

- Não pode ser ilimitada no Enterprise sem uma conta feita. "Notas fiscais
  ilimitadas" com custo por nota é margem negativa esperando acontecer.
- Precisa de **cota por plano**, igual à cota de IA.

**Boa notícia: o mecanismo já existe e é reaproveitável.** A cota mensal de IA
que a sessão 7 construiu ([lib/account.ts](src/lib/account.ts): `maxAiMessages`,
`consumirMensagemIA`, colunas `aiMessagesUsed` / `aiMessagesPeriod`) é o mesmo
padrão. Um `maxNotasFiscais` no catálogo e um `consumirNotaFiscal` copiado dali
resolvem — sem inventar mecanismo novo.

Sugestão de posicionamento, a decidir: NF-e **só do Professional para cima**.
É o módulo exclusivo que hoje falta para o Professional justificar R$ 189, e
resolve os dois problemas de uma vez.

---

## Ordem de construção sugerida

Estimativa honesta: **6 a 9 dias**. O passo 7 é o imprevisível.

| # | Passo | Custo |
|---|---|---|
| 1 | Escolher o provedor e criar conta de homologação | 0,5 dia |
| 2 | Campos fiscais em `Company` + tela de configuração fiscal (regime tributário primeiro) | 1 dia |
| 3 | Upload do certificado A1 → repassa ao provedor, não persiste | 1 dia |
| 4 | Campos fiscais em `Product` e `Customer` + preenchimento em massa | 1,5 dia |
| 5 | Model `NotaFiscal` + rota de emissão + webhook de retorno | 1,5 dia |
| 6 | Botão "Emitir NF-e" no pedido, status, DANFE, XML, cancelamento, carta de correção | 1,5 dia |
| 7 | **Homologação real na SEFAZ** com CNPJ de teste | 1 dia+, imprevisível |
| 8 | Cota por plano + atualizar catálogo, `/precos`, `/features` e o prompt da IA | 0,5 dia |

O passo 8 não é burocracia: hoje o prompt da Orion AI e a página `/features`
afirmam explicitamente que **NF-e não existe**. Se a feature entrar e esses
textos não mudarem, o assistente dentro do produto pago vai negar uma
funcionalidade que o cliente acabou de comprar. Ver a seção "O QUE O ORION NÃO
FAZ" em [api/ai/chat/route.ts](src/app/api/ai/chat/route.ts).

---

## ⚠️ Reforma Tributária — o risco de fazer isso agora

A transição para IBS/CBS está em curso e o **layout da NF-e está mudando** para
acomodar os novos campos. Isso significa que:

- O provedor precisa estar acompanhando as notas técnicas. **Pergunte
  diretamente na avaliação** — é um bom filtro de qualidade.
- Um modelo fiscal montado hoje pode precisar de retrabalho em 2026/2027.
- Terceirizar para um provedor é justamente o que reduz esse risco: a
  atualização de layout é problema dele, não seu. **É o argumento mais forte
  contra tentar falar com a SEFAZ direto.**

Não confie na minha leitura do estado atual da reforma — confirme o calendário
vigente antes de modelar os campos.

---

## Decisões a tomar antes de escrever código

Nesta ordem. Nenhuma delas é técnica.

1. **O arquivo de metas muda?** "Integrações fiscais" sai de "Fora de escopo"?
   Se não sair, pare aqui.
2. **Antes ou depois do G3?** (recomendação: depois — o G3 é uma tarde)
3. **NF-e, NFC-e ou NFS-e primeiro?** Depende de quem é o primeiro cliente.
   Produto → NF-e. Serviço → NFS-e, que é mais chato porque é municipal.
4. **Qual plano inclui?** (recomendação: Professional para cima, com cota)
5. **Quem paga o custo por documento** se o cliente estourar a cota: bloqueia,
   ou cobra excedente?

---

## Se você seguir em frente, faça primeiro isto

Antes de tocar em schema, gaste meia hora **emitindo uma nota de homologação na
mão**, pelo sandbox do provedor escolhido, com `curl`. Você vai descobrir em 30
minutos quais campos são realmente obrigatórios — e é uma lista maior do que
qualquer documentação faz parecer. Todo o resto do plano acima depende dessa
lista estar certa.
