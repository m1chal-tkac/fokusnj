import { useEffect, useState } from "react";
import {
  Form as Form_,
  formUpdate as formUpdate_,
} from "../../components/form/Form";
import { EmailInput } from "../../components/form/input/EmailInput";
import { PhoneInput } from "../../components/form/input/PhoneInput";
import { NumberInput } from "../../components/form/input/NumberInput";
import { TextInput } from "../../components/form/input/TextInput";
import { StudentForm } from "./StudentForm";
import { Select } from "../../components/form/Select";
import { postFetcher } from "../../../logic/fetchers/postFetcher";
import type { SubmitSoutez } from "../../../logic/Types";

interface FormProps {
  url: string;
  data: SubmitSoutez;
  onSubmit: () => void;
}

export function Form({ url, data, onSubmit }: FormProps) {
  const [values, setValues] = useState<any>({
    studenti: [{}],
  });

  const formUpdate = formUpdate_(setValues);

  useEffect(() => {
    document.title = data.nazev;
  }, []);

  return (
    <Form_
      id="prihlaska0"
      title={data.nazev}
      promise={async () => {
        await postFetcher("/api/prihlasky/prihlaska/index.php", {
          ...values,
          url,
        });
      }}
      callBack={onSubmit}
    >
      <Select
        label="Škola (vyberte ze seznamu)"
        name="skola"
        selected={values.skola}
        values={data.skoly.map((x) => {
          return { value: x.id, text: x.nazev };
        })}
        onChange={formUpdate}
      />
      <EmailInput
        label="Email učitele"
        name="ucitel_email"
        value={values.ucitel_email}
        onChange={formUpdate}
      />
      <PhoneInput
        label="Telefon učitele"
        name="ucitel_telefon"
        value={values.ucitel_telefon}
        onChange={formUpdate}
      />
      <NumberInput
        label="Počet soutěžících ve školním kole"
        name="soutezici_skolni_kolo"
        value={values.soutezici_skolni_kolo}
        onChange={formUpdate}
        min={1}
        max={100}
      />
      {Object.keys(data.pridavne_pole.skola).map((x) => {
        const pole = data.pridavne_pole.skola![x];

        return (
          <>
            {pole.typ === "CISLO" ? (
              <NumberInput
                key={x}
                label={pole.nazev}
                name={x}
                value={values[x]}
                onChange={formUpdate}
                min={-1000000}
                max={1000000}
              />
            ) : (
              <TextInput
                key={x}
                label={pole.nazev}
                name={x}
                value={values[x]}
                onChange={formUpdate}
                max={50}
              />
            )}
          </>
        );
      })}
      {values.studenti.map((x: any, i: number) => (
        <StudentForm
          i={i}
          key={i}
          formUpdate={formUpdate}
          pridavnePole={data.pridavne_pole.student}
          values={values.studenti[i]}
          onRemove={() => {
            setValues((y: any) => {
              const copy = { ...y };
              copy.studenti.splice(i, 1);
              return copy;
            });
          }}
        />
      ))}
      <button
        type="button"
        className="text-blue-500 -mt-2 mb-4"
        onClick={() =>
          setValues((x: any) => {
            return {
              ...x,
              studenti: [...x.studenti, {}],
            };
          })
        }
      >
        + Přidat studenta
      </button>
    </Form_>
  );
}
