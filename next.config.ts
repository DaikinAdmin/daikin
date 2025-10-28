import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/libquery_engine-*'],
  },
};

export default withNextIntl(nextConfig);
