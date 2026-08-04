/**
 * Canal de suporte por WhatsApp — fonte única do número.
 *
 * Ele aparece na sidebar do dashboard e em /contato. Não é env var de
 * propósito: o número é público, sai impresso na landing, e pôr em `.env`
 * garante que uma das pontas fique sem ele.
 *
 * ⚠️ **Vazio = canal não publicado.** Enquanto for `""`, o botão da sidebar e
 * os contatos de telefone/WhatsApp de /contato simplesmente não renderizam. Um
 * botão verde que abre conversa com número inválido é pior que a ausência
 * dele. Preencha com o número real (só dígitos: 55 + DDD + número) e tudo passa
 * a aparecer sozinho.
 */
export const WHATSAPP_SUPORTE = "";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_SUPORTE}`;

export const WHATSAPP_TEL = `tel:+${WHATSAPP_SUPORTE}`;

/** "5511912345678" -> "(11) 91234-5678". Sem match, devolve os dígitos crus. */
export const WHATSAPP_DISPLAY = WHATSAPP_SUPORTE.replace(
  /^55(\d{2})(\d{4,5})(\d{4})$/,
  "($1) $2-$3"
);
