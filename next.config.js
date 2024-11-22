/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
  },
}

module.exports = nextConfig

