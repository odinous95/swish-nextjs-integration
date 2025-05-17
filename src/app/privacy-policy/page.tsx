"use client"
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { useCart } from "@/hooks/useCart";
import React from "react";

export default function PrivacyPolicyPage() {
    const {
        setIsCartOpen,
        getTotalCartItems,
    } = useCart();
    return (
        <PrivacyPolicy
            cartItemCount={getTotalCartItems()}
            onCartClick={() => setIsCartOpen(true)}
        />
    )
}

