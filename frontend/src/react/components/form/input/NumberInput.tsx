import { optional, z } from "zod";
import { Input } from ".";

interface NumberInputProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  optional?: boolean;
}

export function NumberInput({
  label,
  value,
  name,
  onChange,
  min,
  max,
  optional,
}: NumberInputProps) {
  return (
    <Input
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      test={z.coerce
        .number({ invalid_type_error: "Použijte prosím jenom čísla bez mezer" })
        .int()
        .min(min || Number.NEGATIVE_INFINITY, {
          message: `Minimální počet je ${min}`,
        })
        .max(max || Number.POSITIVE_INFINITY, {
          message: `Maximální počet je ${max}`,
        })}
      optional={optional}
    />
  );
}
