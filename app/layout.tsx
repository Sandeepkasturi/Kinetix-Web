import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/ui/SplashScreen";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Kinetix | Convert Website to Native Mobile App",
  description: "Transform any website into a high-performance native Android & iOS application instantly. No coding needed. Deep linking, push notifications, and app store ready.",
  keywords: ["website to app", "web to android", "web to ios", "native app builder", "TWA", "Kinetix"],
  authors: [{ name: "SKAV TECH", url: "https://skavtechs.vercel.app" }],
  creator: "Sandeep Kasturi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kinetixapp.com",
    title: "Kinetix — Web to Native App Engine",
    description: "Turn any website into a native mobile app with deep linking, push notifications, and full app store compliance.",
    siteName: "Kinetix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinetix — Web to Native App",
    description: "Transform websites into native apps instantly.",
    creator: "@skavtechs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
