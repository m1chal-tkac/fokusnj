export interface DashboardSoutez {
  url: string;
  nazev: string;
  pocet_prihlasek: string;
  prihlasovani_od: string;
  prihlasovani_do: string;
}

export interface SoutezWithPrihlasky extends DashboardSoutez {
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
}

export interface SubmitSoutez {
  nazev: string;
  pridavne_pole: {
    skola: {
      [key: string]: {
        nazev: string;
        typ: "CISLO" | "TEXT";
      };
    };
    student: {
      [key: string]: {
        nazev: string;
        typ: "CISLO" | "TEXT";
      };
    };
  };
  skoly: {
    id: string;
    nazev: string;
  }[];
}

export interface Uzivatel {
  email: string;
  jmeno: string;
  prijmeni: string;
  admin: string;
}
