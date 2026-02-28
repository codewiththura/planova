import type { Metadata, Viewport } from "next";
import "@radix-ui/themes/styles.css";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "./components/Toaster";

export const metadata: Metadata = {
  title: "Planova",
  description: 'A productivity app to manage your plans and actions.',
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Planova",
    // Startup images help iOS render the correct splash screen
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  // Ensure iOS does not cache the page in a way that loses auth state
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
            <Toaster />
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}