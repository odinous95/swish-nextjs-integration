import React from 'react'

interface Props {
    className?: string;
}


export function Container({ children, className }: React.PropsWithChildren<Props>) {
    return (
        <div className={`px-2 w-full max-w-7xl mx-auto ${className ? className : ""}`}>{children}</div>
    )
}
