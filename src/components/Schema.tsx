import Script from "next/script";
import { siteConfig } from "@/config/site";

export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        "name": siteConfig.name,
        "jobTitle": "Musician, Writer, and Researcher",
        "url": siteConfig.url,
        "sameAs": Object.values(siteConfig.links)
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        "url": siteConfig.url,
        "name": `${siteConfig.name} Portfolio`,
        "publisher": {
          "@id": `${siteConfig.url}/#person`
        }
      }
    ]
  };

  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
