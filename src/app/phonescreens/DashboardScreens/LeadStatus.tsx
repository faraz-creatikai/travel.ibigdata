"use client";
import { IoIosArrowForward } from "react-icons/io";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

interface LeadStatusItem {
  name: string;
}

interface LeadStatusProps {
  leadStatuses: LeadStatusItem[];
}

export default function LeadStatus({ leadStatuses }: LeadStatusProps) {
  const router = useRouter();

  const objectcolor = [
    "#7C3AED",
    "#3B82F6",
    "#F97316",
    "#22C55E",
    "#8B5CF6",
    "#9CA3AF",
    "#FB923C",
  ];

  const handleClick = (name: string) => {
    router.push(`/followups/customer?StatusType=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen py-2">
      <div className="flex flex-col gap-2">
        {leadStatuses.map((status, index) => {
          const color = objectcolor[index % objectcolor.length];

          return (
            <button
              key={index}
              onClick={() => handleClick(status.name)}
              className="group relative flex items-center justify-between w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[var(--color-childbgdark)] border border-gray-100 dark:border-white/[0.07] shadow-sm active:scale-[0.98] transition-all duration-150 overflow-hidden text-left"
            >
              {/* Left color strip */}
              <span
                className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                style={{ backgroundColor: color }}
              />

              {/* Faint glow on left */}
              <span
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 opacity-[0.04] group-active:opacity-[0.08] transition-opacity"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
              />

              <div className="flex items-center gap-3 pl-3">
                {/* Color dot */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-white tracking-tight">
                  {status.name}
                </span>
              </div>

              {/* Right: index + arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[10px] font-black tabular-nums opacity-30"
                  style={{ color }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
                >
                  <IoIosArrowForward size={12} style={{ color }} />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}