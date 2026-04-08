import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import clsx from "clsx";
import { EllipsisVertical } from "lucide-react";

export const MenusContext = createContext();

/* -------------------------------- Root -------------------------------- */

function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const [position, setPosition] = useState(null);

  const close = () => setOpenId("");
  const open = setOpenId;

  useEffect(() => {
    function handleScroll() {
      close();
    }

    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

export function useMenus() {
  const context = useContext(MenusContext);
  if (!context) throw new Error("useMenus must be used inside <Menus>");
  return context;
}

/* -------------------------------- Menu wrapper -------------------------------- */

function Menu({ children }) {
  return <div className="flex items-center justify-end">{children}</div>;
}

/* -------------------------------- Toggle -------------------------------- */

function Toggle({ id }) {
  const { openId, open, close, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenAbove = spaceBelow < 150 && spaceAbove > 150;

    setPosition({
      x: window.innerWidth - rect.right,
      y: shouldOpenAbove ? rect.top - 6 : rect.bottom + 6,
      openAbove: shouldOpenAbove,
    });

    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-md p-1 transition hover:bg-muted focus:outline-none"
    >
      <EllipsisVertical className="h-5 w-5 text-muted-foreground" />
    </button>
  );
}

/* -------------------------------- List -------------------------------- */

function List({ id, children }) {
  const { openId, position, close } = useContext(MenusContext);
  const ref = useOutsideClick(close, false);

  if (openId !== id) return null;

  return createPortal(
    <ul
      ref={ref}
      style={{
        right: position?.x,
        top: position?.y,
      }}
      className={clsx(
        "fixed z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in",
        position?.openAbove ? "slide-in-from-bottom" : "fade-in zoom-in-95",
      )}
    >
      {children}
    </ul>,
    document.body,
  );
}

/* -------------------------------- Item / Button -------------------------------- */

function Button({ children, icon, onClick, className }) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <button
        onClick={handleClick}
        className={clsx(
          "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition hover:bg-muted",
          className,
        )}
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span>{children}</span>
      </button>
    </li>
  );
}

/* -------------------------------- Exports -------------------------------- */

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
