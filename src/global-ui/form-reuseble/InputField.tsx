import { FiEye, FiEyeOff } from "react-icons/fi";

export function InputField({
  id,
  name,
  type,
  label,
  disabled,
  hasToggle = false,
  onToggle,
  defaultValue,
  showToggleState = false,
}: {
  id: string;
  name: string;
  type: string;
  label: string;
  disabled: boolean;
  hasToggle?: boolean;
  onToggle?: () => void;
  defaultValue?: string;
  showToggleState?: boolean;
}) {
  return (
    <div className="w-full relative my-2">
      {/* Label ovanför inputfältet */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        disabled={disabled}
        defaultValue={defaultValue}
        className="
          mt-1
          peer
          relative
          z-1
          w-full
          py-2       {/* ändrat från pb-2 till py-2 */}
          pl-4
          font-light
          bg-transparent
          border
          border-gray-100
          dark:border-gray-600
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          text-black
          focus:border-orange-500
          focus:ring-1
          focus:ring-orange-200
        "
      />

      {hasToggle && (
        <div
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
          onClick={onToggle}
        >
          {showToggleState ? <FiEyeOff /> : <FiEye />}
        </div>
      )}
    </div>
  );
}
