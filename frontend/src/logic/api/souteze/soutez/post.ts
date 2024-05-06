import { promiseTimeout } from "../../../promiseTimeout";
import { handleResponse } from "../../handleResponse";

export type postSoutezData = {
  url: string;
};

export async function postSoutez(body: {
  [key: string]: any;
}): Promise<postSoutezData> {
  const token = sessionStorage.getItem("token");

  const response = (await promiseTimeout(
    0,
    10000,
    fetch(import.meta.env.PUBLIC_SERVER + "/api/souteze/soutez/index.php", {
      method: "POST",
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
    result?.message || "Soutěž se nepodařilo vytvořit"
  );

  return result.data;
}
