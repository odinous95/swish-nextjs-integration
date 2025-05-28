import { MdArrowDownward } from "react-icons/md";

type Option = {
    value: string | number;
    label: string;
};

type SelectFieldProps = {
    id: string;
    name: string;
    label: string;
    value?: string | number;
    options: Option[];
    disabled?: boolean;
    defaultValue?: string | number;
};

export function SelectField({
    id,
    name,
    label,
    value,
    options,
    disabled,
    defaultValue,
}: SelectFieldProps) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-body text-primary text-gray-500">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    defaultValue={defaultValue}
                    value={value}
                    name={name}
                    disabled={disabled}
                    className="
      w-full border border-inputBorder rounded-md shadow-sm px-3 py-2
      appearance-none pr-10 cursor-pointer text-black
    "

                    onChange={(e) => {
                        // Handle change event
                        console.log(e.target.value);
                    }}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <MdArrowDownward className="text-lg text-gray-500" />
                </div>
            </div>
        </div>
    )
}