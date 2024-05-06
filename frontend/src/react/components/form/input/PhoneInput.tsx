import { z } from "zod";
import { Input } from ".";

interface PhoneInputProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
}

export function PhoneInput({
  label,
  value,
  name,
  onChange,
  optional,
}: PhoneInputProps) {
  return (
    <Input
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      test={z.coerce
        .number({
          invalid_type_error: "Použijte prosím jenom čísla bez mezer",
        })
        .min(100000000, { message: "Musí být telefonní číslo" })
        .max(999999999, { message: "Musí být telefonní číslo" })}
      optional={optional}
    />
  );
}
