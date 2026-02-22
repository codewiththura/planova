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
      <body className="bg-background min-h-screen text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Added scaling="95%" to slightly reduce typography and sizing */}
          <Theme
            appearance="inherit"
            accentColor="violet"
            hasBackground={false}
            scaling="90%"
          >
            {children}
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}