import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ArrowLeft, Boxes, LifeBuoy, Newspaper, Tag } from "lucide-react";

const quickLinks = [
  { label: "Produto", description: "Como o Orion funciona", href: "/produto", icon: Boxes },
  { label: "Preços", description: "Planos e valores", href: "/precos", icon: Tag },
  { label: "Blog", description: "Conteúdo e novidades", href: "/blog", icon: Newspaper },
  { label: "Central de Ajuda", description: "Tire suas dúvidas", href: "/ajuda", icon: LifeBuoy },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="relative grid-bg">
        {/* ponytail: orbs decorativos, mesmo padrão da HeroSection */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="orb orb-cyan h-72 w-72 -top-20 -left-20" />
          <div className="orb orb-purple h-96 w-96 -bottom-32 -right-24" />
        </div>

        <div className="relative mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
          <p className="mb-4 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium tracking-widest text-primary uppercase">
            Erro 404
          </p>

          <h1 className="gradient-text text-7xl font-bold leading-none sm:text-9xl">404</h1>

          <h2 className="mt-6 text-2xl font-semibold text-balance sm:text-3xl">
            Essa página saiu de órbita
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground text-balance">
            O endereço que você acessou não existe, mudou de lugar ou foi removido.
            Que tal seguir por um destes caminhos?
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para a home
            </Link>
            <Link href="/contato" className="btn-ghost inline-flex items-center justify-center">
              Falar com a gente
            </Link>
          </div>

          <div className="mt-16 grid w-full gap-4 sm:grid-cols-2">
            {quickLinks.map(({ label, description, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="glass-card hover-glow flex items-center gap-4 p-5 text-left"
              >
                <span className="gradient-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="block text-sm text-muted-foreground">{description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
