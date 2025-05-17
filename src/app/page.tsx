"use client"
import HomePage from "@/components/layout/HomePage";
import { useCart } from '../hooks/useCart';
import CartModal from "@/components/CartModal";
import ExtrasModal from "@/components/ExtrasModal";

export default function Home() {

  const {
    cartItems,
    isCartOpen,
    isExtrasOpen,
    pendingCartItem,
    buttonStates,
    quantities,
    showQuantity,
    setIsCartOpen,
    setIsExtrasOpen,
    setPendingCartItem,
    getTotalCartItems,
    getTotalPrice,
    removeFromCart,
    adjustQuantity,
    handleAddExtras,
    handleButtonClick
  } = useCart();


  return (
    <>
      <HomePage
        cartItemCount={getTotalCartItems()}
        onCartClick={() => setIsCartOpen(true)}
        showQuantity={showQuantity}
        quantities={quantities}
        buttonStates={buttonStates}
        handleButtonClick={handleButtonClick}
        adjustQuantity={adjustQuantity}
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
