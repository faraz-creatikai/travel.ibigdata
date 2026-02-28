"use client";
import React, { useEffect } from 'react'
import ProgressCircle from './ProgressCircle';
import Link from 'next/link';
import { BsArrowRightCircle } from "react-icons/bs";
import { getAllCustomerFollowups } from '@/store/customerFollowups';
import { getCustomer } from '@/store/customer';
import ProgressCircleItem from './ProgressCircleItem';

interface FollowupData {
    percentage: number;
    followups: number;
    totalCustomers: number;
    status: string;
    statusSecondary: string;
    color: string;
}

interface FollowupStatusMetric {
    percentage: number;
    value: number;
    total: number;
    status: string;
    statusSecondary: string;
    color: string;
}

// ── Metric card ───────────────────────────────────────────────────────────────
const MetricCard = ({
    children,
    index,
    accentColor,
}: {
    children: React.ReactNode;
    index: number;
    accentColor: string;
}) => (
    <div
        className="group relative flex flex-col items-center gap-5 pt-6 pb-5 px-4 rounded-3xl bg-gray-50 dark:bg-[#13151f] border border-gray-100 dark:border-white/[0.06] hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden cursor-default"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {/* Top accent bar */}
        <span
            className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
        />
        {/* Faint radial glow behind circle */}
        <span
            className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
            style={{ backgroundColor: accentColor }}
        />
        {children}
    </div>
);

const OwnerFollowups = () => {
    const [followuUpsData, setFollowupsData] = React.useState<FollowupData | null>(null);
    const [wantDemoData, setWantDemoData] = React.useState<FollowupStatusMetric | null>(null);
    const [interestedData, setInterestedData] = React.useState<FollowupStatusMetric | null>(null);
    const [unInterestedData, setUnInterestedData] = React.useState<FollowupStatusMetric | null>(null);

    const getColorByPercentage = (percentage: number, defaultColor: string) => {
        return percentage < 10 ? "#ef4444" : defaultColor;
    };

    useEffect(() => {
        fetchCustomerFollowupData();
    }, []);

    const fetchCustomerFollowupData = async () => {
        const FollowupResponseRaw = await getAllCustomerFollowups();
        const FollowupResponse = FollowupResponseRaw?.map((item: any) => ({
            customerid: item.customer._id,
            StatusType: item.StatusType,
            Date: item.Date,
            _id: item._id,
            Name: item.customer.customerName,
            ContactNumber: item.customer.ContactNumber,
            User: item.customer.AssignTo?.name ?? "",
        }));
        const FollowupsCustomers = FollowupResponse?.filter(
            (item, index, arr) =>
                arr.findIndex((row) => row.customerid === item.customerid) === index
        ).length;

        const totalFollowups = FollowupResponse?.length;

        const interestedFollowups = FollowupResponseRaw?.filter(
            (item: any) => item.StatusType === "interested" || item.StatusType === "Interested"
        ).length;

        const unInterestedFollowups = FollowupResponseRaw?.filter(
            (item: any) => item.StatusType === "not interested" || item.StatusType === "Not Interested"
        ).length;

        const wantDemoFollowups = FollowupResponseRaw?.filter(
            (item: any) => item.StatusType === "want demo" || item.StatusType === "Want Demo"
        ).length;

        const customers = await getCustomer();
        const totalCustomers = customers.length;

        const percentage = totalCustomers ? (FollowupsCustomers! / totalCustomers) * 100 : 0;
        const interestedPercentage = totalFollowups! > 0 ? (interestedFollowups! / totalFollowups!) * 100 : 0;
        const unInterestedPercentage = totalFollowups! > 0 ? (unInterestedFollowups! / totalFollowups!) * 100 : 0;
        const wantDemoPercentage = totalFollowups! > 0 ? (wantDemoFollowups! / totalFollowups!) * 100 : 0;

        setFollowupsData({
            percentage: Math.round(percentage),
            followups: FollowupsCustomers ?? 0,
            totalCustomers: totalCustomers,
            status: " To Followup",
            statusSecondary: " Customer",
            color: getColorByPercentage(Math.round(percentage), "#0EA5E9")
        });
        setInterestedData({
            percentage: Math.round(interestedPercentage),
            value: interestedFollowups ?? 0,
            total: totalFollowups ?? 0,
            status: " Interested ",
            statusSecondary: " Followups",
            color: getColorByPercentage(Math.round(interestedPercentage), "#0EA5E9")
        });
        setUnInterestedData({
            percentage: Math.round(unInterestedPercentage),
            value: unInterestedFollowups ?? 0,
            total: totalFollowups ?? 0,
            status: " Not Interested ",
            statusSecondary: " Followups",
            color: getColorByPercentage(Math.round(unInterestedPercentage), "#0EA5E9")
        });
        setWantDemoData({
            percentage: Math.round(wantDemoPercentage),
            value: wantDemoFollowups ?? 0,
            total: totalFollowups ?? 0,
            status: " Want Demo ",
            statusSecondary: " Followups",
            color: getColorByPercentage(Math.round(wantDemoPercentage), "#0EA5E9")
        });
    };

    return (
        <section className="mt-6 rounded-3xl bg-white dark:bg-[#0c0e16] dark:text-slate-300 border border-gray-100 dark:border-white/[0.05] shadow-sm dark:shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-gray-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-violet-400/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 leading-none mb-0.5">Overview</p>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none tracking-tight">Customer Followup</h2>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Live</span>
                </div>
            </div>

            {/* ── Cards ──────────────────────────────────────────────────────── */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3 p-5">
                {followuUpsData && (
                    <MetricCard index={0} accentColor={followuUpsData.color}>
                        <ProgressCircleItem
                            percentage={followuUpsData.percentage}
                            value={followuUpsData.followups}
                            total={followuUpsData.totalCustomers}
                            status={followuUpsData.status}
                            statusSecondary={followuUpsData.statusSecondary}
                            color={followuUpsData.color}
                        />
                    </MetricCard>
                )}
                {interestedData && (
                    <MetricCard index={1} accentColor={interestedData.color}>
                        <ProgressCircleItem
                            percentage={interestedData.percentage}
                            value={interestedData.value}
                            total={interestedData.total}
                            status={interestedData.status}
                            statusSecondary={interestedData.statusSecondary}
                            color={interestedData.color}
                        />
                    </MetricCard>
                )}
                {unInterestedData && (
                    <MetricCard index={2} accentColor={unInterestedData.color}>
                        <ProgressCircleItem
                            percentage={unInterestedData.percentage}
                            value={unInterestedData.value}
                            total={unInterestedData.total}
                            status={unInterestedData.status}
                            statusSecondary={unInterestedData.statusSecondary}
                            color={unInterestedData.color}
                        />
                    </MetricCard>
                )}
                {wantDemoData && (
                    <MetricCard index={3} accentColor={wantDemoData.color}>
                        <ProgressCircleItem
                            percentage={wantDemoData.percentage}
                            value={wantDemoData.value}
                            total={wantDemoData.total}
                            status={wantDemoData.status}
                            statusSecondary={wantDemoData.statusSecondary}
                            color={wantDemoData.color}
                        />
                    </MetricCard>
                )}
            </div>
        </section>
    );
};

export default OwnerFollowups;