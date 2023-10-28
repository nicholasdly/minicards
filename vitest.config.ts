import { join } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: "https://url.com",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "secret_key",
      CLERK_SECRET_KEY: "secret_key",
      UPSTASH_REDIS_REST_URL: "https://url.com",
      UPSTASH_REDIS_REST_TOKEN: "secret_token",
    }
  },
  resolve: {
    alias: {
      "~/": join(__dirname, "./src/"),
    },
  },
});