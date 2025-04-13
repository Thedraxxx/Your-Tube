"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authcontext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [error, setError] = useState("");

  const router = useRouter();
  const { setIsAuthenticated } = useAuth(); // ✅ from context

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/api/v2/users/login", {
        method: "POST",
        body: formData,
        credentials: "include",  // This ensures cookies are sent with requests
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login success", data);
          alert("successfully logeed in")
          setIsAuthenticated(true); 
        // After successful login, redirect to the desired page
        router.push("/");

      } else {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = "Something went wrong!";
        }
        setError(errorMessage);
        console.log(errorMessage);
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.log("Error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-md space-y-4 shadow-lg"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl text-center font-bold">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
          className="w-full px-4 py-2 bg-zinc-800 rounded outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="w-full px-4 py-2 bg-zinc-800 rounded outline-none"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          Sign In
        </button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
