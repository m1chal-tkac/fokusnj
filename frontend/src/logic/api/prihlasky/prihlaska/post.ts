import { promiseTimeout } from "../../../promiseTimeout";
import { handleResponse } from "../../handleResponse";

export async function postPrihlaska(body: { [key: string]: any }) {
  const response = (await promiseTimeout(
    0,
    10000,
    fetch(
      import.meta.env.PUBLIC_SERVER + "/api/prihlasky/prihlaska/index.php",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    ),
    true
  )) as Response;

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Přihlášku se nepodařilo odeslat"
  );

  return result.data;
}
