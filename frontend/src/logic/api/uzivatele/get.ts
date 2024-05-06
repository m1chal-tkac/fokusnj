import { promiseTimeout } from "../../promiseTimeout";
import { handleResponse } from "../handleResponse";

export type getUzivateleData = {
  uzivatele: {
    email: string;
    jmeno: string;
    prijmeni: string;
    admin: string;
  }[];
};

export async function getUzivatele(): Promise<getUzivateleData> {
  const token = sessionStorage.getItem("token");

  const response = (await promiseTimeout(
    0,
    10000,
    fetch(import.meta.env.PUBLIC_SERVER + "/api/uzivatele/index.php", {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "GET",
    }),
    true
  )) as Response;

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Uživatele se nepodařilo načíst"
  );

  return result.data;
}
