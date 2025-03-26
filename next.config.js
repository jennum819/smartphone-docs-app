/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // ESLintチェックを無効化（ビルド時のみ）
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
