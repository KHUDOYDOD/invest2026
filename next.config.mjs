import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["pg"],
  },
  webpack: (config, { isServer }) => {
    // Явно указываем пути для резолва модулей
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
      }
    }
    return config
  },
  images: {
    unoptimized: true,
  },
  // Отключаем статическую генерацию для API routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig