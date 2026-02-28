import React, { useEffect, useState } from 'react'
import { useDashboardData } from '../data/useDashboardSectionOne';
import { getLocation } from '@/store/masters/location/location';
import { getCustomer } from '@/store/customer';
import { LuMapPin, LuUsers } from 'react-icons/lu';

function TableComponent() {
  const { locationStats, setLocationStats } = useDashboardData();
  const [loading, setLoading] = useState(true);

  const fetchLocationStats = async () => {
    try {
      setLoading(true);
      const locations = await getLocation();
      const customers = await getCustomer();

      const locationMap: Record<string, number> = {};
      locations.forEach((loc: any) => {
        locationMap[loc.Name] = 0;
      });

      customers.forEach((customer: any) => {
        const loc = customer.Location || "Unknown";
        if (locationMap[loc] !== undefined) {
          locationMap[loc] += 1;
        }
      });

      const locationArray = Object.entries(locationMap).map(([location, count]) => ({
        location,
        customers: count
      }));
      locationArray.sort((a, b) => b.customers - a.customers);

      setLocationStats(locationArray);
    } catch (error) {
      console.error("Error fetching location stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationStats();
  }, []);

  const maxCustomers = Math.max(...locationStats.map((d) => d.customers), 1);
  const totalCustomers = locationStats.reduce((sum, d) => sum + d.customers, 0);

  // Rank medal colors
  const rankStyle = (index: number) => {
    if (index === 0) return { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-500/20", bar: "bg-amber-400" };
    if (index === 1) return { bg: "bg-slate-50 dark:bg-slate-500/10", text: "text-slate-500 dark:text-slate-400", border: "border-slate-200 dark:border-slate-500/20", bar: "bg-slate-400" };
    if (index === 2) return { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-500/20", bar: "bg-orange-400" };
    return { bg: "", text: "text-slate-400 dark:text-slate-600", border: "border-transparent", bar: "bg-[var(--color-primary)]" };
  };

  return (
    <div className="
      w-full sm:max-w-[500px]
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
              <LuMapPin size={16} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">
                Top Locations
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium mt-0.5">
                Customers by area
              </p>
            </div>
          </div>

          {/* Total pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2">
            <LuUsers size={12} className="text-slate-400 dark:text-slate-600" />
            <span className="text-[12px] font-black text-slate-700 dark:text-slate-300">
              {totalCustomers}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
              total
            </span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 py-3">

        {/* Column headers */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
            Location
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-600">
            Customers
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2 max-h-[230px] overflow-y-auto custom-scrollbar pr-0.5">
          {loading ? (
            // ── Skeleton ──
            <div className="flex flex-col gap-2 py-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-1 py-2.5 animate-pulse">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/[0.05] shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 bg-slate-100 dark:bg-white/[0.05] rounded-full w-2/3" />
                    <div className="h-1.5 bg-slate-100 dark:bg-white/[0.04] rounded-full w-full" />
                  </div>
                  <div className="w-8 h-4 bg-slate-100 dark:bg-white/[0.05] rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : locationStats.length === 0 ? (
            <div className="py-8 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center">
                <LuMapPin size={18} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-[12px] text-slate-400 dark:text-slate-600 font-medium">
                No location data
              </p>
            </div>
          ) : (
            locationStats.map((data, index) => {
              const style = rankStyle(index);
              const pct = Math.round((data.customers / maxCustomers) * 100);

              return (
                <div key={index} className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150">

                  {/* Rank badge */}
                  <div className={`
                    w-6 h-6 rounded-lg flex items-center justify-center shrink-0
                    text-[10px] font-black border
                    ${index < 3 ? `${style.bg} ${style.text} ${style.border}` : "bg-slate-50 dark:bg-white/[0.04] text-slate-400 dark:text-slate-600 border-slate-100 dark:border-white/[0.06]"}
                  `}>
                    {index + 1}
                  </div>

                  {/* Location + bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 truncate leading-none">
                        {data.location}
                      </span>
                      <span className="text-[11px] font-black text-slate-800 dark:text-white ml-2 shrink-0">
                        {data.customers}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1 rounded-full bg-slate-100 dark:bg-white/[0.06]">
                      <div
                        className={`h-1 rounded-full transition-all duration-700 ${index < 3 ? style.bar : "bg-[var(--color-primary)]/60"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Percent */}
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 shrink-0 w-8 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
          {locationStats.length} locations tracked
        </span>
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-sm ${rankStyle(i).bar}`} />
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600">
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableComponent;