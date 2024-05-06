import useSWR from "swr";
import { getFetcher } from "../../../logic/fetchers/getFetcher";
import { useEffect, useRef, useState } from "react";
import { PromiseManager } from "../../components/PromiseManager";
import { Table, Td, Tr } from "../../components/table";
import { Button } from "../../components/generic/button";
import { useLocation } from "wouter";
import type { DashboardSoutez } from "../../../logic/Types";

export function Overview() {
  useEffect(() => {
    document.title = "Přehled soutěží";
  }, []);

  const preventFast = useRef(true);

  const {
    data: _data,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/souteze/index.php", (url) =>
    getFetcher(url, preventFast.current, { take: take.current.toString() })
  );

  useEffect(() => {
    if (_data) preventFast.current = false;
  }, [_data]);

  const data = _data as { souteze: DashboardSoutez[] };

  const take = useRef(data ? Math.ceil(data.souteze.length / 20) * 20 : 20);
  const [isAll, setIsAll] = useState(
    data ? data.souteze.length % 20 !== 0 : false
  );

  useEffect(() => {
    if (data && data.souteze.length < take.current) {
      setIsAll(true);
    }
  }, [data]);

  const [location, navigate] = useLocation();

  return (
    <main className="w-[96rem] flex-1 max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300">
      <PromiseManager isLoading={isLoading} error={error}>
        <Table
          loadMore={
            isAll
              ? undefined
              : async () => {
                  take.current += 20;
                  await mutate();
                }
          }
        >
          <Tr>
            <Td>Název</Td>
            <Td>Počet přihlášek</Td>
            <Td>Přihlašování od</Td>
            <Td>Přihlašování do</Td>
            <Td>Akce</Td>
          </Tr>
          {data &&
            data.souteze.map((x, i) => {
              const prOd = x.prihlasovani_od.split("-");
              const prDo = x.prihlasovani_do.split("-");
              return (
                <Tr key={i}>
                  <Td>{x.nazev}</Td>
                  <Td>{x.pocet_prihlasek}</Td>
                  <Td>
                    {prOd[2]}. {prOd[1]}. {prOd[0]}
                  </Td>
                  <Td>
                    {prDo[2]}. {prDo[1]}. {prDo[0]}
                  </Td>
                  <Td>
                    <button
                      className="text-blue-500"
                      onClick={() =>
                        navigate("/dashboard/selected?url=" + x.url)
                      }
                    >
                      Přehled
                    </button>
                  </Td>
                </Tr>
              );
            })}
        </Table>
        <div className="mt-4">
          <Button
            text="Nová soutěž"
            type="button"
            onClick={() => navigate("/dashboard/create")}
          />
        </div>
      </PromiseManager>
    </main>
  );
}
