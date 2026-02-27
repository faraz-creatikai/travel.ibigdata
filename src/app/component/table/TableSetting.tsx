"use client";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Pin, PinOff } from "lucide-react";
import { useState, useRef } from "react";
import { IoMdSettings } from "react-icons/io";

type Column = {
  key: string;
  label: string;
  isPinned: boolean;
  visible: boolean;
};

type TableSettingProps = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

function Tablesetting({ columns, setColumns }: TableSettingProps) {
  const [togglesetting, setTogglesetting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // 🔥 Close when clicking outside
  useClickOutside({
    ref: menuRef,
    handler: () => setTogglesetting(false),
    enabled: togglesetting, // only active when open
  });

  const togglePin = (key: string) => {
    setColumns((prev: Column[]) =>
      prev.map((col) =>
        col.key === key
          ? {
              ...col,
              isPinned: !col.isPinned,
              visible: col.isPinned ? false : true,
            }
          : col
      )
    );
  };

  return (
    <div className=" mr-2"   ref={menuRef}>
      {/* Settings Button */}
      <div className=" relative z-40">
        <button
          onClick={() => setTogglesetting((prev) => !prev)}
          className="text-[var(--color-secondary)] transition-all duration-300 hover:rotate-180  cursor-pointer flex justify-center items-center rounded-md"
        >
          <IoMdSettings size={18} />
        </button>
         {/* Dropdown Menu */}
      <div
      
        style={{
          borderWidth: "0.2px",
          borderColor: "gray",
          borderStyle: "solid",
        }}
        className={`absolute top-8 -left-60 min-w-[250px] max-h-54 bg-white shadow-2xl shadow-gray-300
          text-gray-900 px-1 py-2 right-18 flex-col rounded-md z-[1000]
          transform transition-all duration-300 ease-out overflow-y-scroll [scrollbar-width:thin] [scrollbar-color:var(--color-primary)_transparent]
          ${
            togglesetting
              ? "scale-100 opacity-100 visible"
              : "scale-95 opacity-0 pointer-events-none invisible"
          }`}
      >
        {columns.map((col) => (
          <button
            key={col.key}
            className="w-full flex  justify-between gap-9 px-3 py-2.5 hover:bg-[var(--color-secondary)]/90 rounded-md text-sm hover:text-white transition-colors"
            onClick={() => togglePin(col.key)}
          >
            <span>{col.label}</span>
            {col.isPinned ? (
              <Pin className="w-4 h-4 text-primary" />
            ) : (
              <PinOff className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>
      </div>

     
    </div>
  );
}

export default Tablesetting;
