import React from 'react';
import Image from 'next/image';

export function BankIDForm() {
    return (
        <div className="text-center space-y-4">
            <Image
                src="/BankID_logo.png"
                alt="BankID Illustration"
                width={200}
                height={200}
                className="w-[200px] h-auto mx-auto"
            />
            <p className="text-primary text-bodyMobile md:text-body">
                Logga in med BankID för snabb åtkomst.
            </p>
        </div>
    );
};

