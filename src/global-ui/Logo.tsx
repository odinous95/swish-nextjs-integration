import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      {/* 
        Lägg till Tailwind-klasser för att förflytta loggan uppåt och åt vänster:
        - translate-y-1 (motsvarar -0.25rem = -4px)
        - -translate-x-1 (motsvarar -0.25rem = -4px)
      */}
      <div className="w-9 h-10 relative cursor-pointer -translate-y-1 -translate-x-1">
        <Image
          alt="logo"
          src="https://i.ibb.co/DfCT3Gpw/90-E498-E9-6163-43-B3-BECD-A0-F043500-C87-cleanup-removebg-preview.png"
          width={64}
          height={64}
          style={{ objectFit: "contain" }}
        />
      </div>
    </Link>
  );
}
