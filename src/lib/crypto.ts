import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/**
 * Cifra simétrica para credencial de terceiro guardada no banco — hoje só o
 * token da Focus NFe, que emite documento fiscal em nome do cliente. Vazamento
 * de dump do banco não pode virar emissão de nota.
 *
 * ponytail: `node:crypto` com AES-256-GCM. Nada de dependência nova; GCM porque
 * autentica junto e um ciphertext adulterado falha em vez de decifrar lixo.
 * Se um dia houver rotação de chave ou HSM, isso vira KMS — não mais código aqui.
 */

const ALGORITMO = "aes-256-gcm";
const TAMANHO_IV = 12; // recomendado para GCM
const TAMANHO_TAG = 16;

function chave(): Buffer {
  const segredo = process.env.ENCRYPTION_KEY;
  if (!segredo) {
    throw new Error(
      "ENCRYPTION_KEY não configurada. Gere com: openssl rand -base64 32"
    );
  }
  // scrypt aceita segredo de qualquer tamanho e devolve os 32 bytes que o
  // AES-256 exige — evita a classe de bug de "chave com 31 caracteres".
  return scryptSync(segredo, "orion-fiscal", 32);
}

/** Devolve iv:tag:ciphertext em base64. */
export function encrypt(texto: string): string {
  const iv = randomBytes(TAMANHO_IV);
  const cipher = createCipheriv(ALGORITMO, chave(), iv);
  const cifrado = Buffer.concat([cipher.update(texto, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), cifrado]).toString("base64");
}

export function decrypt(payload: string): string {
  const bruto = Buffer.from(payload, "base64");
  const iv = bruto.subarray(0, TAMANHO_IV);
  const tag = bruto.subarray(TAMANHO_IV, TAMANHO_IV + TAMANHO_TAG);
  const cifrado = bruto.subarray(TAMANHO_IV + TAMANHO_TAG);

  const decipher = createDecipheriv(ALGORITMO, chave(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(cifrado), decipher.final()]).toString("utf8");
}

/** `abc…xyz` para exibir na tela sem revelar a credencial. */
export function mascarar(texto: string): string {
  if (texto.length <= 8) return "•".repeat(texto.length);
  return `${texto.slice(0, 4)}${"•".repeat(8)}${texto.slice(-4)}`;
}
