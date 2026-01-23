import { Resend } from "resend";

// Inicializar Resend com API key do env
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email padrão do remetente
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Orion ERP <noreply@orion-erp.com>";

// Verificar se Resend está configurado
export function isResendConfigured() {
  return !!process.env.RESEND_API_KEY;
}
