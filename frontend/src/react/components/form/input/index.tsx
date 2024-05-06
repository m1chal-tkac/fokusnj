import { useContext, useEffect, useState } from "react";
import { ZodError, ZodSchema, z } from "zod";
import { FormErrors, FormState, State } from "../Form";

interface InputProps {
  label: string;
  test: ZodSchema;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "password";
  optional?: boolean;
}

export function Input({
  label,
  test,
  value,
  name,
  onChange,
  type = "text",
  optional,
}: InputProps) {
  const [error, setError] = useState("");

  useEffect(() => {
    handleChange(value);
  }, [value]);

  const formState = useContext(FormState);
  const formErrors = useContext(FormErrors);

  useEffect(() => {
    return () =>
      formErrors((x) => {
        const copy = { ...x };
        delete copy[name];
        return copy;
      });
  }, [formErrors]);

  const handleChange = (newValue: string) => {
    try {
      (optional ? test.optional().or(z.literal("")) : test).parse(newValue);
      setError("");
      formErrors((x) => {
        const copy = { ...x };
        copy[name] = false;
        return copy;
      });
    } catch (e) {
      if (e instanceof ZodError) {
        setError(e.issues[0].message);
        formErrors((x) => {
          const copy = { ...x };
          copy[name] = true;
          return copy;
        });
      }
    }
  };

  return (
    <div className="mb-4 last:mb-0">
      <label htmlFor={name} className="text-gray-800 text-sm mb-1">
        {label}:
      </label>
      <input
        id={name}
        type={type}
        name={name}
        className="border border-gray-300 px-4 py-2 w-full rounded-md text-gray-800 focus:outline-blue-500"
        value={value || ""}
        onChange={(e) => formState !== State.Loading && onChange(e)}
      />
      {error && formState === State.ShowErrors && (
        <p className="text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
