export function ErrorText({ error }: { error?: string }) {
    if (!error) return null;
    return <div className="text-red-500 text-sm mt-1">{error}</div>;
}