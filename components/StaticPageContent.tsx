import { getMainHtml } from '@/lib/content';

/**
 * Renders the preserved nexaSMC v7.2.1 public-page markup inside a real Next.js route.
 * Local anchors are handled by SiteRuntime through the Next.js App Router, so page
 * navigation stays client-side without a browser hard refresh.
 */
export function StaticPageContent({ fileName }: { fileName: string }) {
  const html = getMainHtml(fileName);
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
