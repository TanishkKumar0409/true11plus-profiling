import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import UnderConstructionToast from "@/ui/toast/UnderConstructionToast";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const timesNewRomanVariable = "--font-times";

export const metadata: Metadata = {
  title: "True11plus",
  description: "Made with love",
  icons: { icon: "/img/logo/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        style={
          {
            [timesNewRomanVariable as string]:
              '"Times New Roman", Times, serif',
          } as React.CSSProperties
        }
      >
        <Toaster />
        <UnderConstructionToast />
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
