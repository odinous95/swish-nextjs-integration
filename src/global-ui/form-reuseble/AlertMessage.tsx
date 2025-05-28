import React from "react";
import { CheckoutState } from "@/features/checkout/types";
import { FaExclamationCircle } from "react-icons/fa";

export type AlertMessageProps = {
    state: CheckoutState | null;
};
export function AlertMessage({ state }: AlertMessageProps) {
    if (state?.success === undefined) return null;
    const containerClasses = state.success
        ? "bg-gray-100 text-green-900 dark:bg-gray-100 dark:text-green-900"
        : "bg-gray-100 text-red-600 dark:bg-gray-100 dark:text-red-600";
    const iconClasses = state.success
        ? "text-green-900 dark:text-green-900"
        : "text-red-600 dark:text-red-600";
    return (
        <div
            className={`mt-4 flex items-center space-x-2 rounded-md p-3 text-sm ${containerClasses}`}
            aria-live="polite"
            aria-atomic="true"
        >
            <FaExclamationCircle className={`h-5 w-5 ${iconClasses}`} />
            <span>{state.message}</span>
        </div>
    );
};


