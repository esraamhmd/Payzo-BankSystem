/** @type {import('next').NextConfig} */
const nextConfig = {

  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', '@mui/x-charts'],
  },
};

module.exports = nextConfig;