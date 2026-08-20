/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
   devIndicators: false,
  compress: true,
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/faq.html', destination: '/faq', permanent: true },
      { source: '/privacy-policy.html', destination: '/privacy-policy', permanent: true },
      { source: '/insights.html', destination: '/insights', permanent: true },
      { source: '/insight-nexasmc-erp-data-consulting.html', destination: '/insights/nexasmc-erp-data-consulting', permanent: true },
      { source: '/insight-building-better-erp-reporting.html', destination: '/insights/building-better-erp-reporting', permanent: true },
      { source: '/insight-oracle-netsuite-implementation-readiness.html', destination: '/insights/oracle-netsuite-implementation-readiness', permanent: true },
      { source: '/insight-client-success-delivery-highlights.html', destination: '/insights/client-success-delivery-highlights', permanent: true }
    ];
  }
};

export default nextConfig;
