import React from "react";
import { apiUrl } from "~/utils/api";

const login = () => {
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    fetch(apiUrl("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    //create a login page with email and password

    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl border-2">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input required className="border ml-2 my-2 rounded-lg px-3 py-1" placeholder="Enter you email" type="email" id="email" name="email" /> <br />
          <label htmlFor="password">Password:</label>
          <input required className="border ml-2 my-2 rounded-lg px-3 py-1" placeholder="Enter you password" type="password" id="password" name="password" /> <br />
          <button className="py-2 px-3 border rounded-lg " type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default login;
