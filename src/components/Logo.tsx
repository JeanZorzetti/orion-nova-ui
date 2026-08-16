/**
 * Logo Orion — a ampulheta de Órion montada em lajes, gerada por fórmula, nada
 * posicionado à mão.
 *
 * A silhueta é o asterismo real: Betelgeuse, Bellatrix, Mintaka, Rigel, Saiph e
 * Alnitak nas coordenadas celestes J2000, projetadas em gnomônica. As lajes são os
 * 7 módulos do dashboard, cada uma com altura proporcional ao tamanho real do
 * módulo em linhas de código — a constelação e o sistema na mesma silhueta.
 *
 * Receita de regeração (viewBox 0 0 48.6 100):
 *   1. gnomônica centrada no centroide dos 6 astros; x negado (a AR cresce para
 *      leste, que aparece à esquerda numa carta celeste)
 *   2. gira por atan2(dx, dy) do eixo do corpo (meio dos ombros -> meio dos pés)
 *      para o corpo ficar de pé; normaliza a bbox para y 0..100
 *   3. altura da laje i = (100 - 6*1.8) * loc_i / loc_total; recorta o hexágono
 *      contra a faixa [y, y+h] (Sutherland-Hodgman, 2 semiplanos)
 *   4. ordem: ranking por loc alternando topo/base, então a menor laje cai no
 *      cinturão. Sem isso a menor cai numa borda inclinada e vira lasca.
 *
 * loc por módulo: configuracoes 2154, vendas 1695, relatorios 1355, produtos 1063,
 * clientes 964, financeiro 709, suporte 413.
 * Recontar: find src/app/dashboard/<mod> \( -name '*.tsx' -o -name '*.ts' \) -exec cat {} + | wc -l
 *
 * As frestas fecham abaixo de 24px: /favicon.svg usa a silhueta cheia, com cor fixa.
 */
const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <svg viewBox="0 0 48.6 100" fill="currentColor" className={className} role="img" aria-label="Orion ERP">
    <path d="M3.21 0L45.39 12.38L40.98 23L8.5 23Z" />
    <path d="M40.23 24.8L34.23 39.27L12.24 39.27L8.91 24.8Z" />
    <path d="M33.49 41.07L30.1 49.22L30.91 51.37L15.02 51.37L12.65 41.07Z" />
    <path d="M31.59 53.17L33.25 57.58L16 57.58L16.28 56.84L15.43 53.17Z" />
    <path d="M33.93 59.38L36.78 66.95L12.47 66.95L15.32 59.38Z" />
    <path d="M37.46 68.75L41.74 80.1L7.51 80.1L11.79 68.75Z" />
    <path d="M42.41 81.9L48.6 98.31L0 100L6.83 81.9Z" />
  </svg>
);

export default Logo;
