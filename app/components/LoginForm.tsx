"use client";

import { FormEventHandler, useEffect, useState } from "react";
import { loginUser } from "../queries/loginUser";
import { useAuth } from "@/contexts/AuthContext";

interface loginType {
  handleSubmit;
  userPassword: string;
  userName;
  setUserPassword;
  setUserName;
}

export const LoginForm = ({
  handleSubmit,
  userPassword,
  userName,
  setUserPassword,
  setUserName,
}: loginType) => {
  /*   const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userFromResponse, setUserFromResponse] = useState({});

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await loginUser(userName, userPassword);
      setUserFromResponse(data);
      setUserName("");
      setUserPassword("");
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed to query API.");
    }
  }; */
  const { isAuthenticated, refreshUser, user, roles, loading } = useAuth();

  console.log("isAuthenticated i CreateButton:", isAuthenticated);
  console.log("user i CreateButton:", user);

  /*   useEffect(() => {
    refreshUser();
  }, []); */
  const refreshUserAfterLogin = async () => {
    await refreshUser();
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
          onClick={() => refreshUserAfterLogin()}
        >
          Login
        </button>
      </form>
    </div>
  );
};
