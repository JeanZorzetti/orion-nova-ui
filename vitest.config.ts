import { defineConfig } from "vitest/config";
import path from "path";

// ponytail: sem @vitejs/plugin-react — ele só serve para Fast Refresh, que teste não usa.
// O esbuild do vitest transforma JSX sozinho lendo "jsx": "react-jsx" do tsconfig.
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // e2e/ é do Playwright — sem isto o vitest tenta rodar os specs e quebra.
    exclude: ["node_modules", "dist", ".next", "e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData/*",
        "**/.next/*",
        "**/dist/*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
