import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getAllCustomerFollowups } from "@/store/customerFollowups";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { LucidePieChart } from "lucide-react";


const COLORS = ["#F87171", "#0EA5E9", "#10B981", "#FBBF24", "#A855F7", "#3B82F6"];
const TOP_N = 5;

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="
      bg-white dark:bg-[#0d1117]
      border border-slate-200 dark:border-white/[0.08]
      rounded-xl shadow-xl px-4 py-3 min-w-[150px]
    ">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: item.payload.fill }} />
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
      </div>
      <p className="text-[18px] font-black text-slate-900 dark:text-white leading-none">
        {item.value}
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-600 ml-1.5">
          ({((item.value / item.payload.total) * 100).toFixed(1)}%)
        </span>
      </p>
    </div>
  );
};

const DonutChart = () => {
  const { feedbackStats, setFeedbackStats } = useDashboardData();
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const fetchFeedbackStats = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomerFollowups();
      if (!response || response.length === 0) {
        setFeedbackStats([]);
        setLoading(false);
        return;
      }

      const statusMap: Record<string, number> = {};
      response.forEach((item: any) => {
        const status = item.StatusType || "Unknown";
        if (!statusMap[status]) statusMap[status] = 0;
        statusMap[status] += 1;
      });

      let statsArray = Object.entries(statusMap).map(([name, value]) => ({
        name,
        value,
      }));

      statsArray = statsArray.sort((a, b) => b.value - a.value).slice(0, TOP_N);
      setFeedbackStats(statsArray);
    } catch (error) {
      console.error("Error fetching customer followups:", error);
      setFeedbackStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  const total = feedbackStats.reduce((sum, item) => sum + item.value, 0);

  // Inject total into each data point for tooltip
  const dataWithTotal = feedbackStats.map((d) => ({ ...d, total }));

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if (percent < 0.07) return null;
    return (
      <foreignObject x={x - 18} y={y - 12} width={36} height={24} style={{ pointerEvents: "none" }}>
        <div style={{
          width: "100%", height: "100%", fontSize: "10px",
          fontWeight: "bold", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {`${(percent * 100).toFixed(0)}%`}
        </div>
      </foreignObject>
    );
  };

  return (
    <div className="
      w-full max-w-md mx-auto
      bg-white dark:bg-[#0d1117]
      rounded-2xl overflow-hidden
      border border-slate-100 dark:border-white/[0.06]
      shadow-sm
    ">

      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary)]/10 flex items-center justify-center">
              <LucidePieChart size={16} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">
                Followup Status
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium mt-0.5">
                Top {TOP_N} status types
              </p>
            </div>
          </div>

          {/* Total badge */}
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-black text-slate-800 dark:text-white leading-none">
              {total}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
              total
            </span>
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="px-4 pt-4 pb-2">
        {loading ? (
          <div className="h-[200px] flex flex-col items-center justify-center gap-3">
            <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-white/[0.06] border-t-[var(--color-primary)] animate-spin" />
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600">
              Loading status data…
            </p>
          </div>
        ) : feedbackStats.length === 0 ? (
          <div className="h-[200px] flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center">
              <LucidePieChart size={20} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-[12px] text-slate-400 dark:text-slate-600 font-medium">No status data</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataWithTotal}
                dataKey="value"
                nameKey="name"
                innerRadius="38%"
                outerRadius="72%"
                paddingAngle={3}
                stroke="none"
                label={renderLabel}
                labelLine={false}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                    style={{ transition: "opacity 0.2s", cursor: "pointer" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Legend rows ── */}
      {!loading && feedbackStats.length > 0 && (
        <div className="px-5 pb-4 flex flex-col gap-2">
          {feedbackStats.map((item, index) => {
            const pct = total > 0 ? (item.value / total) * 100 : 0;
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
                  transition-all duration-150
                  ${isActive
                    ? "bg-slate-50 dark:bg-white/[0.05]"
                    : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  }
                `}
              >
                {/* Color swatch */}
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: COLORS[index % COLORS.length] }}
                />

                {/* Name */}
                <span className="flex-1 text-[12px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                  {item.name}
                </span>

                {/* Bar */}
                <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: COLORS[index % COLORS.length],
                    }}
                  />
                </div>

                {/* Count + % */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[12px] font-black text-slate-800 dark:text-white">
                    {item.value}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600">
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          {feedbackStats.length} statuses
        </span>
        <div className="flex items-center gap-1.5">
          {COLORS.slice(0, feedbackStats.length).map((c, i) => {
            return (
              <span key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;