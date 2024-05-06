import { promiseTimeout } from "../../../promiseTimeout";
import { handleResponse } from "../../handleResponse";

export async function deleteUzivatel(body: { [key: string]: any }) {
  const token = sessionStorage.getItem("token");

  const response = (await promiseTimeout(
    0,
    10000,
    fetch(import.meta.env.PUBLIC_SERVER + "/api/uzivatele/uzivatel/index.php", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    }),
    true
  )) as Response;

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Uživatele se nepodařilo smazat"
  );

  return result.data;
}
