import { useEffect, useRef, useState } from "react";
import { Table, Td, Tr } from "../../../components/table";
import { Button } from "../../../components/generic/button";
import type { Uzivatel } from "../../../../logic/Types";
import useSWR from "swr";
import { getFetcher } from "../../../../logic/fetchers/getFetcher";
import { PromiseManager } from "../../../components/PromiseManager";
import { useLocation } from "wouter";
import { jwtDecode } from "jwt-decode";

export function Users() {
  useEffect(() => {
    document.title = "Uživatelé";
  }, []);

  const preventFast = useRef(true);

  const {
    data: _data,
    error,
    isLoading,
  } = useSWR("/api/uzivatele/index.php", (url) =>
    getFetcher(url, preventFast.current)
  );

  useEffect(() => {
    if (_data) preventFast.current = false;
  }, [_data]);

  const data = _data as { uzivatele: Uzivatel[] };

  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return "";
    const token = sessionStorage.getItem("token");
    if (!token) return (window.location.href = "/login");
    const payload: any = jwtDecode(token);
    return payload.email;
  });

  const [location, navigate] = useLocation();

  return (
    <main className="w-[96rem] flex-1 max-w-full min-h-0 flex flex-col bg-white p-4 rounded-lg border border-gray-300">
      <PromiseManager isLoading={isLoading} error={error}>
        {data && (
          <>
            <div className="w-full flex border-b border-gray-300 pb-2 items-center mb-4">
              <button
                onClick={() => navigate("/dashboard")}
                type="button"
                className="p-2"
              >
                <img src="/ikony/back.svg" alt="Zpět" className="w-6 h-6" />
              </button>
              <h1 className="text-xl ml-1">Uživatelé</h1>
            </div>
            <Table>
              <Tr>
                <Td>Email</Td>
                <Td>Jméno</Td>
                <Td>Příjmení</Td>
                <Td>Může vytvářet / mazat uživatele</Td>
                <Td>Akce</Td>
              </Tr>
              {data.uzivatele.map((x, i) => (
                <Tr key={i}>
                  <Td>{x.email}</Td>
                  <Td>{x.jmeno}</Td>
                  <Td>{x.prijmeni}</Td>
                  <Td>{x.admin === "1" ? "Ano" : "Ne"}</Td>
                  <Td>
                    {x.email === user ? null : (
                      <button
                        className="text-red-500"
                        onClick={() =>
                          navigate("/dashboard/users/delete?email=" + x.email)
                        }
                      >
                        Smazat
                      </button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Table>
            <div className="mt-4">
              <Button
                text="Nový uživatel"
                type="button"
                onClick={() => navigate("/dashboard/users/create")}
              />
            </div>
          </>
        )}
      </PromiseManager>
    </main>
  );
}
