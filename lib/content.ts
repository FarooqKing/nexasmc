import fs from 'node:fs';
import path from 'node:path';

const contentDirectory = path.join(process.cwd(), 'content');

const insightFileBySlug: Record<string, string> = {
  'nexasmc-erp-data-consulting': 'insight-nexasmc-erp-data-consulting.html',
  'building-better-erp-reporting': 'insight-building-better-erp-reporting.html',
  'oracle-netsuite-implementation-readiness': 'insight-oracle-netsuite-implementation-readiness.html',
  'client-success-delivery-highlights': 'insight-client-success-delivery-highlights.html'
};

export const insightSlugs = Object.keys(insightFileBySlug);

function rewriteLegacyLinks(html: string): string {
  return html
    .replaceAll('src="assets/', 'src="/assets/')
    .replaceAll("src='assets/", "src='/assets/")
    .replaceAll('href="assets/', 'href="/assets/')
    .replaceAll("href='assets/", "href='/assets/")
    .replaceAll('src="uploads/', 'src="/uploads/')
    .replaceAll("src='uploads/", "src='/uploads/")
    .replaceAll('href="index.html#', 'href="/#')
    .replaceAll("href='index.html#", "href='/#")
    .replaceAll('href="index.html"', 'href="/"')
    .replaceAll("href='index.html'", "href='/'")
    .replaceAll('href="faq.html"', 'href="/faq"')
    .replaceAll("href='faq.html'", "href='/faq'")
    .replaceAll('href="privacy-policy.html"', 'href="/privacy-policy"')
    .replaceAll("href='privacy-policy.html'", "href='/privacy-policy'")
    .replaceAll('href="insights.html#', 'href="/insights#')
    .replaceAll("href='insights.html#", "href='/insights#")
    .replaceAll('href="insights.html"', 'href="/insights"')
    .replaceAll("href='insights.html'", "href='/insights'")
    .replaceAll('href="insight-nexasmc-erp-data-consulting.html"', 'href="/insights/nexasmc-erp-data-consulting"')
    .replaceAll('href="insight-building-better-erp-reporting.html"', 'href="/insights/building-better-erp-reporting"')
    .replaceAll('href="insight-oracle-netsuite-implementation-readiness.html"', 'href="/insights/oracle-netsuite-implementation-readiness"')
    .replaceAll('href="insight-client-success-delivery-highlights.html"', 'href="/insights/client-success-delivery-highlights"')
    .replaceAll('action="/api/contact"', 'action="/api/contact"');
}

function readLegacyFile(fileName: string): string {
  const fullPath = path.join(contentDirectory, fileName);
  return fs.readFileSync(fullPath, 'utf8');
}

export function getMainHtml(fileName: string): string {
  const raw = readLegacyFile(fileName);
  const match = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

  if (!match) {
    throw new Error(`Unable to find <main> content in ${fileName}.`);
  }

  return rewriteLegacyLinks(match[1]);
}

export function getInsightFile(slug: string): string | null {
  return insightFileBySlug[slug] ?? null;
}
