"use client";

import React from "react";
import { CartModal, ExtrasModal, Footer, Navbar } from "@/global-ui";
import { useCartStore } from "@/store";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const {
        isCartOpen,
        isExtrasOpen,
        cartItems,
        setIsCartOpen,
        setIsExtrasOpen,
        setPendingCartItem,
        removeFromCart,
        adjustQuantity,
        handleAddExtras,
        getTotalPrice,
    } = useCartStore();

    return (
        <>
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                getTotalPrice={getTotalPrice}
                adjustQuantity={adjustQuantity}
            />
            <ExtrasModal
                isOpen={isExtrasOpen}
                onClose={() => {
                    setIsExtrasOpen(false);
                    setPendingCartItem(null);
                }}
                onAddToCart={handleAddExtras}
            />
            <Navbar />
            <main className="pt-[130px]">{children}</main> {/* 👈 ADDED this */}
            <Footer />
        </>
    );
}
