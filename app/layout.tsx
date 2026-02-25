import type { Metadata, Viewport } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Planova",
  description: 'A productivity app to manage your plans and actions.',
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Planova",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
            <div vaul-drawer-wrapper="">
              {children}
            </div>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}