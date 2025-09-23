"use client";

import { useState } from "react";
import { registerNewUser } from "../queries/registerNewUser";

export const RegisterForm = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userFromResponse, setUserFromResponse] = useState({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await registerNewUser(userName, userPassword, userEmail);
      setUserFromResponse(data);
      setUserEmail("");
      setUserName("");
      setUserPassword("");
    } catch {
      throw new Error("Registering new user failed to query API.");
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 px-5 pt-5 h-auto">
      <h1>Register new user</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col px-5 pt-5">
          <p>Email</p>
          <input
            className="border bg-white p-1"
            type="text"
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="email"
            value={userEmail}
          />
        </div>

        <div className="flex flex-col px-5 pt-5">
          <p>Username</p>
          <input
            className="border bg-white p-1"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
            placeholder="user name"
            value={userName}
          />
        </div>
        <div className="flex flex-col p-5">
          <p>Password</p>
          <input
            className="border bg-white p-1"
            type="text"
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="password"
            value={userPassword}
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white p-5 cursor-pointer"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};
