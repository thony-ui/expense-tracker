"use client";

import { UserProvider } from "@/components/contexts/user-context";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
