import { ApiReference } from "@scalar/nextjs-api-reference";
import { openApiSpec } from "@/lib/openapi";

const config = {
  spec: {
    content: openApiSpec,
  },
  theme: "purple",
  layout: "modern",
  showSidebar: true,
  darkMode: true,
};

export const GET = ApiReference(config);
