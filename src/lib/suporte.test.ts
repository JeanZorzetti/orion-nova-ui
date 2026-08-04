import { describe, it, expect } from "vitest";
import { WHATSAPP_SUPORTE, WHATSAPP_DISPLAY } from "./suporte";

describe("WHATSAPP_SUPORTE", () => {
  it("é só dígitos no formato 55 + DDD + número, ou vazio (não publicado)", () => {
    // Vazio é estado válido: enquanto não houver número real, o botão e os
    // contatos de /contato não renderizam. O que não pode é um número torto —
    // `(11) 9999-9999` esteve publicado por seis sessões.
    expect(WHATSAPP_SUPORTE).toMatch(/^(|55\d{10,11})$/);
  });

  it("formata o número para exibição quando preenchido", () => {
    if (!WHATSAPP_SUPORTE) return expect(WHATSAPP_DISPLAY).toBe("");
    expect(WHATSAPP_DISPLAY).toMatch(/^\(\d{2}\) \d{4,5}-\d{4}$/);
  });
});
