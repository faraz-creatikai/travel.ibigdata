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
      icon: <BrickWallFire size={28} />,
      gradient: "from-rose-500 to-orange-500",
      glow: "shadow-rose-500/30",
      bgMuted: "bg-rose-500/10",
      textAccent: "text-rose-400",
      url: `${admin?.role !== "administrator" ? "/masters/campaign/allcampaigns" : "/masters/campaign"}`,
    },
    {
      pTag: "Customer",
      icon: <Podcast size={28} />,
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/30",
      bgMuted: "bg-violet-500/10",
      textAccent: "text-violet-400",
      url: "/customer",
    },
    {
      pTag: "Followups",
      icon: <School size={28} />,
      gradient: "from-teal-400 to-cyan-600",
      glow: "shadow-teal-500/30",
      bgMuted: "bg-teal-500/10",
      textAccent: "text-teal-400",
      url: "/followups/customer",
    },
    {
      pTag: "Favorites",
      icon: <ShieldUser size={28} />,
      gradient: "from-blue-500 to-indigo-600",
      glow: "shadow-blue-500/30",
      bgMuted: "bg-blue-500/10",
      textAccent: "text-blue-400",
      url: "/favourites",
    },
    {
      pTag: "Report",
      icon: <Cable size={28} />,
      gradient: "from-emerald-400 to-green-600",
      glow: "shadow-emerald-500/30",
      bgMuted: "bg-emerald-500/10",
      textAccent: "text-emerald-400",
      url: "/reports/customer",
    },
    {
      pTag: "Status Type",
      icon: <NotebookTabs size={28} />,
      gradient: "from-slate-400 to-slate-600",
      glow: "shadow-slate-500/30",
      bgMuted: "bg-slate-500/10",
      textAccent: "text-slate-400",
      url: "/masters/status-type",
    },
  ];

  return (
    <div className="flex flex-col  dark:bg-[#0c0e16] min-h-[calc(100vh-80px)] rounded-b-md">

      {/* Image Slider */}
      <div className="rounded-b-3xl overflow-hidden shadow-xl">
        <ImageSlider />
      </div>

     <div className=" mt-5">
       {/* Section label */}
      <div className="flex items-center gap-2 px-4 pb-2 ">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500">
          Quick Access
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-white/10 to-transparent" />
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 pt-2">
        {boxeButtons.map((data, index) => (
          <Link
            key={index}
            href={data?.url ?? ""}
            className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#13151f] border border-gray-100 dark:border-white/[0.06] shadow-sm active:scale-95 transition-all duration-200"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            {/* Top gradient bar */}
            <span
              className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${data.gradient} opacity-80 group-active:opacity-100`}
            />

            <div className="flex flex-col items-start gap-3 p-4 pt-5">
              {/* Icon blob */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${data.bgMuted}
                  group-active:scale-95 transition-transform duration-150
                `}
              >
                {/* Gradient icon via clip */}
                <span
                  className={` bg-linear-to-br ${data.gradient} w-full h-full flex justify-center items-center rounded-md text-white [&>svg]:stroke-current`}
                  style={{ display: "flex" }}
                >
                  {data.icon}
                </span>
              </div>

              {/* Label */}
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                  {data.pTag}
                </p>
                {/* Subtle arrow indicator */}
                <p className={`text-[10px] font-semibold mt-0.5 tracking-wide ${data.textAccent} flex items-center gap-0.5`}>
                  Open
                  <svg className="w-2.5 h-2.5 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </p>
              </div>
            </div>

            {/* Bottom-right glow on hover */}
            <span
              className={`
                pointer-events-none absolute -bottom-4 -right-4
                w-16 h-16 rounded-full blur-2xl
                bg-gradient-to-br ${data.gradient}
                opacity-0 group-active:opacity-30 transition-opacity duration-300
              `}
            />
          </Link>
        ))}
      </div>
     </div>
    </div>
  );
};

export default SmallScreenData;