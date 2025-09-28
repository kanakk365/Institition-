import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import LayoutWrapper from "@/components/LayoutWrapper"; // Import client wrapper
import { Toaster } from "@/components/ui/toaster";
import { LogoProvider } from "@/lib/LogoContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Poppins } from "next/font/google";
import Script from "next/script"; // ✅ Added

const poppins = Poppins({ 
  weight: ["300", "400", "500", "600", "700", "800"], 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "self learn Ai",
  description: "A comprehensive platform for studying and exam preparation",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Custom Logo Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        
        {/* Google Fonts - Poppins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* ✅ Google Identity Services Script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body className={poppins.className}>
        <AuthProvider>
          <LogoProvider>
            <SidebarProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
              <Toaster />
            </SidebarProvider>
          </LogoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
