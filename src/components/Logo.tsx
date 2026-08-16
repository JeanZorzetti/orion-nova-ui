// Gerada por scripts/gen-logo.mjs — não editar as coordenadas à mão.
// Constelação de Órion nas coordenadas celestes reais (J2000, projeção gnomônica).
// Cada estrela é um módulo do dashboard e o raio dela vem das linhas de código do módulo:
// Betelgeuse = clientes (964 loc), Bellatrix = relatorios (1355 loc), Alnitak = produtos (1063 loc), Alnilam = vendas (1695 loc), Mintaka = financeiro (709 loc), Saiph = suporte (413 loc), Rigel = configuracoes (2154 loc).
// Regerar: node scripts/gen-logo.mjs

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Orion ERP"
      {...props}
    >
      <path
        d="M17.23 7L39.1 10.18M17.23 7L27.75 34.37M39.1 10.18L34.1 29.6M27.75 34.37L31.05 32.22M31.05 32.22L34.1 29.6M27.75 34.37L22.7 57M34.1 29.6L46.77 52.73M22.7 57L46.77 52.73"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
      {/* Betelgeuse — clientes */}
      <circle cx="17.23" cy="7" r="3.48" fill="currentColor" opacity="0.16" />
      <circle cx="17.23" cy="7" r="1.45" fill="currentColor" />
      {/* Bellatrix — relatorios */}
      <circle cx="39.1" cy="10.18" r="3.79" fill="currentColor" opacity="0.16" />
      <circle cx="39.1" cy="10.18" r="1.58" fill="currentColor" />
      {/* Alnitak — produtos */}
      <circle cx="27.75" cy="34.37" r="3.58" fill="currentColor" opacity="0.16" />
      <circle cx="27.75" cy="34.37" r="1.49" fill="currentColor" />
      {/* Alnilam — vendas */}
      <circle cx="31.05" cy="32.22" r="4.03" fill="currentColor" opacity="0.16" />
      <circle cx="31.05" cy="32.22" r="1.68" fill="currentColor" />
      {/* Mintaka — financeiro */}
      <circle cx="34.1" cy="29.6" r="3.26" fill="currentColor" opacity="0.16" />
      <circle cx="34.1" cy="29.6" r="1.36" fill="currentColor" />
      {/* Saiph — suporte */}
      <circle cx="22.7" cy="57" r="2.93" fill="currentColor" opacity="0.16" />
      <circle cx="22.7" cy="57" r="1.22" fill="currentColor" />
      {/* Rigel — configuracoes */}
      <circle cx="46.77" cy="52.73" r="4.30" fill="currentColor" opacity="0.16" />
      <circle cx="46.77" cy="52.73" r="1.79" fill="currentColor" />
    </svg>
  )
}
