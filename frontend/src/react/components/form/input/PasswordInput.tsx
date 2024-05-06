import { z } from "zod";
import { Input } from ".";

interface PasswordInputProps {
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  optional?: boolean;
}

export function PasswordInput({
  label,
  value,
  name,
  onChange,
  optional,
}: PasswordInputProps) {
  return (
    <Input
      label={label}
      value={value}
      name={name}
      onChange={onChange}
      type="password"
      test={z
        .string({ required_error: "Povinné pole" })
        .min(5, { message: "Minimální délka je 5 znaků" })
        .max(30, {
          message: `Maximální délka je 30 znaků`,
        })
        .regex(
          /^.*([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+).*$/,
          {
            message:
              "Heslo musí obsahovat malé písmeno, velké písmeno a číslici",
          }
        )}
      optional={optional}
    />
  );
}
