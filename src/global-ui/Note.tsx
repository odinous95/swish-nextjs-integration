import React, { ReactNode } from "react";

type NoteProps = {
    text: string;
    className?: string;
};

export function Note({ text, className = "" }: NoteProps) {
    return (
        <div className={`flex items-start gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-2 ${className}`}>
            <svg
                className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="12" y1="8" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            <span className="text-sm text-yellow-900">{text}</span>
        </div>
    )
}
