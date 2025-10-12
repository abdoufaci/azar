/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "omrah-gate.b-cdn.net",
          },
        ],
      },
};

export default nextConfig;
