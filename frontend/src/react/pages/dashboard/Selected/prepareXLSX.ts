import type { SoutezWithPrihlasky } from "../../../../logic/Types";
import { utils as XLSX_UTILS } from "xlsx";

export function prepareXLSX(data: SoutezWithPrihlasky) {
  const aoa = [
    [
      "Škola",
      "Email učitele",
      "Telefon učitele",
      "Počet soutěžících ve školním kole",
      ...Object.keys(data.pridavne_pole.skola).map((x) => {
        return data.pridavne_pole.skola![x].nazev;
      }),
      "Jméno",
      "Příjmení",
      "Datum narození",
      "Třída",
      ...Object.keys(data.pridavne_pole.student).map((x) => {
        return data.pridavne_pole.student![x].nazev;
      }),
    ],
  ];

  data.prihlasky.forEach((x) => {
    x.studenti.forEach((y) => {
      const date = y.datum_narozeni.split("-");
      aoa.push([
        x.skola,
        x.ucitel_email,
        x.ucitel_telefon,
        x.soutezici_skolni_kolo,
        ...Object.keys(data.pridavne_pole.skola).map((z) => {
          return x[z];
        }),
        y.jmeno,
        y.prijmeni,
        `${date[2]}. ${date[1]}. ${date[0]}`,
        y.trida,
        ...Object.keys(data.pridavne_pole.student).map((z) => {
          return y[z];
        }),
      ]);
    });
  });

  const wscols = [
    { wpx: 600 },
    { wpx: 200 },
    { wpx: 100 },
    { wpx: 200 },
    ...Object.keys(data.pridavne_pole.skola).map((x) => {
      return { wpx: 100 };
    }),
    { wpx: 75 },
    { wpx: 75 },
    { wpx: 100 },
    { wpx: 75 },
    ...Object.keys(data.pridavne_pole.student).map((x) => {
      return { wpx: 100 };
    }),
  ];

  const ws = XLSX_UTILS.aoa_to_sheet(aoa);
  ws["!cols"] = wscols;

  const wb = XLSX_UTILS.book_new();

  XLSX_UTILS.book_append_sheet(wb, ws, "Přihlášky");

  return wb;
}
