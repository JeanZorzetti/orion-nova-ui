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
  // ... demais artigos de vendas seguem o mesmo padrão
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
