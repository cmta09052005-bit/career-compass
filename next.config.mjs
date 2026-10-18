/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async headers() {
    return ["/sw.js", "/offline-worker.js", "/offline-manifest.json"].map(source => ({ source, headers: [{ key: "Cache-Control", value: "no-store" }] }));
  },
};

export default nextConfig;
