import { z } from "zod";
import { Input } from ".";

interface TextInputProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  optional?: boolean;
}

export function TextInput({
  label,
  value,
  name,
  onChange,
  min,
  max,
  optional,
}: TextInputProps) {
  return (
    <Input
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      test={z
        .string({ required_error: "Povinné pole" })
        .min(min || 1, {
          message: min ? `Minimální délka je ${min} znaků` : "Povinné pole",
        })
        .max(max || Number.POSITIVE_INFINITY, {
          message: `Maximální délka je ${max} znaků`,
        })}
      optional={optional}
    />
  );
}
