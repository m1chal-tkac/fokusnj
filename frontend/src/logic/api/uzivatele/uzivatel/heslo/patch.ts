import { promiseTimeout } from "../../../../promiseTimeout";
import { handleResponse } from "../../../handleResponse";

export async function patchHeslo(body: { [key: string]: any }) {
  const response = (await promiseTimeout(
    0,
    10000,
    fetch(
      import.meta.env.PUBLIC_SERVER + "/api/uzivatele/uzivatel/heslo/index.php",
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    ),
    true
  )) as Response;

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Obnovení hesla se nezdařilo"
  );

  return result.data;
}
