import type { Metadata } from 'next';
import { StaticPageContent } from '@/components/StaticPageContent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the nexaSMC website and contact form.'
};

export default function PrivacyPolicyPage() {
  return <StaticPageContent fileName="privacy-policy.html" />;
}
