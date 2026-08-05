"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
  Building2,
  Headphones,
  FileQuestion,
  Users,
} from "lucide-react";
import { pageMetadata } from "@/lib/metadata";
import {
  WHATSAPP_SUPORTE,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  WHATSAPP_TEL,
} from "@/lib/suporte";

const contactReasons = [
  { value: "comercial", label: "Falar com Comercial" },
  { value: "suporte", label: "Suporte Técnico" },
  { value: "parcerias", label: "Parcerias" },
  { value: "imprensa", label: "Imprensa" },
  { value: "outros", label: "Outros Assuntos" },
];

// Telefone e WhatsApp só entram quando existe número real — até então eram
// `(11) 9999-9999`, que não é número de ninguém. Ver lib/suporte.ts.
const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "contato@orion.roilabs.com.br",
    link: "mailto:contato@orion.roilabs.com.br",
  },
  ...(WHATSAPP_SUPORTE
    ? [
        {
          icon: Phone,
          title: "Telefone",
          value: WHATSAPP_DISPLAY,
          link: WHATSAPP_TEL,
        },
        {
          icon: MessageSquare,
          title: "WhatsApp",
          value: WHATSAPP_DISPLAY,
          link: WHATSAPP_URL,
        },
      ]
    : []),
  {
    icon: MapPin,
    title: "Localização",
    value: "São Paulo, SP - Brasil",
    link: null,
  },
];

const departments = [
  {
    icon: Building2,
    title: "Comercial",
    description: "Dúvidas sobre planos, preços e demonstrações.",
    email: "comercial@orion.roilabs.com.br",
  },
  {
    icon: Headphones,
    title: "Suporte",
    description: "Ajuda técnica para usuários do sistema.",
    email: "suporte@orion.roilabs.com.br",
  },
  {
    icon: Users,
    title: "Parcerias",
    description: "Oportunidades de parceria e integrações.",
    email: "parcerias@orion.roilabs.com.br",
  },
  {
    icon: FileQuestion,
    title: "Imprensa",
    description: "Assessoria de imprensa e mídia.",
    email: "imprensa@orion.roilabs.com.br",
  },
];

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    reason: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErro("");

    // Só diz "Enviada!" se foi mesmo: até 05/08/26 isto era um setTimeout que
    // descartava os dados e mostrava sucesso.
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar sua mensagem.");
      setIsSubmitted(true);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              Fale Conosco
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Estamos Aqui para{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                Ajudar
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tem alguma dúvida? Quer conhecer melhor o Orion ERP? Entre em contato
              conosco. Nossa equipe está pronta para atender você.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Mensagem Enviada!</h3>
                    <p className="text-muted-foreground mb-6">
                      Recebemos sua mensagem e retornaremos em breve. Fique de olho no
                      seu email!
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          reason: "",
                          message: "",
                        });
                      }}
                    >
                      Enviar Nova Mensagem
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            Nome *
                          </label>
                          <Input
                            name="name"
                            placeholder="Seu nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            Email *
                          </label>
                          <Input
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            Telefone
                          </label>
                          <Input
                            name="phone"
                            placeholder="(11) 99999-9999"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            Empresa
                          </label>
                          <Input
                            name="company"
                            placeholder="Nome da empresa"
                            value={formData.company}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Assunto *
                        </label>
                        <Select
                          value={formData.reason}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, reason: value }))
                          }
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o assunto" />
                          </SelectTrigger>
                          <SelectContent>
                            {contactReasons.map((reason) => (
                              <SelectItem key={reason.value} value={reason.value}>
                                {reason.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          Mensagem *
                        </label>
                        <Textarea
                          name="message"
                          placeholder="Descreva como podemos ajudar..."
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {erro && (
                        <p className="text-sm text-destructive text-center">{erro}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Enviar Mensagem
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        Ao enviar, você concorda com nossa{" "}
                        <Link href="/privacidade" className="underline">
                          Política de Privacidade
                        </Link>
                        .
                      </p>
                    </form>
                  </>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Contato Rápido</h3>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {info.title}
                          </p>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-medium">{info.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Horário de Atendimento</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Segunda a Sexta</span>
                      <span className="font-medium">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábado</span>
                      <span className="font-medium">09:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domingo</span>
                      <span className="font-medium">Fechado</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Suporte por WhatsApp em todos os planos, dentro deste
                    horário. Não há atendimento 24/7 em nenhum plano.
                  </p>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6">
                  <h3 className="font-semibold mb-2">Tempo de Resposta</h3>
                  <p className="text-sm text-muted-foreground">
                    Nossa equipe responde em até <strong>4 horas úteis</strong> para
                    assuntos comerciais. No suporte técnico o prazo é o do seu
                    plano: <strong>24-48h</strong> no Starter,{" "}
                    <strong>8h úteis</strong> no Professional e{" "}
                    <strong>2h úteis</strong> no Enterprise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Contato por Departamento
              </h2>
              <p className="text-lg text-muted-foreground">
                Entre em contato diretamente com a área desejada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <dept.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{dept.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {dept.description}
                  </p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Muitas dúvidas podem ser respondidas rapidamente em nossa central de
              ajuda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/precos">Ver FAQ de Preços</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/features">Ver Funcionalidades</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
