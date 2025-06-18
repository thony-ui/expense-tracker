"use client";

import type React from "react";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface DashBoardAndTransactionLayoutProps {
  children: React.ReactNode;
}

export function DashBoardAndTransactionLayout({
  children,
}: DashBoardAndTransactionLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="lg:pl-64 h-full">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
