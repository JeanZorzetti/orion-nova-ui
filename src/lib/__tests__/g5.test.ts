import { describe, it, expect } from "vitest";
import { progressoG5, rotuloG5 } from "../g5";

const nada = { customer: false, product: false, sale: false, report: false };

describe("progressoG5", () => {
  it("conta zero e aponta o primeiro passo", () => {
    const p = progressoG5(nada);
    expect(p.concluidos).toBe(0);
    expect(p.percentual).toBe(0);
    expect(p.completo).toBe(false);
    expect(p.proximo?.id).toBe("customer");
  });

  it("pula para o próximo passo em aberto, mesmo fora de ordem", () => {
    // Popular com dados de exemplo cria cliente, produto e pedido de uma vez:
    // o CTA tem que apontar para o relatório, não voltar para o começo.
    const p = progressoG5({ ...nada, customer: true, product: true, sale: true });
    expect(p.concluidos).toBe(3);
    expect(p.percentual).toBe(75);
    expect(p.proximo?.id).toBe("report");
  });

  it("fecha em 100% sem próximo passo", () => {
    const p = progressoG5({ customer: true, product: true, sale: true, report: true });
    expect(p.completo).toBe(true);
    expect(p.percentual).toBe(100);
    expect(p.proximo).toBeNull();
  });

  it("ignora buracos: conta o que está feito, não até onde chegou", () => {
    const p = progressoG5({ ...nada, report: true });
    expect(p.concluidos).toBe(1);
    expect(p.proximo?.id).toBe("customer");
  });
});

describe("rotuloG5", () => {
  it("numera o passo em aberto para o efeito Zeigarnik", () => {
    expect(rotuloG5(progressoG5({ ...nada, customer: true }))).toBe(
      "Passo 2 de 4: 25% concluído"
    );
  });

  it("não anuncia um 5º passo quando tudo fecha", () => {
    const p = progressoG5({ customer: true, product: true, sale: true, report: true });
    expect(rotuloG5(p)).toBe("Ciclo completo: 100% concluído");
  });
});
