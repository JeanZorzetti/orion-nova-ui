import { describe, it, expect } from "vitest";
import {
  usaCsosn,
  companyFiscalSchema,
  productFiscalSchema,
  chaveAcessoSchema,
  pendenciasEmitente,
  pendenciasProduto,
} from "../fiscal";

const emitenteCompleto = {
  cnpj: "12345678000199",
  regimeTributario: "SIMPLES_NACIONAL" as const,
  inscricaoEstadual: "1234567890",
  codigoMunicipioIBGE: "3550308",
  address: "Rua das Flores",
  numero: "100",
  bairro: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01001000",
};

describe("regime tributário decide CSOSN vs CST", () => {
  it("Simples Nacional e MEI usam CSOSN", () => {
    expect(usaCsosn("SIMPLES_NACIONAL")).toBe(true);
    expect(usaCsosn("MEI")).toBe(true);
  });

  it("Regime Normal e Simples com excesso usam CST", () => {
    expect(usaCsosn("REGIME_NORMAL")).toBe(false);
    expect(usaCsosn("SIMPLES_NACIONAL_EXCESSO")).toBe(false);
  });

  it("sem regime definido não assume Simples", () => {
    expect(usaCsosn(null)).toBe(false);
  });
});

describe("campos numéricos fiscais", () => {
  it("aceita NCM de 8 dígitos com ou sem máscara", () => {
    expect(productFiscalSchema.parse({ ncm: "1234.56.78" }).ncm).toBe("12345678");
  });

  it("rejeita NCM com tamanho errado", () => {
    expect(() => productFiscalSchema.parse({ ncm: "1234" })).toThrow();
  });

  it("rejeita origem fora de 0-8", () => {
    expect(() => productFiscalSchema.parse({ origem: "9" })).toThrow();
  });

  it("rejeita código IBGE que não tem 7 dígitos", () => {
    expect(() => companyFiscalSchema.parse({ codigoMunicipioIBGE: "355030" })).toThrow();
  });

  it("exige 44 dígitos na chave de acesso", () => {
    expect(chaveAcessoSchema.parse("3".repeat(44))).toHaveLength(44);
    expect(() => chaveAcessoSchema.parse("3".repeat(43))).toThrow();
  });

  it("série da NF-e começa em 1, não em 0", () => {
    expect(() => companyFiscalSchema.parse({ serieNfe: 0 })).toThrow();
  });
});

describe("pendências antes de emitir", () => {
  it("emitente completo não tem pendência", () => {
    expect(pendenciasEmitente(emitenteCompleto)).toEqual([]);
  });

  it("cobra o que falta, inclusive número e bairro separados do logradouro", () => {
    const pendencias = pendenciasEmitente({ ...emitenteCompleto, numero: null, bairro: "" });
    expect(pendencias).toEqual(["Número", "Bairro"]);
  });

  it("produto sem NCM nunca está pronto", () => {
    expect(pendenciasProduto({ cfop: "5102", origem: "0", csosn: "102" }, "SIMPLES_NACIONAL")).toEqual([
      "NCM",
    ]);
  });

  it("cobra CSOSN no Simples e CST no Regime Normal, nunca os dois", () => {
    const produto = { ncm: "12345678", cfop: "5102", origem: "0" };
    expect(pendenciasProduto(produto, "SIMPLES_NACIONAL")).toEqual(["CSOSN"]);
    expect(pendenciasProduto(produto, "REGIME_NORMAL")).toEqual(["CST de ICMS"]);
    expect(pendenciasProduto({ ...produto, csosn: "102" }, "REGIME_NORMAL")).toEqual([
      "CST de ICMS",
    ]);
  });
});
