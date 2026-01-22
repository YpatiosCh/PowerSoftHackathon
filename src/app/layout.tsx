import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/CartContext";

export const metadata: Metadata = {
  title: "FlashBite - Restaurant Flash Sales",
  description: "Reduce food waste with smart flash sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
