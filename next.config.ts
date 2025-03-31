import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Adicione domínios de imagens se necessário
  },
  // Configuração para proxy de API para evitar CORS durante o desenvolvimento
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
      },
    ]
  },
};

export default nextConfig;
