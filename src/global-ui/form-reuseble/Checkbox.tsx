export function Checkbox({
    id,
    label,
    name,
    checked,
    onChangeHandler, // This will now be our custom handler
}: {
    id: string;
    label: React.ReactNode;
    name: string;
    checked: boolean;
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void; // Update the type
}) {
    return (
        <div className="flex items-center space-x-2">
            <input
                checked={checked}
                type="checkbox"
                id={id}
                name={name}
                className="h-5 w-5 text-primary border-gray-300 rounded-md focus:ring-primary cursor-pointer"
                onChange={onChangeHandler}
            />
            <label htmlFor={id} className="text-body text-primary">
                {label}
            </label>
        </div>
    );
}