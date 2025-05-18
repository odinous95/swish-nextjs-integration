import Image from "next/image";
import Link from "next/link";

export function Logo() {
    return (
        <Link href="/">
            <div className="w-20 h-8 relative cursor-pointer">
                <Image
                    alt="logo"
                    src="https://i.ibb.co/h1Mskmyq/HElogo-removebg-preview.png"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="32px"
                />
            </div>
        </Link>
    );
}
