"use client";

import { BrickWallFire, Podcast, School, Cable, ShieldUser, NotebookTabs } from "lucide-react";
import ImageSlider from "./ImageSlider";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const SmallScreenData = () => {
  const { admin, isLoading, login } = useAuth();

  const boxeButtons = [
    {
      pTag: "Campaigns",
      icon: <BrickWallFire size={24} />,
      gradient: "from-rose-500 to-orange-500",
      glow: "shadow-rose-500/30",
      bgMuted: "bg-rose-500/10",
      textAccent: "text-rose-400",
      gradientFrom: "#f43f5e",
      gradientTo: "#f97316",
      desc: "Manage & track active campaigns",
      url: `${admin?.role !== "administrator" ? "/masters/campaign/allcampaigns" : "/masters/campaign"}`,
    },
    {
      pTag: "Customer",
      icon: <Podcast size={24} />,
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/30",
      bgMuted: "bg-violet-500/10",
      textAccent: "text-violet-400",
      gradientFrom: "#8b5cf6",
      gradientTo: "#7c3aed",
      desc: "View and manage all customers",
      url: "/customer",
    },
    {
      pTag: "Followups",
      icon: <School size={24} />,
      gradient: "from-teal-400 to-cyan-600",
      glow: "shadow-teal-500/30",
      bgMuted: "bg-teal-500/10",
      textAccent: "text-teal-400",
      gradientFrom: "#2dd4bf",
      gradientTo: "#0891b2",
      desc: "Pending & scheduled followups",
      url: "/followups/customer",
    },
    {
      pTag: "Favorites",
      icon: <ShieldUser size={24} />,
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/30",
      bgMuted: "bg-blue-500/10",
      textAccent: "text-blue-400",
      gradientFrom: "#3b82f6",
      gradientTo: "#4f46e5",
      desc: "Your saved & starred leads",
      url: "/favourites",
    },
    {
      pTag: "Report",
      icon: <Cable size={24} />,
      gradient: "from-emerald-400 to-green-600",
      glow: "shadow-emerald-500/30",
      bgMuted: "bg-emerald-500/10",
      textAccent: "text-emerald-400",
      gradientFrom: "#34d399",
      gradientTo: "#16a34a",
      desc: "Analytics, charts & exports",
      url: "/reports/customer",
    },
    {
      pTag: "Status Type",
      icon: <NotebookTabs size={24} />,
      gradient: "from-slate-400 to-slate-600",
      glow: "shadow-slate-500/30",
      bgMuted: "bg-slate-500/10",
      textAccent: "text-slate-400",
      gradientFrom: "#94a3b8",
      gradientTo: "#475569",
      desc: "Configure lead status labels",
      url: "/masters/status-type",
    },
  ];

  const featured = boxeButtons.slice(0, 2);
  const grid = boxeButtons.slice(2);

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-[#0c0e16] min-h-[calc(100vh-80px)]">

      {/* ── Slider ────────────────────────────────────────────────────────── */}
      <div className="rounded-b-3xl overflow-hidden shadow-xl">
        <ImageSlider />
      </div>

      <div className="px-4 pt-5 pb-8 space-y-5">

        {/* ── Header row ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-gray-400 dark:text-gray-500">Dashboard</p>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight leading-none mt-0.5">Quick Access</h2>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Live</span>
          </div>
        </div>

        {/* ── Featured: horizontal cards (first 2) ──────────────────────── */}
        <div className="space-y-2">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600 px-0.5">Primary</p>
          {featured.map((data, index) => (
            <Link
              key={index}
              href={data.url ?? ""}
              className="group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl overflow-hidden bg-white dark:bg-[#13151f] border border-gray-100 dark:border-white/[0.06] shadow-sm active:scale-[0.98] transition-all duration-150"
            >
              {/* Left color strip */}
              <span
                className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                style={{ background: `linear-gradient(180deg, ${data.gradientFrom}, ${data.gradientTo})` }}
              />
              {/* Right ambient wash */}
              <span
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 opacity-[0.04]"
                style={{ background: `linear-gradient(270deg, ${data.gradientFrom}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ml-2"
                style={{ background: `linear-gradient(135deg, ${data.gradientFrom}, ${data.gradientTo})` }}
              >
                <span className="text-white">{data.icon}</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{data.pTag}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{data.desc}</p>
              </div>

              {/* Arrow */}
              <span
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in srgb, ${data.gradientFrom} 12%, transparent)` }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: data.gradientFrom }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* ── Section divider ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.05]" />
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-300 dark:text-gray-600">More</span>
          <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.05]" />
        </div>

        {/* ── 2-col grid (remaining 4) ──────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5">
          {grid.map((data, index) => (
            <Link
              key={index}
              href={data.url ?? ""}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#13151f] border border-gray-100 dark:border-white/[0.06] shadow-sm active:scale-[0.97] transition-all duration-150"
            >
              {/* Top gradient bar */}
              <span
                className="absolute top-0 inset-x-0 h-[2.5px]"
                style={{ background: `linear-gradient(90deg, ${data.gradientFrom}, ${data.gradientTo})` }}
              />

              <div className="flex flex-col gap-2 p-3.5 pt-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${data.gradientFrom}, ${data.gradientTo})` }}
                >
                  <span className="text-white">{data.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{data.pTag}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-snug line-clamp-2">{data.desc}</p>
                </div>
                <div className="flex items-center gap-1" style={{ color: data.gradientFrom }}>
                  <span className="text-[9px] font-bold tracking-wider uppercase">Open</span>
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <span
                className="pointer-events-none absolute -bottom-3 -right-3 w-14 h-14 rounded-full blur-2xl opacity-0 group-active:opacity-20 transition-opacity"
                style={{ backgroundColor: data.gradientFrom }}
              />
            </Link>
          ))}
        </div>

        {/* ── Bottom stat strip ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-[#13151f] border border-gray-100 dark:border-white/[0.06]">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--color-primary)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Modules</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">{boxeButtons.length} Active</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-[#13151f] border border-gray-100 dark:border-white/[0.06]">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-500/10">
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</p>
              <p className="text-sm font-black text-gray-900 dark:text-white">All Systems OK</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmallScreenData;