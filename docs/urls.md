# URLs do Orion ERP

## Contagem Total
- **Landing Pages**: 9 URLs
- **Autenticação**: 5 URLs
- **Dashboard**: 15+ URLs (rotas principais)
- **Artigos de Ajuda**: 44 URLs
- **API Routes**: 30+ endpoints
- **Total Aproximado**: 100+ URLs públicos

---

## 1. Landing Pages (Públicas)

| URL | Descrição | Prioridade |
|-----|-----------|------------|
| `/` | Homepage | 1.0 |
| `/recursos` | Página de recursos/features | 0.8 |
| `/precos` | Planos e preços | 0.9 |
| `/sobre` | Sobre a empresa | 0.6 |
| `/contato` | Formulário de contato | 0.7 |
| `/ajuda` | Central de ajuda | 0.8 |
| `/ajuda/faq` | Perguntas frequentes | 0.7 |
| `/blog` | Blog/artigos | 0.7 |
| `/termos` | Termos de uso | 0.3 |
| `/privacidade` | Política de privacidade | 0.3 |

---

## 2. Autenticação

| URL | Descrição | Indexável |
|-----|-----------|-----------|
| `/auth/login` | Login | Sim |
| `/auth/cadastro` | Cadastro de nova conta | Sim |
| `/auth/esqueci-senha` | Recuperação de senha | Sim |
| `/auth/redefinir-senha` | Redefinir senha | Não |
| `/auth/verificar-email` | Verificação de email | Não |

---

## 3. Dashboard (Áreas Protegidas)

### 3.1 Dashboard Principal
| URL | Descrição |
|-----|-----------|
| `/dashboard` | Dashboard inicial |
| `/dashboard/primeiros-passos` | Onboarding |

### 3.2 Clientes e CRM
| URL | Descrição |
|-----|-----------|
| `/dashboard/clientes` | Lista de clientes |
| `/dashboard/clientes/novo` | Cadastrar cliente |
| `/dashboard/clientes/[id]` | Detalhes do cliente |
| `/dashboard/clientes/[id]/editar` | Editar cliente |

### 3.3 Produtos e Estoque
| URL | Descrição |
|-----|-----------|
| `/dashboard/produtos` | Lista de produtos |
| `/dashboard/produtos/novo` | Cadastrar produto |
| `/dashboard/produtos/[id]` | Detalhes do produto |
| `/dashboard/produtos/[id]/editar` | Editar produto |
| `/dashboard/estoque` | Controle de estoque |

### 3.4 Vendas e Pedidos
| URL | Descrição |
|-----|-----------|
| `/dashboard/vendas` | Lista de vendas |
| `/dashboard/vendas/novo` | Nova venda |
| `/dashboard/vendas/[id]` | Detalhes da venda |
| `/dashboard/orcamentos` | Orçamentos |
| `/dashboard/orcamentos/novo` | Novo orçamento |

### 3.5 Financeiro
| URL | Descrição |
|-----|-----------|
| `/dashboard/financeiro` | Dashboard financeiro |
| `/dashboard/financeiro/contas-receber` | Contas a receber |
| `/dashboard/financeiro/contas-pagar` | Contas a pagar |
| `/dashboard/financeiro/fluxo-caixa` | Fluxo de caixa |

### 3.6 Relatórios
| URL | Descrição |
|-----|-----------|
| `/dashboard/relatorios` | Central de relatórios |
| `/dashboard/relatorios/vendas` | Relatório de vendas |
| `/dashboard/relatorios/financeiro` | Relatório financeiro |
| `/dashboard/relatorios/estoque` | Relatório de estoque |

### 3.7 Configurações
| URL | Descrição |
|-----|-----------|
| `/dashboard/configuracoes` | Configurações gerais |
| `/dashboard/configuracoes/empresa` | Dados da empresa |
| `/dashboard/configuracoes/usuarios` | Gestão de usuários |
| `/dashboard/configuracoes/integracao` | Integrações |
| `/dashboard/configuracoes/notificacoes` | Configurar notificações |
| `/dashboard/configuracoes/assinatura` | Plano e assinatura |

### 3.8 Suporte
| URL | Descrição |
|-----|-----------|
| `/dashboard/suporte` | Central de suporte |
| `/dashboard/suporte/tickets` | Tickets abertos |
| `/dashboard/suporte/novo` | Novo ticket |

---

## 4. Central de Ajuda (44 Artigos)

### 4.1 Clientes e CRM (5 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/clientes/cadastrar-cliente` | Como cadastrar meu primeiro cliente |
| `/ajuda/clientes/importar-clientes` | Importando clientes via planilha |
| `/ajuda/clientes/segmentar-clientes` | Segmentando clientes por categoria |
| `/ajuda/clientes/historico-clientes` | Histórico de interações com clientes |
| `/ajuda/clientes/contatos-clientes` | Gerenciando contatos e responsáveis |

### 4.2 Estoque e Produtos (5 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/estoque/cadastrar-produtos` | Cadastrando produtos e serviços |
| `/ajuda/estoque/alertas-estoque` | Configurando alertas de estoque baixo |
| `/ajuda/estoque/movimentacao-estoque` | Controlando entrada e saída de produtos |
| `/ajuda/estoque/inventario` | Realizando inventário |
| `/ajuda/estoque/multiplos-depositos` | Gerenciando múltiplos depósitos |

