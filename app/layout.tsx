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
        {/* Restore institution theme ASAP to avoid FOUC */}
        <Script id="restore-institution-theme" strategy="beforeInteractive">
          {`
            try {
              const stored = localStorage.getItem('institution-theme');
              if (stored) {
                const theme = JSON.parse(stored);
                const root = document.documentElement;
                if (theme?.primary) {
                  root.style.setProperty('--primary', theme.primary);
                  // Simple contrast calc
                  const hex = String(theme.primary).replace('#','');
                  const h = hex.length === 3 ? hex.split('').map(c=>c+c).join('') : hex;
                  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
                  const yiq = (r*299 + g*587 + b*114)/1000;
                  root.style.setProperty('--primary-foreground', yiq >= 128 ? '#000000' : '#ffffff');
                }
                if (theme?.secondary) {
                  root.style.setProperty('--secondary', theme.secondary);
                  const hex2 = String(theme.secondary).replace('#','');
                  const h2 = hex2.length === 3 ? hex2.split('').map(c=>c+c).join('') : hex2;
                  const r2 = parseInt(h2.slice(0,2),16), g2 = parseInt(h2.slice(2,4),16), b2 = parseInt(h2.slice(4,6),16);
                  const yiq2 = (r2*299 + g2*587 + b2*114)/1000;
                  root.style.setProperty('--secondary-foreground', yiq2 >= 128 ? '#000000' : '#ffffff');
                }
              }
            } catch {}
          `}
        </Script>
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
