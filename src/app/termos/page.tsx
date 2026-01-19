import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FileText, Calendar } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata.termos;

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <FileText className="w-3 h-3 mr-1" />
              Documento Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Termos de Uso</h1>
            <p className="text-lg text-muted-foreground mb-4">
              Leia atentamente os termos e condi\u00e7\u00f5es para utiliza\u00e7\u00e3o do Orion ERP.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>\u00daltima atualiza\u00e7\u00e3o: 17 de Janeiro de 2026</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-10 space-y-8">
                {/* 1. Aceita\u00e7\u00e3o */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. Aceita\u00e7\u00e3o dos Termos</h2>
                  <p className="text-muted-foreground mb-4">
                    Ao acessar ou usar o Orion ERP (&quot;Servi\u00e7o&quot;), voc\u00ea concorda em ficar
                    vinculado a estes Termos de Uso (&quot;Termos&quot;). Se voc\u00ea n\u00e3o concordar com
                    qualquer parte destes Termos, n\u00e3o poder\u00e1 acessar o Servi\u00e7o.
                  </p>
                  <p className="text-muted-foreground">
                    Estes Termos se aplicam a todos os visitantes, usu\u00e1rios e outros que
                    acessam ou usam o Servi\u00e7o. O Servi\u00e7o \u00e9 oferecido pela ROI Labs
                    Tecnologia Ltda. (&quot;ROI Labs&quot;, &quot;n\u00f3s&quot;, &quot;nosso&quot;).
                  </p>
                </div>

                {/* 2. Descri\u00e7\u00e3o do Servi\u00e7o */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Descri\u00e7\u00e3o do Servi\u00e7o</h2>
                  <p className="text-muted-foreground mb-4">
                    O Orion ERP \u00e9 um sistema de gest\u00e3o empresarial (ERP) baseado em nuvem
                    que oferece funcionalidades de:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Gest\u00e3o de clientes e relacionamento (CRM)</li>
                    <li>Controle de estoque e produtos</li>
                    <li>Vendas, pedidos e faturamento</li>
                    <li>Gest\u00e3o financeira (contas a pagar/receber, fluxo de caixa)</li>
                    <li>Relat\u00f3rios e dashboards</li>
                    <li>Assistente de intelig\u00eancia artificial (Orion AI)</li>
                  </ul>
                </div>

                {/* 3. Conta do Usu\u00e1rio */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">3. Conta do Usu\u00e1rio</h2>

                  <h3 className="text-lg font-semibold mb-2">3.1. Registro</h3>
                  <p className="text-muted-foreground mb-4">
                    Para utilizar o Servi\u00e7o, voc\u00ea deve criar uma conta fornecendo
                    informa\u00e7\u00f5es precisas, completas e atualizadas. Voc\u00ea \u00e9 respons\u00e1vel por
                    manter a confidencialidade de sua conta e senha.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">3.2. Responsabilidade</h3>
                  <p className="text-muted-foreground mb-4">
                    Voc\u00ea \u00e9 respons\u00e1vel por todas as atividades que ocorrem em sua conta.
                    Notifique-nos imediatamente sobre qualquer uso n\u00e3o autorizado de sua
                    conta.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">3.3. Idade M\u00ednima</h3>
                  <p className="text-muted-foreground">
                    Voc\u00ea deve ter pelo menos 18 anos para usar o Servi\u00e7o. Ao criar uma
                    conta, voc\u00ea declara que tem capacidade legal para celebrar este
                    contrato.
                  </p>
                </div>

                {/* 4. Planos e Pagamentos */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Planos e Pagamentos</h2>

                  <h3 className="text-lg font-semibold mb-2">4.1. Trial Gratuito</h3>
                  <p className="text-muted-foreground mb-4">
                    Oferecemos um per\u00edodo de trial gratuito de 30 dias com acesso completo
                    ao Servi\u00e7o. Ap\u00f3s o trial, \u00e9 necess\u00e1rio assinar um plano pago para
                    continuar usando.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">4.2. Planos Pagos</h3>
                  <p className="text-muted-foreground mb-4">
                    Os planos pagos s\u00e3o cobrados mensalmente ou anualmente, conforme sua
                    escolha. Os pre\u00e7os est\u00e3o dispon\u00edveis em nossa{" "}
                    <Link href="/precos" className="text-primary hover:underline">
                      p\u00e1gina de pre\u00e7os
                    </Link>
                    .
                  </p>

                  <h3 className="text-lg font-semibold mb-2">4.3. Renova\u00e7\u00e3o</h3>
                  <p className="text-muted-foreground mb-4">
                    Sua assinatura ser\u00e1 renovada automaticamente ao final de cada per\u00edodo,
                    a menos que voc\u00ea cancele antes da data de renova\u00e7\u00e3o.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">4.4. Cancelamento</h3>
                  <p className="text-muted-foreground mb-4">
                    Voc\u00ea pode cancelar sua assinatura a qualquer momento. O cancelamento
                    ser\u00e1 efetivado ao final do per\u00edodo pago atual. N\u00e3o h\u00e1 reembolso
                    proporcional para per\u00edodos parciais.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">4.5. Altera\u00e7\u00f5es de Pre\u00e7o</h3>
                  <p className="text-muted-foreground">
                    Reservamo-nos o direito de alterar os pre\u00e7os a qualquer momento.
                    Altera\u00e7\u00f5es de pre\u00e7o ser\u00e3o notificadas com anteced\u00eancia de 30 dias.
                  </p>
                </div>

                {/* 5. Uso Aceit\u00e1vel */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Uso Aceit\u00e1vel</h2>
                  <p className="text-muted-foreground mb-4">
                    Ao usar o Servi\u00e7o, voc\u00ea concorda em N\u00c3O:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      Violar qualquer lei ou regulamento aplic\u00e1vel
                    </li>
                    <li>
                      Usar o Servi\u00e7o para fins ilegais ou n\u00e3o autorizados
                    </li>
                    <li>
                      Transmitir v\u00edrus, malware ou c\u00f3digo malicioso
                    </li>
                    <li>
                      Tentar acessar contas de outros usu\u00e1rios sem autoriza\u00e7\u00e3o
                    </li>
                    <li>
                      Interferir ou interromper o funcionamento do Servi\u00e7o
                    </li>
                    <li>
                      Realizar engenharia reversa ou descompilar o software
                    </li>
                    <li>
                      Revender ou sublicenciar o acesso ao Servi\u00e7o
                    </li>
                    <li>
                      Usar o Servi\u00e7o de maneira que possa danificar, sobrecarregar ou
                      prejudicar nossos servidores
                    </li>
                  </ul>
                </div>

                {/* 6. Propriedade Intelectual */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Propriedade Intelectual</h2>

                  <h3 className="text-lg font-semibold mb-2">6.1. Nosso Conte\u00fado</h3>
                  <p className="text-muted-foreground mb-4">
                    O Servi\u00e7o e seu conte\u00fado original (excluindo conte\u00fado fornecido pelos
                    usu\u00e1rios), recursos e funcionalidades s\u00e3o de propriedade exclusiva da
                    ROI Labs e s\u00e3o protegidos por direitos autorais, marcas registradas e
                    outras leis de propriedade intelectual.
                  </p>

                  <h3 className="text-lg font-semibold mb-2">6.2. Seu Conte\u00fado</h3>
                  <p className="text-muted-foreground">
                    Voc\u00ea mant\u00e9m todos os direitos sobre os dados e conte\u00fados que inserir no
                    Servi\u00e7o. Ao usar o Servi\u00e7o, voc\u00ea nos concede uma licen\u00e7a limitada para
                    armazenar, processar e exibir seu conte\u00fado exclusivamente para fornecer
                    o Servi\u00e7o.
                  </p>
                </div>

                {/* 7. Privacidade */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Privacidade e Dados</h2>
                  <p className="text-muted-foreground">
                    Nossa coleta e uso de informa\u00e7\u00f5es pessoais s\u00e3o descritos em nossa{" "}
                    <Link href="/privacidade" className="text-primary hover:underline">
                      Pol\u00edtica de Privacidade
                    </Link>
                    . Ao usar o Servi\u00e7o, voc\u00ea concorda com nossa coleta e uso de dados
                    conforme descrito nessa pol\u00edtica.
                  </p>
                </div>

                {/* 8. Disponibilidade */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">8. Disponibilidade do Servi\u00e7o</h2>
                  <p className="text-muted-foreground mb-4">
                    Nos esfor\u00e7amos para manter o Servi\u00e7o dispon\u00edvel 24/7, mas n\u00e3o
                    garantimos disponibilidade ininterrupta. O Servi\u00e7o pode ficar
                    indispon\u00edvel temporariamente para manuten\u00e7\u00e3o, atualiza\u00e7\u00f5es ou por
                    motivos fora do nosso controle.
                  </p>
                  <p className="text-muted-foreground">
                    Para planos Enterprise, oferecemos SLA com garantia de 99.9% de
                    uptime. Detalhes est\u00e3o dispon\u00edveis em contrato separado.
                  </p>
                </div>

                {/* 9. Limita\u00e7\u00e3o de Responsabilidade */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    9. Limita\u00e7\u00e3o de Responsabilidade
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    O SERVI\u00c7O \u00c9 FORNECIDO &quot;COMO EST\u00c1&quot;, SEM GARANTIAS DE QUALQUER TIPO,
                    EXPRESSAS OU IMPL\u00cdCITAS.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Em nenhuma circunst\u00e2ncia a ROI Labs ser\u00e1 respons\u00e1vel por danos
                    indiretos, incidentais, especiais, consequenciais ou punitivos,
                    incluindo, mas n\u00e3o limitado a, perda de lucros, dados, uso ou outras
                    perdas intang\u00edveis.
                  </p>
                  <p className="text-muted-foreground">
                    Nossa responsabilidade total por todas as reivindica\u00e7\u00f5es relacionadas
                    ao Servi\u00e7o n\u00e3o exceder\u00e1 o valor total pago por voc\u00ea nos \u00faltimos 12
                    meses.
                  </p>
                </div>

                {/* 10. Indeniza\u00e7\u00e3o */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">10. Indeniza\u00e7\u00e3o</h2>
                  <p className="text-muted-foreground">
                    Voc\u00ea concorda em defender, indenizar e isentar a ROI Labs de qualquer
                    reivindica\u00e7\u00e3o, dano, obriga\u00e7\u00e3o, perda, responsabilidade, custo ou
                    d\u00edvida decorrente de: (a) seu uso do Servi\u00e7o; (b) sua viola\u00e7\u00e3o destes
                    Termos; (c) sua viola\u00e7\u00e3o de direitos de terceiros.
                  </p>
                </div>

                {/* 11. Rescis\u00e3o */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">11. Rescis\u00e3o</h2>
                  <p className="text-muted-foreground mb-4">
                    Podemos encerrar ou suspender sua conta imediatamente, sem aviso
                    pr\u00e9vio, por qualquer motivo, incluindo, sem limita\u00e7\u00e3o, se voc\u00ea violar
                    estes Termos.
                  </p>
                  <p className="text-muted-foreground">
                    Ap\u00f3s a rescis\u00e3o, seu direito de usar o Servi\u00e7o cessar\u00e1 imediatamente.
                    Seus dados ser\u00e3o mantidos por 30 dias para permitir exporta\u00e7\u00e3o, ap\u00f3s o
                    que ser\u00e3o exclu\u00eddos permanentemente.
                  </p>
                </div>

                {/* 12. Altera\u00e7\u00f5es */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">12. Altera\u00e7\u00f5es nos Termos</h2>
                  <p className="text-muted-foreground">
                    Reservamo-nos o direito de modificar estes Termos a qualquer momento.
                    Altera\u00e7\u00f5es significativas ser\u00e3o notificadas com anteced\u00eancia de 30 dias
                    por email ou aviso no sistema. O uso continuado do Servi\u00e7o ap\u00f3s as
                    altera\u00e7\u00f5es constitui aceita\u00e7\u00e3o dos novos Termos.
                  </p>
                </div>

                {/* 13. Lei Aplic\u00e1vel */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">13. Lei Aplic\u00e1vel</h2>
                  <p className="text-muted-foreground">
                    Estes Termos ser\u00e3o regidos e interpretados de acordo com as leis da
                    Rep\u00fablica Federativa do Brasil, sem considerar suas disposi\u00e7\u00f5es sobre
                    conflitos de leis. Qualquer disputa relacionada a estes Termos ser\u00e1
                    submetida \u00e0 jurisdi\u00e7\u00e3o exclusiva do Foro da Comarca de S\u00e3o Paulo, SP.
                  </p>
                </div>

                {/* 14. Contato */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">14. Contato</h2>
                  <p className="text-muted-foreground mb-4">
                    Se voc\u00ea tiver d\u00favidas sobre estes Termos, entre em contato:
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                    <p>
                      <strong>ROI Labs Tecnologia Ltda.</strong>
                    </p>
                    <p>
                      Email:{" "}
                      <a
                        href="mailto:juridico@orion.roilabs.com.br"
                        className="text-primary hover:underline"
                      >
                        juridico@orion.roilabs.com.br
                      </a>
                    </p>
                    <p>S\u00e3o Paulo, SP - Brasil</p>
                  </div>
                </div>

                {/* Links */}
                <div className="border-t border-border pt-8">
                  <p className="text-sm text-muted-foreground">
                    Veja tamb\u00e9m:{" "}
                    <Link href="/privacidade" className="text-primary hover:underline">
                      Pol\u00edtica de Privacidade
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
