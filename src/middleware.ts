import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const type = response.headers.get("content-type") || "";
  if (type.includes("text/html")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, s-maxage=30, stale-while-revalidate=3600"
    );
  }
  return response;
});
