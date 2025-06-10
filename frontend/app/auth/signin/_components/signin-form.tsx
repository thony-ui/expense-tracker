"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { signInAction } from "./actions/sigin-in";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/contexts/user-context";
import axios from "axios";

export function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const res = await signInAction(formData.email, formData.password);

    setIsLoading(false);
  };
  const createUser = async (email: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/users`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4 text-gray-400" />
            ) : (
              <EyeIcon className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="flex justify-center gap-2">
        <span className="text-sm text-gray-600 cursor-pointer" onClick={async() => await createUser("test@gmail.com")}>Don't have an account? </span>
        <p
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
          onClick={() => router.push("/auth/signup")}
        >
          Sign up
        </p>
      </div>
    </form>
  );
}
