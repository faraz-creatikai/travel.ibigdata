"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getAllCustomerFollowups } from "@/store/customerFollowups";
import { LuCalendarRange, LuTrendingUp } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";

type ChartMonth = {
  name: string;
  followups: number;
};

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">{label}</p>
      <p className="text-[18px] font-black text-white leading-none">
        {payload[0].value}
        <span className="text-[11px] font-medium text-white/60 ml-1">followups</span>
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { followupByMonths, setFollowupByMonths } = useDashboardData();
  const [chartData, setChartData] = useState<ChartMonth[]>([]);

  const fetchAllFollowups = async () => {
    const apiData = await getAllCustomerFollowups();
    if (!apiData) return [];

    const now = new Date();

    const parseDDMMYYYY = (dateStr: string) => {
      const [day, month, year] = dateStr.split("-");
      return new Date(Number(year), Number(month) - 1, Number(day));
    };

    const months = Array.from({ length: 4 }).map((_, index) => {
      const d = new Date(now.getFullYear(), now.getMonth() + index, 1);
      return {
        month: d.getMonth(),
        year: d.getFullYear(),
        label: d.toLocaleString("default", { month: "short" }),
        count: 0,
      };
    });

    apiData.forEach((item: any) => {
      if (!item.StartDate && !item.FollowupNextDate) return;
      const startDate = item.StartDate ? new Date(item.StartDate) : null;
      const followupDate = item.FollowupNextDate ? parseDDMMYYYY(item.FollowupNextDate) : null;
      const checkDate = followupDate || startDate;
      if (!checkDate) return;

      months.forEach((m) => {
        if (checkDate.getMonth() === m.month && checkDate.getFullYear() === m.year) {
          m.count += 1;
        }
      });
    });

    return months;
  };

  useEffect(() => {
    const loadFollowups = async () => {
      try {
        const months = await fetchAllFollowups();
        if (!months || months.length === 0) return;

        const formattedChart = months.map((m) => ({
          name: m.label,
          followups: m.count,
        }));

        setChartData(formattedChart);
        setFollowupByMonths({
          thisMonth: months[0]?.count ?? 0,
          nextMonth: months[1]?.count ?? 0,
        });
      } catch (error) {
        console.error("Error fetching followups:", error);
      }
    };

    loadFollowups();
  }, []);

  const maxVal = Math.max(...chartData.map((d) => d.followups), 1);

  return (
    <div className="relative h-full lg:w-[440px] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/20">

      {/* ── Deep gradient background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900" />

      {/* ── Mesh overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Glow blobs ── */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative flex flex-col h-full">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center">
                  <LuCalendarRange size={13} className="text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
                  Followup Schedule
                </p>
              </div>
              <h2 className="text-[20px] font-black text-white leading-tight tracking-tight">
                Monthly Followups
              </h2>
            </div>

            {/* Trend badge */}
            <div className="flex flex-col items-end gap-1.5 mt-1">
              <div className="flex items-center gap-1.5 bg-white/15 border border-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                <FaArrowTrendUp className="text-emerald-300 text-[11px]" />
                <span className="text-[12px] font-black text-white">
                  {followupByMonths.thisMonth.toString() + followupByMonths.nextMonth.toString()}
                </span>
              </div>
              <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">
                2-mo total
              </span>
            </div>
          </div>
        </div>

        {/* ── Chart ── */}
        <div className="flex-1 px-3 pt-2">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)", radius: 6 }}
                content={<CustomTooltip />}
              />
              <Bar dataKey="followups" barSize={28} radius={[8, 8, 0, 0]} name="Followups">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.followups === maxVal
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.35)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Stats footer ── */}
        <div className="mx-5 mb-5 mt-1">
          <div className="
            grid grid-cols-2 gap-3
            bg-white/10 backdrop-blur-sm
            border border-white/15
            rounded-2xl overflow-hidden p-1
          ">

            {/* This month */}
            <div className="flex flex-col items-center justify-center py-3 px-4 rounded-xl bg-white/10">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/50 mb-1.5">
                This Month
              </p>
              <p className="text-[28px] font-black text-white leading-none tracking-tight">
                {followupByMonths.thisMonth}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-[9px] font-semibold text-emerald-300/80 uppercase tracking-wider">
                  Active
                </span>
              </div>
            </div>

            {/* Next month */}
            <div className="flex flex-col items-center justify-center py-3 px-4 rounded-xl">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/50 mb-1.5">
                Next Month
              </p>
              <p className="text-[28px] font-black text-white/80 leading-none tracking-tight">
                {followupByMonths.nextMonth}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <LuTrendingUp size={10} className="text-white/40" />
                <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;