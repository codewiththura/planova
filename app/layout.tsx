import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Planova",
  description: "Planova App",
};

import { Navbar } from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
