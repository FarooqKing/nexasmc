import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StaticPageContent } from '@/components/StaticPageContent';
import { getInsightFile, insightSlugs } from '@/lib/content';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const insightMeta: Record<string, { title: string; description: string }> = {
  'nexasmc-erp-data-consulting': {
    title: 'nexaSMC Expands ERP & Data Consulting Capabilities',
    description: 'Company updates, project milestones and ERP and data consulting capability highlights from nexaSMC.'
  },
  'building-better-erp-reporting': {
    title: 'Building Better ERP Reporting with Power BI',
    description: 'Practical ways to turn ERP data into useful management reporting with Power BI.'
  },
  'oracle-netsuite-implementation-readiness': {
    title: 'Oracle NetSuite Implementation Readiness',
    description: 'Key areas to review before starting an Oracle NetSuite implementation.'
  },
  'client-success-delivery-highlights': {
    title: 'Client Success and Delivery Highlights',
    description: 'Implementation wins and delivery highlights from nexaSMC.'
  }
};

export function generateStaticParams() {
  return insightSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return insightMeta[slug] ?? { title: 'Insight' };
}

export default async function InsightDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fileName = getInsightFile(slug);

  if (!fileName) {
    notFound();
  }

  return <StaticPageContent fileName={fileName as string} />;
}
