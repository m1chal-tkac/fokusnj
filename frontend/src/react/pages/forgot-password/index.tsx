import { useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../components/form/Form";
import { EmailInput } from "../../components/form/input/EmailInput";
import { patchFetcher } from "../../../logic/fetchers/patchFetcher";

export function ForgotPassword() {
  const [values, setValues] = useState<any>({});

  const formUpdate = formUpdate_(setValues);

  return (
    <Form
      id="forgotPassword0"
      title="Zapomenuté heslo"
      promise={async () => {
        await patchFetcher("/api/uzivatele/uzivatel/heslo/index.php", {
          ...values,
        });
      }}
      callBack={() => {
        window.location.href = "/login";
        sessionStorage.setItem(
          "formMessage",
          JSON.stringify({
            message: "Pokud účet existuje, email byl odeslán",
            type: "success",
            formId: "login0",
          })
        );
      }}
      submitText="Obnovit heslo"
    >
      <EmailInput
        label="Email"
        name="email"
        onChange={formUpdate}
        value={values.email}
      />
    </Form>
  );
}
