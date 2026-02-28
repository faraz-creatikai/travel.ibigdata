"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";
import { getCustomer } from "@/store/customer";
import { LuChartNoAxesColumnIncreasing } from "react-icons/lu";

// -------------------- TYPES --------------------

interface ChartData {
  date: string;
  newVisitor: number;
  oldVisitor: number;
  lastMonth: number;
  avg: number;
}

interface ActiveIndicators {
  oldVisitor: boolean;
  newVisitor: boolean;
  lastMonth: boolean;
  avg: boolean;
}

interface CustomLegendProps {
  activeIndicators: ActiveIndicators;
  toggleIndicator: (key: keyof ActiveIndicators) => void;
}

interface DotProps {
  cx?: number;
  cy?: number;
  stroke?: string;
}

// -------------------- CUSTOM TOOLTIP --------------------

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="
      bg-white dark:bg-[#0d1117]
      border border-slate-200 dark:border-white/[0.08]
      rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-black/40
      px-4 py-3 min-w-[160px]
    ">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-2.5">
        {label}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: entry.color }} />
            <span className="text-[12px] text-slate-600 dark:text-slate-400">{entry.name}</span>
          </div>
          <span className="text-[12px] font-bold text-slate-800 dark:text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// -------------------- CUSTOM LEGEND --------------------

