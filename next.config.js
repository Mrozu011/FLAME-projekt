const nextConfig = {
  // Remove output: "export" for Vercel deployment
  images: {
    unoptimized: false, // Enable image optimization for Vercel
    domains: ['cdn.jsdelivr.net', 'fonts.googleapis.com'], // Add external domains
  },
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@next/font', 'remixicon'],
  },
  // Configure webpack for better bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
