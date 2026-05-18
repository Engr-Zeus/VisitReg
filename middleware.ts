export { default } from "next-auth/middleware";

export const config = {
  // Matches any path that starts with /admin (e.g., /admin/requests, /admin/checkout)
  matcher: ["/admin/:path*"],
};