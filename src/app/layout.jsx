import "./globals.css";
import { Providers } from "./providers";
import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/ui/Sidebar";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "HighP Platform",
  description: "Premium storefront and operations platform for modern local businesses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-(--surface-2) pb-20 md:pb-0">
        <Providers>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-x-hidden">
              {children}
            </div>
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
