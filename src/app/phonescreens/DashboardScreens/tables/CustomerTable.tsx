"use client";

import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { MdPhone, MdEmail } from "react-icons/md";
import { FaEye, FaWhatsapp } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

import { AiOutlineBackward, AiOutlineForward } from "react-icons/ai"
import { IoIosHeart, IoMdClose } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PopupMenu from "@/app/component/popups/PopupMenu";
import { GoArrowLeft } from "react-icons/go";
import CustomerImageSlider from "@/app/component/slides/CustomerImageSlider";
import { UserPlus } from "lucide-react";

export interface LabelConfig {
    key: string;
    label: string;
}

interface LeadsSectionProps<T extends Record<string, any>> {
    leads: T[];
    labelLeads: LabelConfig[];
    allLabelLeads?: LabelConfig[];
    isCustomerPage?: boolean
    onAdd?: (id: string) => void;
    onEdit?: (id: string) => void;
    onWhatsappClick?: (lead: T) => void;
    onMailClick?: (lead: T) => void;
    onFavourite?: (lead: T) => void;
    onViewFollowup?: (id: string, Name: string) => void;
    onGoogleMapViewAddress?: (Address: string) => void;
    loader?: boolean;
    hasMoreCustomers?: boolean;
    fetchMore?: () => Promise<void>;
    duplicateContacts?: Record<string, boolean>;
    onViewDuplicate?: (contactNumber: string) => void;
}

