import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

// Initialize Plus Jakarta Sans
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShiftServe Platform",
  description: "Connect with reliable household help",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the new font to the body */}
      <body className={jakarta.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}