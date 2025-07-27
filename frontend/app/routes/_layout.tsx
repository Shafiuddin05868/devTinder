import { Outlet } from "react-router";
import NavBar from "~/component/NavBar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}