### 4.3 Vendas e Pedidos (6 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/vendas/criar-orcamento` | Criando seu primeiro orçamento |
| `/ajuda/vendas/converter-orcamento` | Convertendo orçamento em pedido |
| `/ajuda/vendas/funil-vendas` | Gerenciando funil de vendas |
| `/ajuda/vendas/comissoes` | Configurando comissões de vendedores |
| `/ajuda/vendas/pedidos-venda` | Emitindo pedidos de venda |
| `/ajuda/vendas/metricas-vendas` | Acompanhando métricas de vendas |

### 4.4 Financeiro (6 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/financeiro/fluxo-caixa` | Entendendo o fluxo de caixa |
| `/ajuda/financeiro/contas-pagar` | Contas a pagar: cadastro e controle |
| `/ajuda/financeiro/contas-receber` | Contas a receber: gestão de cobranças |
| `/ajuda/financeiro/conciliacao-bancaria` | Conciliação bancária automática |
| `/ajuda/financeiro/formas-pagamento` | Gerenciando formas de pagamento |
| `/ajuda/financeiro/relatorio-dre` | Relatório DRE (Demonstrativo de Resultados) |

### 4.5 Relatórios e BI (5 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/relatorios/dashboard` | Dashboard: principais indicadores |
| `/ajuda/relatorios/relatorio-vendas` | Relatório de vendas por período |
| `/ajuda/relatorios/produtos-mais-vendidos` | Análise de produtos mais vendidos |
| `/ajuda/relatorios/exportar-relatorios` | Exportando relatórios em Excel/PDF |
| `/ajuda/relatorios/personalizar-dashboards` | Personalizando dashboards |

### 4.6 Orion AI (5 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/ia/usar-orion-ai` | Conversando com a Orion AI |
| `/ajuda/ia/comandos-voz` | Comandos de voz para cadastros rápidos |
| `/ajuda/ia/previsao-demanda` | Previsão de demanda com IA |
| `/ajuda/ia/analise-inteligente` | Análise inteligente de dados |
| `/ajuda/ia/precificacao-ia` | Sugestões automáticas de precificação |

### 4.7 Configurações (6 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/configuracoes/configuracao-inicial` | Configuração inicial do sistema |
| `/ajuda/configuracoes/usuarios-permissoes` | Gerenciando usuários e permissões |
| `/ajuda/configuracoes/personalizar-tema` | Personalizando aparência e tema |
| `/ajuda/configuracoes/integracoes-ecommerce` | Integrações com e-commerce |
| `/ajuda/configuracoes/backup-dados` | Backup automático de dados |
| `/ajuda/configuracoes/configurar-notificacoes` | Configurando notificações |

### 4.8 Fiscal e NF-e (6 artigos)
| URL | Título |
|-----|--------|
| `/ajuda/fiscal/emitir-nfe` | Como emitir uma NF-e |
| `/ajuda/fiscal/certificado-digital` | Configurando certificado digital |
| `/ajuda/fiscal/impostos` | Impostos: ICMS, PIS, COFINS |
| `/ajuda/fiscal/carta-correcao` | Carta de Correção Eletrônica (CC-e) |
| `/ajuda/fiscal/cancelar-nfe` | Cancelamento de notas fiscais |
| `/ajuda/fiscal/sped-fiscal` | SPED Fiscal e obrigações acessórias |

---

## 5. API Routes (Backend)

### 5.1 Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/reset-password`

### 5.2 Usuários
- `GET /api/user/profile`
- `PATCH /api/user/profile`
- `GET /api/user/notifications`
- `POST /api/user/onboarding`

### 5.3 Clientes
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/[id]`
- `PATCH /api/customers/[id]`
- `DELETE /api/customers/[id]`

### 5.4 Produtos
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/[id]`
- `PATCH /api/products/[id]`
- `DELETE /api/products/[id]`

### 5.5 Vendas/Pedidos
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/[id]`
- `PATCH /api/orders/[id]`
- `DELETE /api/orders/[id]`

### 5.6 Notificações
- `GET /api/notifications`
- `POST /api/notifications/mark-read`
- `POST /api/push/subscribe`

### 5.7 Webhooks
- `POST /api/webhooks/stripe`
- `POST /api/webhooks/resend`

### 5.8 Cron Jobs
- `GET /api/cron/notifications`

---

## 6. Assets e Recursos Estáticos

- `/sitemap.xml` - Sitemap gerado dinamicamente
- `/robots.txt` - Robots.txt
- `/favicon.ico` - Favicon
- `/manifest.json` - PWA manifest

---

## Manutenção do Documento

### Quando Atualizar:
1. ✅ Ao criar novas páginas públicas (landing, blog posts, etc.)
2. ✅ Ao adicionar novos artigos de ajuda
3. ✅ Ao criar novas seções no dashboard
4. ⚠️ Rotas dinâmicas com dados do DB não precisam ser listadas individualmente

### Sincronização com Sitemap:
O arquivo `src/app/sitemap.ts` deve ser atualizado em paralelo para incluir:
- Todas as páginas públicas listadas aqui
- URLs dinâmicos gerados a partir de dados (artigos, etc.)

### Checklist de Atualização:
- [ ] Adicionar URL em `docs/urls.md`
- [ ] Adicionar URL em `src/app/sitemap.ts` (se público)
- [ ] Atualizar contagem total no topo
- [ ] Verificar prioridades no sitemap
- [ ] Testar URL em produção após deploy

---

**Última atualização**: 2024-01-23
**Versão**: 1.0.0
