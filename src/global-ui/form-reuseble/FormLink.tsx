import Link from "next/link";

// FormLink Component
export function FormLink({
    href,
    text,
    className = '',
}: {
    href: string;
    text: string;
    className?: string;
}) {
    return (
        <span className={`flex justify-center text-bodyMobile lg:text-body mt-2 ${className}`}>
            <Link href={href} className="text-linkColor hover:underline">
                {text}
            </Link>
        </span>
    )
}