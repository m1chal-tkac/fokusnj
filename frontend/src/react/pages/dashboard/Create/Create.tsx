import { useEffect, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../../components/form/Form";
import { TextInput } from "../../../components/form/input/TextInput";
import { DateInput } from "../../../components/form/input/DateInput";
import { PridavneForm } from "./PridavneForm";
import { useLocation } from "wouter";
import { postFetcher } from "../../../../logic/fetchers/postFetcher";

export function Create() {
  useEffect(() => {
    document.title = "Nová soutěž";
  }, []);

  const [values, setValues] = useState<any>({ pridavne_pole: [] });
  const formUpdate = formUpdate_(setValues);
  const [location, navigate] = useLocation();

  return (
    <main className="max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300 w-[32rem] overflow-y-auto">
      <Form
        id="dashCreate0"
        title="Nová soutěž"
        promise={async () => {
          return await postFetcher("/api/souteze/soutez/index.php", values);
        }}
        callBack={({ url }) => {
          const p_od = values.prihlasovani_od.replaceAll(" ", "").split(".");
          const p_do = values.prihlasovani_do.replaceAll(" ", "").split(".");
          navigate("/dashboard");
        }}
        submitText="Vytvořit"
        onExit={() => navigate("/dashboard")}
      >
        <TextInput
          label="Název"
          name="nazev"
          value={values.nazev}
          onChange={formUpdate}
          max={50}
        />
        <DateInput
          label="Přihlašování od"
          name="prihlasovani_od"
          value={values.prihlasovani_od}
          onChange={formUpdate}
        />
        <DateInput
          label="Přihlašování do"
          name="prihlasovani_do"
          value={values.prihlasovani_do}
          onChange={formUpdate}
        />
        {values.pridavne_pole.map((x: any, i: number) => (
          <PridavneForm
            i={i}
            key={i}
            formUpdate={formUpdate}
            values={values.pridavne_pole[i]}
            onRemove={() => {
              setValues((y: any) => {
                const copy = { ...y };
                copy.pridavne_pole.splice(i, 1);
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
                pridavne_pole: [...x.pridavne_pole, {}],
              };
            })
          }
        >
          + Nové přídavné pole
        </button>
      </Form>
    </main>
  );
}
