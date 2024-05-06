import { useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../components/form/Form";
import { TextInput } from "../../components/form/input/TextInput";

export function Index() {
  const [values, setValues] = useState<any>({});

  const formUpdate = formUpdate_(setValues);

  return (
    <>
      <Form
        id="index0"
        title="FOKUS"
        promise={async () => null}
        callBack={() => (window.location.href = `/prihlaska?url=${values.id}`)}
        submitText="Otevřít formulář"
      >
        <TextInput
          label="Id soutěže"
          name="id"
          onChange={formUpdate}
          value={values.id}
          min={13}
          max={13}
        />
      </Form>
      <div className="w-full border-b border-gray-300 mt-6 mb-4" />
      <a
        href="/login"
        className="block text-center border-2 border-blue-500 bg-blue-500 text-white p-2 w-full rounded-md"
      >
        Admin panel
      </a>
    </>
  );
}
