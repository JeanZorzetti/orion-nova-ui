import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "../JsonLd";

describe("JsonLd", () => {
  it("should render script tag with JSON-LD type", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Test Company",
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script).toBeInTheDocument();
  });

  it("should serialize data as JSON", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Test Article",
      author: {
        "@type": "Person",
        name: "John Doe",
      },
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.textContent).toBe(JSON.stringify(data));
  });

  it("should handle nested objects", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://example.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://example.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.textContent).toBe(JSON.stringify(data));
  });

  it("should handle arrays in data", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Test Company",
      sameAs: [
        "https://facebook.com/test",
        "https://twitter.com/test",
        "https://linkedin.com/test",
      ],
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.textContent).toBe(JSON.stringify(data));
    expect(script?.textContent).toContain("facebook.com/test");
    expect(script?.textContent).toContain("twitter.com/test");
    expect(script?.textContent).toContain("linkedin.com/test");
  });

  it("should handle empty object", () => {
    const data = {};

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.textContent).toBe("{}");
  });

  it("should handle complex schema types", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Test Article",
      datePublished: "2024-01-15",
      dateModified: "2024-01-16",
      author: {
        "@type": "Person",
        name: "John Doe",
      },
      publisher: {
        "@type": "Organization",
        name: "Test Publisher",
        logo: {
          "@type": "ImageObject",
          url: "https://example.com/logo.png",
        },
      },
      image: "https://example.com/image.png",
      articleBody: "This is a test article body.",
    };

    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.textContent).toBe(JSON.stringify(data));
    const parsed = JSON.parse(script?.textContent || "{}");
    expect(parsed["@type"]).toBe("Article");
    expect(parsed.author.name).toBe("John Doe");
    expect(parsed.publisher.name).toBe("Test Publisher");
  });

  it("should render script tag with correct type attribute", () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Test Company",
    };

    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toHaveAttribute("type", "application/ld+json");
  });

  it("should allow multiple JsonLd components", () => {
    const data1 = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Company 1",
    };

    const data2 = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://example.com",
    };

    const { container } = render(
      <>
        <JsonLd data={data1} />
        <JsonLd data={data2} />
      </>
    );

    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);
    expect(scripts[0].textContent).toBe(JSON.stringify(data1));
    expect(scripts[1].textContent).toBe(JSON.stringify(data2));
  });
});
