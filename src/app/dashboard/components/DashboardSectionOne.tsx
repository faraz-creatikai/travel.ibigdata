"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { LuCalendar, LuChartNoAxesColumnIncreasing, LuCalendarRange } from "react-icons/lu";
import { getCustomer } from "@/store/customer";
import { useDashboardData } from "../data/useDashboardSectionOne";
import { getAllCustomerFollowups } from "@/store/customerFollowups";
import { getIncomeMarketing } from "@/store/financial/incomemarketing/incomemarketing";
import { getContact } from "@/store/contact";

export default function DashboardSectionOne() {
  const { dashboardSectionOneCardData, setDashboardSectionOneCardData } = useDashboardData();
  const [dataLoading, setDataLoading] = useState(false);

  const [counts, setCounts] = useState<number[]>(
    dashboardSectionOneCardData.map(() => 0)
  );
  const countersRef = useRef<HTMLDivElement | null>(null);
  const [countersInView, setCountersInView] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setCountersInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => {
      if (countersRef.current) observer.unobserve(countersRef.current);
    };
  }, []);

  useEffect(() => {
    DashboardSectionOneDataFetch();
  }, []);

  const DashboardSectionOneDataFetch = async () => {
    const LeadsResponse = await getCustomer();
    const FollowupResponseRaw = await getAllCustomerFollowups();
    const ContactResponse = await getContact();

    const FollowupResponse = FollowupResponseRaw?.map((item: any) => ({
      customerid: item.customer._id,
      StatusType: item.StatusType,
      Date: item.Date,
      _id: item._id,
      Name: item.customer.customerName,
      ContactNumber: item.customer.ContactNumber,
      User: item.customer.AssignTo?.name ?? "",
    }));

    const IncomeResponse = await getIncomeMarketing();

    if (LeadsResponse && FollowupResponse && IncomeResponse && ContactResponse) {
      const totalCustomer = LeadsResponse.length;
      const totalContacts = ContactResponse.length;
      const convertedLeads = FollowupResponse.filter(
        (item: any, index: number, arr: any[]) =>
          arr.findIndex((row: any) => row.customerid === item.customerid) === index
      ).length;
      const activeFollowups = FollowupResponse.filter(
        (item: any) => item.StatusType === "Active"
      ).length;
      const totalRevenue = IncomeResponse.reduce(
        (sum: number, item: any) => sum + (Number(item.Income) || 0), 0
      );

      setDashboardSectionOneCardData((prev: any) => {
        const newData = [...prev];
        newData[0] = { ...newData[0], value: totalCustomer || 0 };
        newData[1] = { ...newData[1], value: convertedLeads || 0 };
        newData[2] = { ...newData[2], value: totalContacts || 0 };
        newData[3] = { ...newData[3], value: totalRevenue || 0, prefix: "₹" };
        setDataLoading(true);
        return newData;
      });
    }
  };

  useEffect(() => {
    if (!countersInView) return;
    const intervals: number[] = [];

    dashboardSectionOneCardData.forEach((item: any, index: number) => {
      const increment = item.value < 10 ? 1 : Math.ceil(item.value / 50);
      const intervalTime = item.value < 10 ? 200 : 30;

      if (dataLoading) {
        const intervalId = window.setInterval(() => {
          setCounts((prev) => {
            const newCounts = [...prev];
            if (newCounts[index] < item.value) {
              newCounts[index] = Math.min(newCounts[index] + increment, item.value);
            }
            return newCounts;
          });
        }, intervalTime);
        intervals.push(intervalId);
      }
    });

    return () => intervals.forEach((id) => clearInterval(id));
  }, [countersInView, dashboardSectionOneCardData]);

  return (
    <div ref={countersRef}>
      <section className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        {dashboardSectionOneCardData.map((item: any, index: number) => (
          <div
            key={index}
            className="
              group relative
              bg-white dark:bg-[#0d1117]
              rounded-2xl overflow-hidden
              border border-slate-100 dark:border-white/[0.06]
              hover:shadow-lg hover:shadow-slate-200/70 dark:hover:shadow-black/30
              hover:border-slate-200 dark:hover:border-white/[0.1]
              transition-all duration-200 cursor-default
            "
          >
            {/* ── Gradient top border ── */}
            <div className={`h-[3px] w-full bg-gradient-to-r ${item.footerlineColor}`} />

            <div className="px-5 py-2">
              {/* ── Top row: icon + live badge ── */}
              <div className="flex items-center justify-between mb-3">

                {/* Icon badge */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  text-white text-[17px] shrink-0
                  bg-gradient-to-br ${item.footerlineColor}
                  shadow-sm
                  group-hover:scale-105 transition-transform duration-200
                `}>
                  {item.icon}
                </div>

                {/* Live pulse */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 bg-gradient-to-br ${item.footerlineColor}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 bg-gradient-to-br ${item.footerlineColor}`} />
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-wider">
                    Live
                  </span>
                </div>
              </div>

              {/* ── Metric ── */}
              <div className="mb-1">
                <p className="text-[24px] font-black text-slate-800 dark:text-white leading-none tracking-tight">
                  {item.prefix || ""}
                  {counts[index].toLocaleString()}
                </p>
              </div>

              {/* ── Label ── */}
              <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-[0.12em]">
                {item.name}
              </p>
            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-2.5 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-600">
                <LuChartNoAxesColumnIncreasing size={12} />
                <span className="text-[11px] font-medium">Total</span>
              </div>
              <div className={`
                flex items-center gap-1
                text-[11px] font-bold
                text-transparent bg-clip-text bg-gradient-to-r ${item.footerlineColor}
              `}>
                <FaArrowTrendUp className={`text-[10px] text-transparent bg-clip-text bg-gradient-to-r ${item.footerlineColor}`} style={{ WebkitTextFillColor: 'currentColor' }} />
                <span>{dataLoading ? counts[index].toLocaleString() : "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}