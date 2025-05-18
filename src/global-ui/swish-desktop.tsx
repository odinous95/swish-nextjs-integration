// "use client";

// import React, { useState, useEffect } from "react";
// import { QRCode } from "qrcode.react";

// interface SwishPaymentResponse {
//     id: string;
//     url: string;
//     status: string;
// }

// export default function SwishPayment() {
//     const [step, setStep] = useState<"idle" | "creating" | "waiting" | "paid" | "error">("idle");
//     const [paymentId, setPaymentId] = useState<string | null>(null);
//     const [error, setError] = useState<string | null>(null);

//     // Poll for payment status
//     useEffect(() => {
//         if (step !== "waiting" || !paymentId) return;

//         const interval = setInterval(async () => {
//             try {
//                 const res = await fetch(`/api/swish/status?id=${paymentId}`);
//                 const json = await res.json();
//                 if (json.status === "PAID") {
//                     clearInterval(interval);
//                     setStep("paid");
//                 }
//             } catch (err) {
//                 console.error("Polling error", err);
//             }
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [step, paymentId]);

//     const startPayment = async () => {
//         setStep("creating");
//         setError(null);

//         try {
//             const res = await fetch("/api/swish/paymentrequests", {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     payerAlias: "0739871260",
//                     amount: "100.00",
//                     message: "T-shirt Order",
//                 }),
//             });

//             const data: SwishPaymentResponse = await res.json();

//             if (!res.ok) {
//                 throw new Error(data?.status || "Swish request failed");
//             }

//             setPaymentId(data.id);
//             setStep("waiting");
//         } catch (err: any) {
//             console.error(err);
//             setError(err.message || "Unknown error");
//             setStep("error");
//         }
//     };

//     return (
//         <div className="max-w-md mx-auto p-4 text-center bg-white rounded-xl shadow-lg">
//             <h1 className="text-2xl font-bold mb-4">Pay with Swish</h1>

//             {step === "idle" && (
//                 <button
//                     onClick={startPayment}
//                     className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                     Start Swish Payment
//                 </button>
//             )}

//             {step === "creating" && <p>Creating payment request...</p>}

//             {step === "waiting" && paymentId && (
//                 <>
//                     <QRCode value={`swish://paymentrequest?token=${paymentId}`} size={256} />
//                     <p className="mt-4">Scan the QR code or <a href={`swish://paymentrequest?token=${paymentId}`} className="text-blue-600 underline">open in Swish</a>.</p>
//                     <p className="text-gray-500 mt-2">Waiting for payment confirmation...</p>
//                 </>
//             )}

//             {step === "paid" && (
//                 <div className="text-green-700 font-bold mt-4">
//                     ✅ Payment received!
//                 </div>
//             )}

//             {step === "error" && (
//                 <div className="text-red-600 mt-4">
//                     ❌ {error}
//                 </div>
//             )}
//         </div>
//     );
// }
