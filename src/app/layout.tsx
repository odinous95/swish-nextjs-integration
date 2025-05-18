"use client";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/global-ui";
import CartModal from "@/components/CartModal";
import ExtrasModal from "@/components/ExtrasModal";
import { useCartStore } from "@/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Your App Title",
//   description: "Your App Description",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pull modal and cart state from Zustand store
  const {
    isCartOpen,
    isExtrasOpen,
    cartItems,
    pendingCartItem,
    setIsCartOpen,
    setIsExtrasOpen,
    setPendingCartItem,
    removeFromCart,
    adjustQuantity,
    handleAddExtras,
    getTotalPrice,
  } = useCartStore();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Cart Modal */}
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          getTotalPrice={getTotalPrice}
          adjustQuantity={adjustQuantity}
        />

        {/* Extras Modal */}
        <ExtrasModal
          isOpen={isExtrasOpen}
          onClose={() => {
            setIsExtrasOpen(false);
            setPendingCartItem(null);
          }}
          onAddToCart={handleAddExtras}
        />

        {/* Navbar and Content */}
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
