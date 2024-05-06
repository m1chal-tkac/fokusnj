import { useEffect, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../../components/form/Form";
import { EmailInput } from "../../../components/form/input/EmailInput";
import { PasswordInput } from "../../../components/form/input/PasswordInput";
import { deleteFetcher } from "../../../../logic/fetchers/deleteFetcher";
import { useLocation } from "wouter";

export function UserDelete() {
  useEffect(() => {
    document.title = "Smazat uživatele";
  }, []);

  const email =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email")!
      : "";

  const [values, setValues] = useState<any>({ email });

  const formUpdate = formUpdate_(setValues);

  const [location, navigate] = useLocation();

  return (
    <main className="max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300 w-[32rem] overflow-y-auto">
      <Form
        id="dashDeleteUser0"
        title="Smazat uživatele"
        promise={async () => {
          await deleteFetcher("/api/uzivatele/uzivatel/index.php", {
            email: values.email,
            heslo: values.heslo,
          });
        }}
        callBack={() => navigate("/dashboard/users")}
        submitText="Potvrdit"
        onExit={() => navigate("/dashboard/users")}
      >
        <EmailInput
          label="Email"
          name="email"
          value={values.email}
          onChange={() => null}
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
