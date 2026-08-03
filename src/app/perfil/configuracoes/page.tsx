import { redirect } from "next/navigation";

// ponytail: configurações de conta são as mesmas do ERP; página própria só se divergirem
export default function PerfilConfiguracoesPage() {
  redirect("/dashboard/configuracoes");
}
