import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

};
module.exports = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'static.wikia.nocookie.net'], // Add this line
  },
};
export default nextConfig;
