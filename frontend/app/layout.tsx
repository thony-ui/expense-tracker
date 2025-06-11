import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/query-client-provider";
import ClientWrapper from "./providers/client-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker Dashboard",
  description: "Track and manage your expenses efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
