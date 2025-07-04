// src/global-ui/form-reuseble/SubmitButton.tsx
import React from "react";
import { Loader } from "..";

export function SubmitButton({
  title,
  icon,
  onClick,
  disabled,
  pending,
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  pending?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={pending || disabled}
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className={`
        inline-flex items-center justify-center
        px-6 py-2 text-black font-bold rounded-lg transition duration-300 whitespace-nowrap
        ${
          pending
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-500 to-yellow-300 hover:opacity-90"
        }
        ${className}
      `}
    >
      {pending ? (
        <Loader />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </>
      )}
    </button>
  );
}
