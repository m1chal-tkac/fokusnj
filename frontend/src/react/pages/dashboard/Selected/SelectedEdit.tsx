import { useEffect, useRef, useState } from "react";
import { Form, formUpdate as formUpdate_ } from "../../../components/form/Form";
import { TextInput } from "../../../components/form/input/TextInput";
import { DateInput } from "../../../components/form/input/DateInput";
import { PasswordInput } from "../../../components/form/input/PasswordInput";
import useSWR from "swr";
import { useLocation, useSearch } from "wouter";
import { getFetcher } from "../../../../logic/fetchers/getFetcher";
import { PromiseManager } from "../../../components/PromiseManager";
import { patchFetcher } from "../../../../logic/fetchers/patchFetcher";
import { deleteFetcher } from "../../../../logic/fetchers/deleteFetcher";
import type { SoutezWithPrihlasky } from "../../../../logic/Types";

export function SelectedEdit() {
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

  const [values, setValues] = useState<any>({});
  const [heslo, setHeslo] = useState<any>({});
  const defaultValues = useRef<any>({});

  useEffect(() => {
    if (data) {
      const _od = data.prihlasovani_od.split("-");
      const _do = data.prihlasovani_do.split("-");

      const _data = {
        nazev: data.nazev,
        prihlasovani_od: _od[2] + ". " + _od[1] + ". " + _od[0],
        prihlasovani_do: _do[2] + ". " + _do[1] + ". " + _do[0],
      };
      setValues(_data);
      defaultValues.current = data;
      document.title = data.nazev + " - Úprava";
    }
  }, [data]);

  const formUpdate = formUpdate_(setValues);
  const hesloUpdate = formUpdate_(setHeslo);

  const [location, navigate] = useLocation();
  return (
    <main className="max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300 w-[32rem] overflow-y-auto">
      <PromiseManager isLoading={isLoading} error={error}>
        {data && (
          <>
            <Form
              id="dashSelectedSettings0"
              title="Nastavení soutěže"
              promise={async () => {
                const data: any = { url };

                if (values.nazev !== defaultValues.current.nazev)
                  data["nazev"] = values.nazev;
                if (
                  values.prihlasovani_od !==
                  defaultValues.current.prihlasovani_od
                ) {
                  data["prihlasovani_od"] = values.prihlasovani_od;
                }
                if (
                  values.prihlasovani_do !==
                  defaultValues.current.prihlasovani_do
                ) {
                  data["prihlasovani_do"] = values.prihlasovani_do;
                }

                if (Object.keys(data).length < 2)
                  throw new Error("Žádné změny k uložení");

                await patchFetcher("/api/souteze/soutez/index.php", data);
              }}
              callBack={() => navigate("/dashboard/selected?url=" + url)}
              submitText="Uložit"
              onExit={() => navigate("/dashboard/selected?url=" + url)}
            >
              <TextInput
                label="Název"
                name="nazev"
                value={values.nazev}
                onChange={formUpdate}
                max={50}
              />
              <DateInput
                label="Přihlašování od"
                name="prihlasovani_od"
                value={values.prihlasovani_od}
                onChange={formUpdate}
              />
              <DateInput
                label="Přihlašování do"
                name="prihlasovani_do"
                value={values.prihlasovani_do}
                onChange={formUpdate}
              />
            </Form>
            <div className="w-full border-b border-gray-300 mt-6 mb-4" />
            <Form
              id="dashSelectedSettings1"
              promise={async () => {
                const data: any = { url, heslo: heslo.heslo };
                await deleteFetcher("/api/souteze/soutez/index.php", data);
              }}
              callBack={() => {
                navigate("/dashboard");
              }}
              submitText="Trvale smazat soutěž"
            >
              <PasswordInput
                label="Heslo"
                name="heslo"
                value={heslo.heslo}
                onChange={hesloUpdate}
              />
            </Form>
          </>
        )}
      </PromiseManager>
    </main>
  );
}
