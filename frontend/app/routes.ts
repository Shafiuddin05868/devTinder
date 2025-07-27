import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/home.tsx"),
    { path: "about", file: "routes/about.tsx" },
  ]),
  { path: "login", file: "routes/login.tsx" },
  { path: "register", file: "routes/register.tsx" },
] satisfies RouteConfig;
