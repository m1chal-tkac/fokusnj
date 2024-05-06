import { useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../components/form/Form";
import { EmailInput } from "../../components/form/input/EmailInput";
import { PasswordInput } from "../../components/form/input/PasswordInput";
import { postFetcher } from "../../../logic/fetchers/postFetcher";

export function Login() {
  const [values, setValues] = useState<any>({});

  const formUpdate = formUpdate_(setValues);

  return (
    <>
      <Form
        id="login0"
        title="Přihlášení"
        promise={async () => {
          const login = await postFetcher(
            "/api/uzivatele/uzivatel/prihlaseni/index.php",
            {
              ...values,
            }
          );
          sessionStorage.setItem("token", login.token);
        }}
        callBack={() => (window.location.href = "/dashboard")}
        submitText="Přihlásit se"
      >
        <EmailInput
          label="Email"
          name="email"
          onChange={formUpdate}
          value={values.email}
        />
        <PasswordInput
          label="Heslo"
          name="heslo"
          onChange={formUpdate}
          value={values.heslo}
        />
      </Form>
      <div className="w-full border-b border-gray-300 mt-6 mb-4" />
      <a
        href="/forgot-password"
        className="block text-center border-2 border-blue-500 text-blue-500 p-2 w-full rounded-md"
      >
        Zapomenuté heslo
      </a>
    </>
  );
}
