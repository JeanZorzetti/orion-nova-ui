/**
 * Script de auditoria Lighthouse
 * Executa análise de performance, acessibilidade, SEO e best practices
 */

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs para auditar
const urls = [
  "http://localhost:3000/",
  "http://localhost:3000/produto",
  "http://localhost:3000/sobre",
  "http://localhost:3000/features",
  "http://localhost:3000/solucoes",
];

// Configuração do Lighthouse
const lighthouseConfig = {
  extends: "lighthouse:default",
  settings: {
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "desktop",
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
      cpuSlowdownMultiplier: 1,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

// Thresholds mínimos para passar na auditoria
const thresholds = {
  performance: 80,
  accessibility: 90,
  "best-practices": 90,
  seo: 90,
};

async function runAudit(url, chrome) {
  console.log(`\n🔍 Auditando: ${url}`);

  const runnerResult = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
  }, lighthouseConfig);

  if (!runnerResult || !runnerResult.lhr) {
    throw new Error(`Falha ao auditar ${url}`);
  }

  const { lhr } = runnerResult;
  const categories = lhr.categories;

  // Resultados
  const results = {
    url,
    timestamp: new Date().toISOString(),
    scores: {},
    metrics: {},
    passed: true,
  };

  // Processar categorias
  console.log("\n📊 Resultados:");
  for (const [key, category] of Object.entries(categories)) {
    const score = Math.round(category.score * 100);
    results.scores[key] = score;

    const threshold = thresholds[key];
    const status = score >= threshold ? "✅" : "❌";
    const color = score >= threshold ? "\x1b[32m" : "\x1b[31m";
    const reset = "\x1b[0m";

    console.log(`  ${status} ${category.title}: ${color}${score}${reset}/100 (mínimo: ${threshold})`);

    if (score < threshold) {
      results.passed = false;
    }
  }

  // Métricas Core Web Vitals
  const audits = lhr.audits;
  results.metrics = {
    fcp: audits["first-contentful-paint"]?.numericValue,
    lcp: audits["largest-contentful-paint"]?.numericValue,
    cls: audits["cumulative-layout-shift"]?.numericValue,
    tbt: audits["total-blocking-time"]?.numericValue,
    si: audits["speed-index"]?.numericValue,
    tti: audits["interactive"]?.numericValue,
  };

  console.log("\n⚡ Core Web Vitals:");
  console.log(`  FCP: ${Math.round(results.metrics.fcp)}ms`);
  console.log(`  LCP: ${Math.round(results.metrics.lcp)}ms`);
  console.log(`  CLS: ${results.metrics.cls?.toFixed(3)}`);
  console.log(`  TBT: ${Math.round(results.metrics.tbt)}ms`);

  return results;
}

async function main() {
  console.log("🚀 Iniciando auditorias Lighthouse...\n");

  // Criar diretório de relatórios
  const reportsDir = path.join(__dirname, "..", "lighthouse-reports");
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Iniciar Chrome
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const allResults = [];
  let allPassed = true;

  try {
    // Executar auditorias
    for (const url of urls) {
      const results = await runAudit(url, chrome);
      allResults.push(results);

      if (!results.passed) {
        allPassed = false;
      }
    }

    // Salvar relatório consolidado
    const reportPath = path.join(
      reportsDir,
      `audit-${new Date().toISOString().replace(/:/g, "-")}.json`
    );

    const report = {
      timestamp: new Date().toISOString(),
      passed: allPassed,
      results: allResults,
      summary: {
        total: urls.length,
        passed: allResults.filter((r) => r.passed).length,
        failed: allResults.filter((r) => !r.passed).length,
      },
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Relatório salvo em: ${reportPath}`);

    // Resumo final
    console.log("\n" + "=".repeat(60));
    console.log(`\n📈 Resumo: ${report.summary.passed}/${report.summary.total} páginas passaram`);

    if (allPassed) {
      console.log("\n✅ Todas as auditorias passaram!");
      process.exit(0);
    } else {
      console.log("\n❌ Algumas auditorias falharam");
      process.exit(1);
    }
  } finally {
    await chrome.kill();
  }
}

main().catch((error) => {
  console.error("❌ Erro ao executar auditorias:", error);
  process.exit(1);
});
