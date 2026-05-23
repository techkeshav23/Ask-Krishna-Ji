/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // PayU webhook routes need raw body access for signature verification.
  // Disable Next's automatic body parsing on those API routes.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
};

module.exports = nextConfig;
