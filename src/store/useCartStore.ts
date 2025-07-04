import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Extra } from "../types";

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isExtrasOpen: boolean;
  pendingCartItem: CartItem | null;
  buttonStates: { [key: string]: boolean };
  quantities: { [key: string]: number };
  showQuantity: { [key: string]: boolean };
  resetCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsExtrasOpen: (open: boolean) => void;
  setPendingCartItem: (item: CartItem | null) => void;
  getTotalCartItems: () => number;
  getTotalPrice: () => number;
  removeFromCart: (itemId: string) => void;
  adjustQuantity: (buttonId: string, delta: number) => void;
  handleAddExtras: (extras: Extra[]) => void;
  handleButtonClick: (
    buttonId: string,
    itemName: string,
    price: number,
    isExtra?: boolean
  ) => void;
  addToCartDirect: (
    buttonId: string,
    itemName: string,
    price: number
  ) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      isExtrasOpen: false,
      pendingCartItem: null,
      buttonStates: {},
      quantities: {},
      showQuantity: {},

      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setIsExtrasOpen: (open) => set({ isExtrasOpen: open }),
      setPendingCartItem: (item) => set({ pendingCartItem: item }),

      getTotalCartItems: () =>
        get().cartItems.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        })),

      adjustQuantity: (buttonId, delta) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) => {
            if (item.id === buttonId) {
              const newQuantity = Math.max(1, item.quantity + delta);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }),
          quantities: {
            ...state.quantities,
            [buttonId]: Math.max(1, (state.quantities[buttonId] || 1) + delta),
          },
        }));
      },

      // Ändrad: slå ihop extras med samma id/name
      handleAddExtras: (extras) => {
        set((state) => {
          const newCartItems: CartItem[] = [...state.cartItems];

          extras.forEach((extra) => {
            const idx = newCartItems.findIndex(
              (item) => item.id === extra.id && item.name === extra.name
            );
            if (idx !== -1) {
              // finns redan, öka bara quantity
              newCartItems[idx].quantity += extra.quantity;
            } else {
              // nytt extra
              newCartItems.push({
                id: extra.id,
                name: extra.name,
                price: extra.price,
                quantity: extra.quantity,
                isExtra: true,
              });
            }
          });

          return { cartItems: newCartItems };
        });
      },

      // Direkt-lägg-till utan popup
      addToCartDirect: (buttonId, itemName, price) => {
        set((state) => {
          const newItem: CartItem = {
            id: buttonId,
            name: itemName,
            price,
            quantity: 1,
          };
          const existingIndex = state.cartItems.findIndex(
            (item) => item.id === buttonId && item.name === itemName
          );
          if (existingIndex >= 0) {
            const updated = state.cartItems.map((item, idx) =>
              idx === existingIndex
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            return { cartItems: updated };
          } else {
            return { cartItems: [...state.cartItems, newItem] };
          }
        });
      },

      handleButtonClick: (buttonId, itemName, price, isExtra = false) => {
        const quantity = get().quantities[buttonId] || 1;

        if (buttonId.startsWith("sauce_")) {
          const sauceName =
            buttonId === "sauce_sriracha" ? "Sriracha" : "Vitlök";

          set((state) => {
            const lastMealIndex = [...state.cartItems]
              .map((item, index) => ({ item, index }))
              .reverse()
              .find(({ item }) => !item.isExtra)?.index;

            if (lastMealIndex !== undefined) {
              const updatedMeal = {
                ...state.cartItems[lastMealIndex],
                name: `${state.cartItems[lastMealIndex].name} (${sauceName})`,
              };

              const existingComboIndex = state.cartItems.findIndex(
                (item, index) =>
                  index !== lastMealIndex &&
                  item.id === updatedMeal.id &&
                  item.name === updatedMeal.name
              );

              let newCartItems;
              if (existingComboIndex >= 0) {
                newCartItems = state.cartItems
                  .filter((_, index) => index !== lastMealIndex)
                  .map((item, index) =>
                    index === existingComboIndex
                      ? {
                          ...item,
                          quantity: item.quantity + updatedMeal.quantity,
                        }
                      : item
                  );
              } else {
                newCartItems = state.cartItems.map((item, index) =>
                  index === lastMealIndex ? updatedMeal : item
                );
              }

              return { cartItems: newCartItems };
            }

            return {};
          });

          return;
        }

        const newItem: CartItem = {
          id: buttonId,
          name: itemName,
          price,
          quantity,
          isExtra,
        };

        set((state) => {
          const existingItemIndex = state.cartItems.findIndex(
            (item) => item.id === buttonId && item.name === itemName
          );

          const baseState = {
            buttonStates: { ...state.buttonStates, [buttonId]: true },
            showQuantity: { ...state.showQuantity, [buttonId]: false },
            quantities: { ...state.quantities, [buttonId]: 1 },
            isExtrasOpen: !isExtra && buttonId !== "business-50",
          };

          if (existingItemIndex >= 0) {
            const updatedItems = state.cartItems.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            return { cartItems: updatedItems, ...baseState };
          }

          return { cartItems: [...state.cartItems, newItem], ...baseState };
        });

        setTimeout(() => {
          set((state) => ({
            buttonStates: { ...state.buttonStates, [buttonId]: false },
          }));
        }, 150);
      },

      resetCart: () => {
        set({
          cartItems: [],
          buttonStates: {},
          quantities: {},
          showQuantity: {},
          isCartOpen: false,
          isCheckoutOpen: false,
          isExtrasOpen: false,
          pendingCartItem: null,
        });
      },
    }),
    {
      name: "cart-storage",
      storage:
        typeof window !== "undefined"
          ? {
              getItem: (name) => {
                const item = sessionStorage.getItem(name);
                return item ? JSON.parse(item) : null;
              },
              setItem: (name, value) => {
                sessionStorage.setItem(name, JSON.stringify(value));
              },
              removeItem: (name) => {
                sessionStorage.removeItem(name);
              },
            }
          : undefined,
    }
  )
);
