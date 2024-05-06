import { promiseTimeout } from "../../../promiseTimeout";
import { handleResponse } from "../../handleResponse";

export async function deleteSoutez(body: { [key: string]: any }) {
  const token = sessionStorage.getItem("token");

  const response = (await promiseTimeout(
    0,
    10000,
    fetch(import.meta.env.PUBLIC_SERVER + "/api/souteze/soutez/index.php", {
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
    result?.message || "Soutěž se nepodařilo smazat"
  );

  return result.data;
}
