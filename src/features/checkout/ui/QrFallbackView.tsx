// components/checkout/QrFallbackView.tsx
import Image from "next/image";

export function QrFallbackView({ blobUrl }: { blobUrl: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
            <h1 className="text-xl font-bold mb-4">Skanna QR-koden med Swish</h1>
            <Image src={blobUrl} alt="Swish QR-kod" width={256} height={256} className="w-64 h-64 mb-6" />
            <p className="text-gray-600 text-sm text-center">
                Har du problem? Kopiera länken nedan och öppna i din Swish-app:
            </p>
            <a href={blobUrl} className="text-blue-500 text-sm break-all mt-2">
                {blobUrl}
            </a>
        </div>
    );
}
