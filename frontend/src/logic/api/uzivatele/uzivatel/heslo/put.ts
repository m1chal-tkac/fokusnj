import { promiseTimeout } from "../../../../promiseTimeout";
import { handleResponse } from "../../../handleResponse";

export async function putHeslo(body: { [key: string]: any }) {
  const response = (await promiseTimeout(
    0,
    10000,
    fetch(
      import.meta.env.PUBLIC_SERVER + "/api/uzivatele/uzivatel/heslo/index.php",
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    ),
    true
  )) as Response;

  if (response.status === 403) {
    sessionStorage.setItem(
      "formMessage",
      JSON.stringify({
        message: "Vyžádejte si prosím nový email",
        type: "error",
        formId: "forgotPassword0",
      })
    );
    sessionStorage.setItem;
    window.location.href = "/forgot-password";
    throw new Error();
  }

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Změna hesla se nezdařila"
  );

  return result.data;
}
