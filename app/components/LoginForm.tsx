"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { loginUser } from "../queries/loginUser";
import { useAuth } from "@/contexts/AuthContext";

interface loginType {
  userPassword: string;
  userName: string;
  setUserPassword: (arg: string) => void;
  setUserName: (arg: string) => void;
}

export const LoginForm = ({
  userPassword,
  userName,
  setUserPassword,
  setUserName,
}: loginType) => {
  const { refreshUser } = useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await loginUser(userName, userPassword);
      await refreshUser();
      setUserName("");
      setUserPassword("");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 px-5 pt-5 h-90">
      <h1>Login user</h1>
      <form onSubmit={handleSubmit}>
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
          className="bg-blue-500 hover:bg-blue-600 text-white p-5 cursor-pointer"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};
