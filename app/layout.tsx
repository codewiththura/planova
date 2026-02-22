import type { Metadata } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Planova",
  description: "Planova App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Theme appearance="inherit" accentColor="violet">
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
