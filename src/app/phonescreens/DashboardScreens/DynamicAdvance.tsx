"use client";

import AddButton from "@/app/component/buttons/AddButton";
import { PlusSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

type DynamicAdvanceProps = {
  children: React.ReactNode;
  addUrl?: string;
};

const DynamicAdvance = ({ children, addUrl = "/customer/add" }: DynamicAdvanceProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full my-3">

      {/* ── Toolbar row ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">

        {/* Search toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`
            group relative flex items-center gap-2 px-4 py-2 rounded-xl
            border transition-all duration-200 select-none overflow-hidden
            ${open
              ? "border-transparent text-white shadow-md"
              : "bg-white dark:bg-[var(--color-childbgdark)] border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20"
            }
          `}
          style={open ? { backgroundColor: "var(--color-primary)" } : {}}
        >
          {/* Animated fill background when open */}
          {!open && (
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)" }}
            />
          )}

          {/* Search icon */}
          <svg
            className={`w-3.5 h-3.5 relative  transition-colors ${open ? "text-white" : "text-gray-400 dark:text-gray-500"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>

          <span className="relative text-xs font-bold tracking-widest uppercase">
            Advanced Search
          </span>

          {/* Arrow pill */}
          <span
            className={`
              relative  w-5 h-5 rounded-md flex items-center justify-center transition-colors
              ${open ? "bg-white/20" : "bg-gray-100 dark:bg-white/[0.06]"}
            `}
          >
            {open
              ? <IoIosArrowUp className="text-white" size={11} />
              : <IoIosArrowDown className="text-gray-400 dark:text-gray-500" size={11} />
            }
          </span>
        </button>

        {/* Add button */}
        <AddButton
          url={addUrl}
          text="Add"
          icon={<PlusSquare size={16} />}
        />
      </div>

      {/* ── Expandable search panel ──────────────────────────────────────── */}
      {open && (
        <div className="mt-2 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[var(--color-childbgdark)] shadow-sm">
          {/* Top accent line using brand color */}
          <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, var(--color-primary), transparent)" }} />

          <div className="flex flex-col gap-4 p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicAdvance;