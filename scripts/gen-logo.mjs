// Gera a logo do Orion ERP: a constelação de Órion desenhada a partir de dois
// dados reais — as coordenadas celestes (RA/Dec, J2000) das 7 estrelas principais,
// projetadas em gnomônica, e o tamanho real de cada módulo do dashboard em linhas
// de código, que vira o raio da estrela correspondente.
//
// Regerar:  node scripts/gen-logo.mjs
// Recontar LOC:  find src/app/dashboard/<mod> \( -name '*.tsx' -o -name '*.ts' \) -exec cat {} + | wc -l
//
// Saídas: src/components/Logo.tsx, public/favicon.svg, public/apple-touch-icon.svg

import { writeFileSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// --- dado 1: catálogo estelar (RA em horas, Dec em graus, J2000) ---------------
// star: nome, RA, Dec, módulo do ERP que ela representa
const STARS = [
  { star: 'Betelgeuse', ra: 5.919529, dec: 7.407064, mod: 'clientes' },
  { star: 'Bellatrix', ra: 5.418850, dec: 6.349703, mod: 'relatorios' },
  { star: 'Alnitak', ra: 5.679313, dec: -1.942574, mod: 'produtos' },
  { star: 'Alnilam', ra: 5.603559, dec: -1.201919, mod: 'vendas' },
  { star: 'Mintaka', ra: 5.533445, dec: -0.299095, mod: 'financeiro' },
  { star: 'Saiph', ra: 5.795942, dec: -9.669605, mod: 'suporte' },
  { star: 'Rigel', ra: 5.242298, dec: -8.201638, mod: 'configuracoes' },
]

// asterismo clássico: ombros, cinturão, pernas, pés
const LINES = [
  ['Betelgeuse', 'Bellatrix'],
  ['Betelgeuse', 'Alnitak'],
  ['Bellatrix', 'Mintaka'],
  ['Alnitak', 'Alnilam'],
  ['Alnilam', 'Mintaka'],
  ['Alnitak', 'Saiph'],
  ['Mintaka', 'Rigel'],
  ['Saiph', 'Rigel'],
]

// --- dado 2: peso real de cada módulo no código -------------------------------
function loc(dir) {
  let total = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) total += loc(p)
    else if (/\.tsx?$/.test(entry.name)) total += readFileSync(p, 'utf8').split('\n').length
  }
  return total
}

const weights = Object.fromEntries(
  STARS.map(({ mod }) => [mod, loc(join(root, 'src/app/dashboard', mod))])
)

// --- projeção gnomônica centrada no centroide da constelação -------------------
const rad = (d) => (d * Math.PI) / 180
const ra0 = rad((STARS.reduce((s, x) => s + x.ra, 0) / STARS.length) * 15)
const dec0 = rad(STARS.reduce((s, x) => s + x.dec, 0) / STARS.length)

const projected = STARS.map((s) => {
  const ra = rad(s.ra * 15)
  const dec = rad(s.dec)
  const c =
    Math.sin(dec0) * Math.sin(dec) +
    Math.cos(dec0) * Math.cos(dec) * Math.cos(ra - ra0)
  return {
    ...s,
    // x negado: no céu a AR cresce para leste, que aparece à esquerda
    x: -(Math.cos(dec) * Math.sin(ra - ra0)) / c,
    y: -(Math.cos(dec0) * Math.sin(dec) - Math.sin(dec0) * Math.cos(dec) * Math.cos(ra - ra0)) / c,
  }
})

// encaixa no viewBox preservando o aspecto real da constelação
function fit(size, pad) {
  const xs = projected.map((p) => p.x)
  const ys = projected.map((p) => p.y)
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)]
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)]
  const k = Math.min((size - 2 * pad) / (x1 - x0), (size - 2 * pad) / (y1 - y0))
  const ox = (size - (x1 - x0) * k) / 2
  const oy = (size - (y1 - y0) * k) / 2
  const maxLoc = Math.max(...Object.values(weights))
  return projected.map((p) => ({
    ...p,
    loc: weights[p.mod],
    cx: +((p.x - x0) * k + ox).toFixed(2),
    cy: +((p.y - y0) * k + oy).toFixed(2),
    // área ∝ tamanho do módulo, então raio ∝ sqrt(loc). O teto é ditado pelo
    // cinturão: as 3 estrelas ficam a ~3.9 unidades uma da outra em 64, e se o
    // raio passar disso elas fundem num borrão só.
    r: +(size * (0.012 + 0.016 * Math.sqrt(weights[p.mod] / maxLoc))).toFixed(2),
  }))
}

