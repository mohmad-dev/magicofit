import { defineMiddlewares } from "@medusajs/framework/http";

export default defineMiddlewares({
  routes: [
    {
      // Bypass publishable key requirement for public contact form
      matcher: "/store/contact-messages",
      middlewares: [],
    },
  ],
});
