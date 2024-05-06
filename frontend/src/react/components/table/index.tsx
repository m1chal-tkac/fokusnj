import { useRef, type ReactNode } from "react";

interface TableProps {
  children: ReactNode | ReactNode[];
  loadMore?: () => any;
}

export function Table({ children, loadMore }: TableProps) {
  const loading = useRef(false);

  const handleScroll = async (e: any) => {
    if (!loadMore || loading.current) return;

    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      loading.current = true;
      await loadMore();
      loading.current = false;
    }
  };

  return (
    <table
      className="block max-w-full overflow-auto flex-1"
      onScroll={handleScroll}
    >
      <tbody>{children}</tbody>
    </table>
  );
}

interface TrProps {
  children: ReactNode | ReactNode[];
}

export function Tr({ children }: TrProps) {
  return (
    <tr className="border-b border-gray-300 last:border-0 first:sticky first:top-0 bg-white">
      {children}
    </tr>
  );
}

interface TdProps {
  children: ReactNode | ReactNode[];
}

export function Td({ children }: TdProps) {
  return (
    <td className="first:w-full pr-4 sm:pr-8 lg:pr-16 py-4 whitespace-nowrap">
      {children}
    </td>
  );
}