export default function CustomerTable<T extends Record<string, any>>({
    leads,
    labelLeads,
    allLabelLeads,
    onAdd,
    onEdit,
    onWhatsappClick,
    onMailClick,
    onFavourite,
    onViewFollowup,
    loader,
    hasMoreCustomers,
    fetchMore,
    duplicateContacts,
    onViewDuplicate,
    onGoogleMapViewAddress,
}: LeadsSectionProps<T>) {
    const [toggleSearchDropdown, setToggleSearchDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperpage = 10;
    const [viewAll, setViewAll] = useState(false);
    const [viewLeadData, setViewLeadData] = useState<T | null>(null);

    const totalPages = Math.ceil(leads.length / itemsperpage);
    const startIndex = (currentPage - 1) * itemsperpage;
    const paginatedLeads = leads.slice(startIndex, startIndex + itemsperpage);

    const router = useRouter();

    const nextPage = async () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            return;
        }
        if (hasMoreCustomers && fetchMore) {
            await fetchMore();
            const newTotalPages = Math.ceil((leads.length + itemsperpage) / itemsperpage);
            if (currentPage < newTotalPages) {
                setCurrentPage(prev => prev + 1);
            }
        }
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    }

    const getDisplayedPages = () => {
        if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage === 1) return [1, 2, 3];
        if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
        return [currentPage - 1, currentPage, currentPage + 1];
    };
    const pages = getDisplayedPages();

    const followupRedirect = () => {
        router.push('/followups/customer');
    }

    // ── Loading state ──────────────────────────────────────────────────────────
    if (loader) {
        return (
            <div className="px-3 pb-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="mb-3 rounded-2xl overflow-hidden bg-white dark:bg-[var(--color-childbgdark)] border border-gray-100 dark:border-white/[0.06] animate-pulse">
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10" />
                        <div className="p-4 flex gap-4">
                            <div className="flex-1 space-y-2.5">
                                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full w-3/4" />
                                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full w-1/2" />
                                <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full w-2/3" />
                            </div>
                            <div className="w-[100px] h-[70px] rounded-xl bg-gray-100 dark:bg-white/10" />
                        </div>
                        <div className="h-12 bg-gray-50 dark:bg-white/5 mx-3 mb-3 rounded-xl" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {/* ── Detail popup ──────────────────────────────────────────────────── */}
            {viewAll && (
                <PopupMenu onClose={() => { setViewAll(false) }}>
                    <div className="bg-white dark:bg-[var(--color-childbgdark)] relative w-full h-full flex flex-col">
                        <button
                            className="absolute top-3 left-3 cursor-pointer z-[2000] bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-100 dark:border-white/10 rounded-full p-1.5 shadow-sm"
                            onClick={() => { setViewAll(false); setViewLeadData(null); }}
                        >
                            <GoArrowLeft size={22} className="text-gray-700 dark:text-white" />
                        </button>

                        <CustomerImageSlider
                            images={viewLeadData?.CustomerImage?.length ? viewLeadData.CustomerImage : ["/siteplan2.png"]}
                        />

                        <div className="max-h-[calc(80vh-240px)] absolute top-[380px] w-full bg-white dark:bg-[var(--color-childbgdark)] overflow-y-auto px-4 py-6 rounded-t-3xl">
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
                                <h2 className="text-base font-bold tracking-tight px-2" style={{ color: "var(--color-primary)" }}>
                                    Customer Information
                                </h2>
                                <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
                            </div>

                            <div className="space-y-2">
                                {allLabelLeads?.map((item, j) => (
                                    <div
                                        key={j}
                                        className={`flex ${viewLeadData?.[item.key]?.length > 30 ? "flex-col gap-1.5" : "items-center justify-between"} p-3 bg-gray-50 dark:bg-[var(--color-secondary-darker)] rounded-xl`}
                                    >
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-[var(--color-txtlight)]">
                                            {item.label}
                                        </span>

                                        {item.label === "Contact No" ? (
                                            <a
                                                href={`tel:+91${viewLeadData?.[item.key] ?? ""}`}
                                                className="text-sm font-semibold hover:underline"
                                                style={{ color: "var(--color-primary)" }}
                                            >
                                                {viewLeadData?.[item.key] ?? ""}
                                            </a>
                                        ) : item.label === "Address" ? (
                                            <span
                                                className="text-sm font-medium underline cursor-pointer text-right"
                                                style={{ color: "var(--color-primary)" }}
                                                onClick={() => onGoogleMapViewAddress?.(viewLeadData?.[item.key])}
                                            >
                                                {viewLeadData?.[item.key] ?? ""}
                                            </span>
                                        ) : (
                                            <span className={`text-sm font-medium text-gray-800 dark:text-[var(--color-txtlight)] ${viewLeadData?.[item.key]?.length > 30 ? "w-full" : "text-right max-w-[60%]"}`}>
                                                {viewLeadData?.[item.key] ?? ""}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopupMenu>
            )}

            {/* ── Lead cards ────────────────────────────────────────────────────── */}
            <div className="px-3 pb-4 space-y-3">
                {paginatedLeads.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">No customers available</p>
                    </div>
                )}

                {paginatedLeads.map((lead, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04, duration: 0.22 }}
                        className="w-full bg-white dark:bg-[var(--color-childbgdark)] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/[0.06] shadow-sm dark:shadow-none"
                    >
                        {/* Top brand stripe */}
                        <div className="h-1" style={{ background: "var(--color-primary)" }} />

                        {/* Card body */}
                        <div className="flex gap-3 p-4">
                            {/* ── Left: lead info ───────────────────────────────── */}
                            <div className="flex-1 min-w-0">
                                {labelLeads.map((item, j) => (
                                    <div key={j} className="flex items-baseline gap-1.5 mb-1.5">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-[var(--color-primary-light)] shrink-0 w-[72px]">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] text-gray-300 dark:text-white/20 shrink-0">·</span>
                                        <span className="text-sm font-medium text-gray-800 dark:text-[var(--color-primary-lighter)] truncate">
                                            {String(lead[item.key])}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Right: image + action buttons ─────────────────── */}
                            <div className="flex flex-col items-center gap-2.5 shrink-0">
                                {/* Thumbnail */}
                                <div
                                    className="w-[88px] h-[64px] rounded-xl overflow-hidden bg-gray-100 dark:bg-[var(--color-secondary-darker)] border border-gray-100 dark:border-white/[0.06] cursor-pointer active:scale-95 transition-transform"
                                    onClick={() => { setViewAll(true); setViewLeadData(lead); }}
                                >
                                    <img
                                        width={88}
                                        className={`w-full h-full ${lead.SitePlan?.length > 0 ? "object-cover" : "object-contain p-2"}`}
                                        src={lead.SitePlan?.length > 0 ? lead.SitePlan : "/siteplan2.png"}
                                    />
                                </div>

                                {/* Row 1: followup + favourite */}
                                <div className="flex gap-2 w-full justify-between">
                                    <button
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-all active:scale-95"
                                        style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
                                        onClick={() => onViewFollowup?.(lead._id, lead.Name)}
                                    >
                                        <UserPlus size={15} style={{ color: "var(--color-primary)" }} />
                                    </button>
                                    <button
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm bg-gray-50 dark:bg-white/[0.05] transition-all active:scale-95"
                                        onClick={() => onFavourite?.(lead)}
                                    >
                                        {lead.isFavourite
                                            ? <IoIosHeart size={17} style={{ color: "var(--color-primary)" }} />
                                            : <AiOutlineHeart size={17} className="text-gray-400 dark:text-gray-500" />
                                        }
                                    </button>
                                </div>

                                {/* Row 2: duplicate eye + edit */}
                                <div className="flex gap-2 w-full justify-between">
                                    {duplicateContacts?.[String(lead.ContactNumber)] ? (
                                        <button
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-all active:scale-95"
                                            style={{ backgroundColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)" }}
                                            onClick={() => onViewDuplicate?.(String(lead.ContactNumber))}
                                        >
                                            <FaEye size={14} style={{ color: "var(--color-primary)" }} />
                                        </button>
                                    ) : <div className="w-8" />}
                                    <button
                                        className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center shadow-sm transition-all active:scale-95"
                                        onClick={() => onEdit?.(lead._id)}
                                    >
                                        <MdEdit size={16} style={{ color: "var(--color-primary)" }} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ── Action footer ─────────────────────────────────────── */}
                        <div
                            className="flex items-center justify-between px-4 py-2.5 mx-3 mb-3 rounded-xl"
                            style={{ backgroundColor: "var(--color-primary)" }}
                        >
                            <button
                                onClick={() => onAdd?.(lead._id)}
                                className="flex items-center gap-1.5 text-white text-xs font-bold tracking-wider uppercase border border-white/30 rounded-full px-3 py-1.5 active:scale-95 transition-transform"
                            >
                                <UserPlus size={12} />
                                Follow Up
                            </button>

                            <div className="flex items-center gap-4">
                                <a
                                    href={`tel:+91${String(lead["ContactNumber"]) ?? String(lead["ContactNo"]) ?? ""}`}
                                    className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors"
                                    onClick={() => onAdd?.(lead._id)}
                                >
                                    <MdPhone size={17} className="text-white" />
                                </a>
                                <button
                                    onClick={() => onMailClick?.(lead)}
                                    className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors"
                                >
                                    <MdEmail size={17} className="text-white" />
                                </button>
                                <button
                                    onClick={() => onWhatsappClick?.(lead)}
                                    className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center active:bg-white/25 transition-colors"
                                >
                                    <FaWhatsapp size={17} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* ── Pagination ────────────────────────────────────────────────── */}
                {paginatedLeads.length > 0 && (
                    <div className="flex items-center justify-center pt-2 pb-1">
                        <div className="flex items-center gap-1.5 bg-white dark:bg-[var(--color-childbgdark)] border border-gray-100 dark:border-white/[0.07] rounded-2xl shadow-sm px-3 py-2">
                            {/* First */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] flex items-center justify-center text-gray-400 transition-colors"
                            >
                                <AiOutlineBackward size={13} />
                            </button>

                            {/* Prev */}
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 transition-colors ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08]"}`}
                            >
                                <GrFormPrevious size={15} />
                            </button>

                            {/* Page numbers */}
                            <AnimatePresence mode="popLayout">
                                {pages.map((num, i) => (
                                    <motion.button
                                        key={num}
                                        onClick={() => setCurrentPage(num)}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.15 }}
                                        className={`rounded-lg text-sm font-semibold flex items-center justify-center transition-all ${
                                            num === currentPage
                                                ? "w-8 h-8 text-white shadow-sm"
                                                : "w-7 h-7 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08]"
                                        }`}
                                        style={num === currentPage ? { backgroundColor: "var(--color-primary)" } : {}}
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                            </AnimatePresence>

                            {/* Next */}
                            <button
                                onClick={nextPage}
                                disabled={!hasMoreCustomers && currentPage === totalPages}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 transition-colors ${(!hasMoreCustomers && currentPage === totalPages) ? "opacity-30 cursor-not-allowed" : "bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08]"}`}
                            >
                                <GrFormNext size={15} />
                            </button>

                            {/* Last */}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] flex items-center justify-center text-gray-400 transition-colors"
                            >
                                <AiOutlineForward size={13} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}