const CustomLegend: React.FC<CustomLegendProps> = ({ activeIndicators, toggleIndicator }) => {
  const indicators = [
    { key: "oldVisitor", label: "Old Customers", color: "#f87171" },
    { key: "newVisitor", label: "New Customers", color: "#dc2626" },
    { key: "lastMonth", label: "Last Month", color: "#22c55e" },
    { key: "avg", label: "Average", color: "#f59e0b" },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {indicators.map((indicator) => (
        <button
          key={indicator.key}
          onClick={() => toggleIndicator(indicator.key)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg
            text-[12px] font-semibold cursor-pointer
            border transition-all duration-150
            ${activeIndicators[indicator.key]
              ? "bg-white dark:bg-white/[0.06] border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 shadow-sm"
              : "bg-transparent border-slate-100 dark:border-white/[0.04] text-slate-400 dark:text-slate-600"
            }
          `}
        >
          <span
            className="w-2.5 h-2.5 rounded-sm shrink-0 transition-opacity duration-150"
            style={{
              background: indicator.color,
              opacity: activeIndicators[indicator.key] ? 1 : 0.3
            }}
          />
          {indicator.label}
        </button>
      ))}
    </div>
  );
};

// -------------------- CUSTOM DOT --------------------

const CustomDot: React.FC<DotProps> = ({ cx, cy, stroke }) => {
  if (!cx || !cy) return null;
  return (
    <circle cx={cx} cy={cy} r={4} fill="#fff" stroke={stroke} strokeWidth={2} />
  );
};

// -------------------- MAIN COMPONENT --------------------

export default function VisitorsChart() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [activeIndicators, setActiveIndicators] = useState<ActiveIndicators>({
    oldVisitor: true,
    newVisitor: true,
    lastMonth: true,
    avg: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCustomer();
      setCustomers(data || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!customers.length) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthShort = now.toLocaleString("default", { month: "short" });

    const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
    const firstDayLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayLastMonth = new Date(currentYear, currentMonth, 0);

    const oldCustomers = customers.filter(
      (c) => new Date(c.createdAt) < firstDayCurrentMonth
    );
    const newCustomers = customers.filter((c) => {
      const d = new Date(c.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const lastMonthCustomers = customers.filter((c) => {
      const d = new Date(c.createdAt);
      return d >= firstDayLastMonth && d <= lastDayLastMonth;
    });

    const groupedByMonth: Record<string, number> = {};
    customers.forEach((c) => {
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      groupedByMonth[key] = (groupedByMonth[key] || 0) + 1;
    });

    const avgPerMonth =
      Object.values(groupedByMonth).reduce((a, b) => a + b, 0) /
      Object.keys(groupedByMonth).length;

    const today = now.getDate();
    const step = Math.ceil(today / 6);
    const result: ChartData[] = [];

    for (let day = 1; day <= today; day += step) {
      const fullDate = new Date(currentYear, currentMonth, day);
      const formattedDate = fullDate.toLocaleString("default", {
        month: "short",
        day: "numeric",
      });
      result.push({
        date: formattedDate,
        newVisitor: newCustomers.filter(
          (c) => new Date(c.createdAt).getDate() <= day
        ).length,
        oldVisitor: oldCustomers.length,
        lastMonth: lastMonthCustomers.length,
        avg: Math.round(avgPerMonth),
      });
    }

    if (!result.find((r) => r.date === `${monthShort} ${today}`)) {
      const lastFullDate = new Date(currentYear, currentMonth, today);
      const lastFormattedDate = lastFullDate.toLocaleString("default", {
        month: "short",
        day: "numeric",
      });
      result.push({
        date: lastFormattedDate,
        newVisitor: newCustomers.length,
        oldVisitor: oldCustomers.length,
        lastMonth: lastMonthCustomers.length,
        avg: Math.round(avgPerMonth),
      });
    }

    setChartData(result);
  }, [customers]);

  const toggleIndicator = (key: keyof ActiveIndicators) => {
    setActiveIndicators((prev) => {
      const activeCount = Object.values(prev).filter(Boolean).length;
      if (activeCount === 1 && prev[key]) return prev;
      return { ...prev, [key]: !prev[key] };
    });
  };

  const hasActiveIndicators = Object.values(activeIndicators).some(Boolean);

  // ── Summary stats ──
  const latest = chartData[chartData.length - 1];

  return (
    <div className="
      w-full
      bg-white dark:bg-[#0d1117]
      rounded-2xl overflow-hidden
      border border-slate-100 dark:border-white/[0.06]
      shadow-sm
    ">
      {/* ── Header ── */}
      <div className="
        flex flex-col sm:flex-row sm:items-center justify-between gap-4
        px-6 py-5
        border-b border-slate-100 dark:border-white/[0.06]
      ">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary)]/10 flex items-center justify-center">
            <LuChartNoAxesColumnIncreasing
              size={17}
              className="text-[var(--color-primary)]"
            />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-slate-800 dark:text-white leading-tight">
              Customer Overview
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-600 font-medium mt-0.5">
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini stat pills */}
          {latest && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
                  {latest.newVisitor} new
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {latest.lastMonth} last mo.
                </span>
              </div>
            </div>
          )}

          {/* Reset button */}
          <button
            onClick={() =>
              setActiveIndicators({
                oldVisitor: true,
                newVisitor: true,
                lastMonth: true,
                avg: true,
              })
            }
            className="
              flex items-center gap-1.5 h-8 px-3.5 rounded-lg cursor-pointer
              text-[12px] font-semibold
              bg-[var(--color-primary-lighter)] text-[var(--color-primary)]
              hover:bg-[var(--color-primary)] hover:text-white
              border border-[var(--color-primary)]/20 hover:border-transparent
              transition-all duration-200
            "
          >
            All
          </button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="px-6 pt-4 pb-0">
        <CustomLegend
          activeIndicators={activeIndicators}
          toggleIndicator={toggleIndicator}
        />
      </div>

      {/* ── Chart ── */}
      <div className="px-4 pt-2 pb-4">
        {hasActiveIndicators ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              margin={{ top: 16, right: 16, left: -10, bottom: 0 }}
              barGap={-19}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E2E8F0"
                opacity={0.6}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(148,163,184,0.06)", radius: 4 }}
              />

              {activeIndicators.oldVisitor && (
                <Bar
                  dataKey="oldVisitor"
                  fill="#f87171"
                  barSize={22}
                  name="Old Customers"
                  radius={[4, 4, 0, 0]}
                />
              )}
              {activeIndicators.newVisitor && (
                <Bar
                  dataKey="newVisitor"
                  fill="#dc2626"
                  barSize={14}
                  name="New Customers"
                  radius={[4, 4, 0, 0]}
                />
              )}
              {activeIndicators.lastMonth && (
                <Line
                  type="monotone"
                  dataKey="lastMonth"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={<CustomDot stroke="#22c55e" />}
                  name="Last Month"
                />
              )}
              {activeIndicators.avg && (
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={<CustomDot stroke="#f59e0b" />}
                  name="Average"
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[260px] flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center">
              <LuChartNoAxesColumnIncreasing size={20} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-[13px] text-slate-400 dark:text-slate-600 font-medium">
              No indicators selected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}