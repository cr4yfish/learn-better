import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/system";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" className=" min-h-screen max-h-screen dark">
        <body
          className={`${montserrat.className} dark antialiased h-full min-h-screen flex justify-between flex-col overflow-y-hidden`}
        >
          <NextUIProvider className="h-full max-h-screen overflow-y-hidden flex justify-between flex-col antialiased dark">
              {children}
              
            </NextUIProvider>
        </body>
    </html>
  );
}
