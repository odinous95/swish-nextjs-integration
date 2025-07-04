// app/stripe-success/page.tsx
import { redirect } from "next/navigation";
import { stripe } from "@/services/stripe";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import Stripe from "stripe";
import { StripePaymentSuccess } from "@/features/checkout/ui";

export default async function StripeSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { session_id } = await searchParams;

    if (!session_id) {
        redirect("/");
    }

    let session: Stripe.Checkout.Session | null = null;

    try {
        session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["payment_intent"],
        });
    } catch (error) {
        console.error("Stripe session fetch error:", error);
        redirect("/");
    }

    const paymentIntent = session?.payment_intent as Stripe.PaymentIntent;
    const paymentIntentId = paymentIntent?.id || "N/A";
    const email = session?.customer_email || "N/A";
    const amountTotal = session?.amount_total ?? 0;
    const paymentStatus = session?.payment_status || "unknown";

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
            <section className="w-full max-w-xl border-4 border-green-500 rounded-xl p-8 shadow-lg text-center">
                <FaCheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />

                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                    Tack för din betalning!
                </h1>

                <StripePaymentSuccess payment_status={paymentStatus} />

                <div className="mt-6 space-y-2 text-base text-gray-800">
                    <p>
                        <span className="font-semibold">Betalningsreferens:</span>{" "}
                        {paymentIntentId}
                    </p>
                    <p>
                        <span className="font-semibold">E-post:</span> {email}
                    </p>
                    <p>
                        <span className="font-semibold">Totalt belopp:</span>{" "}
                        {amountTotal / 100} kr
                    </p>
                </div>

                <p className="mt-6 text-gray-600">
                    Du kommer att få en bekräftelse via e-post inom kort. Tack för att du handlar hos oss!
                </p>

                <Link
                    href="/"
                    className="inline-block mt-8 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    Till startsidan
                </Link>
            </section>
        </main>
    );
}
