import { useContext, useEffect } from "react";
import { FormState, State } from "./Form";

interface SelectProps {
  label: string;
  name: string;
  selected: string;
  values: { value: string; text: string }[];
  onChange: ({
    target: { value, name },
  }: {
    target: {
      value: string;
      name: string;
    };
  }) => void;
}

export function Select({
  label,
  name,
  selected,
  values,
  onChange,
}: SelectProps) {
  const formState = useContext(FormState);

  useEffect(() => {
    if (selected || values.length > 0)
      onChange({ target: { name, value: selected || values[0].value } });
  }, []);

  return (
    <div className="mb-4 last:mb-0">
      <label htmlFor={name} className="text-gray-800 text-sm mb-1">
        {label}:
      </label>
      <select
        id={name}
        name={name}
        className="border border-gray-300 px-4 py-2 w-full rounded-md text-gray-800 bg-transparent focus:outline-blue-500"
        onChange={(e) => formState !== State.Loading && onChange(e)}
        value={selected}
      >
        {values.map((x, i) => (
          <option value={x.value} key={i}>
            {x.text}
          </option>
        ))}
      </select>
    </div>
  );
}
