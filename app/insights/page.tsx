import type { Metadata } from 'next';
import { StaticPageContent } from '@/components/StaticPageContent';

export const metadata: Metadata = {
  title: 'News & Insights',
  description: 'Company announcements and practical ERP, analytics and enterprise technology updates from nexaSMC.'
};

export default function InsightsPage() {
  return <StaticPageContent fileName="insights.html" />;
}
