"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>

      <Image
        src="/404.svg"
        alt="404"
        width={300}
        height={180}
        className="mx-auto rounded-none object-cover"
      />

      <h1 className="text-errorText font-extrabold text-8xl">404</h1>
      <p className="text-primary text-2xl font-semibold pt-4">
        Tyvärr kunde vi inte hitta sidan du letade efter.
      </p>

      <button
        onClick={() => router.back()}
        className="btn btn-md mt-6 text-lg font-medium uppercase"
      >
        Gå tillbaka till föregående sida
      </button>
    </div>
  );
}
