import type { Metadata } from 'next';
import { StaticPageContent } from '@/components/StaticPageContent';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Clear answers to common questions about ERP implementation, data migration, analytics, training and ongoing support.'
};

export default function FaqPage() {
  return <StaticPageContent fileName="faq.html" />;
}
