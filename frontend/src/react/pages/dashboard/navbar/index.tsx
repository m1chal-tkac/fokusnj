import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link as Link_ } from "wouter";

export function Navbar() {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const effect = () => {
      const token = sessionStorage.getItem("token");
      if (!token) return (window.location.href = "/login");
      const payload: any = jwtDecode(token);
      setName(`${payload.jmeno} ${payload.prijmeni}`);
      setIsAdmin(payload.admin === 1);
    };
    effect();
  }, []);

  return (
    <nav className="w-[96rem] max-w-full pt-2 mb-8 flex flex-col">
      <div className="w-full md:hidden mb-4 flex justify-between">
        <h1 className="text-2xl">FOKUS</h1>
        <button onClick={() => setMenu((x) => !x)}>
          <img src="/ikony/menu.svg" alt="menu" className="w-8 h-8" />
        </button>
      </div>
      <div
        className={`${
          menu ? "flex" : "hidden"
        } md:flex flex-col md:flex-row md:justify-between md:items-center`}
      >
        <div className="hidden md:block w-48">
          <h1 className="text-2xl">FOKUS</h1>
          <h2 className="text-gray-700 hidden md:block">Organizace soutěží</h2>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-16 space-y-1 md:space-y-0 mb-4 md:mb-0">
          <Link href="/dashboard" text="Soutěže" />
          <Link href="/dashboard/settings" text="Nastavení" />
          {isAdmin && <Link href="/dashboard/users" text="Uživatelé" />}
        </div>
        <div className="flex flex-col items-start md:items-end w-48">
          <h2 className="text-xl mb-1">{name}</h2>
          <button
            className="text-blue-500"
            onClick={() => {
              sessionStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Odhlásit se
          </button>
        </div>
      </div>
    </nav>
  );
}

interface LinkProps {
  href: string;
  text: string;
}

function Link({ href, text }: LinkProps) {
  return (
    <Link_ href={href} className="text-lg md:text-base">
      {text}
    </Link_>
  );
}
