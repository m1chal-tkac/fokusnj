import { useEffect, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../../components/form/Form";
import { EmailInput } from "../../../components/form/input/EmailInput";
import { Select } from "../../../components/form/Select";
import { PasswordInput } from "../../../components/form/input/PasswordInput";
import { useLocation } from "wouter";
import { postFetcher } from "../../../../logic/fetchers/postFetcher";

export function UserCreate() {
  useEffect(() => {
    document.title = "Nový uživatel";
  }, []);

  const [values, setValues] = useState<any>({});

  const formUpdate = formUpdate_(setValues);

  const [location, navigate] = useLocation();
  return (
    <main className="max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300 w-[32rem] overflow-y-auto">
      <Form
        id="dashCreateUser0"
        title="Nový uživatel"
        promise={async () => {
          await postFetcher("/api/uzivatele/uzivatel/index.php", {
            email: values.email,
            admin: values.admin,
            heslo: values.heslo,
          });
        }}
        callBack={() => navigate("/dashboard/users")}
        submitText="Vytvořit"
        onExit={() => navigate("/dashboard/users")}
      >
        <EmailInput
          label="Email"
          name="email"
          value={values.email}
          onChange={formUpdate}
        />
        <Select
          label="Může vytvářet / mazat uživatele"
          name="admin"
          onChange={formUpdate}
          selected={values.admin}
          values={[
            {
              text: "Ne",
              value: "0",
            },
            {
              text: "Ano",
              value: "1",
            },
          ]}
        />
        <div className="w-full border-b border-gray-300 mt-6 mb-4" />
        <PasswordInput
          label="Vaše heslo"
          name="heslo"
          value={values.heslo}
          onChange={formUpdate}
        />
      </Form>
    </main>
  );
}
