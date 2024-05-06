import { z } from "zod";
import { Input } from ".";

interface EmailInputProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
}

export function EmailInput({ label, value, name, onChange, optional }: EmailInputProps) {
  return (
    <Input
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      test={z
        .string({ required_error: "Povinné pole" })
        .email({ message: "Musí být email" })
        .max(50, { message: "Maximální počet znaků je 50" })}
      optional={optional}
    />
  );
}
