import { useEffect, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../components/form/Form";
import { PasswordInput } from "../../components/form/input/PasswordInput";
import { EmailInput } from "../../components/form/input/EmailInput";
import { z } from "zod";
import { TextInput } from "../../components/form/input/TextInput";
import { putFetcher } from "../../../logic/fetchers/putFetcher";

export function CreateAccount() {
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
      id="createAccount0"
      title="Vytvoření účtu"
      promise={async () => {
        if (values.heslo !== values.heslo_2)
          throw new Error("Hesla se neshodují");

        await putFetcher("/api/uzivatele/uzivatel/index.php", {
          email: values.email,
          jmeno: values.jmeno,
          prijmeni: values.prijmeni,
          key: secret,
          heslo: values.heslo,
        });
      }}
      callBack={() => {
        window.location.href = "/login";
        sessionStorage.setItem(
          "formMessage",
          JSON.stringify({
            message: "Účet byl vytvořen",
            type: "success",
            formId: "login0",
          })
        );
      }}
      submitText="Vytvořit účet"
    >
      <EmailInput
        label="Email"
        name="email"
        value={values.email}
        onChange={() => null}
      />
      <TextInput
        label="Jméno"
        name="jmeno"
        value={values.jmeno}
        onChange={formUpdate}
      />
      <TextInput
        label="Příjmení"
        name="prijmeni"
        value={values.prijmeni}
        onChange={formUpdate}
      />
      <PasswordInput
        label="Heslo"
        name="heslo"
        value={values.heslo}
        onChange={formUpdate}
      />
      <PasswordInput
        label="Zopakujte heslo"
        name="heslo_2"
        value={values.heslo_2}
        onChange={formUpdate}
      />
    </Form>
  );
}
