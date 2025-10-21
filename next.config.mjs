
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tcgdex.net',
        port: '',
        pathname: '/**',  // allow all paths under this domain
      },
    ], // 👈 Allow this image domain
  },



};

export default nextConfig;