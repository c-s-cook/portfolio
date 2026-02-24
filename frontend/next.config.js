/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cscook-portfolio.s3.us-east-2.amazonaws.com',
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
