"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = async(e) => {
    e.preventDefault();
    try {
        const response = await fetch("http://localhost:8000/api/v2/users/login",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email,password}),
        });
        const data = response.json();

        if(response.ok){
            console.log("login sccuss",data);
        }
        else{
            console.log("login failed",data.message)
        }
    } catch (err) {
        console.log('Wrror',err)
    }
    console.log("logging in :", email, password);
    router.push("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        action=""
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-4 shadow-lg"
      >
        <h1 className="text-2xl text-center font-bold">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 bg-zinc-800 rounded outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-zinc-800 rounded outline-none"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          Sign In
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/register")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
