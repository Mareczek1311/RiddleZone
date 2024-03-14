"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./context/authContext";

const inter = Inter({ subsets: ["latin"] });

/*
export const metadata: Metadata = {
  title: "RIDDLEZONE",
};
*/ ///WHYYYY


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContextProvider >
        <body className={inter.className}>{children}</body>
      </AuthContextProvider>
    </html>
  );
}
