/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/components': `${__dirname}/components`,
      '@/utils': `${__dirname}/utils`,
      '@/lib': `${__dirname}/lib`,
      '@/types': `${__dirname}/types`,
    };
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx'];
    config.resolve.modules = ['node_modules', __dirname];
    config.resolve.mainFields = ['browser', 'main', 'module'];
    config.resolve.symlinks = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: false,
      fs: false,
    };
    return config;
  },
  experimental: {
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    SKIP_DB_INIT: process.env.NODE_ENV === 'production' ? 'true' : 'false'
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 