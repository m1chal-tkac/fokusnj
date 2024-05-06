import { useEffect, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../components/form/Form";
import { PasswordInput } from "../../components/form/input/PasswordInput";
import { EmailInput } from "../../components/form/input/EmailInput";
import { z } from "zod";
import { putFetcher } from "../../../logic/fetchers/putFetcher";

export function ChangePassword() {
  const [values, setValues] = useState<any>({});
  const [secret, setSecret] = useState("");

  const formUpdate = formUpdate_(setValues);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window?.location.search);

    const emailSchema = z
      .string({ required_error: "Povinné pole" })
      .email({ message: "Musí být email" })
      .max(50, { message: "Maximální počet znaků je 50" });

    const email = emailSchema.safeParse(urlSearchParams.get("email") || "");
    const key = urlSearchParams.get("key") || "";
    if (!key || key.length !== 40 || !email.success) {
      window.location.href = "/forgot-password";
      sessionStorage.setItem(
        "formMessage",
        JSON.stringify({
          message: "Vyžádejte si prosím nový email",
          type: "error",
          formId: "forgotPassword0",
        })
      );
      return;
    }
    setSecret(key);
    formUpdate({ target: { value: email.data, name: "email" } });
  }, []);

  return (
    <Form
      id="changePassword0"
      title="Změna hesla"
      promise={async () => {
        if (values.nove_heslo !== values.nove_heslo_2)
          throw new Error("Hesla se neshodují");

        await putFetcher("/api/uzivatele/uzivatel/heslo/index.php", {
          email: values.email,
          key: secret,
          heslo: values.nove_heslo,
        });
      }}
      callBack={() => {
        window.location.href = "/login";
        sessionStorage.setItem(
          "formMessage",
          JSON.stringify({
            message: "Heslo bylo změněno",
            type: "success",
            formId: "login0",
          })
        );
      }}
      submitText="Změnit heslo"
    >
      <EmailInput
        label="Email"
        name="email"
        value={values.email}
        onChange={() => null}
      />
      <PasswordInput
        label="Nové heslo"
        name="nove_heslo"
        value={values.nove_heslo}
        onChange={formUpdate}
      />
      <PasswordInput
        label="Zopakujte nové heslo"
        name="nove_heslo_2"
        value={values.nove_heslo_2}
        onChange={formUpdate}
      />
    </Form>
  );
}
