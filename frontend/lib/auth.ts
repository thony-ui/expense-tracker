"use server";
import { redirect } from "next/navigation";
import axiosInstance from "./axios";
import { createClient } from "./supabase/supabase-server";

export async function signUp(email: string, password: string, name: string) {
  const supabase = await createClient();
  // Find user in demo users
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || "Invalid email or password",
    };
  }

  await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/users`,
    {
      email,
      name,
    },
    {
      headers: {
        Authorization: `Bearer ${data.session?.access_token}`,
      },
    }
  );
  return {
    success: true,
  };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) {
    return {
      success: false,
      error: error?.message || "Invalid email or password",
    };
  }
  return {
    success: true,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/signin");
}
