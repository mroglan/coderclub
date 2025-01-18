import type { NextConfig } from "next";
const { PyodidePlugin } = require("@pyodide/webpack-plugin")

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.plugins.push(new PyodidePlugin());
    return config;
  }
};

export default nextConfig;
