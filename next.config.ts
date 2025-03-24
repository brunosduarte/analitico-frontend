import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Adicione domínios de imagens se necessário
  },
  // Configuração para proxy de API para evitar CORS durante o desenvolvimento
  async rewrites() {
    // Only add the rewrite if the API URL is defined
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
      console.warn('Warning: NEXT_PUBLIC_API_URL is not defined. API rewrites will not be configured.');
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;