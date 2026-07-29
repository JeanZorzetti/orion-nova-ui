import { Resend } from "resend";

// Lazy: o construtor do Resend lança se a key faltar, e isso quebrava o build
let _resend: Resend | null = null;
export const getResend = () => (_resend ??= new Resend(process.env.RESEND_API_KEY));

// Email padrão do remetente
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Orion ERP <noreply@orion-erp.com>";

// Verificar se Resend está configurado
export function isResendConfigured() {
  return !!process.env.RESEND_API_KEY;
}
