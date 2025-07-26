import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dev Tinder" },
    { name: "description", content: "Welcome to Dev Tinder" },
  ];
}

export default function Home() {
  return <>
    <h1>Hello</h1>
  </>;
}
