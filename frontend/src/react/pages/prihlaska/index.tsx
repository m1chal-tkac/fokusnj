import { useState } from "react";
import { Form } from "./Form";
import { PromiseManager } from "../../components/PromiseManager";
import { getFetcher } from "../../../logic/fetchers/getFetcher";
import useSWR from "swr";
import type { SubmitSoutez } from "../../../logic/Types";

enum State {
  Init,
  Submit,
}

export function Prihlaska() {
  const url =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("url")!
      : "";

  const {
    data: _data,
    error,
    isLoading,
  } = useSWR(
    "/api/souteze/soutez/index.php?url=" + url,
    (url) => getFetcher(url, true),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      shouldRetryOnError: false,
    }
  );

  const data = _data as SubmitSoutez;

  const [state, setState] = useState<State>(State.Init);

  return (
    <PromiseManager isLoading={isLoading} error={error}>
      <>
        {state === State.Init && data ? (
          <Form url={url} data={data} onSubmit={() => setState(State.Submit)} />
        ) : (
          <>
            <h2 className="w-full border-b border-gray-300 text-xl pb-2 mb-4">
              Přihláška odeslána
            </h2>
            <p>Potvrzení bylo zasláno na váš email</p>
          </>
        )}
      </>
    </PromiseManager>
  );
}
