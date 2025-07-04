import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-2 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text text-transparent font-heading text-xl font-bold whitespace-nowrap"
    >
      <div className="w-9 h-10 relative">
        <Image
          alt="logo"
          src="https://i.ibb.co/DfCT3Gpw/90-E498-E9-6163-43-B3-BECD-A0-F043500-C87-cleanup-removebg-preview.png"
          width={36}
          height={36}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <span>HEALTHY EATING</span>
    </Link>
  );
}
