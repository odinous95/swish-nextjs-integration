import { Loader } from "..";


export function SubmitButton({
    title,
    disabled,
    icon,
    onClick,
    pending,
}: {
    title: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    pending?: boolean;
}) {
    return (
        <button
            type="submit"
            className={`w-full p-2 text-white rounded-lg transition duration-300 ${pending
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-400"
                }`}
            onClick={onClick}
        >
            {pending ? <Loader /> : title}
        </button>
    )
}