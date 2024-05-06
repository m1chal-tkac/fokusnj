import { DateInput } from "../../components/form/input/DateInput";
import { NumberInput } from "../../components/form/input/NumberInput";
import { TextInput } from "../../components/form/input/TextInput";
import { OutlineButton } from "../../components/generic/button/OutlineButton";

interface StudentFormProps {
  i: number;
  formUpdate: ({
    target: { value, name },
  }: {
    target: {
      value: string;
      name: string;
    };
  }) => void;
  values: any;
  pridavnePole: {
    [key: string]: {
      nazev: string;
      typ: "CISLO" | "TEXT";
    };
  };
  onRemove: () => void;
}

export function StudentForm({
  i,
  formUpdate,
  values,
  pridavnePole,
  onRemove,
}: StudentFormProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-300 mb-4">
      <h2 className="w-full border-b border-gray-300 text-lg pb-2 mb-4">
        Student {i + 1}
      </h2>
      <TextInput
        name={`studenti.${i}.jmeno`}
        label="Jméno"
        value={values.jmeno}
        onChange={formUpdate}
        max={20}
      />
      <TextInput
        name={`studenti.${i}.prijmeni`}
        label="Příjmení"
        value={values.prijmeni}
        onChange={formUpdate}
        max={20}
      />
      <DateInput
        name={`studenti.${i}.datum_narozeni`}
        label="Datum narození"
        value={values.datum_narozeni}
        onChange={formUpdate}
      />
      <TextInput
        name={`studenti.${i}.trida`}
        label="Třída"
        value={values.trida}
        onChange={formUpdate}
        max={10}
      />
      {Object.keys(pridavnePole).map((x) => {
        const pole = pridavnePole![x];

        return (
          <div key={`studenti.${i}.${x}`} className="mb-4">
            {pole.typ === "CISLO" ? (
              <NumberInput
                label={pole.nazev}
                name={`studenti.${i}.${x}`}
                value={values[x]}
                onChange={formUpdate}
                min={-1000000}
                max={1000000}
              />
            ) : (
              <TextInput
                label={pole.nazev}
                name={`studenti.${i}.${x}`}
                value={values[x]}
                onChange={formUpdate}
                max={50}
              />
            )}
          </div>
        );
      })}
      {i !== 0 && (
        <OutlineButton
          text="Odstranit studenta"
          type="button"
          onClick={onRemove}
        />
      )}
    </div>
  );
}
