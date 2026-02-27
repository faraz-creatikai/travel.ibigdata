"use client";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { LuKey } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import PopUps from "./PopUps";
import { useRouter } from "next/navigation";
import ProtectedRoute from "./ProtectedRoutes";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Moon, Sun, Bell, Plus, ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useThemeCustom } from "@/context/ThemeContext";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<
    "notifications" | "quickAdd" | "adminMail" | null
  >(null);
  const router = useRouter();
  const { admin, logout } = useAuth();

  const notificationsRef = useRef<HTMLLIElement>(null);
  const quickAddRef = useRef<HTMLLIElement>(null);
  const adminMailRef = useRef<HTMLLIElement>(null);
  const { dark, toggleTheme } = useThemeCustom();

  const quickadds = [
    { name: "Add References", link: "/masters/references/add" },
    { name: "Add City", link: "/masters/city/add" },
    { name: "Add Location", link: "/masters/locations/add" },
    { name: "Add Functional Area", link: "/masters/functional-areas/add" },
    { name: "Add Industry", link: "/masters/industries/add" },
    { name: "Add Campaign", link: "/masters/campaign/add" },
    { name: "Add Income", link: "/masters/incomes/add" },
    { name: "Add Expenses", link: "/masters/expenses/add" },
    { name: "Add Status Type", link: "/masters/status-type/add" },
    { name: "Add Mail Template", link: "/masters/mail-templates/add" },
    { name: "Add Whatsapp Template", link: "/masters/whatsapp-templates/add" },
    { name: "Add Payment Method", link: "/masters/payment-methods/add" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node) &&
        quickAddRef.current &&
        !quickAddRef.current.contains(e.target as Node) &&
        adminMailRef.current &&
        !adminMailRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutDashboard = async () => {
    await logout();
    router.push("/admin");
  };

  const dropdownBase = `absolute top-[calc(100%+10px)] right-0 z-50 transition-all duration-200 origin-top-right`;
  const dropdownVisible = "opacity-100 scale-100 pointer-events-auto translate-y-0";
  const dropdownHidden = "opacity-0 scale-95 pointer-events-none -translate-y-1";

  const initials = admin?.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "A";

  return (
    <ProtectedRoute>
      <div className="
        flex justify-end items-center h-full gap-2 px-4 py-2
        bg-white max-sm:dark:bg-[#0d1117]
        max-sm:bg-[var(--color-primary)] max-sm:max-sm:dark:bg-[var(--color-primary)]
      ">

        {/* ── Divider before controls (desktop) ── */}
        <div className="hidden md:block h-6 w-px bg-slate-200 max-sm:dark:bg-white/10 mr-1" />

        {/* ── Theme toggle ── */}
        <button
          onClick={toggleTheme}
          className="
            w-10 h-10 flex items-center justify-center rounded-xl
            text-slate-500 max-sm:dark:text-slate-400 max-sm:text-white/80
            hover:bg-slate-100 max-sm:dark:hover:bg-white/[0.06]
            hover:text-[var(--color-primary)] max-sm:dark:hover:text-[var(--color-primary)]
            transition-all duration-150
          "
          title={dark ? "Switch to light" : "Switch to dark"}
        >
          {dark
            ? <Sun size={17} strokeWidth={2} />
            : <Moon size={17} strokeWidth={2} />
          }
        </button>

        <nav style={{ zIndex: 1000 }}>
          <ul className="flex items-center gap-1.5">

            {/* ── Notifications ── */}
            <li ref={notificationsRef} className="relative max-md:hidden">
              <button
                className="
                  relative w-10 h-10 flex items-center justify-center rounded-xl
                  text-slate-500 max-sm:dark:text-slate-400
                  hover:bg-slate-100 max-sm:dark:hover:bg-white/[0.06]
                  hover:text-[var(--color-primary)] max-sm:dark:hover:text-[var(--color-primary)]
                  transition-all duration-150 cursor-pointer
                "
                onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
                onMouseEnter={() => setOpenMenu("notifications")}
                title="Notifications"
              >
                <Bell size={17} strokeWidth={2} />
                <span className="
                  absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                  bg-[var(--color-primary)]
                  border-2 border-white max-sm:dark:border-[#0d1117]
                " />
              </button>

              <div className={`${dropdownBase} ${openMenu === "notifications" ? dropdownVisible : dropdownHidden}`}>
                <div className="
                  w-[300px] rounded-2xl overflow-hidden
                  bg-white max-sm:dark:bg-[#0d1117]
                  border border-slate-200 max-sm:dark:border-white/[0.07]
                  shadow-2xl shadow-slate-300/40 max-sm:dark:shadow-black/50
                ">
                  <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 max-sm:dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                      <h3 className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-700 max-sm:dark:text-slate-200">
                        Notifications
                      </h3>
                    </div>
                    <button className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline underline-offset-2 cursor-pointer transition-opacity hover:opacity-80">
                      View all
                    </button>
                  </div>
                  <div className="min-h-[140px] flex flex-col items-center justify-center gap-2 py-6">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 max-sm:dark:bg-white/[0.05] flex items-center justify-center">
                      <Bell size={18} className="text-slate-300 max-sm:dark:text-slate-600" />
                    </div>
                    <p className="text-[12px] text-slate-400 max-sm:dark:text-slate-600 font-medium">
                      No new notifications
                    </p>
                  </div>
                </div>
              </div>
            </li>

            {/* ── Quick Add ── */}
            <li ref={quickAddRef} className="relative max-md:hidden">
              <button
                className="
                  flex items-center gap-2 h-10 px-4 rounded-xl cursor-pointer
                  text-[13px] font-semibold tracking-tight
                  bg-[var(--color-primary-lighter)] text-[var(--color-primary)]
                  hover:bg-[var(--color-primary)] hover:text-white
                  border border-[var(--color-primary)]/20 hover:border-transparent
                  shadow-sm hover:shadow-md hover:shadow-[var(--color-primary)]/20
                  transition-all duration-200
                "
                onClick={() => setOpenMenu(openMenu === "quickAdd" ? null : "quickAdd")}
                onMouseEnter={() => setOpenMenu("quickAdd")}
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Quick Add</span>
                <span className="opacity-60">
                  {openMenu === "quickAdd"
                    ? <ChevronUp size={13} />
                    : <ChevronDown size={13} />
                  }
                </span>
              </button>

              <div className={`${dropdownBase} ${openMenu === "quickAdd" ? dropdownVisible : dropdownHidden}`}>
                <div className="
                  w-[230px] rounded-2xl overflow-hidden
                  bg-white max-sm:dark:bg-[#0d1117]
                  border border-slate-200 max-sm:dark:border-white/[0.07]
                  shadow-2xl shadow-slate-300/40 max-sm:dark:shadow-black/50
                ">
                  {/* Top gradient bar */}
                  <div
                    className="h-[3px] w-full"
                    style={{ background: "linear-gradient(90deg, var(--color-primary), var(--color-primary-light), transparent)" }}
                  />

                  {/* Header label */}
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 max-sm:dark:text-slate-600">
                      Quick Actions
                    </p>
                  </div>

                  <div className="pb-2 max-h-[calc(100vh-90px)] overflow-y-auto custom-scrollbar">
                    {quickadds.map((item, i) => (
                      <Link
                        key={item.name + i}
                        href={item.link}
                        onClick={() => setOpenMenu(null)}
                        className="
                          flex items-center gap-3 px-4 py-2.5
                          text-[13px] text-slate-600 max-sm:dark:text-slate-400
                          hover:bg-slate-50 max-sm:dark:hover:bg-white/[0.05]
                          hover:text-[var(--color-primary)] max-sm:dark:hover:text-[var(--color-primary)]
                          transition-colors duration-100 group
                        "
                      >
                        <span className="
                          w-6 h-6 rounded-lg flex items-center justify-center shrink-0
                          bg-slate-100 max-sm:dark:bg-white/[0.06]
                          text-slate-400 max-sm:dark:text-slate-600
                          group-hover:bg-[var(--color-primary-lighter)] group-hover:text-[var(--color-primary)]
                          transition-all duration-150
                        ">
                          <Plus size={11} strokeWidth={2.5} />
                        </span>
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>

            {/* ── Divider ── */}
            <div className="hidden md:block h-6 w-px bg-slate-200 max-sm:dark:bg-white/10 mx-0.5" />

            {/* ── Admin profile ── */}
            <li ref={adminMailRef} className="relative cursor-pointer">
              <button
                className="
                  flex items-center gap-2.5 h-10 pl-2 pr-3 rounded-xl
                  hover:bg-slate-100 max-sm:dark:hover:bg-white/[0.06]
                  max-sm:hover:bg-white/10
                  border border-transparent hover:border-slate-200 max-sm:dark:hover:border-white/[0.08]
                  transition-all duration-150 cursor-pointer
                "
                onClick={() => setOpenMenu(openMenu === "adminMail" ? null : "adminMail")}
                onMouseEnter={() => setOpenMenu("adminMail")}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold shadow-sm"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
                >
                  {initials}
                </div>

                {/* Name + role stack */}
                <div className="hidden md:flex flex-col leading-none">
                  <span className="text-[13px] font-semibold text-slate-700 max-sm:dark:text-slate-200 truncate max-w-[90px]">
                    {admin?.name ?? "Admin"}
                  </span>
                  <span className="text-[10px] text-slate-400 max-sm:dark:text-slate-600 capitalize font-medium mt-0.5">
                    {admin?.role ?? "user"}
                  </span>
                </div>

                <span className="text-slate-400 max-sm:dark:text-slate-600 max-sm:text-white/70 ml-0.5">
                  {openMenu === "adminMail"
                    ? <ChevronUp size={13} />
                    : <ChevronDown size={13} />
                  }
                </span>
              </button>

              <div className={`${dropdownBase} ${openMenu === "adminMail" ? dropdownVisible : dropdownHidden}`}>
                <div className="
                  w-[210px] rounded-2xl overflow-hidden
                  bg-white max-sm:dark:bg-[#0d1117]
                  border border-slate-200 max-sm:dark:border-white/[0.07]
                  shadow-2xl shadow-slate-300/40 max-sm:dark:shadow-black/50
                ">
                  {/* Profile card header */}
                  <div className="px-4 py-4 border-b border-slate-100 max-sm:dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shrink-0 shadow"
                        style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 max-sm:dark:text-slate-100 truncate leading-tight">
                          {admin?.name ?? "Admin"}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 max-sm:dark:text-slate-600 mt-0.5 capitalize">
                          {admin?.role ?? "user"}
                        </p>
                      </div>
                    </div>
                    {/* Online status */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-slate-400 max-sm:dark:text-slate-600 font-medium">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    {[
                      {
                        icon: <IoPersonOutline size={14} />,
                        label: "Edit Profile",
                        action: () => { setOpenMenu(null); router.push(`/users/edit/${admin?._id}`); }
                      },
                      {
                        icon: <LuKey size={14} />,
                        label: "Change Password",
                        action: () => { setOpenMenu(null); router.push("/users/change_password"); }
                      },
                    ].map(({ icon, label, action }) => (
                      <button
                        key={label}
                        onClick={action}
                        className="
                          w-full flex items-center gap-3 px-4 py-2.5
                          text-[13px] text-slate-600 max-sm:dark:text-slate-400
                          hover:bg-slate-50 max-sm:dark:hover:bg-white/[0.05]
                          hover:text-slate-900 max-sm:dark:hover:text-white
                          transition-colors duration-100 text-left
                        "
                      >
                        <span className="shrink-0 text-slate-400 max-sm:dark:text-slate-600">{icon}</span>
                        {label}
                      </button>
                    ))}

                    {/* Divider before logout */}
                    <div className="mx-4 my-1.5 h-px bg-slate-100 max-sm:dark:bg-white/[0.06]" />

                    <button
                      onClick={() => { setOpenMenu(null); logoutDashboard(); }}
                      className="
                        w-full flex items-center gap-3 px-4 py-2.5
                        text-[13px] text-red-500
                        hover:bg-red-50 max-sm:dark:hover:bg-red-500/10
                        transition-colors duration-100 text-left
                      "
                    >
                      <span className="shrink-0 text-red-400"><CiLogout size={14} /></span>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </li>

            {/* ── Logout shortcut ── */}
            <li
              className="
                w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer
                text-slate-400 max-sm:dark:text-slate-600 max-sm:text-white/70
                hover:bg-red-50 max-sm:dark:hover:bg-red-500/10
                hover:text-red-500 max-sm:dark:hover:text-red-400
                transition-all duration-150
              "
              onClick={logoutDashboard}
              title="Logout"
            >
              <LogOut size={16} strokeWidth={2} />
            </li>

          </ul>
        </nav>
      </div>
    </ProtectedRoute>
  );
}