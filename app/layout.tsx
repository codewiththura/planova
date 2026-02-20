import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Sidebar } from "./components/Sidebar";
import { MobileNav } from "./components/MobileNav";
import { TopNavbar } from "./components/TopNavbar";
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
          <Theme appearance="inherit">
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col md:ml-56 min-h-screen">
                <TopNavbar />
                <main className="flex-1 w-full pt-6 pb-24 md:pt-6 md:pb-10">
                  {children}
                </main>
                <MobileNav />
              </div>
            </div>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
