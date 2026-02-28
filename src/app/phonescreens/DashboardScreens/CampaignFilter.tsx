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

export default function CampaignFilter({ leadStatuses }: LeadStatusProps) {
  const router = useRouter();

  const objectcolor = [
    "var(--color-primary)",
  ];

  const handleClick = (name: string) => {
    router.push(`/customer?Campaign=${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen py-2">
      <div className="grid grid-cols-2 gap-2.5">
        {leadStatuses.map((status, index) => {
          const colorIndex = index % objectcolor.length;

          return (
            <button
              key={index}
              onClick={() => handleClick(status.name)}
              className="group relative flex flex-col items-start justify-between p-4 rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-childbgdark)] border border-gray-100 dark:border-white/[0.07] shadow-sm active:scale-[0.97] transition-all duration-150 min-h-[88px] text-left"
            >
              {/* Brand-colored top bar */}
              <span
                className="absolute top-0 inset-x-0 h-[3px] rounded-b-full"
                style={{ backgroundColor: objectcolor[colorIndex] }}
              />

              {/* Faint radial glow */}
              <span
                className="pointer-events-none absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-10 group-active:opacity-20 transition-opacity"
                style={{ backgroundColor: objectcolor[colorIndex] }}
              />

              {/* Index number */}
              <span
                className="text-[10px] font-black tabular-nums mb-2 opacity-40"
                style={{ color: objectcolor[colorIndex] }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Campaign name */}
              <p className="text-sm font-bold text-gray-800 dark:text-white leading-snug tracking-tight break-words line-clamp-2 w-full">
                {status.name}
              </p>

              {/* Bottom row: arrow icon */}
              <div className="flex items-center justify-end w-full mt-2">
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center opacity-60 group-active:opacity-100 transition-opacity"
                  style={{ backgroundColor: `color-mix(in srgb, ${objectcolor[colorIndex]} 12%, transparent)` }}
                >
                  <IoIosArrowForward
                    size={13}
                    style={{ color: objectcolor[colorIndex] }}
                  />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}