import { useEffect, useRef, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../components/form/Form";
import { TextInput } from "../../components/form/input/TextInput";
import { EmailInput } from "../../components/form/input/EmailInput";
import { PasswordInput } from "../../components/form/input/PasswordInput";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "wouter";
import { patchFetcher } from "../../../logic/fetchers/patchFetcher";

export function Settings() {
  useEffect(() => {
    document.title = "Nastavení";
  }, []);

  const [values, setValues] = useState<any>({});
  const defaultValues = useRef<any>({});

  useEffect(() => {
    const effect = () => {
      const token = sessionStorage.getItem("token");
      if (!token) return (window.location.href = "/login");
      const payload: any = jwtDecode(token);
      const data = {
        email: payload.email,
        jmeno: payload.jmeno,
        prijmeni: payload.prijmeni,
      };
      setValues(data);
      defaultValues.current = data;
    };
    effect();
  }, []);

  const formUpdate = formUpdate_(setValues);

  const [location, navigate] = useLocation();
  return (
    <main className="max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300 w-[32rem] overflow-y-auto">
      <Form
        id="dashSettings0"
        title="Nastavení"
        promise={async () => {
          if (values.nove_heslo !== values.nove_heslo_2)
            throw new Error("Hesla se neshodují");

          if (values.nove_heslo === values.heslo)
            throw new Error("Nové heslo nesmí být stejné");

          const data: any = { heslo: values.heslo };

          if (values.email !== defaultValues.current.email)
            data["email"] = values.email;
          if (values.jmeno !== defaultValues.current.jmeno)
            data["jmeno"] = values.jmeno;
          if (values.prijmeni !== defaultValues.current.prijmeni)
            data["prijmeni"] = values.prijmeni;
          if (values.nove_heslo) data["nove_heslo"] = values.nove_heslo;

          if (Object.keys(data).length < 2)
            throw new Error("Žádné změny k uložení");

          await patchFetcher("/api/uzivatele/uzivatel/index.php", data);
        }}
        callBack={() => {
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          sessionStorage.setItem(
            "formMessage",
            JSON.stringify({
              message: "Účet byl upraven",
              type: "success",
              formId: "login0",
            })
          );
        }}
        submitText="Uložit"
        onExit={() => navigate("/dashboard")}
      >
        <EmailInput
          label="Email"
          name="email"
          value={values.email}
          onChange={formUpdate}
        />
        <TextInput
          label="Jméno"
          name="jmeno"
          value={values.jmeno}
          onChange={formUpdate}
          max={20}
        />
        <TextInput
          label="Příjmení"
          name="prijmeni"
          value={values.prijmeni}
          onChange={formUpdate}
          max={20}
        />
        <div className="w-full border-b border-gray-300 mt-6 mb-4" />
        <PasswordInput
          label="Nové heslo"
          name="nove_heslo"
          value={values.nove_heslo}
          onChange={formUpdate}
          optional
        />
        <PasswordInput
          label="Zopakujte nové heslo"
          name="nove_heslo_2"
          value={values.nove_heslo_2}
          onChange={formUpdate}
          optional
        />
        <div className="w-full border-b border-gray-300 mt-6 mb-4" />
        <PasswordInput
          label="Heslo"
          name="heslo"
          value={values.heslo}
          onChange={formUpdate}
        />
      </Form>
    </main>
  );
}
