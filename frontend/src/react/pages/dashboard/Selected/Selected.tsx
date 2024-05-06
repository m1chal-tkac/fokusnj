import { useState, useEffect, useRef } from "react";
import { type WorkBook, writeFile as XLSX_WRITE_FILE } from "xlsx";
import { Table, Td, Tr } from "../../../components/table";
import { FeedbackButtonOutlined } from "../../../components/generic/button/FeedbackButtonOutlined";
import { TextInput } from "../../../components/form/input/TextInput";
import { Button } from "../../../components/generic/button";
import useSWR from "swr";
import { getFetcher } from "../../../../logic/fetchers/getFetcher";
import { PromiseManager } from "../../../components/PromiseManager";
import { useLocation, useSearch } from "wouter";
import type { SoutezWithPrihlasky } from "../../../../logic/Types";
import { prepareXLSX } from "./prepareXLSX";

const accessText = (_od: string, _do: string) => {
  const p_od = new Date(_od);
  const p_do = new Date(_do);

  const year = new Date().getFullYear();

  if (+p_do < new Date().setHours(0, 0, 0, 0)) return "Přihlašování uzavřeno";
  else if (p_od.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0))
    return `od ${p_od.getDate()}. ${p_od.getMonth() + 1}.${
      p_od.getFullYear() !== year ? " " + p_od.getFullYear() : ""
    }`;

  return "";
};

export function Selected() {
  const url = new URLSearchParams(useSearch()).get("url")!;

  const preventFast = useRef(true);

  const {
    data: _data,
    error,
    isLoading,
  } = useSWR("/api/prihlasky/index.php?url=" + url, (url) =>
    getFetcher(url, preventFast.current)
  );

  useEffect(() => {
    if (_data) preventFast.current = false;
  }, [_data]);

  const data = _data as SoutezWithPrihlasky;

  const [access, setAccess] = useState("");
  const [wb, setWb] = useState<WorkBook>();

  useEffect(() => {
    if (data) {
      setAccess(accessText(data.prihlasovani_od, data.prihlasovani_do));
      document.title = data.nazev;
    }
  }, [data]);

  useEffect(() => {
    if (data) setWb(prepareXLSX(data));
  }, [data]);

  const [location, navigate] = useLocation();

  return (
    <main className="w-[96rem] flex-1 max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300">
      <PromiseManager isLoading={isLoading} error={error}>
        {data && (
          <>
            <div className="w-full flex border-b border-gray-300 pb-2 items-center">
              <button onClick={() => navigate("/dashboard")} className="p-2">
                <img src="/ikony/back.svg" alt="Zpět" className="w-6 h-6" />
              </button>
              <h1 className="text-xl flex-1 ml-2">{data.nazev}</h1>
              <h2 className="text-blue-500">{access}</h2>
            </div>
            <Table>
              <Tr>
                <Td>Škola</Td>
                <Td>Email učitele</Td>
                <Td>Telefon učitele</Td>
                <Td>Počet soutěžících ve školním kole</Td>
                {Object.keys(data.pridavne_pole.skola).map((x, i) => {
                  const nazev = data.pridavne_pole.skola![x].nazev;
                  return <Td key={i}>{nazev}</Td>;
                })}
                <Td>Jméno</Td>
                <Td>Příjmení</Td>
                <Td>Datum narození</Td>
                <Td>Třída</Td>
                {Object.keys(data.pridavne_pole.student).map((x, i) => {
                  const nazev = data.pridavne_pole.student![x].nazev;
                  return <Td key={"_" + i}>{nazev}</Td>;
                })}
              </Tr>
              {data.prihlasky.map((x, i) =>
                x.studenti.map((y, j) => {
                  const date = y.datum_narozeni.split("-");
                  return (
                    <Tr key={i + "" + j}>
                      <Td>{x.skola}</Td>
                      <Td>{x.ucitel_email}</Td>
                      <Td>{x.ucitel_telefon}</Td>
                      <Td>{x.soutezici_skolni_kolo}</Td>
                      {Object.keys(data.pridavne_pole.skola || {}).map(
                        (z, i) => {
                          const value = x[z];
                          return <Td key={i}>{value}</Td>;
                        }
                      )}
                      <Td>{y.jmeno}</Td>
                      <Td>{y.prijmeni}</Td>
                      <Td>
                        {date[2]}. {date[1]}. {date[0]}
                      </Td>
                      <Td>{y.trida}</Td>
                      {Object.keys(data.pridavne_pole.student || {}).map(
                        (z, i) => {
                          const value = y[z];
                          return <Td key={"_" + i}>{value}</Td>;
                        }
                      )}
                    </Tr>
                  );
                })
              )}
            </Table>
            <div className="mt-4 flex flex-col md:flex-row md:items-end">
              <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                <TextInput
                  label={"Odkaz"}
                  name="odkaz"
                  onChange={() => null}
                  value={
                    import.meta.env.PUBLIC_LINK_SERVER + "/prihlaska?url=" + url
                  }
                />
              </div>
              <div>
                <FeedbackButtonOutlined
                  text="Kopírovat odkaz"
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      import.meta.env.PUBLIC_LINK_SERVER +
                        "/prihlaska?url=" +
                        url
                    )
                  }
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row md:items-end">
              <div className="w-full mb-4 md:mb-0 md:mr-4">
                <Button
                  text="Upravit soutěž"
                  type="button"
                  onClick={() =>
                    navigate("/dashboard/selected/edit?url=" + url)
                  }
                />
              </div>
              <Button
                type="button"
                text="Stáhnout přihlášky"
                onClick={() => {
                  if (wb) XLSX_WRITE_FILE(wb, data.nazev + ".xlsx");
                }}
              />
            </div>
          </>
        )}
      </PromiseManager>
    </main>
  );
}
