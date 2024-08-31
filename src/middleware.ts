export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"],
  // matcher: ["/((?!register|api|login).*)"],
};