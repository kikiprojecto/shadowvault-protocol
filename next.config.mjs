/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      crypto: false,
      stream: false,
      buffer: false,
      process: false,
      path: false,
      fs: false
    };

    config.plugins = config.plugins || [];

    return config;
  }
};

export default nextConfig;
