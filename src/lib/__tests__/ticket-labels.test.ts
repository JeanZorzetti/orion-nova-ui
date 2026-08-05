import { describe, it, expect } from "vitest";
import { statusConfig, priorityConfig, formatTicketDate } from "../ticket-labels";

// O modo de falha real: alguém acrescenta um status no schema.prisma e a tela
// passa a mostrar "WAITING_VENDOR" cru para o cliente. Estas listas são as do
// schema — se divergirem, o teste quebra antes do usuário ver.
const STATUS = ["OPEN", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED", "CLOSED"];
const PRIORITY = ["LOW", "MEDIUM", "HIGH", "URGENT"];

describe("ticket-labels", () => {
  it("cobre todo status do schema", () => {
    expect(Object.keys(statusConfig).sort()).toEqual([...STATUS].sort());
    for (const s of STATUS) expect(statusConfig[s].label).toBeTruthy();
  });

  it("cobre toda prioridade do schema", () => {
    expect(Object.keys(priorityConfig).sort()).toEqual([...PRIORITY].sort());
  });

  it("formata data aceitando string e Date", () => {
    const d = new Date("2026-03-04T15:30:00Z");
    expect(formatTicketDate(d)).toBe(formatTicketDate(d.toISOString()));
  });
});
