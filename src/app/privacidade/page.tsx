import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Shield, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Pol\u00edtica de Privacidade - Orion ERP | LGPD Compliant",
  description:
    "Pol\u00edtica de Privacidade do Orion ERP. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.",
  openGraph: {
    title: "Pol\u00edtica de Privacidade - Orion ERP",
    description: "Conhe\u00e7a nossa pol\u00edtica de privacidade e prote\u00e7\u00e3o de dados.",
    type: "website",
  },
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              LGPD Compliant
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Pol\u00edtica de Privacidade
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              A ROI Labs leva a privacidade dos seus dados a s\u00e9rio. Esta pol\u00edtica
              explica como coletamos, usamos e protegemos suas informa\u00e7\u00f5es.
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
                {/* 1. Introdu\u00e7\u00e3o */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. Introdu\u00e7\u00e3o</h2>
                  <p className="text-muted-foreground mb-4">
                    A ROI Labs Tecnologia Ltda. (&quot;ROI Labs&quot;, &quot;n\u00f3s&quot;, &quot;nosso&quot;) opera o
                    sistema Orion ERP e o site orion.roilabs.com.br. Esta Pol\u00edtica de
                    Privacidade descreve como coletamos, usamos, armazenamos e
                    compartilhamos suas informa\u00e7\u00f5es pessoais quando voc\u00ea utiliza nossos
                    servi\u00e7os.
                  </p>
                  <p className="text-muted-foreground">
                    Ao utilizar o Orion ERP, voc\u00ea concorda com a coleta e uso de
                    informa\u00e7\u00f5es de acordo com esta pol\u00edtica. Esta pol\u00edtica est\u00e1 em
                    conformidade com a Lei Geral de Prote\u00e7\u00e3o de Dados (LGPD - Lei n\u00ba
                    13.709/2018).
                  </p>
                </div>

                {/* 2. Dados Coletados */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Dados que Coletamos</h2>

                  <h3 className="text-lg font-semibold mb-2">
                    2.1. Dados fornecidos por voc\u00ea
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                    <li>Nome completo e dados de identifica\u00e7\u00e3o</li>
                    <li>Endere\u00e7o de email</li>
                    <li>Telefone de contato</li>
                    <li>Dados da empresa (CNPJ, raz\u00e3o social, endere\u00e7o)</li>
                    <li>Informa\u00e7\u00f5es de pagamento</li>
                    <li>Dados inseridos no sistema (clientes, produtos, vendas, etc.)</li>
                  </ul>

                  <h3 className="text-lg font-semibold mb-2">
                    2.2. Dados coletados automaticamente
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Endere\u00e7o IP e localiza\u00e7\u00e3o geogr\u00e1fica aproximada</li>
                    <li>Tipo de dispositivo e navegador</li>
                    <li>P\u00e1ginas visitadas e tempo de perman\u00eancia</li>
                    <li>Dados de uso do sistema (logs de acesso)</li>
                    <li>Cookies e tecnologias similares</li>
                  </ul>
                </div>

                {/* 3. Uso dos Dados */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">3. Como Usamos seus Dados</h2>
                  <p className="text-muted-foreground mb-4">
                    Utilizamos seus dados para as seguintes finalidades:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Fornecer e manter o servi\u00e7o Orion ERP</li>
                    <li>Processar pagamentos e gerenciar sua assinatura</li>
                    <li>Enviar comunica\u00e7\u00f5es sobre o servi\u00e7o (atualiza\u00e7\u00f5es, manuten\u00e7\u00f5es)</li>
                    <li>Oferecer suporte t\u00e9cnico e atendimento ao cliente</li>
                    <li>Melhorar e personalizar a experi\u00eancia do usu\u00e1rio</li>
                    <li>Enviar comunica\u00e7\u00f5es de marketing (com seu consentimento)</li>
                    <li>Cumprir obriga\u00e7\u00f5es legais e regulat\u00f3rias</li>
                    <li>Prevenir fraudes e garantir a seguran\u00e7a do sistema</li>
                  </ul>
                </div>

                {/* 4. Bases Legais */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    4. Bases Legais para Tratamento (LGPD)
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Tratamos seus dados com base nas seguintes hip\u00f3teses legais da LGPD:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      <strong>Execu\u00e7\u00e3o de contrato:</strong> Para fornecer os servi\u00e7os
                      contratados
                    </li>
                    <li>
                      <strong>Consentimento:</strong> Para marketing e comunica\u00e7\u00f5es opcionais
                    </li>
                    <li>
                      <strong>Leg\u00edtimo interesse:</strong> Para melhorar nossos servi\u00e7os e
                      seguran\u00e7a
                    </li>
                    <li>
                      <strong>Obriga\u00e7\u00e3o legal:</strong> Para cumprir leis e regulamenta\u00e7\u00f5es
                    </li>
                  </ul>
                </div>

                {/* 5. Compartilhamento */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Compartilhamento de Dados</h2>
                  <p className="text-muted-foreground mb-4">
                    Podemos compartilhar seus dados com:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      <strong>Provedores de servi\u00e7o:</strong> Empresas que nos auxiliam na
                      opera\u00e7\u00e3o (hospedagem, pagamentos, email)
                    </li>
                    <li>
                      <strong>Parceiros de neg\u00f3cio:</strong> Mediante seu consentimento
                      expl\u00edcito
                    </li>
                    <li>
                      <strong>Autoridades legais:</strong> Quando exigido por lei ou ordem
                      judicial
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    <strong>N\u00e3o vendemos</strong> seus dados pessoais a terceiros para fins
                    de marketing.
                  </p>
                </div>

                {/* 6. Armazenamento e Seguran\u00e7a */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Armazenamento e Seguran\u00e7a</h2>
                  <p className="text-muted-foreground mb-4">
                    Seus dados s\u00e3o armazenados em servidores seguros localizados no Brasil
                    e/ou em pa\u00edses que oferecem n\u00edvel adequado de prote\u00e7\u00e3o de dados.
                    Implementamos medidas de seguran\u00e7a t\u00e9cnicas e administrativas,
                    incluindo:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Criptografia de dados em tr\u00e2nsito (SSL/TLS) e em repouso</li>
                    <li>Controle de acesso baseado em fun\u00e7\u00f5es</li>
                    <li>Monitoramento cont\u00ednuo de seguran\u00e7a</li>
                    <li>Backup automatizado e redundante</li>
                    <li>Auditorias peri\u00f3dicas de seguran\u00e7a</li>
                  </ul>
                </div>

                {/* 7. Reten\u00e7\u00e3o */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Reten\u00e7\u00e3o de Dados</h2>
                  <p className="text-muted-foreground">
                    Mantemos seus dados pelo tempo necess\u00e1rio para cumprir as finalidades
                    descritas nesta pol\u00edtica, a menos que um per\u00edodo de reten\u00e7\u00e3o mais longo
                    seja exigido por lei. Ap\u00f3s o cancelamento da sua conta, manteremos seus
                    dados por 30 dias para permitir a recupera\u00e7\u00e3o, ap\u00f3s o que ser\u00e3o
                    exclu\u00eddos permanentemente, exceto dados necess\u00e1rios para cumprimento de
                    obriga\u00e7\u00f5es legais.
                  </p>
                </div>

                {/* 8. Seus Direitos */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">8. Seus Direitos (LGPD)</h2>
                  <p className="text-muted-foreground mb-4">
                    Conforme a LGPD, voc\u00ea tem os seguintes direitos:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>
                      <strong>Confirma\u00e7\u00e3o e acesso:</strong> Saber se tratamos seus dados e
                      acess\u00e1-los
                    </li>
                    <li>
                      <strong>Corre\u00e7\u00e3o:</strong> Corrigir dados incompletos ou desatualizados
                    </li>
                    <li>
                      <strong>Anonimiza\u00e7\u00e3o ou bloqueio:</strong> De dados desnecess\u00e1rios ou
                      excessivos
                    </li>
                    <li>
                      <strong>Portabilidade:</strong> Receber seus dados em formato estruturado
                    </li>
                    <li>
                      <strong>Elimina\u00e7\u00e3o:</strong> Solicitar a exclus\u00e3o de dados tratados com
                      consentimento
                    </li>
                    <li>
                      <strong>Revoga\u00e7\u00e3o:</strong> Retirar o consentimento a qualquer momento
                    </li>
                    <li>
                      <strong>Oposi\u00e7\u00e3o:</strong> Se opor a tratamento em casos espec\u00edficos
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Para exercer seus direitos, entre em contato conosco atrav\u00e9s do email{" "}
                    <a
                      href="mailto:privacidade@orion.roilabs.com.br"
                      className="text-primary hover:underline"
                    >
                      privacidade@orion.roilabs.com.br
                    </a>
                    .
                  </p>
                </div>

                {/* 9. Cookies */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">9. Cookies</h2>
                  <p className="text-muted-foreground mb-4">
                    Utilizamos cookies e tecnologias similares para:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Manter voc\u00ea logado no sistema</li>
                    <li>Lembrar suas prefer\u00eancias</li>
                    <li>Analisar o uso do site para melhorias</li>
                    <li>Personalizar conte\u00fado e an\u00fancios (com consentimento)</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Voc\u00ea pode gerenciar suas prefer\u00eancias de cookies nas configura\u00e7\u00f5es do
                    seu navegador.
                  </p>
                </div>

                {/* 10. Menores */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">10. Menores de Idade</h2>
                  <p className="text-muted-foreground">
                    O Orion ERP n\u00e3o \u00e9 destinado a menores de 18 anos. N\u00e3o coletamos
                    intencionalmente dados de menores. Se voc\u00ea acredita que coletamos dados
                    de um menor, entre em contato conosco imediatamente.
                  </p>
                </div>

                {/* 11. Altera\u00e7\u00f5es */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    11. Altera\u00e7\u00f5es nesta Pol\u00edtica
                  </h2>
                  <p className="text-muted-foreground">
                    Podemos atualizar esta Pol\u00edtica de Privacidade periodicamente. Quando
                    fizermos altera\u00e7\u00f5es significativas, notificaremos voc\u00ea por email ou
                    atrav\u00e9s de um aviso no sistema. Recomendamos revisar esta p\u00e1gina
                    regularmente.
                  </p>
                </div>

                {/* 12. Contato */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">12. Contato</h2>
                  <p className="text-muted-foreground mb-4">
                    Se voc\u00ea tiver d\u00favidas sobre esta Pol\u00edtica de Privacidade ou sobre como
                    tratamos seus dados, entre em contato:
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
                    <p>
                      <strong>ROI Labs Tecnologia Ltda.</strong>
                    </p>
                    <p>Encarregado de Prote\u00e7\u00e3o de Dados (DPO)</p>
                    <p>
                      Email:{" "}
                      <a
                        href="mailto:privacidade@orion.roilabs.com.br"
                        className="text-primary hover:underline"
                      >
                        privacidade@orion.roilabs.com.br
                      </a>
                    </p>
                    <p>S\u00e3o Paulo, SP - Brasil</p>
                  </div>
                </div>

                {/* Links */}
                <div className="border-t border-border pt-8">
                  <p className="text-sm text-muted-foreground">
                    Veja tamb\u00e9m:{" "}
                    <Link href="/termos" className="text-primary hover:underline">
                      Termos de Uso
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
