import { describe, it, expect } from "vitest";
import {
  usaCsosn,
  companyFiscalSchema,
  productFiscalSchema,
  chaveAcessoSchema,
  pendenciasEmitente,
  pendenciasProduto,
  pendenciasPrestador,
  pendenciasServico,
  opcaoSimplesNacional,
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

describe("NFS-e: prestador de serviço não é emitente de mercadoria", () => {
  // MEI de serviço: tem inscrição municipal, não tem nem pode ter estadual.
  // Foi o caso que provou que reusar pendenciasEmitente aqui estava errado.
  const prestadorMEI = {
    cnpj: "57493675000137",
    regimeTributario: "MEI" as const,
    inscricaoMunicipal: "123456",
    codigoMunicipioIBGE: "5201405",
    address: "Rua Teste",
    numero: "100",
    bairro: "Centro",
    city: "Aparecida de Goiânia",
    state: "GO",
    zipCode: "74900000",
  };

  it("prestador sem inscrição estadual está pronto — ela não é exigida no ISS", () => {
    expect(pendenciasPrestador(prestadorMEI)).toEqual([]);
  });

  it("e o mesmo MEI é rejeitado como emitente de NF-e, por falta de IE", () => {
    expect(pendenciasEmitente(prestadorMEI)).toEqual(["Inscrição estadual"]);
  });

  it("não cobra inscrição municipal: o DPS Nacional não tem campo para ela", () => {
    expect(pendenciasPrestador({ ...prestadorMEI, inscricaoMunicipal: "" })).toEqual([]);
  });

  it("mas cobra o código IBGE, que é como o Nacional localiza o prestador", () => {
    expect(pendenciasPrestador({ ...prestadorMEI, codigoMunicipioIBGE: null })).toEqual([
      "Código IBGE do município",
    ]);
  });

  it("serviço sem código de tributação nacional não sai, como produto sem NCM", () => {
    expect(pendenciasServico({})).toEqual(["Código de tributação nacional do ISS"]);
    expect(pendenciasServico({ codigoTributacaoNacionalISS: "170600" })).toEqual([]);
  });

  it("opção pelo Simples sai do regime, sem perguntar de novo no cadastro", () => {
    expect(opcaoSimplesNacional("MEI")).toBe(2);
    expect(opcaoSimplesNacional("SIMPLES_NACIONAL")).toBe(3);
    expect(opcaoSimplesNacional("REGIME_NORMAL")).toBe(1);
  });

  it("código de tributação do ISS tem 6 dígitos", () => {
    expect(
      productFiscalSchema.parse({ codigoTributacaoNacionalISS: "170600" })
        .codigoTributacaoNacionalISS
    ).toBe("170600");
    expect(() => productFiscalSchema.parse({ codigoTributacaoNacionalISS: "1706" })).toThrow();
  });
});
