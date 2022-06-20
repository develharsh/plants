// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

// module.exports = nextConfig
module.exports = {
  env: {
    baseUrl: "http://localhost:3000",
    MONGODB_URL: "mongodb://localhost:27017/plants",
    ACCESS_TOKEN_SECRET: "nnninjcdgdfg hatg1oadis",
    ACCESS_TOKEN_EXPIRE: "5d",
    DO_SPACES_URL: "fra1.digitaloceanspaces.com",
    DO_SPACES_BUCKET: "media-harsh",
    SPACES_ACCESS_KEY_ID: "F6XFC7WPCJEHM7ZN33LG",
    SPACES_SECRET_ACCESS_KEY: "Q9W+WscTTDkaWuHRY25JLzzqm6VmsxloIcNWzloK8SA",
  },
  images: {
    domains: ["media-harsh.fra1.digitaloceanspaces.com"],
  },
};
