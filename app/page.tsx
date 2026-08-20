import type { Metadata } from 'next';
import { StaticPageContent } from '@/components/StaticPageContent';

export const metadata: Metadata = {
  title: 'ERP & Data Consulting',
  description: 'nexaSMC provides Oracle NetSuite, SAP Business One, Power BI, Oracle NSAW, ERP integration and support services.'
};

export default function HomePage() {
  return <StaticPageContent fileName="index.html" />;
}
