import NavBar from "~/component/NavBar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dev Tinder" },
    { name: "description", content: "Welcome to Dev Tinder" },
  ];
}

export default function Home() {
  return (
    <>
      <NavBar/>

      <h1>Hello</h1>
    </>
  );
}
