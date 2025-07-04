"use client";
import { useState, useRef, useEffect } from "react";
import { CheckoutForm } from "../types";

export const useCheckoutForm = () => {
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    comment: "",
    doorCode: "",
    floor: "",
    termsAccepted: false,
  });

  interface InputRefs {
    [key: string]: React.RefObject<
      HTMLInputElement | HTMLTextAreaElement | null
    >;
  }
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const inputRefs: InputRefs = {
    firstName: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    lastName: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    address: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    postalCode: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    city: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    phone: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    email: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    comment: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    doorCode: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
    floor: useRef<HTMLInputElement | HTMLTextAreaElement>(null),
  };

  useEffect(() => {
    if (focusedInput && inputRefs[focusedInput]?.current) {
      inputRefs[focusedInput].current?.focus();
    }
  }, [checkoutForm, focusedInput]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckoutForm((prev) => ({
      ...prev,
      termsAccepted: e.target.checked,
    }));
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setFocusedInput(null);
    }, 100);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Checkout form submitted:", checkoutForm);
  };

  return {
    checkoutForm,
    inputRefs,
    handleInputChange,
    handleTermsChange,
    handleInputFocus,
    handleInputBlur,
    handleCheckoutSubmit,
  };
};
