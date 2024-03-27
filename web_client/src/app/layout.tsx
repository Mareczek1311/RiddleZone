"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./context/authContext";
import { SocketContextProvider } from "./context/socketContext";
import { UserNameContextProvider } from "./context/userNameContext";
import { RoomContextProvider } from "./context/roomContext";

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
      <SocketContextProvider>
        <RoomContextProvider>
          <UserNameContextProvider>
            <AuthContextProvider>
              <body className={inter.className}>{children}</body>
            </AuthContextProvider>
          </UserNameContextProvider>
        </RoomContextProvider>
      </SocketContextProvider>
    </html>
  );
}
