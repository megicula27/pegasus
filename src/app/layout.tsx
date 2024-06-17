import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/lib/authProvider";
import SignOutOnUnload from "@/utils/SignOutOnUnload";
import CheckSessionOnLoad from "@/utils/CheckSessionOnLoad";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pegasus",
  description: "Tournament app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CheckSessionOnLoad />
          <SignOutOnUnload />
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
