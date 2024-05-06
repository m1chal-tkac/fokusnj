import { promiseTimeout } from "../../promiseTimeout";
import { handleResponse } from "../handleResponse";

export type getSoutezeData = {
  souteze: {
    url: string;
    nazev: string;
    pocet_prihlasek: string;
    prihlasovani_od: string;
    prihlasovani_do: string;
  }[];
};

export async function getSouteze(skip?: number): Promise<getSoutezeData> {
  const token = sessionStorage.getItem("token");

  const response = (await promiseTimeout(
    0,
    10000,
    fetch(
      import.meta.env.PUBLIC_SERVER +
        "/api/souteze/index.php" +
        (skip ? "?skip=" + skip : ""),
      {
        headers: {
          Authorization: "Bearer " + token,
        },
        method: "GET",
      }
    ),
    true
  )) as Response;

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Soutěže se nepodařilo načíst"
  );

  return result.data;
}
