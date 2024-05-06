import { promiseTimeout } from "../../../promiseTimeout";
import { handleResponse } from "../../handleResponse";

export type getSoutezData = {
  nazev: string;
  pridavne_pole: {
    skola: {
      [key: string]: { nazev: string; typ: "CISLO" | "TEXT" };
    };
    student: {
      [key: string]: { nazev: string; typ: "CISLO" | "TEXT" };
    };
  };
  skoly: { id: string; nazev: string }[];
};

export async function getSoutez(url: string): Promise<getSoutezData> {
  const response = (await promiseTimeout(
    0,
    10000,
    fetch(
      import.meta.env.PUBLIC_SERVER +
        "/api/souteze/soutez/index.php?url=" +
        url,
      {
        method: "GET",
      }
    ),
    true
  )) as Response;

  const result = await response.json();

  handleResponse(
    response.status,
    result?.message || "Soutěž se nepodařilo načíst"
  );

  return result.data;
}
