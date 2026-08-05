import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { sendGenericNotificationEmail } from "@/lib/email/send";
import { withRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

/**
 * Formulário de /contato. Antes desta rota o form era um `setTimeout` de 1,5 s
 * que dizia "Mensagem Enviada!" e **descartava os dados** — todo lead do site
 * público desde sempre foi perdido.
 *
 * A ordem importa: o e-mail é a cópia durável do lead e vai PRIMEIRO. O CRM é o
 * destino, mas se ele estiver fora, logamos e seguimos — um lead perdido porque
 * o hub estava reiniciando é pior que um lead sem card. Não há tabela de leads
 * aqui de propósito: uma terceira cópia é a que fica desatualizada.
 */

// Endereço já publicado na própria página de contato — não é segredo nem varia.
const DESTINO = process.env.LEAD_EMAIL || "contato@orion.roilabs.com.br";

const ASSUNTOS: Record<string, string> = {
  comercial: "Comercial",
  suporte: "Suporte Técnico",
  parcerias: "Parcerias",
  imprensa: "Imprensa",
  outros: "Outros Assuntos",
};

const texto = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

async function enviarParaCrm(payload: Record<string, unknown>) {
  const url = process.env.CRM_INGEST_URL;
  const secret = process.env.CRM_INGEST_SECRET;
  if (!url || !secret) return; // CRM não configurado neste ambiente — o e-mail já guardou o lead

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify(payload),
      // Hub reiniciando não pode segurar a resposta ao visitante.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[contact] CRM devolveu ${res.status}:`, await res.text().catch(() => ""));
    }
  } catch (error) {
    console.error("[contact] CRM inacessível — lead está no e-mail:", error);
  }
}

export const POST = withRateLimit(async (request: Request) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const name = texto(b.name, 200);
  const email = texto(b.email, 200);
  const message = texto(b.message, 5000);
  const phone = texto(b.phone, 40);
  const company = texto(b.company, 200);
  const reason = texto(b.reason, 40);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nome, email e mensagem são obrigatórios" },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const assunto = ASSUNTOS[reason] || "Contato";

  // 1) E-mail primeiro: é a cópia que prova que o lead existiu.
  const resultado = await sendGenericNotificationEmail(
    DESTINO,
    "Equipe",
    `Novo lead (${assunto}): ${name}`,
    [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      phone && `Telefone: ${phone}`,
      company && `Empresa: ${company}`,
      `Assunto: ${assunto}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n")
  );

  if (!resultado.success) {
    // Sem e-mail e sem tabela local, aceitar seria perder o lead em silêncio —
    // exatamente o defeito que esta rota existe para corrigir.
    console.error("[contact] falha ao enviar e-mail do lead:", resultado.error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem agora. Tente novamente." },
      { status: 502 }
    );
  }

  // 2) CRM depois, e sem poder derrubar a requisição.
  await enviarParaCrm({
    // Gerado por envio: usar o e-mail como chave faria o mesmo lead voltando em
    // seis meses virar update silencioso de um registro morto.
    external_id: `orion:contato:${randomUUID()}`,
    pipeline: "orion",
    nome: name,
    email,
    telefone: phone || undefined,
    origem: "orion:contato",
    metadata: { empresa: company || undefined, assunto, mensagem: message },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}, RATE_LIMITS.contact);
