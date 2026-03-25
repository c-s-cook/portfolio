/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_IMG_BUCKET_CDN,
        port: '',
        pathname: '/**',
      },
    ],
  },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
}

module.exports = nextConfig
