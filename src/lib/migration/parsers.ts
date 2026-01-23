// Parsers para migração de dados de ERPs concorrentes

export interface ParsedData {
  customers?: Customer[];
  products?: Product[];
  sales?: Sale[];
  categories?: Category[];
}

export interface Customer {
  name: string;
  email?: string;
  phone?: string;
  cpfCnpj?: string;
  type: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface Product {
  name: string;
  sku?: string;
  description?: string;
  price: number;
  cost?: number;
  stockQuantity: number;
  category?: string;
  unit: string;
}

export interface Sale {
  orderNumber: string;
  customerName: string;
  total: number;
  orderDate: string;
  items: SaleItem[];
}

export interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Category {
  name: string;
  description?: string;
}

export type SourceErp = "OMIE" | "BLING" | "TINY" | "CONTA_AZUL" | "SAP" | "TOTVS" | "OTHER";

// Parser para Omie ERP
export class OmieParser {
  parse(data: any[]): ParsedData {
    const result: ParsedData = {
      customers: [],
      products: [],
      sales: [],
    };

    data.forEach((row) => {
      // Mapeamento específico do Omie
      if (row.tipo === "cliente") {
        result.customers?.push({
          name: row.razao_social || row.nome_fantasia,
          email: row.email,
          phone: row.telefone,
          cpfCnpj: row.cnpj_cpf,
          type: row.cnpj_cpf?.length > 11 ? "PESSOA_JURIDICA" : "PESSOA_FISICA",
          address: row.endereco,
          city: row.cidade,
          state: row.estado,
          zipCode: row.cep,
        });
      }

      if (row.tipo === "produto") {
        result.products?.push({
          name: row.descricao,
          sku: row.codigo,
          description: row.descricao_detalhada,
          price: parseFloat(row.valor_unitario || "0"),
          cost: parseFloat(row.custo || "0"),
          stockQuantity: parseInt(row.quantidade_estoque || "0"),
          category: row.categoria,
          unit: row.unidade || "UN",
        });
      }
    });

    return result;
  }
}

// Parser para Bling ERP
export class BlingParser {
  parse(data: any[]): ParsedData {
    const result: ParsedData = {
      customers: [],
      products: [],
      sales: [],
    };

    data.forEach((row) => {
      if (row.type === "customer" || row.tipo === "cliente") {
        result.customers?.push({
          name: row.name || row.nome,
          email: row.email,
          phone: row.phone || row.telefone,
          cpfCnpj: row.document || row.cpf_cnpj,
          type: (row.document || row.cpf_cnpj)?.length > 11 ? "PESSOA_JURIDICA" : "PESSOA_FISICA",
          address: row.address || row.endereco,
          city: row.city || row.cidade,
          state: row.state || row.uf,
          zipCode: row.zip || row.cep,
        });
      }

      if (row.type === "product" || row.tipo === "produto") {
        result.products?.push({
          name: row.description || row.descricao,
          sku: row.code || row.codigo,
          description: row.obs || row.observacoes,
          price: parseFloat(row.price || row.preco || "0"),
          cost: parseFloat(row.cost_price || row.preco_custo || "0"),
          stockQuantity: parseInt(row.stock || row.estoque || "0"),
          category: row.category || row.categoria,
          unit: row.unit || row.unidade || "UN",
        });
      }
    });

    return result;
  }
}

// Parser para Tiny ERP
export class TinyParser {
  parse(data: any[]): ParsedData {
    const result: ParsedData = {
      customers: [],
      products: [],
      sales: [],
    };

    data.forEach((row) => {
      if (row.entity === "contact" || row.entidade === "contato") {
        result.customers?.push({
          name: row.company_name || row.nome_empresa,
          email: row.email,
          phone: row.phone || row.telefone,
          cpfCnpj: row.tax_id || row.cpf_cnpj,
          type: (row.tax_id || row.cpf_cnpj)?.length > 11 ? "PESSOA_JURIDICA" : "PESSOA_FISICA",
          address: row.street || row.rua,
          city: row.city || row.cidade,
          state: row.state || row.estado,
          zipCode: row.postal_code || row.cep,
        });
      }

      if (row.entity === "item" || row.entidade === "item") {
        result.products?.push({
          name: row.name || row.nome,
          sku: row.sku || row.codigo,
          description: row.description || row.descricao,
          price: parseFloat(row.sale_price || row.preco_venda || "0"),
          cost: parseFloat(row.purchase_price || row.preco_compra || "0"),
          stockQuantity: parseInt(row.quantity || row.quantidade || "0"),
          category: row.category || row.categoria,
          unit: row.measurement_unit || row.unidade_medida || "UN",
        });
      }
    });

    return result;
  }
}

// Parser genérico (para outros ERPs ou formato customizado)
export class GenericParser {
  parse(data: any[]): ParsedData {
    const result: ParsedData = {
      customers: [],
      products: [],
      sales: [],
    };

    data.forEach((row) => {
      // Tenta identificar o tipo de registro por campos
      const hasCustomerFields = row.name || row.email || row.cpf || row.cnpj;
      const hasProductFields = row.sku || row.price || row.stock;

      if (hasCustomerFields && !hasProductFields) {
        result.customers?.push({
          name: row.name || row.customer_name || row.client_name,
          email: row.email,
          phone: row.phone || row.telephone,
          cpfCnpj: row.cpf || row.cnpj || row.document,
          type: row.type === "company" || row.cnpj ? "PESSOA_JURIDICA" : "PESSOA_FISICA",
          address: row.address || row.street,
          city: row.city,
          state: row.state || row.uf,
          zipCode: row.zip || row.zipcode || row.postal_code,
        });
      }

      if (hasProductFields) {
        result.products?.push({
          name: row.name || row.product_name || row.description,
          sku: row.sku || row.code || row.reference,
          description: row.description || row.details,
          price: parseFloat(row.price || row.sale_price || "0"),
          cost: parseFloat(row.cost || row.cost_price || "0"),
          stockQuantity: parseInt(row.stock || row.quantity || "0"),
          category: row.category,
          unit: row.unit || row.measurement_unit || "UN",
        });
      }
    });

    return result;
  }
}

// Factory para retornar o parser correto
export function getParser(sourceErp: SourceErp) {
  switch (sourceErp) {
    case "OMIE":
      return new OmieParser();
    case "BLING":
      return new BlingParser();
    case "TINY":
      return new TinyParser();
    default:
      return new GenericParser();
  }
}
