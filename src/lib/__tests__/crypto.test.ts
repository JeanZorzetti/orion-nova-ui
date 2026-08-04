import { describe, it, expect, beforeAll } from "vitest";
import { encrypt, decrypt, mascarar } from "../crypto";

beforeAll(() => {
  process.env.ENCRYPTION_KEY = "chave-de-teste-nao-usar-em-producao";
});

describe("cifra do token do provedor fiscal", () => {
  it("volta o mesmo texto", () => {
    const token = "a1b2c3d4-5e6f-7890-abcd-ef1234567890";
    expect(decrypt(encrypt(token))).toBe(token);
  });

  it("não guarda o token em claro", () => {
    const token = "token-secreto-do-cliente";
    expect(encrypt(token)).not.toContain(token);
  });

  it("dois encrypts do mesmo texto dão saídas diferentes (IV aleatório)", () => {
    expect(encrypt("igual")).not.toBe(encrypt("igual"));
  });

  it("ciphertext adulterado falha em vez de decifrar lixo", () => {
    const cifrado = Buffer.from(encrypt("token"), "base64");
    cifrado[cifrado.length - 1] ^= 0xff;
    expect(() => decrypt(cifrado.toString("base64"))).toThrow();
  });

  it("sem ENCRYPTION_KEY não cifra calado", () => {
    const anterior = process.env.ENCRYPTION_KEY;
    delete process.env.ENCRYPTION_KEY;
    expect(() => encrypt("x")).toThrow(/ENCRYPTION_KEY/);
    process.env.ENCRYPTION_KEY = anterior;
  });

  it("máscara mostra as pontas e esconde o meio", () => {
    expect(mascarar("abcd1234567890wxyz")).toBe("abcd••••••••wxyz");
    expect(mascarar("curto")).toBe("•••••");
  });
});
