/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3q0odwafjkyv1.cloudfront.net", // ✅ Add your API's image domain
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // ✅ Allow Placeholder Images
      },
    ],
  },
  env: {
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_ID: process.env.WHATSAPP_PHONE_ID,
  },
};

module.exports = nextConfig;
