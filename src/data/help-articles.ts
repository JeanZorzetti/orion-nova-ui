export interface HelpArticle {
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  lastUpdated: string;
  readTime: string;
  content: {
    sections: {
      title: string;
      content: string;
      steps?: string[];
      tips?: string[];
      warning?: string;
    }[];
  };
  relatedArticles?: {
    title: string;
    slug: string;
    category: string;
  }[];
}

export const helpArticles: HelpArticle[] = [
  // ===== CLIENTES E CRM =====
  {
    title: "Como cadastrar meu primeiro cliente",
    slug: "cadastrar-cliente",
    category: "Clientes e CRM",
    categorySlug: "clientes",
    description: "Passo a passo completo para cadastrar seu primeiro cliente no Orion ERP",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Introdução",
          content: "O cadastro de clientes é uma das funcionalidades mais importantes do Orion ERP. Um cadastro completo e organizado permite melhor gestão do relacionamento, histórico de compras e análises de vendas.",
        },
        {
          title: "Passo a Passo",
          content: "Siga estas etapas para cadastrar seu primeiro cliente:",
          steps: [
            "Acesse o menu 'Clientes' na barra lateral",
            "Clique no botão '+ Novo Cliente'",
            "Preencha os dados básicos: Nome/Razão Social e tipo (Pessoa Física ou Jurídica)",
            "Adicione CPF ou CNPJ (opcional mas recomendado)",
            "Preencha dados de contato: email e telefone",
            "Adicione o endereço completo para facilitar entregas",
            "Adicione observações internas se necessário",
            "Clique em 'Criar Cliente' para finalizar"
          ],
        },
        {
          title: "Campos Importantes",
          content: "Alguns campos merecem atenção especial:",
          tips: [
            "Nome/Razão Social: Use o nome completo para facilitar buscas",
            "CPF/CNPJ: Importante para emissão de notas fiscais",
            "Email: Será usado para envio de orçamentos e notas",
            "Status Ativo: Clientes inativos não aparecem nas vendas"
          ],
        },
        {
          title: "Próximos Passos",
          content: "Após cadastrar seu cliente, você pode registrar uma venda, criar um orçamento ou visualizar o histórico de interações no perfil do cliente.",
        }
      ],
    },
    relatedArticles: [
      { title: "Importando clientes via planilha", slug: "importar-clientes", category: "Clientes" },
      { title: "Criando seu primeiro orçamento", slug: "criar-orcamento", category: "Vendas" },
    ],
  },
  {
    title: "Importando clientes via planilha",
    slug: "importar-clientes",
    category: "Clientes e CRM",
    categorySlug: "clientes",
    description: "Como importar múltiplos clientes de uma vez usando arquivos CSV ou Excel",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Quando usar importação",
          content: "A importação em lote é ideal quando você está migrando de outro sistema ou possui uma lista grande de clientes em planilhas. Você pode importar centenas de clientes em poucos minutos.",
        },
        {
          title: "Preparando a planilha",
          content: "Antes de importar, organize sua planilha com estas colunas:",
          steps: [
            "Nome ou Razão Social (obrigatório)",
            "Tipo: 'PF' para Pessoa Física ou 'PJ' para Pessoa Jurídica",
            "CPF ou CNPJ",
            "Email",
            "Telefone",
            "Endereço, Cidade, Estado, CEP",
            "Observações"
          ],
          tips: [
            "Use a primeira linha para os nomes das colunas",
            "Remova linhas vazias",
            "Formato de arquivo: CSV ou XLSX",
            "Encoding recomendado: UTF-8"
          ],
        },
        {
          title: "Processo de Importação",
          content: "Siga estes passos para importar:",
          steps: [
            "Acesse Clientes > Importar",
            "Faça upload do arquivo CSV ou Excel",
            "Mapeie as colunas da planilha com os campos do sistema",
            "Revise os dados na pré-visualização",
            "Clique em 'Iniciar Importação'",
            "Aguarde o processamento (pode levar alguns minutos)",
            "Verifique o relatório de importação"
          ],
        },
        {
          title: "Tratamento de Erros",
          content: "Se houver erros na importação, o sistema gerará um relatório detalhado. Corrija os dados problemáticos na planilha e reimporte apenas as linhas com erro.",
          warning: "Clientes duplicados (mesmo CPF/CNPJ) serão ignorados. O sistema não sobrescreve dados existentes."
        }
      ],
    },
    relatedArticles: [
      { title: "Como cadastrar meu primeiro cliente", slug: "cadastrar-cliente", category: "Clientes" },
      { title: "Segmentando clientes por categoria", slug: "segmentar-clientes", category: "Clientes" },
    ],
  },
  {
    title: "Segmentando clientes por categoria",
    slug: "segmentar-clientes",
    category: "Clientes e CRM",
    categorySlug: "clientes",
    description: "Organize seus clientes em categorias para melhor gestão e análise",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Por que segmentar?",
          content: "A segmentação permite organizar clientes por características comuns, facilitando ações de marketing, definição de políticas comerciais diferenciadas e análises estratégicas.",
        },
        {
          title: "Criando Categorias",
          content: "Você pode criar categorias baseadas em diferentes critérios:",
          tips: [
            "Volume de compras: VIP, Regular, Eventual",
            "Tipo de negócio: Atacado, Varejo, Revenda",
            "Região: Norte, Sul, Leste, Oeste",
            "Segmento: Indústria, Comércio, Serviços",
            "Status: Ativo, Inativo, Prospect"
          ],
        },
        {
          title: "Aplicando Categorias",
          content: "Para categorizar um cliente:",
          steps: [
            "Acesse o cadastro do cliente",
            "Clique em 'Editar'",
            "No campo 'Categoria', selecione ou crie uma nova",
            "Salve as alterações"
          ],
        },
        {
          title: "Usando Segmentação",
          content: "Após segmentar, você pode filtrar listas, criar relatórios específicos, configurar descontos automáticos por categoria e personalizar comunicações de marketing.",
        }
      ],
    },
    relatedArticles: [
      { title: "Histórico de interações com clientes", slug: "historico-clientes", category: "Clientes" },
    ],
  },
  {
    title: "Histórico de interações com clientes",
    slug: "historico-clientes",
    category: "Clientes e CRM",
    categorySlug: "clientes",
    description: "Acompanhe todas as interações, vendas e comunicações com cada cliente",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Visão Geral",
          content: "O histórico de cada cliente registra automaticamente todas as interações: vendas, orçamentos, notas fiscais, emails enviados e anotações manuais.",
        },
        {
          title: "Acessando o Histórico",
          content: "Para visualizar o histórico completo:",
          steps: [
            "Acesse a lista de Clientes",
            "Clique no cliente desejado",
            "A aba 'Histórico' mostra todas as interações",
            "Use os filtros para refinar por tipo ou período"
          ],
        },
        {
          title: "Tipos de Registro",
          content: "O sistema registra automaticamente:",
          tips: [
            "Vendas e orçamentos realizados",
            "Notas fiscais emitidas",
            "Pagamentos recebidos",
            "Emails enviados pelo sistema",
            "Chamados de suporte abertos",
            "Anotações manuais da equipe"
          ],
        },
        {
          title: "Adicionando Notas Manuais",
          content: "Você pode adicionar observações sobre ligações, reuniões ou acordos:",
          steps: [
            "No perfil do cliente, clique em 'Nova Anotação'",
            "Descreva a interação",
            "Marque como privada se necessário",
            "Salve a anotação"
          ],
        }
      ],
    },
    relatedArticles: [
      { title: "Gerenciando contatos e responsáveis", slug: "contatos-clientes", category: "Clientes" },
    ],
  },
  {
    title: "Gerenciando contatos e responsáveis",
    slug: "contatos-clientes",
    category: "Clientes e CRM",
    categorySlug: "clientes",
    description: "Cadastre múltiplos contatos e defina responsáveis para cada cliente",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Múltiplos Contatos",
          content: "Especialmente em vendas B2B, é comum um cliente ter vários contatos: comprador, financeiro, decisor técnico, etc. O Orion permite cadastrar quantos contatos forem necessários.",
        },
        {
          title: "Adicionando Contatos",
          content: "Para adicionar um novo contato:",
          steps: [
            "Acesse o cadastro do cliente",
            "Clique na aba 'Contatos'",
            "Clique em '+ Novo Contato'",
            "Preencha: Nome, Cargo, Email, Telefone",
            "Marque como 'Contato Principal' se aplicável",
            "Salve o contato"
          ],
        },
        {
          title: "Definindo Responsáveis",
          content: "Você pode atribuir um vendedor ou gerente de conta responsável por cada cliente. Isso facilita distribuição de leads e comissionamento.",
          steps: [
            "No cadastro do cliente, encontre 'Responsável'",
            "Selecione o usuário da sua equipe",
            "Defina a porcentagem de comissão (opcional)",
            "Salve as alterações"
          ],
        },
        {
          title: "Benefícios",
          content: "Com contatos bem organizados, você pode enviar orçamentos para a pessoa certa, direcionar cobranças ao financeiro e personalizar comunicações por cargo.",
        }
      ],
    },
    relatedArticles: [
      { title: "Como cadastrar meu primeiro cliente", slug: "cadastrar-cliente", category: "Clientes" },
    ],
  },

  // ===== ESTOQUE E PRODUTOS =====
  {
    title: "Cadastrando produtos e serviços",
    slug: "cadastrar-produtos",
    category: "Estoque e Produtos",
    categorySlug: "estoque",
    description: "Guia completo para cadastrar produtos físicos e serviços no sistema",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Tipos de Cadastro",
          content: "O Orion suporta dois tipos de cadastro: Produtos (itens físicos com estoque) e Serviços (itens sem controle de estoque).",
        },
        {
          title: "Cadastrando um Produto",
          content: "Para produtos físicos:",
          steps: [
            "Acesse Produtos > Novo Produto",
            "Preencha o nome e escolha tipo 'Produto'",
            "Adicione SKU ou código de barras",
            "Defina categoria e descrição",
            "Configure preço de venda e custo",
            "Defina quantidade inicial em estoque",
            "Configure estoque mínimo para alertas",
            "Escolha unidade de medida (UN, KG, L, etc.)",
            "Marque como ativo",
            "Salve o cadastro"
          ],
        },
        {
          title: "Cadastrando um Serviço",
          content: "Para serviços (consultorias, manutenções, etc.):",
          steps: [
            "Acesse Produtos > Novo Produto",
            "Escolha tipo 'Serviço'",
            "Preencha nome e descrição",
            "Defina preço de venda",
            "Configure duração estimada (opcional)",
            "Salve o cadastro"
          ],
          tips: [
            "Serviços não têm controle de estoque",
            "Útil para mão de obra, consultorias, assinaturas",
            "Podem ser combinados com produtos em vendas"
          ],
        },
        {
          title: "Campos Importantes",
          content: "Atenção especial a:",
          tips: [
            "SKU: Código único para identificação",
            "Custo: Usado para cálculo de margem e lucro",
            "Estoque Mínimo: Gera alertas automáticos",
            "Categoria: Facilita organização e relatórios",
            "Status Ativo: Produtos inativos não aparecem em vendas"
          ],
        }
      ],
    },
    relatedArticles: [
      { title: "Configurando alertas de estoque baixo", slug: "alertas-estoque", category: "Estoque" },
      { title: "Controlando entrada e saída de produtos", slug: "movimentacao-estoque", category: "Estoque" },
    ],
  },
  {
    title: "Configurando alertas de estoque baixo",
    slug: "alertas-estoque",
    category: "Estoque e Produtos",
    categorySlug: "estoque",
    description: "Configure notificações automáticas quando produtos atingirem estoque mínimo",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Importância dos Alertas",
          content: "Alertas de estoque baixo evitam rupturas, permitem reposição planejada e garantem que você nunca perca uma venda por falta de produto.",
        },
        {
          title: "Configurando Estoque Mínimo",
          content: "Para cada produto, defina o estoque mínimo ideal:",
          steps: [
            "Acesse o cadastro do produto",
            "No campo 'Estoque Mínimo', defina a quantidade",
            "Considere: tempo de reposição + demanda média",
            "Salve as alterações"
          ],
          tips: [
            "Produtos de alta rotatividade: estoque mínimo maior",
            "Produtos de fornecedor distante: estoque mínimo maior",
            "Considere sazonalidade na definição"
          ],
        },
        {
          title: "Recebendo Notificações",
          content: "Quando um produto atinge o estoque mínimo, você recebe alertas de três formas:",
          tips: [
            "Notificação no dashboard (ícone de sino)",
            "Email para responsável pelo estoque",
            "Badge vermelho no menu Produtos",
            "Lista de 'Produtos com estoque baixo' no relatório"
          ],
        },
        {
          title: "Ações Recomendadas",
          content: "Ao receber um alerta, você pode gerar pedido de compra automático, fazer uma contagem física para verificar divergências ou ajustar o estoque mínimo se necessário.",
        }
      ],
    },
    relatedArticles: [
      { title: "Cadastrando produtos e serviços", slug: "cadastrar-produtos", category: "Estoque" },
      { title: "Realizando inventário", slug: "inventario", category: "Estoque" },
    ],
  },
  {
    title: "Controlando entrada e saída de produtos",
    slug: "movimentacao-estoque",
    category: "Estoque e Produtos",
    categorySlug: "estoque",
    description: "Registre todas as movimentações de estoque de forma organizada",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Tipos de Movimentação",
          content: "O sistema registra automaticamente entradas (compras, devoluções de clientes, ajustes positivos) e saídas (vendas, transferências, ajustes negativos, perdas).",
        },
        {
          title: "Entrada Manual",
          content: "Para registrar entrada de produtos:",
          steps: [
            "Acesse Estoque > Movimentações > Nova Entrada",
            "Selecione o tipo: Compra, Devolução, Ajuste",
            "Escolha o produto",
            "Digite a quantidade",
            "Adicione observações",
            "Informe nota fiscal (opcional)",
            "Confirme a entrada"
          ],
        },
        {
          title: "Saída Manual",
          content: "Para registrar saída não vinculada a venda:",
          steps: [
            "Acesse Estoque > Movimentações > Nova Saída",
            "Selecione o motivo: Perda, Uso Interno, Transferência",
            "Escolha o produto e quantidade",
            "Justifique a saída",
            "Confirme a operação"
          ],
          warning: "Saídas por venda são automáticas, não precisam registro manual.",
        },
        {
          title: "Rastreabilidade",
          content: "Toda movimentação fica registrada no histórico do produto, permitindo rastrear: quando entrou/saiu, quem registrou, qual o motivo e observações.",
        }
      ],
    },
    relatedArticles: [
      { title: "Realizando inventário", slug: "inventario", category: "Estoque" },
    ],
  },
  {
    title: "Realizando inventário",
    slug: "inventario",
    category: "Estoque e Produtos",
    categorySlug: "estoque",
    description: "Faça contagens físicas e ajuste divergências no estoque",
    lastUpdated: "2024-01-23",
    readTime: "5 min",
    content: {
      sections: [
        {
          title: "O que é Inventário?",
          content: "Inventário é a contagem física real dos produtos para comparar com o estoque registrado no sistema. Recomenda-se fazer periodicamente (mensal, trimestral ou anual).",
        },
        {
          title: "Iniciando um Inventário",
          content: "Para começar uma contagem:",
          steps: [
            "Acesse Estoque > Inventário > Novo Inventário",
            "Escolha: Total (todos produtos) ou Parcial (por categoria)",
            "Defina data e responsável",
            "Imprima ou exporte lista para contagem",
            "Inicie o processo"
          ],
        },
        {
          title: "Processo de Contagem",
          content: "Durante a contagem física:",
          steps: [
            "Vá ao estoque com a lista impressa",
            "Conte fisicamente cada produto",
            "Anote as quantidades reais",
            "Retorne ao sistema",
            "Acesse o inventário em andamento",
            "Digite as quantidades contadas",
            "Revise divergências"
          ],
          tips: [
            "Conte em horário de menor movimento",
            "Se possível, envolva duas pessoas para conferência",
            "Organize o estoque antes da contagem",
            "Use leitor de código de barras para agilizar"
          ],
        },
        {
          title: "Finalizando e Ajustando",
          content: "Após digitar todas as contagens:",
          steps: [
            "Revise produtos com divergências",
            "Investigue grandes diferenças",
            "Aprove os ajustes",
            "O sistema atualizará automaticamente",
            "Um relatório detalhado será gerado"
          ],
        },
        {
          title: "Análise de Divergências",
          content: "Divergências podem indicar: erros de lançamento, furtos/perdas, problemas no recebimento ou problemas na armazenagem. Use o relatório para identificar padrões.",
        }
      ],
    },
    relatedArticles: [
      { title: "Controlando entrada e saída de produtos", slug: "movimentacao-estoque", category: "Estoque" },
      { title: "Configurando alertas de estoque baixo", slug: "alertas-estoque", category: "Estoque" },
    ],
  },
  {
    title: "Gerenciando múltiplos depósitos",
    slug: "multiplos-depositos",
    category: "Estoque e Produtos",
    categorySlug: "estoque",
    description: "Controle estoque em diferentes locais e faça transferências entre depósitos",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Quando usar múltiplos depósitos",
          content: "Ideal para empresas com: matriz e filiais, depósito central e lojas, centros de distribuição regionais ou separação física (almoxarifado, loja, veículos).",
        },
        {
          title: "Criando Depósitos",
          content: "Para cadastrar novos locais de estoque:",
          steps: [
            "Acesse Estoque > Depósitos",
            "Clique em '+ Novo Depósito'",
            "Defina nome e código",
            "Adicione endereço completo",
            "Defina responsável",
            "Marque como ativo",
            "Salve o cadastro"
          ],
        },
        {
          title: "Transferências Entre Depósitos",
          content: "Para mover produtos entre locais:",
          steps: [
            "Acesse Estoque > Transferências",
            "Clique em 'Nova Transferência'",
            "Selecione depósito origem",
            "Selecione depósito destino",
            "Adicione produtos e quantidades",
            "Gere documento de transferência",
            "Registre saída no origem",
            "Registre entrada no destino"
          ],
          tips: [
            "Documente todas as transferências",
            "Use transportadora para rastreio",
            "Confirme recebimento antes de dar baixa"
          ],
        },
        {
          title: "Visão Consolidada",
          content: "No dashboard e relatórios, você pode visualizar estoque por depósito individual ou consolidado (soma de todos os depósitos).",
        }
      ],
    },
    relatedArticles: [
      { title: "Controlando entrada e saída de produtos", slug: "movimentacao-estoque", category: "Estoque" },
    ],
  },

  // Continue com as outras categorias...
  // Por questão de espaço, vou criar um exemplo de estrutura mais resumida para as demais

  // ===== VENDAS E PEDIDOS =====
  {
    title: "Criando seu primeiro orçamento",
    slug: "criar-orcamento",
    category: "Vendas e Pedidos",
    categorySlug: "vendas",
    description: "Aprenda a criar orçamentos profissionais para seus clientes",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é um Orçamento",
          content: "Orçamento é uma proposta comercial que apresenta produtos, quantidades, valores e condições. Pode ser convertido em pedido quando aprovado pelo cliente.",
        },
        {
          title: "Criando um Orçamento",
          content: "Passo a passo:",
          steps: [
            "Acesse Vendas > Novo Orçamento",
            "Selecione o cliente",
            "Adicione produtos um a um",
            "Ajuste quantidades e descontos",
            "Defina condições de pagamento",
            "Adicione observações e validade",
            "Gere PDF e envie por email"
          ],
        },
        {
          title: "Personalizando o Orçamento",
          content: "Você pode adicionar sua logo, personalizar cores, incluir termos e condições e adicionar campos customizados.",
        },
        {
          title: "Acompanhamento",
          content: "O sistema rastreia quando o cliente visualiza o orçamento por email, permitindo follow-up mais assertivo.",
        }
      ],
    },
    relatedArticles: [
      { title: "Convertendo orçamento em pedido", slug: "converter-orcamento", category: "Vendas" },
    ],
  },
  {
    title: "Convertendo orçamento em pedido",
    slug: "converter-orcamento",
    category: "Vendas e Pedidos",
    categorySlug: "vendas",
    description: "Como transformar um orçamento aprovado em pedido de venda",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Quando converter",
          content: "Ao receber aprovação do cliente, converta o orçamento em pedido com um clique. Todos os dados são preservados automaticamente.",
        },
        {
          title: "Processo de Conversão",
          content: "Passo a passo:",
          steps: [
            "Acesse o orçamento aprovado",
            "Clique em 'Converter em Pedido'",
            "Revise dados e condições",
            "Confirme estoque disponível",
            "Defina data de entrega",
            "Finalize a conversão",
            "Sistema gera número de pedido automaticamente"
          ],
        },
        {
          title: "Alterações Possíveis",
          content: "Durante a conversão, você pode ajustar quantidades, aplicar descontos adicionais ou modificar condições de pagamento.",
        }
      ],
    },
    relatedArticles: [
      { title: "Criando seu primeiro orçamento", slug: "criar-orcamento", category: "Vendas" },
      { title: "Emitindo pedidos de venda", slug: "pedidos-venda", category: "Vendas" },
    ],
  },
  {
    title: "Gerenciando funil de vendas",
    slug: "funil-vendas",
    category: "Vendas e Pedidos",
    categorySlug: "vendas",
    description: "Acompanhe oportunidades em cada etapa do processo comercial",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é Funil de Vendas",
          content: "O funil visualiza todas as oportunidades comerciais e em qual estágio cada uma se encontra: prospecção, qualificação, proposta, negociação ou fechamento.",
        },
        {
          title: "Estágios Padrão",
          content: "O sistema oferece 5 estágios configuráveis:",
          tips: [
            "Lead (1º contato)",
            "Qualificado (interesse confirmado)",
            "Proposta (orçamento enviado)",
            "Negociação (discussão de termos)",
            "Ganho/Perdido (resultado final)"
          ],
        },
        {
          title: "Movendo Oportunidades",
          content: "Arraste e solte cards entre os estágios ou use o menu de ações para avançar/retroceder oportunidades no funil.",
        },
        {
          title: "Métricas do Funil",
          content: "Visualize taxa de conversão entre estágios, tempo médio em cada etapa e valor total por estágio.",
        }
      ],
    },
  },
  {
    title: "Configurando comissões de vendedores",
    slug: "comissoes",
    category: "Vendas e Pedidos",
    categorySlug: "vendas",
    description: "Defina regras de comissionamento automático para sua equipe",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Tipos de Comissão",
          content: "O sistema suporta: percentual sobre venda, valor fixo por item, tabela progressiva (aumenta com meta) e comissão diferenciada por produto/categoria.",
        },
        {
          title: "Configurando Comissão",
          content: "Para cada vendedor:",
          steps: [
            "Acesse Vendas > Vendedores",
            "Edite o vendedor",
            "Defina tipo de comissão",
            "Configure percentual ou valor",
            "Defina se comissiona sobre bruto ou líquido",
            "Salve as configurações"
          ],
        },
        {
          title: "Cálculo Automático",
          content: "A cada venda finalizada, o sistema calcula automaticamente a comissão baseado nas regras configuradas.",
        },
        {
          title: "Relatório de Comissões",
          content: "Acesse relatórios mensais com comissões acumuladas por vendedor, vendas geradoras e valor total a pagar.",
        }
      ],
    },
  },
  {
    title: "Emitindo pedidos de venda",
    slug: "pedidos-venda",
    category: "Vendas e Pedidos",
    categorySlug: "vendas",
    description: "Registre e gerencie pedidos de venda de forma organizada",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Criando um Pedido",
          content: "Pedidos podem ser criados diretamente ou convertidos de orçamentos. Registram a venda e reservam estoque automaticamente.",
        },
        {
          title: "Processo",
          content: "Para criar um pedido:",
          steps: [
            "Acesse Vendas > Novo Pedido",
            "Selecione cliente",
            "Adicione produtos",
            "Defina condições de pagamento",
            "Defina prazo de entrega",
            "Confirme o pedido",
            "Sistema reserva estoque"
          ],
        },
        {
          title: "Status do Pedido",
          content: "Acompanhe: Pendente (aguardando aprovação), Aprovado (em produção/separação), Em transporte, Entregue ou Cancelado.",
        }
      ],
    },
  },
  {
    title: "Acompanhando métricas de vendas",
    slug: "metricas-vendas",
    category: "Vendas e Pedidos",
    categorySlug: "vendas",
    description: "Analise performance de vendas com indicadores e gráficos",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Principais Indicadores",
          content: "O dashboard de vendas apresenta KPIs essenciais:",
          tips: [
            "Faturamento total do período",
            "Ticket médio por venda",
            "Número de vendas realizadas",
            "Taxa de conversão (orçamentos → vendas)",
            "Top 10 produtos mais vendidos",
            "Performance por vendedor"
          ],
        },
        {
          title: "Gráficos Disponíveis",
          content: "Visualize vendas por período (diário, semanal, mensal), vendas por categoria de produto, comparativo ano a ano e evolução de metas.",
        },
        {
          title: "Exportando Relatórios",
          content: "Todos os gráficos e tabelas podem ser exportados em PDF ou Excel para apresentações e análises externas.",
        }
      ],
    },
  },

  // ===== FINANCEIRO =====
  {
    title: "Entendendo o fluxo de caixa",
    slug: "fluxo-caixa",
    category: "Financeiro",
    categorySlug: "financeiro",
    description: "Visualize entradas e saídas para melhor gestão financeira",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é Fluxo de Caixa",
          content: "Fluxo de caixa registra todo dinheiro que entra e sai da empresa, permitindo projeções e evitando surpresas financeiras.",
        },
        {
          title: "Entradas e Saídas",
          content: "São lançadas automaticamente:",
          tips: [
            "Entradas: vendas à vista, recebimento de duplicatas, outros recebimentos",
            "Saídas: pagamento de fornecedores, despesas operacionais, impostos, folha"
          ],
        },
        {
          title: "Projeção Futura",
          content: "O sistema projeta saldo futuro considerando contas a receber e a pagar já lançadas mas ainda não efetivadas.",
        },
        {
          title: "Análise por Período",
          content: "Visualize fluxo diário, semanal ou mensal. Identifique padrões e planeje melhor capital de giro.",
        }
      ],
    },
  },
  {
    title: "Contas a pagar: cadastro e controle",
    slug: "contas-pagar",
    category: "Financeiro",
    categorySlug: "financeiro",
    description: "Gerencie todas as obrigações financeiras da empresa",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Cadastrando Contas a Pagar",
          content: "Registre fornecedores, impostos, aluguel e outras despesas:",
          steps: [
            "Acesse Financeiro > Contas a Pagar",
            "Clique em 'Nova Conta'",
            "Informe fornecedor/credor",
            "Defina valor e vencimento",
            "Escolha categoria (fornecedor, imposto, despesa)",
            "Adicione descrição",
            "Salve o lançamento"
          ],
        },
        {
          title: "Parcelamento",
          content: "O sistema permite parcelar automaticamente em quantas vezes necessário, gerando vencimentos sequenciais.",
        },
        {
          title: "Alertas de Vencimento",
          content: "Receba notificações 3, 7 ou 15 dias antes do vencimento para não perder prazos.",
        },
        {
          title: "Baixa de Pagamentos",
          content: "Ao efetuar pagamento, registre a baixa informando data, valor pago e forma de pagamento.",
        }
      ],
    },
  },
  {
    title: "Contas a receber: gestão de cobranças",
    slug: "contas-receber",
    category: "Financeiro",
    categorySlug: "financeiro",
    description: "Controle recebimentos e reduza inadimplência",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Origem das Contas a Receber",
          content: "São geradas automaticamente em vendas a prazo ou podem ser lançadas manualmente para outros recebimentos.",
        },
        {
          title: "Acompanhamento",
          content: "Visualize contas pendentes, vencidas (em atraso) e recebidas. Filtros por cliente, período e status.",
        },
        {
          title: "Gestão de Cobranças",
          content: "Para contas vencidas:",
          steps: [
            "Sistema destaca em vermelho títulos atrasados",
            "Envie lembrete automático por email",
            "Registre tentativas de contato",
            "Aplique juros e multa conforme configurado",
            "Marque como inadimplente se necessário"
          ],
        },
        {
          title: "Baixa de Recebimentos",
          content: "Ao receber, registre baixa total ou parcial, informe forma de pagamento e desconto concedido (se houver).",
        }
      ],
    },
  },
  {
    title: "Conciliação bancária automática",
    slug: "conciliacao-bancaria",
    category: "Financeiro",
    categorySlug: "financeiro",
    description: "Compare extratos bancários com lançamentos do sistema",
    lastUpdated: "2024-01-23",
    readTime: "5 min",
    content: {
      sections: [
        {
          title: "O que é Conciliação",
          content: "Conciliação compara movimentações do extrato bancário com lançamentos no sistema, identificando divergências e garantindo precisão nos registros.",
        },
        {
          title: "Importando Extratos",
          content: "Importe arquivo OFX do banco:",
          steps: [
            "Acesse Financeiro > Conciliação",
            "Selecione a conta bancária",
            "Faça upload do arquivo OFX",
            "Sistema lê todas as transações",
            "Inicia processo de matching"
          ],
        },
        {
          title: "Matching Automático",
          content: "O sistema tenta associar automaticamente lançamentos bancários com contas a pagar/receber baseado em: valor, data próxima, descrição similar.",
        },
        {
          title: "Ajustes Manuais",
          content: "Para transações não conciliadas automaticamente, associe manualmente com lançamentos existentes ou crie novos.",
        },
        {
          title: "Finalização",
          content: "Após conciliar tudo, valide e finalize. O saldo contábil será atualizado para refletir o saldo real do banco.",
        }
      ],
    },
  },
  {
    title: "Gerenciando formas de pagamento",
    slug: "formas-pagamento",
    category: "Financeiro",
    categorySlug: "financeiro",
    description: "Configure e controle diferentes métodos de recebimento",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Formas Padrão",
          content: "O sistema oferece: Dinheiro, Cartão de Crédito, Cartão de Débito, PIX, Boleto, Transferência bancária e Cheque.",
        },
        {
          title: "Configurando Taxas",
          content: "Para cada forma, defina taxa percentual (ex: cartão 3,5%) e prazo de repasse (D+1, D+30, etc).",
        },
        {
          title: "Parcelamento em Cartão",
          content: "Configure parcelamento em cartão com ou sem juros, número máximo de parcelas e valor mínimo por parcela.",
        },
        {
          title: "Múltiplas Formas",
          content: "Em uma venda, permita combinar formas de pagamento (ex: parte PIX, parte cartão).",
        }
      ],
    },
  },
  {
    title: "Relatório DRE (Demonstrativo de Resultados)",
    slug: "relatorio-dre",
    category: "Financeiro",
    categorySlug: "financeiro",
    description: "Entenda a saúde financeira com demonstrativo contábil completo",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é DRE",
          content: "Demonstrativo de Resultado do Exercício mostra Receita Total - Custos - Despesas = Lucro/Prejuízo em um período.",
        },
        {
          title: "Estrutura do DRE",
          content: "O relatório apresenta:",
          tips: [
            "Receita Bruta (todas as vendas)",
            "(-) Deduções (impostos, devoluções)",
            "= Receita Líquida",
            "(-) Custo dos Produtos Vendidos (CMV)",
            "= Lucro Bruto",
            "(-) Despesas Operacionais (aluguel, salários, etc)",
            "= Lucro Operacional",
            "= Resultado Final (lucro ou prejuízo)"
          ],
        },
        {
          title: "Análise de Margens",
          content: "Visualize margem bruta (%), margem operacional (%) e margem líquida (%). Compare meses para identificar tendências.",
        },
        {
          title: "Exportação",
          content: "Exporte DRE em PDF para apresentação ou Excel para análises mais profundas.",
        }
      ],
    },
  },

  // ===== RELATÓRIOS E BI =====
  {
    title: "Dashboard: principais indicadores",
    slug: "dashboard",
    category: "Relatórios e BI",
    categorySlug: "relatorios",
    description: "Visão geral dos KPIs mais importantes do negócio",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Visão Geral",
          content: "O dashboard principal apresenta cards com indicadores-chave atualizados em tempo real.",
        },
        {
          title: "Indicadores Financeiros",
          content: "Cards exibem: faturamento do mês, lucro líquido, contas a receber (pendentes) e contas a pagar (pendentes).",
        },
        {
          title: "Indicadores Comerciais",
          content: "Acompanhe: número de vendas, ticket médio, taxa de conversão e top 5 clientes.",
        },
        {
          title: "Indicadores Operacionais",
          content: "Monitore: produtos com estoque baixo, pedidos pendentes, notas fiscais a emitir.",
        },
        {
          title: "Gráficos Interativos",
          content: "Visualize evolução temporal de vendas, comparativo de categorias e distribuição geográfica.",
        }
      ],
    },
  },
  {
    title: "Relatório de vendas por período",
    slug: "relatorio-vendas",
    category: "Relatórios e BI",
    categorySlug: "relatorios",
    description: "Analise performance comercial em diferentes períodos",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Opções de Período",
          content: "Gere relatórios por: dia, semana, mês, trimestre, ano ou período customizado.",
        },
        {
          title: "Dados Apresentados",
          content: "O relatório mostra:",
          tips: [
            "Valor total de vendas",
            "Quantidade de transações",
            "Ticket médio",
            "Produtos mais vendidos",
            "Clientes que mais compraram",
            "Performance por vendedor",
            "Comparativo com período anterior"
          ],
        },
        {
          title: "Filtros Avançados",
          content: "Filtre por vendedor específico, categoria de produto, forma de pagamento ou cliente.",
        },
        {
          title: "Visualizações",
          content: "Alterne entre tabela detalhada, gráficos de linha (evolução) ou gráficos de barra (comparação).",
        }
      ],
    },
  },
  {
    title: "Análise de produtos mais vendidos",
    slug: "produtos-mais-vendidos",
    category: "Relatórios e BI",
    categorySlug: "relatorios",
    description: "Identifique produtos campeões de venda",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Ranking de Produtos",
          content: "Visualize top 10, 20 ou 50 produtos ordenados por: quantidade vendida, valor faturado ou margem de lucro.",
        },
        {
          title: "Análise ABC",
          content: "Produtos classificados em: A (alta rotatividade, 80% das vendas), B (rotatividade média, 15% das vendas) ou C (baixa rotatividade, 5% das vendas).",
        },
        {
          title: "Produtos Parados",
          content: "Identifique produtos sem movimento há mais de 30, 60 ou 90 dias para ações promocionais.",
        },
        {
          title: "Análise de Margens",
          content: "Compare produtos por margem de contribuição para focar naqueles mais lucrativos.",
        }
      ],
    },
  },
  {
    title: "Exportando relatórios em Excel/PDF",
    slug: "exportar-relatorios",
    category: "Relatórios e BI",
    categorySlug: "relatorios",
    description: "Exporte dados para apresentações e análises externas",
    lastUpdated: "2024-01-23",
    readTime: "2 min",
    content: {
      sections: [
        {
          title: "Formatos Disponíveis",
          content: "Todos os relatórios podem ser exportados em PDF (para apresentação) ou Excel (para manipulação de dados).",
        },
        {
          title: "Exportando em PDF",
          content: "PDF mantém formatação visual com gráficos, tabelas e cores. Ideal para envio a diretoria ou sócios.",
        },
        {
          title: "Exportando em Excel",
          content: "Excel exporta dados brutos em planilha, permitindo criar tabelas dinâmicas, gráficos customizados e cruzamento de informações.",
        },
        {
          title: "Agendamento de Relatórios",
          content: "Configure envio automático de relatórios por email (diário, semanal, mensal) para stakeholders.",
        }
      ],
    },
  },
  {
    title: "Personalizando dashboards",
    slug: "personalizar-dashboards",
    category: "Relatórios e BI",
    categorySlug: "relatorios",
    description: "Crie dashboards customizados com os indicadores que você precisa",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Criando Dashboard Personalizado",
          content: "Além do dashboard padrão, crie quantos dashboards customizados quiser:",
          steps: [
            "Acesse Relatórios > Dashboards",
            "Clique em '+ Novo Dashboard'",
            "Dê um nome",
            "Adicione widgets de uma biblioteca",
            "Posicione e redimensione",
            "Salve o dashboard"
          ],
        },
        {
          title: "Widgets Disponíveis",
          content: "Escolha entre: cards de KPI, gráficos de linha/barra/pizza, tabelas de dados, listas de top N e indicadores de meta.",
        },
        {
          title: "Compartilhamento",
          content: "Compartilhe dashboards com outros usuários ou defina como padrão para toda equipe.",
        },
        {
          title: "Modo Apresentação",
          content: "Ative modo full screen para exibir dashboard em TV/monitor na empresa.",
        }
      ],
    },
  },

  // ===== ORION AI =====
  {
    title: "Conversando com a Orion AI",
    slug: "usar-orion-ai",
    category: "Orion AI",
    categorySlug: "ia",
    description: "Use inteligência artificial para agilizar tarefas no sistema",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é Orion AI",
          content: "Assistente inteligente integrado que entende comandos em linguagem natural para executar ações, buscar informações e gerar insights.",
        },
        {
          title: "Ativando a AI",
          content: "Clique no ícone de AI no canto da tela ou use atalho Ctrl+K (Cmd+K no Mac) para abrir o chat.",
        },
        {
          title: "Exemplos de Comandos",
          content: "Você pode pedir:",
          tips: [
            "\"Mostre vendas do mês\"",
            "\"Cadastre um cliente chamado João Silva\"",
            "\"Qual produto mais vendeu esta semana?\"",
            "\"Crie orçamento para o cliente X\"",
            "\"Me mostre produtos com estoque baixo\"",
            "\"Quanto faturei hoje?\""
          ],
        },
        {
          title: "Aprendizado Contínuo",
          content: "A AI aprende com seu uso e melhora sugestões personalizadas ao longo do tempo.",
        }
      ],
    },
  },
  {
    title: "Comandos de voz para cadastros rápidos",
    slug: "comandos-voz",
    category: "Orion AI",
    categorySlug: "ia",
    description: "Cadastre produtos, clientes e vendas usando apenas sua voz",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Ativando Comando de Voz",
          content: "Clique no ícone de microfone na Orion AI ou use atalho Ctrl+Shift+V e comece a falar.",
        },
        {
          title: "Cadastro Rápido de Produtos",
          content: "Diga: \"Cadastrar produto: Caneta azul, preço 2 reais, estoque 100 unidades\". A AI cria o cadastro instantaneamente.",
        },
        {
          title: "Registro de Vendas",
          content: "Diga: \"Registrar venda para João Silva: 5 canetas azuis\". Sistema busca cliente e produto e cria a venda.",
        },
        {
          title: "Correções por Voz",
          content: "Se algo estiver errado, diga \"Corrigir: quantidade para 10 unidades\" e a AI ajusta.",
        }
      ],
    },
  },
  {
    title: "Previsão de demanda com IA",
    slug: "previsao-demanda",
    category: "Orion AI",
    categorySlug: "ia",
    description: "Algoritmos de machine learning preveem vendas futuras",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Como Funciona",
          content: "A IA analisa histórico de vendas, sazonalidade, tendências e eventos para prever demanda dos próximos 30, 60 ou 90 dias.",
        },
        {
          title: "Acessando Previsões",
          content: "Em Estoque > Previsão de Demanda, visualize para cada produto: demanda prevista, intervalo de confiança e sugestão de compra.",
        },
        {
          title: "Ajuste de Estoque Automático",
          content: "Com base na previsão, sistema sugere pedidos de compra para evitar rupturas e excesso de estoque.",
        },
        {
          title: "Sazonalidade",
          content: "IA identifica padrões sazonais (Natal, Dia das Mães, etc) e ajusta previsões automaticamente.",
        }
      ],
    },
  },
  {
    title: "Análise inteligente de dados",
    slug: "analise-inteligente",
    category: "Orion AI",
    categorySlug: "ia",
    description: "Receba insights automáticos sobre seu negócio",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Insights Automáticos",
          content: "Diariamente, a AI analisa seus dados e gera insights como: \"Vendas de categoria X cresceram 30% esta semana\" ou \"Cliente Y não compra há 45 dias\".",
        },
        {
          title: "Alertas Inteligentes",
          content: "Receba alertas proativos sobre: queda brusca de vendas, aumento de inadimplência, produtos com margem negativa ou oportunidades de upsell.",
        },
        {
          title: "Correlações",
          content: "IA identifica correlações não óbvias: \"Clientes que compram produto A geralmente compram B\" para sugerir combos.",
        },
        {
          title: "Benchmark",
          content: "Compare performance com empresas similares (dados anonimizados) e veja onde pode melhorar.",
        }
      ],
    },
  },
  {
    title: "Sugestões automáticas de precificação",
    slug: "precificacao-ia",
    category: "Orion AI",
    categorySlug: "ia",
    description: "IA sugere preços otimizados baseado em mercado e custos",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Precificação Inteligente",
          content: "Com base no custo, margem desejada, preços de concorrentes e elasticidade da demanda, a IA sugere preço ótimo.",
        },
        {
          title: "Como Funciona",
          content: "Para cada produto, sistema mostra: preço atual, preço sugerido pela IA, justificativa da sugestão e impacto estimado nas vendas.",
        },
        {
          title: "Preço Dinâmico",
          content: "Para produtos de alta rotatividade, ative precificação dinâmica que ajusta preço automaticamente baseado em estoque e demanda.",
        },
        {
          title: "Análise de Sensibilidade",
          content: "Simule diferentes cenários de preço e veja impacto previsto em volume e lucro.",
        }
      ],
    },
  },

  // ===== CONFIGURAÇÕES =====
  {
    title: "Configuração inicial do sistema",
    slug: "configuracao-inicial",
    category: "Configurações",
    categorySlug: "configuracoes",
    description: "Primeiros passos após criar sua conta no Orion ERP",
    lastUpdated: "2024-01-23",
    readTime: "5 min",
    content: {
      sections: [
        {
          title: "Checklist de Configuração",
          content: "Após criar conta, configure:",
          steps: [
            "Dados da empresa (nome, CNPJ, endereço)",
            "Dados fiscais (regime tributário, certificado digital)",
            "Cadastre primeiro produto/serviço",
            "Cadastre primeiro cliente",
            "Configure formas de pagamento",
            "Adicione usuários da equipe",
            "Personalize configurações de notificações"
          ],
        },
        {
          title: "Onboarding Guiado",
          content: "O sistema oferece tutorial interativo que guia passo a passo. Acesse através do menu Ajuda > Refazer Onboarding.",
        },
        {
          title: "Importação de Dados",
          content: "Se está migrando de outro sistema, use funcionalidade de importação em massa de clientes e produtos via planilha.",
        }
      ],
    },
  },
  {
    title: "Gerenciando usuários e permissões",
    slug: "usuarios-permissoes",
    category: "Configurações",
    categorySlug: "configuracoes",
    description: "Adicione membros da equipe e defina acessos",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Adicionando Usuários",
          content: "Para adicionar membro:",
          steps: [
            "Acesse Configurações > Usuários",
            "Clique em '+ Novo Usuário'",
            "Preencha nome e email",
            "Defina perfil de acesso",
            "Envie convite por email",
            "Usuário cria senha no primeiro acesso"
          ],
        },
        {
          title: "Perfis de Acesso",
          content: "Perfis pré-configurados:",
          tips: [
            "Admin: acesso total ao sistema",
            "Gerente: visualiza tudo, não altera configurações críticas",
            "Vendedor: acessa vendas e clientes apenas",
            "Estoquista: acessa apenas módulo de estoque",
            "Financeiro: acessa apenas módulo financeiro",
            "Customizado: defina permissões específicas"
          ],
        },
        {
          title: "Permissões Granulares",
          content: "Em perfil customizado, defina para cada módulo: visualizar, criar, editar ou excluir.",
        }
      ],
    },
  },
  {
    title: "Personalizando aparência e tema",
    slug: "personalizar-tema",
    category: "Configurações",
    categorySlug: "configuracoes",
    description: "Ajuste cores, logo e identidade visual do sistema",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Modo Claro/Escuro",
          content: "Alterne entre tema claro (padrão) ou escuro nas configurações de aparência. Também pode configurar para seguir sistema operacional.",
        },
        {
          title: "Personalizando Logo",
          content: "Faça upload da logo da sua empresa que aparecerá no menu lateral e em documentos (orçamentos, notas).",
        },
        {
          title: "Cores do Sistema",
          content: "Defina cor primária que será aplicada em botões, highlights e elementos visuais. Escolha entre paleta ou insira código hexadecimal.",
        },
        {
          title: "Documentos Personalizados",
          content: "Configure cabeçalho e rodapé de orçamentos e notas fiscais com informações da empresa e assinaturas.",
        }
      ],
    },
  },
  {
    title: "Integrações com e-commerce",
    slug: "integracoes-ecommerce",
    category: "Configurações",
    categorySlug: "configuracoes",
    description: "Conecte sua loja virtual ao ERP para sincronização automática",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Plataformas Suportadas",
          content: "Orion integra com: Shopify, WooCommerce (WordPress), Magento, Nuvemshop, Mercado Livre e VTEX.",
        },
        {
          title: "Configurando Integração",
          content: "Passo a passo:",
          steps: [
            "Acesse Integrações > E-commerce",
            "Escolha a plataforma",
            "Insira credenciais/API key",
            "Configure sincronização (produtos, pedidos, estoque)",
            "Defina frequência de sync (tempo real, a cada hora, manual)",
            "Teste conexão",
            "Ative integração"
          ],
        },
        {
          title: "Sincronização Automática",
          content: "Após ativada, sistema sincroniza: novos pedidos da loja criam vendas no ERP automaticamente, estoque é atualizado em tempo real e produtos novos cadastrados no ERP aparecem na loja.",
        }
      ],
    },
  },
  {
    title: "Backup automático de dados",
    slug: "backup-dados",
    category: "Configurações",
    categorySlug: "configuracoes",
    description: "Mantenha seus dados seguros com backups automáticos",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Backups Automáticos",
          content: "Sistema faz backup automático diário de todos os dados. Backups são armazenados de forma criptografada em servidores redundantes.",
        },
        {
          title: "Retenção",
          content: "Mantemos: backups diários dos últimos 30 dias, backups semanais dos últimos 3 meses e backups mensais dos últimos 12 meses.",
        },
        {
          title: "Restauração",
          content: "Se necessário, você pode solicitar restauração de backup específico via suporte. Processo leva até 4 horas.",
        },
        {
          title: "Download de Backup",
          content: "Faça download manual de todos seus dados em formato JSON a qualquer momento em Configurações > Dados > Exportar Tudo.",
        }
      ],
    },
  },
  {
    title: "Configurando notificações",
    slug: "configurar-notificacoes",
    category: "Configurações",
    categorySlug: "configuracoes",
    description: "Personalize alertas e notificações do sistema",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Tipos de Notificação",
          content: "Escolha receber alertas via: notificações no sistema (sino no topo), email ou push (navegador/mobile).",
        },
        {
          title: "Eventos Notificáveis",
          content: "Configure para cada evento:",
          tips: [
            "Nova venda realizada",
            "Produto com estoque baixo",
            "Conta a pagar vencendo",
            "Conta a receber atrasada",
            "Novo cliente cadastrado",
            "Meta de vendas atingida",
            "Relatório mensal disponível"
          ],
        },
        {
          title: "Frequência",
          content: "Defina: imediato (cada evento gera notificação), resumo diário (um email por dia) ou resumo semanal.",
        },
        {
          title: "Horário de Envio",
          content: "Para resumos, escolha horário preferencial de recebimento (ex: 08h da manhã).",
        }
      ],
    },
  },

  // ===== FISCAL E NF-e =====
  {
    title: "Como emitir uma NF-e",
    slug: "emitir-nfe",
    category: "Fiscal e NF-e",
    categorySlug: "fiscal",
    description: "Guia completo para emissão de nota fiscal eletrônica",
    lastUpdated: "2024-01-23",
    readTime: "5 min",
    content: {
      sections: [
        {
          title: "Pré-requisitos",
          content: "Antes de emitir, certifique-se de ter: certificado digital A1 instalado, dados fiscais da empresa configurados e produtos com NCM/CFOP definidos.",
        },
        {
          title: "Emitindo NF-e",
          content: "Processo passo a passo:",
          steps: [
            "Acesse a venda finalizada",
            "Clique em 'Emitir NF-e'",
            "Revise dados do cliente (CPF/CNPJ)",
            "Confira produtos e valores",
            "Valide impostos calculados",
            "Adicione observações se necessário",
            "Clique em 'Transmitir'",
            "Aguarde autorização da SEFAZ (1-3 minutos)",
            "NF-e autorizada, DANFE gerado automaticamente"
          ],
        },
        {
          title: "Envio ao Cliente",
          content: "Após autorização, sistema envia automaticamente por email: XML da NF-e e PDF do DANFE. Cliente também pode baixar pelo portal.",
        },
        {
          title: "Problemas na Emissão",
          content: "Se SEFAZ rejeitar, sistema mostra código e motivo. Corrija dados conforme indicado e retransmita.",
        }
      ],
    },
  },
  {
    title: "Configurando certificado digital",
    slug: "certificado-digital",
    category: "Fiscal e NF-e",
    categorySlug: "fiscal",
    description: "Como instalar e configurar certificado A1 no sistema",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é Certificado Digital",
          content: "Certificado A1 é arquivo .pfx que identifica digitalmente sua empresa para assinar NF-e. Válido por 1 ano.",
        },
        {
          title: "Adquirindo Certificado",
          content: "Compre em Autoridade Certificadora credenciada: Serasa, Certisign, Valid, Soluti. Processo leva 2-5 dias úteis.",
        },
        {
          title: "Instalando no Orion",
          content: "Para instalar:",
          steps: [
            "Acesse Configurações > Fiscal > Certificado Digital",
            "Faça upload do arquivo .pfx",
            "Digite a senha do certificado",
            "Sistema valida e armazena",
            "Certificado fica ativo para emissão"
          ],
        },
        {
          title: "Renovação",
          content: "30 dias antes do vencimento, sistema alerta para renovar. Processo é igual à instalação inicial.",
        }
      ],
    },
  },
  {
    title: "Impostos: ICMS, PIS, COFINS",
    slug: "impostos",
    category: "Fiscal e NF-e",
    categorySlug: "fiscal",
    description: "Entenda e configure cálculo automático de impostos",
    lastUpdated: "2024-01-23",
    readTime: "5 min",
    content: {
      sections: [
        {
          title: "Principais Impostos",
          content: "ICMS (estadual, varia por UF), PIS e COFINS (federais, sobre faturamento) e IPI (federal, produtos industrializados).",
        },
        {
          title: "Configuração por Produto",
          content: "Para cada produto, defina: NCM (Nomenclatura Comum do Mercosul), CFOP (natureza da operação), CST (situação tributária) e alíquotas aplicáveis.",
        },
        {
          title: "Cálculo Automático",
          content: "Com dados configurados, sistema calcula impostos automaticamente na NF-e baseado em: regime tributário da empresa, CFOP da operação e alíquotas vigentes.",
        },
        {
          title: "Simples Nacional",
          content: "Para empresas do Simples, impostos são unificados. Informe apenas alíquota do anexo que sua empresa se enquadra.",
        },
        {
          title: "Consultor Fiscal",
          content: "Recomendamos consultoria de contador para configuração inicial correta dos tributos.",
        }
      ],
    },
  },
  {
    title: "Carta de Correção Eletrônica (CC-e)",
    slug: "carta-correcao",
    category: "Fiscal e NF-e",
    categorySlug: "fiscal",
    description: "Como corrigir erros em NF-e já autorizada",
    lastUpdated: "2024-01-23",
    readTime: "3 min",
    content: {
      sections: [
        {
          title: "Quando Usar",
          content: "CC-e serve para corrigir erros que não alteram: valores, produtos, quantidades ou destinatário. Usada para corrigir descrições, dados de transporte ou observações.",
        },
        {
          title: "Emitindo CC-e",
          content: "Processo:",
          steps: [
            "Acesse a NF-e emitida",
            "Clique em 'Carta de Correção'",
            "Descreva o erro e a correção",
            "Transmita para SEFAZ",
            "Aguarde autorização",
            "Envie CC-e ao cliente junto com NF-e original"
          ],
        },
        {
          title: "Limitações",
          content: "NÃO pode corrigir com CC-e: valores, razão social, CNPJ/CPF, produtos, quantidades ou data de emissão. Nesses casos, é necessário cancelar e reemitir.",
        },
        {
          title: "Múltiplas Correções",
          content: "Pode emitir até 20 CC-e para mesma NF-e. Cada uma fica vinculada à nota original.",
        }
      ],
    },
  },
  {
    title: "Cancelamento de notas fiscais",
    slug: "cancelar-nfe",
    category: "Fiscal e NF-e",
    categorySlug: "fiscal",
    description: "Quando e como cancelar uma NF-e autorizada",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "Prazo para Cancelamento",
          content: "NF-e pode ser cancelada em até 24 horas após autorização, desde que não tenha ocorrido circulação da mercadoria.",
        },
        {
          title: "Processo de Cancelamento",
          content: "Para cancelar:",
          steps: [
            "Acesse a NF-e autorizada",
            "Clique em 'Cancelar NF-e'",
            "Informe motivo (mínimo 15 caracteres)",
            "Confirme o cancelamento",
            "Sistema transmite evento de cancelamento",
            "SEFAZ processa (1-2 minutos)",
            "NF-e cancelada com sucesso"
          ],
        },
        {
          title: "Após 24 horas",
          content: "Se passou o prazo, só pode fazer devolução através de NF-e de devolução. Não é possível cancelar.",
        },
        {
          title: "Efeitos Fiscais",
          content: "NF-e cancelada não gera débitos fiscais e não entra em apurações de impostos. É como se não tivesse sido emitida.",
        }
      ],
    },
  },
  {
    title: "SPED Fiscal e obrigações acessórias",
    slug: "sped-fiscal",
    category: "Fiscal e NF-e",
    categorySlug: "fiscal",
    description: "Geração de arquivos SPED para entrega à Receita",
    lastUpdated: "2024-01-23",
    readTime: "4 min",
    content: {
      sections: [
        {
          title: "O que é SPED",
          content: "Sistema Público de Escrituração Digital: arquivo com todas as operações fiscais do mês que deve ser entregue à Receita Federal e Estadual.",
        },
        {
          title: "Tipos de SPED",
          content: "Principais arquivos:",
          tips: [
            "SPED Fiscal (ICMS/IPI): operações com mercadorias",
            "SPED Contribuições (PIS/COFINS): contribuições federais",
            "EFD-Reinf: retenções na fonte",
            "SPED Contábil: escrituração contábil digital"
          ],
        },
        {
          title: "Gerando SPED no Orion",
          content: "Sistema gera automaticamente:",
          steps: [
            "Acesse Fiscal > SPED",
            "Escolha o tipo de SPED",
            "Selecione mês/ano de apuração",
            "Clique em 'Gerar Arquivo'",
            "Sistema processa todas as operações",
            "Download do arquivo .txt gerado",
            "Valide no PVA da Receita",
            "Transmita para o fisco"
          ],
        },
        {
          title: "Validação",
          content: "Antes de transmitir, valide arquivo no programa PVA da Receita para garantir que está sem erros.",
        },
        {
          title: "Prazos",
          content: "SPED Fiscal e Contribuições devem ser entregues até dia 20 do mês seguinte à apuração.",
        }
      ],
    },
  },
];

// Função auxiliar para buscar artigo
export function getArticle(categorySlug: string, articleSlug: string): HelpArticle | undefined {
  return helpArticles.find(
    article => article.categorySlug === categorySlug && article.slug === articleSlug
  );
}

// Função para buscar artigos por categoria
export function getArticlesByCategory(categorySlug: string): HelpArticle[] {
  return helpArticles.filter(article => article.categorySlug === categorySlug);
}
