import { ApiReference } from "@scalar/nextjs-api-reference";
import { openApiSpec } from "@/lib/openapi";

export const metadata = {
  title: "API Documentation - Orion ERP",
  description: "Documentação completa da API REST do Orion ERP",
};

export default function ApiDocsPage() {
  return (
    <ApiReference
      configuration={{
        spec: {
          content: openApiSpec,
        },
        theme: "purple",
        layout: "modern",
        showSidebar: true,
        darkMode: true,
        customCss: `
          .scalar-app {
            font-family: var(--font-sans);
          }
        `,
      }}
    />
  );
}
