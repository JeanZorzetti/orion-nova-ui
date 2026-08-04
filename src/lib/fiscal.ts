import { z } from "zod";
import { IndicadorIeDestinatario, RegimeTributario } from "@prisma/client";

/**
 * Regras fiscais que a NF-e exige e que o resto do sistema não tinha motivo
 * para conhecer. Nada aqui fala com provedor — é só o que é obrigatório pela
 * SEFAZ, então continua valendo se o provedor mudar.
 */

const digitos = (v: string) => v.replace(/\D/g, "");

/** Campo numérico de tamanho fixo, aceito com ou sem máscara. Vazio = ausente. */
const numerico = (tamanho: number, nome: string) =>
  z
    .string()
    .trim()
    .transform(digitos)
    .refine((v) => v === "" || v.length === tamanho, `${nome} deve ter ${tamanho} dígitos`)
    .optional();

const texto = z.string().trim().max(255).optional().or(z.literal(""));

/** `<select>` sem escolha manda "": isso é ausência, não um valor do enum. */
const vazioVira = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());

/** Inteiro que vem de um `<input>`: string vazia é "não informado", não zero. */
const inteiro = (min: number, max: number) =>
  vazioVira(z.coerce.number().int().min(min).max(max));

/**
 * Simples Nacional e MEI usam CSOSN; os demais usam CST de ICMS. É a decisão
 * que redefine metade dos campos do produto, e por isso o regime tributário é
 * a primeira pergunta da configuração fiscal.
 */
export function usaCsosn(regime: string | null | undefined): boolean {
  return regime === "SIMPLES_NACIONAL" || regime === "MEI";
}

export const companyFiscalSchema = z.object({
  regimeTributario: vazioVira(z.nativeEnum(RegimeTributario)),
  inscricaoEstadual: texto,
  inscricaoMunicipal: texto,
  cnae: numerico(7, "CNAE"),
  codigoMunicipioIBGE: numerico(7, "Código IBGE do município"),
  serieNfe: inteiro(1, 999),
  proximoNumeroNfe: inteiro(1, 999_999_999),
  numero: texto,
  complemento: texto,
  bairro: texto,
});

export const customerFiscalSchema = z.object({
  inscricaoEstadual: texto,
  indIEDest: vazioVira(z.nativeEnum(IndicadorIeDestinatario)),
  codigoMunicipioIBGE: numerico(7, "Código IBGE do município"),
  numero: texto,
  complemento: texto,
  bairro: texto,
});

export const productFiscalSchema = z.object({
  codigoTributacaoNacionalISS: numerico(6, "Código de tributação nacional do ISS"),
  aliquotaIss: vazioVira(z.coerce.number().min(0).max(100)),
  ncm: numerico(8, "NCM"),
  cest: numerico(7, "CEST"),
  cfop: numerico(4, "CFOP"),
  origem: z.string().trim().regex(/^[0-8]$/, "Origem deve ser de 0 a 8").optional().or(z.literal("")),
  csosn: texto,
  cstIcms: texto,
  cstPisCofins: texto,
  aliquotaIcms: vazioVira(z.coerce.number().min(0).max(100)),
  unidadeTributavel: texto,
});

/** Chave de acesso da NF-e: 44 dígitos. Usada ao receber o retorno do provedor. */
export const chaveAcessoSchema = z
  .string()
  .trim()
  .transform(digitos)
  .refine((v) => v.length === 44, "Chave de acesso deve ter 44 dígitos");

type EmitenteParcial = {
  cnpj?: string | null;
  regimeTributario?: string | null;
  inscricaoEstadual?: string | null;
  codigoMunicipioIBGE?: string | null;
  address?: string | null;
  numero?: string | null;
  bairro?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
};

type ProdutoParcial = {
  ncm?: string | null;
  cfop?: string | null;
  origem?: string | null;
  csosn?: string | null;
  cstIcms?: string | null;
};

type PrestadorParcial = Omit<EmitenteParcial, "inscricaoEstadual"> & {
  inscricaoMunicipal?: string | null;
};

