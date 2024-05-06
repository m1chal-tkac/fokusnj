import { type ReactNode } from "react";
import { Loading } from "./generic/Loading";

interface PromiseManagerProps {
  isLoading: boolean;
  error: any;
  children: ReactNode | ReactNode[];
}

export function PromiseManager({
  isLoading,
  error,
  children,
}: PromiseManagerProps) {
  return (
    <>
      {isLoading ? (
        <>
          <div className="mx-auto py-16 w-max">
            <Loading />
          </div>
          <p className="text-center">Načítání...</p>
        </>
      ) : error ? (
        <p className="text-center text-red-500">{error.message}</p>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
