
"use client"
import CartModal from "@/components/CartModal";
import ExtrasModal from "@/components/ExtrasModal";
import Checkout from "@/components/pages/Checkout";
import { useCart } from "@/hooks/useCart";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";

export default function CheckoutPage() {
    const {
        cartItems,
        isCartOpen,
        isExtrasOpen,
        setIsCartOpen,
        setIsExtrasOpen,
        setPendingCartItem,
        getTotalCartItems,
        getTotalPrice,
        removeFromCart,
        adjustQuantity,
        handleAddExtras,
    } = useCart();

    const {
        checkoutForm,
        inputRefs,
        handleInputChange,
        handleInputFocus,
        handleInputBlur,
        handleCheckoutSubmit
    } = useCheckoutForm();

    return (
        <>
            <Checkout
                cartItems={cartItems}
                cartItemCount={getTotalCartItems()}
                onCartClick={() => setIsCartOpen(true)}
                form={checkoutForm}
                onSubmit={handleCheckoutSubmit}
                onChange={handleInputChange}
                onInputFocus={handleInputFocus}
                onInputBlur={handleInputBlur}
                inputRefs={inputRefs}
            />
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
        </>

    );
}







