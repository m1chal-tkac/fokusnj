import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useRef,
  useEffect,
} from "react";
import { LoadingButton } from "../generic/button/LoadingButton";
import { promiseTimeout } from "../../../logic/promiseTimeout";

interface FormProps {
  title?: string;
  children: ReactNode | ReactNode[];
  promise: () => Promise<any>;
  callBack?: (x: any) => void;
  submitText?: string;
  onExit?: () => void;
  id: string;
}

export enum State {
  Init,
  ShowErrors,
  Loading,
}

export const FormState = createContext(State.Init);

export const FormErrors = createContext<
  Dispatch<SetStateAction<{ [key: string]: boolean }>>
>(() => null);

export function Form({
  title,
  children,
  promise,
  callBack,
  submitText = "Odeslat",
  onExit,
  id,
}: FormProps) {
  const [state, setState] = useState(State.Init);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const scrollElement = useRef<any>();

  useEffect(() => {
    try {
      const data: any = JSON.parse(sessionStorage.getItem("formMessage") || "");
      if (data && data.formId === id) {
        if (data.type === "success") setMessage(data.message);
        else setError(data.message);
        sessionStorage.removeItem("formMessage");
      }
    } catch {}
  }, []);

  const handlePromise = async () => {
    try {
      const x = await promiseTimeout(1000, 10000, promise());
      if (callBack) callBack(x);
    } catch (e) {
      scrollElement.current?.scrollIntoView({
        behavior: "smooth",
      });
      if (e instanceof Error) setError(e.message);
      else setError("Neznámá chyba");
    }
    setState(State.ShowErrors);
  };

  const handleSubmit = async () => {
    if (Object.keys(errors).every((x) => !errors[x])) {
      setError("");
      setState(State.Loading);

      await handlePromise();
    } else {
      scrollElement.current?.scrollIntoView({
        behavior: "smooth",
      });
      setError("Opravte prosím všechny chyby");
    }
    setState(State.ShowErrors);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <FormState.Provider value={state}>
        <FormErrors.Provider value={setErrors}>
          <div ref={scrollElement} />
          {title && (
            <div className="w-full flex border-b border-gray-300 pb-2 items-center mb-4">
              {onExit && (
                <button onClick={onExit} type="button" className="p-2">
                  <img src="/ikony/back.svg" alt="Zpět" className="w-6 h-6" />
                </button>
              )}
              <h1 className={`text-xl ${onExit && "ml-1"}`}>{title}</h1>
            </div>
          )}
          {error ? (
            <div className="border border-red-500 text-red-500 p-2 mb-4 text-center rounded-md break-words">
              {error}
            </div>
          ) : (
            message && (
              <div className="border border-emerald-600 text-emerald-600 p-2 mb-4 text-center rounded-md">
                {message}
              </div>
            )
          )}
          {children}
          <LoadingButton
            loading={state === State.Loading}
            text={submitText}
            type="submit"
          />
        </FormErrors.Provider>
      </FormState.Provider>
    </form>
  );
}

export const formUpdate = (callback: Dispatch<SetStateAction<any>>) => {
  const update = ({
    target: { value, name },
  }: {
    target: { value: string; name: string };
  }) => {
    callback((x: any) => {
      try {
        return { ...x, ...setProperty({ ...x }, name, value) };
      } catch {
        return { ...x };
      }
    });
  };

  return update;
};

function setProperty(
  obj: { [key: string]: any },
  path: string,
  value: string
): { [key: string]: any } {
  const [head, ...rest] = path.split(".");

  if (Array.isArray(obj[head])) {
    const copy = [...obj[head]];
    const temp: any = copy[+rest[0]];
    temp[rest[1]] = value;
    copy.splice(
      +rest[0],
      1,
      rest.length - 1 > 1
        ? setProperty(obj[head], rest.slice(1).join("."), value)
        : temp
    );
    return {
      ...obj,
      [head]: copy,
    };
  }

  return {
    ...obj,
    [head]: rest.length ? setProperty(obj[head], rest.join("."), value) : value,
  };
}
