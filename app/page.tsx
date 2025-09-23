"use client";
import { RegisterForm } from "./components/RegisterForm";
import { LoginForm } from "./components/LoginForm";
import { CreateBoardButton } from "./components/CreateBoardButton";
import { useState } from "react";
import { loginUser } from "./queries/loginUser";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Home() {
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loginResponse, setLoginResponse] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const data = await loginUser(userName, userPassword);
      setLoginResponse(data);
      setUserName("");
      setUserPassword("");
      console.log("DATA from API:", data);
      if (data.message.includes("Login successful")) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed to query API.");
    }
  };
  console.log("isLoggedIn", isLoggedIn);
  console.log("loginResponse", loginResponse);
  return (
    <div className="h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="flex h-screen justify-center items-center">
        <AuthProvider>
          <RegisterForm />
          <LoginForm
            handleSubmit={handleSubmit}
            setUserPassword={setUserPassword}
            setUserName={setUserName}
            userPassword={userPassword}
            userName={userName}
          />
          <CreateBoardButton />
        </AuthProvider>
      </div>
    </div>
  );
}
