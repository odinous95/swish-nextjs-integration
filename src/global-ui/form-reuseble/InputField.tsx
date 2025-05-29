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
    type?: string;
    label: string;
    defaultValue?: string;
    disabled?: boolean;
    hasToggle?: boolean;
    onToggle?: () => void;
    showToggleState?: boolean;
}) {
    return (
        <div className="w-full relative my-4">
            <input
                id={id}
                type={hasToggle && !showToggleState ? "password" : type}
                name={name}
                disabled={disabled}
                defaultValue={defaultValue}
                className="peer relative z-1 w-full pt-4 pb-2 pl-4 font-light bg-transparent border border-gray-300 dark:border-gray-600 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed text-black 
            focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <label
                className="absolute text-sm text-gray-500 duration-150 transform -translate-y-6 top-6 left-2 z-9 origin-[0] 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 
            peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-orange-500"
                htmlFor={id}
            >
                {label}
            </label>
            {hasToggle && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute inset-y-0 right-4 flex items-center text-primary"
                >
                    {showToggleState ? <FiEyeOff size={24} /> : <FiEye size={24} />}
                </button>
            )}
        </div>
    )
}