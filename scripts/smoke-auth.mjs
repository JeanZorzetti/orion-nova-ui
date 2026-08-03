// Smoke test dos guardas de rota, sem cookie nenhum.
//
// Pega a classe de bug que tsc e vitest não pegam: middleware e server components
// discordando sobre "está logado", que vira ERR_TOO_MANY_REDIRECTS em produção.
//
// Uso: node scripts/smoke-auth.mjs [base-url]

const base = (process.argv[2] || "https://orion.roilabs.com.br").replace(/\/$/, "");

// Anônimo: rota protegida manda pro login, e o login RENDERIZA (não redireciona).
const expected = [
  { path: "/login", status: 200 },
  { path: "/cadastro", status: 200 },
  { path: "/precos", status: 200 },
  { path: "/dashboard", status: 307, location: "/login" },
  { path: "/perfil", status: 307, location: "/login" },
  { path: "/assinaturas", status: 307, location: "/login" },
];

let failed = 0;

for (const { path, status, location } of expected) {
  const res = await fetch(base + path, { redirect: "manual" });
  const loc = res.headers.get("location");
  const okStatus = res.status === status;
  const okLoc = !location || (loc && loc.startsWith(location));

  if (okStatus && okLoc) {
    console.log(`  ok    ${path} -> ${res.status}${loc ? ` ${loc}` : ""}`);
  } else {
    failed++;
    const want = location ? `${status} -> ${location}` : `${status}`;
    console.error(`  FALHA ${path} -> ${res.status}${loc ? ` ${loc}` : ""} (esperado ${want})`);
  }
}

if (failed) {
  console.error(`\n${failed} rota(s) fora do esperado em ${base}`);
  process.exit(1);
}
console.log(`\nGuardas de rota ok em ${base}`);
