import { z } from "zod";
import { Input } from ".";

interface DateInputProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
}

export function DateInput({
  label,
  value,
  name,
  onChange,
  optional,
}: DateInputProps) {
  return (
    <Input
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      test={z
        .string({ required_error: "Povinné pole" })
        .regex(
          /^(0?[1-9]|[1-2][0-9]|3[0-1])\.\s?(0?[1-9]|1[0-2])\.\s?[0-9]{4}$/,
          {
            message: "Musí být datum (např. 8. 11. 2007)",
          }
        )}
      optional={optional}
    />
  );
}
