"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrickWallFire, Podcast, School, Cable, ShieldUser, NotebookTabs, Home } from "lucide-react";

import Link from "next/link";
import { MdClose } from "react-icons/md";
import { TfiClose } from "react-icons/tfi";
import { useAuth } from "@/context/AuthContext";

export default function MobileHamburger() {

  const { admin, isLoading, login } = useAuth();
  const data = [
    { title: "Dashboard", url: "/dashboard", icon: <Home size={18} /> },
    { title: "Campaign", url: `${admin?.role !== "administrator" ? "/masters/campaign/allcampaigns" : "/masters/campaign"}`, icon: <BrickWallFire size={18} /> },
    { title: "Customer", url: "/customer", icon: <Podcast size={18} /> },
    { title: "FollowUp", url: "/followups/customer", icon: <School size={18} /> },
    { title: "Contact", url: "/contact", icon: <Podcast size={18} /> },
    { title: "Contact FollowUp", url: "/followups/contact", icon: <School size={18} /> },
    { title: "Status Type", url: "/masters/status-type", icon: <NotebookTabs size={18} /> },
    { title: "Favroites", url: "/favourites", icon: <Cable size={18} /> },
    { title: "Task", url: "/task", icon: <ShieldUser size={18} /> },
    { title: "Report", url: `/reports/customer`, icon: <BrickWallFire size={18} /> },
  ];

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    const date = new Date();
    setCurrentYear(date.getFullYear());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <>
      <div className="sm:hidden grid place-items-center">

        {/* ── Hamburger trigger ─────────────────────────────────────────── */}
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="mx-4 relative outline-0 w-8 h-8 flex items-center justify-center rounded-xl"
          aria-label="Open menu"
        >
          <motion.div
            initial={false}
            animate={open ? "open" : "closed"}
            className="relative w-5 h-5"
          >
            <motion.span
              style={{ transformOrigin: "center center" }}
              variants={{ open: { rotate: 45, y: 0 }, closed: { rotate: 0, y: -7 } }}
              transition={{ duration: 0.28 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2.5px] bg-white rounded-full"
            />
            <motion.span
              style={{ transformOrigin: "center center" }}
              variants={{ open: { opacity: 0, scaleX: 0.9 }, closed: { opacity: 1, scaleX: 1 } }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2.5px] bg-white rounded-full"
            />
            <motion.span
              style={{ transformOrigin: "center center" }}
              variants={{ open: { rotate: -45, y: 0 }, closed: { rotate: 0, y: 7 } }}
              transition={{ duration: 0.28 }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-[2.5px] bg-white rounded-full"
            />
          </motion.div>
        </button>

        {/* ── Floating close pill ───────────────────────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -8 }}
              transition={{ duration: 0.2 }}
              ref={buttonRef}
              onClick={() => setOpen(!open)}
              className="fixed top-4 left-[268px] z-[2001] flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-600 dark:text-white text-xs font-semibold shadow-md backdrop-blur-xl"
            >
              <TfiClose size={11} />
              <span>Close</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Backdrop ──────────────────────────────────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/20 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Slide-in drawer ───────────────────────────────────────────── */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              ref={menuRef}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { type: "spring", stiffness: 180, damping: 18 },
              }}
              exit={{
                x: "-100%",
                opacity: 0,
                transition: { duration: 0.2 },
              }}
              className="fixed top-0 left-0 h-screen w-[260px] z-[2000] flex flex-col overflow-hidden bg-white dark:bg-[var(--color-childbgdark)] border-r border-gray-100 dark:border-white/[0.07] shadow-2xl"
            >
              {/* Ambient glow — uses brand primary */}
              <div
                className="pointer-events-none absolute -top-20 -left-10 w-56 h-56 rounded-full blur-3xl opacity-20 dark:opacity-10"
                style={{ backgroundColor: "var(--color-primary)" }}
              />

              {/* Grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.018] dark:opacity-[0.035]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              {/* ── Brand header ──────────────────────────────────────────── */}
              <div className="relative z-10 px-5 pt-6 pb-5 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="font-black text-xl text-gray-900 dark:text-white tracking-tight">
                        i<span style={{ color: "var(--color-primary)" }}>big</span>data
                      </h2>
                      {/* Travel badge */}
                      <span
                        className="mt-0.5 text-[8px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full border"
                        style={{
                          color: "var(--color-primary)",
                          borderColor: "var(--color-primary)",
                          opacity: 0.9,
                        }}
                      >
                        Travel
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 font-light mt-0.5 tracking-wide">
                      Travel Insights, Made Easy
                    </p>
                  </div>

                  {/* Avatar blob using brand primary */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <span className="text-white text-sm font-black">i</span>
                  </div>
                </div>
              </div>

              {/* ── Nav items ─────────────────────────────────────────────── */}
              <div className="relative z-10 flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index, duration: 0.22 }}
                  >
                    <Link
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06] active:bg-gray-100 dark:active:bg-white/10 transition-all duration-150"
                    >
                      {/* Icon box */}
                      <span
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-gray-500 flex items-center justify-center shrink-0 transition-all duration-150 group-hover:text-white"
                        style={
                          {
                            "--icon-hover-bg": "var(--color-primary)",
                          } as React.CSSProperties
                        }
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.backgroundColor = "var(--color-primary)";
                          el.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.backgroundColor = "";
                          el.style.color = "";
                        }}
                      >
                        {item.icon}
                      </span>

                      <span className="text-sm font-medium tracking-tight">{item.title}</span>

                      {/* Chevron */}
                      <svg
                        className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-25 transition-opacity duration-150 text-gray-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* ── Footer ────────────────────────────────────────────────── */}
              <div className="relative z-10 px-5 py-4 border-t border-gray-100 dark:border-white/[0.06]">
                {/* Brand accent line */}
                <div
                  className="w-6 h-[2px] rounded-full mx-auto mb-2.5 opacity-30"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center tracking-widest font-medium">
                  &copy; {currentYear} ibigdata — all rights reserved
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}