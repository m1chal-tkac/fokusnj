import { promiseTimeout } from "../../promiseTimeout";
import { handleResponse } from "../handleResponse";

export type getPrihlaskyData = {
  nazev: string;
  prihlasovani_od: string;
  prihlasovani_do: string;
  pridavne_pole: {
    skola: { [key: string]: { nazev: string; typ: "CISLO" | "TEXT" } };
    student: { [key: string]: { nazev: string; typ: "CISLO" | "TEXT" } };
  };
  prihlasky: {
    skola: string;
    ucitel_email: string;
    ucitel_telefon: string;
    soutezici_skolni_kolo: string;
    studenti: {
      jmeno: string;
      prijmeni: string;
      datum_narozeni: string;
      trida: string;
      [key: string]: string;
    }[];
    [key: string]: any;
  }[];
};

export async function getPrihlasky(url: string): Promise<getPrihlaskyData> {
  const token = sessionStorage.getItem("token");

  const response = (await promiseTimeout(
    0,
    10000,
    fetch(
      import.meta.env.PUBLIC_SERVER + "/api/prihlasky/index.php?url=" + url,
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
    result?.message || "Přihlášky se nepodařilo načíst"
  );

  return result.data;
}
