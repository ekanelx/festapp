import type { NextConfig } from "next";

const imageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (supabaseUrl) {
  const parsedUrl = new URL(supabaseUrl);

  imageRemotePatterns.push({
    protocol: parsedUrl.protocol.replace(":", "") as "http" | "https",
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;
