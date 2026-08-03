import { describe, it, expect } from "vitest";
import { stripNfe } from "./strip-nfe-from-plans";

describe("stripNfe", () => {
  it("tira o bullet de NF-e e a chave nfeLimit", () => {
    expect(
      stripNfe({
        modules: ["Financeiro básico", "Emissão de NF-e (até 100/mês)"],
        nfeLimit: 100,
        support: "Email",
      })
    ).toEqual({ modules: ["Financeiro básico"], support: "Email" });
  });

  it("pega também NFS-e e 'nota fiscal'", () => {
    expect(
      stripNfe({ modules: ["Emissão ilimitada NF-e/NFS-e", "Nota fiscal de serviço", "PDV"] })
    ).toEqual({ modules: ["PDV"] });
  });

  it("devolve null quando não há nada a mudar (idempotência)", () => {
    expect(stripNfe({ modules: ["PDV"], support: "Email" })).toBeNull();
    expect(stripNfe({})).toBeNull();
    expect(stripNfe(null)).toBeNull();
  });
});
