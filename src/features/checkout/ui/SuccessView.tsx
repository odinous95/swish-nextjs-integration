// components/checkout/SuccessView.tsx
export function SuccessView() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="text-green-500 text-2xl">✓</div>
                </div>
                <h2 className="text-2xl font-bold text-green-600">Tack för din beställning!</h2>
            </div>
        </div>
    );
}
