"use client";

export function Loader() {
    return (
        <div className="flex justify-center items-center">
            <div className="rounded-full bg-orange-200 w-6 h-6 relative flex justify-center items-center animate-spin">
                <svg
                    className="absolute top-0 left-0 text-orange-500"
                    width={25}
                    height={25}
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M16 3C8.8203 3 3 8.8203 3 16C3 23.1797 8.8203 29 16 29C23.1797 29 29 23.1797 29 16H26C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 10.4772 10.4772 6 16 6V3Z"
                        fill="currentColor"
                    />
                </svg>
            </div>
        </div>
    );
}