type ServicoParcial = {
  codigoTributacaoNacionalISS?: string | null;
};

const vazio = (v: unknown) => v === null || v === undefined || v === "";

/**
 * O que ainda falta para o emitente conseguir emitir. Devolve rótulos para a
 * tela — a validação de formato é do zod, esta função só cobra presença.
 */
export function pendenciasEmitente(company: EmitenteParcial): string[] {
  const obrigatorios: Array<[keyof EmitenteParcial, string]> = [
    ["cnpj", "CNPJ"],
    ["regimeTributario", "Regime tributário"],
    ["inscricaoEstadual", "Inscrição estadual"],
    ["codigoMunicipioIBGE", "Código IBGE do município"],
    ["address", "Logradouro"],
    ["numero", "Número"],
    ["bairro", "Bairro"],
    ["city", "Cidade"],
    ["state", "UF"],
    ["zipCode", "CEP"],
  ];
  return obrigatorios.filter(([campo]) => vazio(company[campo])).map(([, rotulo]) => rotulo);
}

/**
 * Idem para quem emite NFS-e. É outra lista, não a mesma com um campo a menos:
 * o prestador de serviço se registra no **município** (ISS), não no estado
 * (ICMS). Cobrar inscrição estadual aqui bloquearia todo MEI de serviço, que
 * não tem nem pode ter uma.
 *
 * A inscrição **municipal** também não entra: no padrão Nacional o prestador é
 * identificado por `cnpj_prestador` + `codigo_municipio_emissora`, e o payload
 * do DPS não tem campo para ela — quem a exige é a NFS-e municipal, que não é
 * o caminho escolhido. Cobrá-la travaria o MEI que nunca abriu cadastro
 * mobiliário na prefeitura, que é a maioria.
 */
export function pendenciasPrestador(company: PrestadorParcial): string[] {
  const obrigatorios: Array<[keyof PrestadorParcial, string]> = [
    ["cnpj", "CNPJ"],
    ["regimeTributario", "Regime tributário"],
    ["codigoMunicipioIBGE", "Código IBGE do município"],
    ["address", "Logradouro"],
    ["numero", "Número"],
    ["bairro", "Bairro"],
    ["city", "Cidade"],
    ["state", "UF"],
    ["zipCode", "CEP"],
  ];
  return obrigatorios.filter(([campo]) => vazio(company[campo])).map(([, rotulo]) => rotulo);
}

/**
 * O código de tributação nacional do ISSQN é para o serviço o que o NCM é para
 * a mercadoria. Nada de CSOSN/CST aqui: quem tributa é o município.
 */
export function pendenciasServico(product: ServicoParcial): string[] {
  const faltando: string[] = [];
  if (vazio(product.codigoTributacaoNacionalISS)) {
    faltando.push("Código de tributação nacional do ISS");
  }
  return faltando;
}

/**
 * `codigo_opcao_simples_nacional` da DPS. Derivado do regime que já existe —
 * não é campo novo de cadastro, seria perguntar duas vezes a mesma coisa.
 */
export function opcaoSimplesNacional(regime: string | null | undefined): 1 | 2 | 3 {
  if (regime === "MEI") return 2;
  if (regime === "SIMPLES_NACIONAL" || regime === "SIMPLES_NACIONAL_EXCESSO") return 3;
  return 1; // não optante
}

/** Idem para o produto. Depende do regime: CSOSN no Simples, CST no normal. */
export function pendenciasProduto(
  product: ProdutoParcial,
  regime: string | null | undefined
): string[] {
  const faltando: string[] = [];
  if (vazio(product.ncm)) faltando.push("NCM");
  if (vazio(product.cfop)) faltando.push("CFOP");
  if (vazio(product.origem)) faltando.push("Origem");
  if (usaCsosn(regime)) {
    if (vazio(product.csosn)) faltando.push("CSOSN");
  } else if (vazio(product.cstIcms)) {
    faltando.push("CST de ICMS");
  }
  return faltando;
}
