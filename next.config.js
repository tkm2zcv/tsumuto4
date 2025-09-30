/** @type {import('next').NextConfig} */
const path = require('path')

const isVercel = Boolean(process.env.VERCEL)

const nextConfig = {
  reactStrictMode: true,

  // 複数のlockfileの警告を解決（Vercelではプロジェクトルートを使用）
  outputFileTracingRoot: isVercel
    ? __dirname
    : path.join(__dirname, '../../../'),

  // PWA用のヘッダー設定
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },

  // 画像最適化の設定
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // パフォーマンス最適化
  poweredByHeader: false,
}

module.exports = nextConfig