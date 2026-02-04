import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ambalangoda Grocery - Fresh Essentials Delivered",
  description: "Order essential grocery items online in Ambalangoda. Pickup or home delivery within 5km radius.",
  keywords: "grocery, Ambalangoda, Sri Lanka, online shopping, delivery, pickup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pb-20 md:pb-8">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