const seg = (pts) =>
  LINES.map(([a, b]) => {
    const p = pts.find((s) => s.star === a)
    const q = pts.find((s) => s.star === b)
    return `M${p.cx} ${p.cy}L${q.cx} ${q.cy}`
  }).join('')

// --- marca principal: React, cor herdada do container -------------------------
const M = fit(64, 7)
const recipe = STARS.map((s) => `${s.star} = ${s.mod} (${weights[s.mod]} loc)`).join(', ')

writeFileSync(
  join(root, 'src/components/Logo.tsx'),
  `// Gerada por scripts/gen-logo.mjs — não editar as coordenadas à mão.
// Constelação de Órion nas coordenadas celestes reais (J2000, projeção gnomônica).
// Cada estrela é um módulo do dashboard e o raio dela vem das linhas de código do módulo:
// ${recipe}.
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
        d="${seg(M)}"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
${M.map(
  (s) =>
    `      {/* ${s.star} — ${s.mod} */}\n` +
    `      <circle cx="${s.cx}" cy="${s.cy}" r="${(s.r * 2.4).toFixed(2)}" fill="currentColor" opacity="0.16" />\n` +
    `      <circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="currentColor" />`
).join('\n')}
    </svg>
  )
}
`
)

// --- ícone: só o cinturão ------------------------------------------------------
// A constelação inteira é estreita e alta demais para um quadrado, e as linhas
// somem abaixo de 24px. O ícone fica com as 3 estrelas do cinturão — o pedaço mais
// reconhecível de Órion — na inclinação real, preenchendo a diagonal do quadrado.
const BELT = ['Alnitak', 'Alnilam', 'Mintaka']
const belt = projected.filter((p) => BELT.includes(p.star))
const bx = belt.map((p) => p.x)
const by = belt.map((p) => p.y)
const [bx0, bx1] = [Math.min(...bx), Math.max(...bx)]
const [by0, by1] = [Math.min(...by), Math.max(...by)]
const maxLoc = Math.max(...belt.map((p) => weights[p.mod]))
const kb = (32 - 2 * 7) / (bx1 - bx0)
const oy = (32 - (by1 - by0) * kb) / 2
const dots = belt
  .map((p) => {
    const cx = ((p.x - bx0) * kb + 7).toFixed(2)
    const cy = ((p.y - by0) * kb + oy).toFixed(2)
    const r = (4.2 + 1.6 * Math.sqrt(weights[p.mod] / maxLoc)).toFixed(2)
    return `  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#o)"/><!-- ${p.star} = ${p.mod} -->`
  })
  .join('\n')

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="o" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="#0a0a0f"/>
${dots}
</svg>
`

writeFileSync(join(root, 'public/favicon.svg'), icon)
writeFileSync(
  join(root, 'public/apple-touch-icon.svg'),
  icon.replace('viewBox="0 0 32 32" width="32" height="32"', 'viewBox="0 0 32 32" width="180" height="180"')
)

// --- checagem: a projeção tem que devolver Órion, não um borrão ---------------
import assert from 'node:assert'
const s = (n) => M.find((p) => p.star === n)
// orientação de carta celeste: Betelgeuse no ombro esquerdo, Rigel no pé direito
assert(s('Betelgeuse').cx < s('Bellatrix').cx && s('Betelgeuse').cy < s('Alnitak').cy, 'orientação invertida')
assert(s('Rigel').cx > s('Saiph').cx && s('Rigel').cy > s('Mintaka').cy, 'orientação invertida')
// as 3 estrelas do cinturão precisam continuar sendo 3 pontos distintos
for (const [a, b] of [['Alnitak', 'Alnilam'], ['Alnilam', 'Mintaka']]) {
  const d = Math.hypot(s(a).cx - s(b).cx, s(a).cy - s(b).cy)
  assert(d > s(a).r + s(b).r, `${a} e ${b} se fundem: raio grande demais`)
}

console.log('modulos:', weights)
console.log('ok: src/components/Logo.tsx, public/favicon.svg, public/apple-touch-icon.svg')
