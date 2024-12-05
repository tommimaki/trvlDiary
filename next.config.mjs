/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // whitelisting Cloudinary's domain
  },
};
export default nextConfig;
