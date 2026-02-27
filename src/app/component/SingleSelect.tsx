import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

interface OptionProps {
  className?: string;
  options: string[];
  label: string;
  value?: string;
  onChange?: (selected: string) => void;
  error?: string;
  isSearchable?: boolean;
}

export default function SingleSelect({
  className,
  options,
  label,
  value,
  onChange,
  error,
  isSearchable = false,
}: OptionProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && isSearchable) {
      setSearch("");
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open, isSearchable]);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setOpen(false);
  };

  const displayedOptions = useMemo(() => {
    if (!isSearchable) return options;
    return options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search, isSearchable]);

  const hasValue = Boolean(value);

  return (
    <div ref={containerRef} className={`relative w-full ${className ?? ""}`} style={{ minWidth: "170px" }}>

      {/* Label above */}
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 max-sm:dark:text-slate-500 mb-1.5 ml-0.5 select-none">
        {label}
      </p>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center gap-2 h-11
          pl-4 pr-3 rounded-lg cursor-pointer
          transition-all duration-200 text-left border-l-4
          ${open
            ? "border-l-[var(--color-primary)] bg-[var(--color-primary-lighter)] max-sm:dark:bg-[var(--color-primary)]/10 shadow-md shadow-[var(--color-primary)]/10"
            : hasValue
              ? "border-l-[var(--color-primary)] bg-slate-50 max-sm:dark:bg-[var(--color-childbgdark)] hover:bg-[var(--color-primary-lighter)] max-sm:dark:hover:bg-[var(--color-primary)]/10"
              : "border-l-slate-200 max-sm:dark:border-l-slate-700 bg-slate-50 max-sm:dark:bg-[var(--color-childbgdark)] hover:border-l-[var(--color-primary)]/60 hover:bg-slate-100 max-sm:dark:hover:bg-slate-800/40"
          }
          ${error ? "!border-l-red-400 !bg-red-50" : ""}
        `}
      >
        <span className="flex-1 min-w-0">
          {hasValue ? (
            <span className="inline-flex items-center gap-1.5 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--color-primary)]" />
              <span className="text-[13px] font-semibold text-slate-800 max-sm:dark:text-slate-200 truncate">
                {value}
              </span>
            </span>
          ) : (
            <span className="text-[13px] text-slate-400 max-sm:dark:text-slate-600">
              Select {label}…
            </span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0">
         {/*  {hasValue && (
            <span
              onClick={(e) => { e.stopPropagation(); onChange?.(""); }}
              className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-[var(--color-primary)] transition-all duration-150 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          )} */}
          <ChevronDown
            className={`w-4 h-4 transition-all duration-200 ${open ? "rotate-180 text-[var(--color-primary)]" : "text-slate-400"}`}
          />
        </span>
      </button>

      {/* Dropdown — white in light, dark in dark */}
      <div
        className={`
          absolute left-0 top-[calc(100%+6px)] w-full z-50
          rounded-xl overflow-hidden
          bg-white max-sm:dark:bg-slate-900
          border border-slate-200 max-sm:dark:border-slate-700/60
          shadow-xl shadow-slate-200/80 max-sm:dark:shadow-black/30
          transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-100 pointer-events-auto translate-y-0" : "opacity-0 scale-95 pointer-events-none -translate-y-1"}
        `}
      >
        {isSearchable && (
          <div className="p-2.5 border-b border-slate-100 max-sm:dark:border-slate-700/50">
            <div className="flex items-center gap-2 bg-slate-50 max-sm:dark:bg-slate-800 rounded-lg px-3 py-2 border border-slate-200 max-sm:dark:border-slate-700">
              <Search className="w-3.5 h-3.5 text-slate-400 max-sm:dark:text-slate-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={`Search ${label}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-[13px] bg-transparent outline-none text-slate-700 max-sm:dark:text-slate-200 placeholder:text-slate-400 max-sm:dark:placeholder:text-slate-600"
              />
            </div>
          </div>
        )}

        <ul className="max-h-52 overflow-y-auto custom-scrollbar py-1.5">
          {displayedOptions.length > 0 ? (
            displayedOptions.map((opt, idx) => {
              const isSelected = opt === value;
              return (
                <li
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  className={`
                    flex items-center justify-between gap-3
                    mx-1.5 px-3 py-2.5 rounded-lg cursor-pointer
                    transition-all duration-100 text-[13px]
                    ${isSelected
                      ? "bg-[var(--color-primary)] text-white font-semibold"
                      : "text-slate-700 max-sm:dark:text-slate-300 hover:bg-slate-100 max-sm:dark:hover:bg-slate-800 hover:text-slate-900 max-sm:dark:hover:text-white"
                    }
                  `}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-4 text-[13px] text-slate-400 max-sm:dark:text-slate-500 text-center">
              {isSearchable ? "No results found" : "No options available"}
            </li>
          )}
        </ul>
      </div>

      {error && (
        <p className="text-red-500 text-[11px] mt-1.5 ml-0.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}