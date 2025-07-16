
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
     // Allow data URIs
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
        {
          protocol: 'https',
          hostname: 'placehold.co',
        },
    ],
    // Add support for data URLs
    domains: ['storage.googleapis.com'], // In case you use cloud storage
    // For local development with data URLs, you might not need config, but for production:
    // This is tricky; Next.js doesn't have a direct config for data: URIs in remotePatterns.
    // The following is a common workaround if you face issues, but often it works out of the box.
    // However, since we are using `next/image` with `src` as a data URI, this might not be needed.
    // Let's add the protocol to be safe.
    dangerouslyAllowSVG: true, // This is for SVGs, but sometimes helps with other data URIs.
    // No specific domain for data URIs, but let's ensure remote patterns are correct.
  },
};

export default nextConfig;
