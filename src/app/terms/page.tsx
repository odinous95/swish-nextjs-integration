"use client"
import { useCart } from "@/hooks/useCart";
import React from "react";
import TermsComponent from "@/components/Terms";

export default function TermsPage() {
    const {
        setIsCartOpen,
        getTotalCartItems,
    } = useCart();
    return (
        <TermsComponent
            cartItemCount={getTotalCartItems()}
            onCartClick={() => setIsCartOpen(true)}
        />
    )
}




