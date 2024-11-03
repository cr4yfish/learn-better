import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/system";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

import PushNotification from "@/components/utils/PushNotification";

const montserrat = Montserrat({
  subsets: ["latin"],
})

const APP_NAME = "Learn Better";
const APP_DEFAULT_TITLE = "Learn Better";
const APP_TITLE_TEMPLATE = "%s - Learn Better";
const APP_DESCRIPTION = "Learn with AI!";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" className=" min-h-screen max-h-screen w-screen overflow-x-hidden dark">
        <body
          className={`${montserrat.className} antialiased h-full min-h-screen flex justify-between flex-col overflow-y-hidden dark:bg-primary/5`}
        >
          <NextUIProvider className="relative h-screen w-full overflow-y-hidden overflow-x-hidden flex justify-between flex-col antialiased">
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <NextTopLoader color="#E879F9" showSpinner={false} />
                  {children}
                  <Toaster />
                  <svg viewBox="0 0 200 200" className=" fill-fuchsia-400/30 absolute top-[75vh] scale-[300%] blur-3xl opacity-50 dark:opacity-15 -z-10" xmlns="http://www.w3.org/2000/svg">
                      <path fill="blue" opacity={.25} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(150 0)" />
                      <path fill="inherit" opacity={1} d="M33.5,-24.5C44.3,-13.3,54.3,0.7,55.7,19.8C57,39,49.6,63.3,33.3,72.2C17.1,81.2,-7.9,74.8,-24.4,62.4C-40.9,49.9,-48.9,31.5,-54.9,10.9C-61,-9.7,-65.1,-32.5,-55.6,-43.4C-46.1,-54.3,-23.1,-53.4,-5.8,-48.8C11.4,-44.1,22.8,-35.7,33.5,-24.5Z" transform="translate(100 100)" />
                  </svg>
                <PushNotification />
              </ThemeProvider>
            </NextUIProvider>
        </body>
    </html>
  );
}
