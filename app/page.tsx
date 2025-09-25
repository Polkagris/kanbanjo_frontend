"use client";
import { RegisterForm } from "./components/RegisterForm";
import { LoginForm } from "./components/LoginForm";
import { CreateBoardButton } from "./components/CreateBoardButton";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LogoutButton } from "./components/LogoutButton";

export default function Home() {
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <div className="h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="flex h-screen justify-center items-center">
        <AuthProvider>
          <div>
            <div className="flex flex-row">
              <RegisterForm />
              <LoginForm
                setUserPassword={setUserPassword}
                setUserName={setUserName}
                userPassword={userPassword}
                userName={userName}
              />
            </div>
            <div className="flex mt-4">
              <div className="mr-2">
                <CreateBoardButton />
              </div>
              <div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </AuthProvider>
      </div>
    </div>
  );
}
