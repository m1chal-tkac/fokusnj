import { Select } from "../../../components/form/Select";
import { TextInput } from "../../../components/form/input/TextInput";
import { OutlineButton } from "../../../components/generic/button/OutlineButton";

interface PridavneFormProps {
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
  onRemove: () => void;
}

export function PridavneForm({
  i,
  formUpdate,
  values,
  onRemove,
}: PridavneFormProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-300 mb-4">
      <h2 className="w-full border-b border-gray-300 text-lg pb-2 mb-4">
        Přídavné pole {i + 1}
      </h2>
      <TextInput
        name={`pridavne_pole.${i}.nazev`}
        label="Název"
        value={values.nazev}
        onChange={formUpdate}
        max={50}
      />
      <Select
        name={`pridavne_pole.${i}.kategorie`}
        label="Kategorie"
        selected={values.kategorie}
        values={[
          { text: "Škola", value: "SKOLA" },
          { text: "Student", value: "STUDENT" },
        ]}
        onChange={formUpdate}
      />
      <Select
        name={`pridavne_pole.${i}.typ`}
        label="Typ"
        selected={values.typ}
        values={[
          { text: "Text", value: "TEXT" },
          { text: "Číslo", value: "CISLO" },
        ]}
        onChange={formUpdate}
      />
      <OutlineButton text="Odstranit" type="button" onClick={onRemove} />
    </div>
  );
}
