"use client";

import * as React from "react";
import {
  Home,
  User,
  ShoppingCart,
  Info,
  Pointer,
  IndianRupee,
  Diamond,
  MessageSquare,
  PlusSquare,
  PenSquareIcon,
  User2,
  LucideCoins,
  ShieldUser,
  Settings,
  ChevronRight,
  LayoutDashboard,
  Users,
  CalendarDays,
  CheckSquare,
  Star,
  FileInput,
  Database,
  Building2,
} from "lucide-react";

import { NavMain } from "../components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Customers", url: "/customer", icon: Users },
    { title: "Customer Follow Up", url: "/followups/customer", icon: PlusSquare },
    { title: "Contact", url: "/contact", icon: User },
    { title: "Contact Follow Up", url: "/followups/contact", icon: PlusSquare },
    { title: "Company Project", url: "/company_project", icon: Building2 },
    { title: "Company Project Enquiry", url: "/company_project/enquiry", icon: Info },
    { title: "Schedules", url: "/schedules", icon: CalendarDays },
    { title: "Task", url: "/task", icon: CheckSquare },
    {
      title: "Masters",
      url: "#",
      icon: Diamond,
      items: [
        { title: "Customer Fields", url: "/masters/customerfields" },
        { title: "Campaign", url: "/masters/campaign" },
        { title: "Types", url: "/masters/customer-types" },
        { title: "Customer Subtype", url: "/masters/customer-subtype" },
        { title: "City", url: "/masters/city" },
        { title: "Locations", url: "/masters/locations" },
        { title: "Sub Locations", url: "/masters/sublocation" },
        { title: "Facilities", url: "/masters/facilities" },
        { title: "Amenities", url: "/masters/amenities" },
        { title: "Builder Sliders", url: "/masters/builder-sliders" },
        { title: "Fuctional Areas", url: "/masters/functional-areas" },
        { title: "Industries", url: "/masters/industries" },
        { title: "Contact Campaign", url: "/masters/contact-campaign" },
        { title: "Contact Type", url: "/masters/contact-type" },
        { title: "References", url: "/masters/references" },
        { title: "Price", url: "/masters/price" },
        { title: "Expenses", url: "/masters/expenses" },
        { title: "Incomes", url: "/masters/incomes" },
        { title: "Status Type", url: "/masters/status-type" },
        { title: "Contact Status Type", url: "/masters/contact-statustype" },
        { title: "Payment Methods", url: "/masters/payment-methods" },
        { title: "Mail Templates", url: "/masters/mail-templates" },
        { title: "Whatsapp Templates", url: "/masters/whatsapp-templates" },
        { title: "New User Requests", url: "/masters/newuser-requests" },
      ],
    },
    {
      title: "Financial",
      url: "#",
      icon: IndianRupee,
      items: [
        { title: "Income Marketings", url: "/financial/income_marketings" },
        { title: "Expense Marketings", url: "/financial/expense_marketings" },
      ],
    },
    { title: "Requirements", url: "/requirements", icon: Home },
    { title: "Favourites", url: "/favourites", icon: Star },
    {
      title: "E-commerce",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Category", url: "/category" },
        { title: "Sub Category", url: "/sub-category" },
        { title: "Products", url: "/product" },
        { title: "Orders", url: "/orders" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        { title: "Customer Fields", url: "/settings/customer/customer-fields" },
      ],
    },
    { title: "Users", url: "/users", icon: User2 },
    { title: "Customer Import", url: "/imports/customer", icon: FileInput },
    { title: "Contact Import", url: "/imports/contact", icon: FileInput },
    { title: "Database Manager", url: "/database_manager", icon: Database },
  ],
};

/* ── Logo: Expanded ── */
function LogoFull() {
  return (
    <div className="flex items-center gap-3 w-full select-none">
      {/* Emblem */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/50">
          <ShieldUser className="w-5 h-5 text-white" strokeWidth={1.8} />
        </div>
        {/* Online dot */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0f1117]" />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <div className="flex items-end leading-none">
          <span className="text-[18px] font-black tracking-[-0.03em] text-slate-900 dark:text-white">
            TRAVEL
          </span>
          <span
            className="text-[18px] font-black tracking-[-0.03em] ml-[2px]"
            style={{ color: "var(--color-primary)" }}
          >
            CRM
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="h-[1px] w-6 bg-gradient-to-r from-[var(--color-primary)] to-transparent" />
          <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
            ibigdata
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Logo: Collapsed ── */
function LogoIcon() {
  return (
    <div className="relative">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/50">
        <ShieldUser className="w-5 h-5 text-white" strokeWidth={1.8} />
      </div>
      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0f1117]" />
    </div>
  );
}

/* ── Main Export ── */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { admin, isLoading } = useAuth();
  if (isLoading) return null;

  const isCollapsed = state === "collapsed";

  const filteredNavItems = data.navMain
    .filter((item) => {
      if (item.title === "Masters" && admin?.role !== "administrator") return false;
      return true;
    })
    .map((item) => {
      if (item.title === "Settings") {
        return {
          ...item,
          items: item.items?.filter((subItem) => {
            if (subItem.title === "Customer Fields" && admin?.role !== "administrator") return false;
            return true;
          }),
        };
      }
      return item;
    });

  return (
    <Sidebar
      collapsible="icon"
      className="
        group/sidebar
        !border-r-0
        bg-white dark:bg-[#0f1117]
        shadow-[4px_0_24px_rgba(0,0,0,0.06)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]
      "
      {...props}
    >
      {/* ════ HEADER ════ */}
      <SidebarHeader
        className={`
          relative overflow-hidden shrink-0
          bg-white dark:bg-[#0f1117]
          ${isCollapsed ? "flex items-center justify-center py-5 px-3 border-b border-slate-100 dark:border-white/5" : "px-5 py-5 border-b border-slate-100 dark:border-white/5"}
        `}
      >
        {/* Subtle radial glow behind logo */}
        <div
          className="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-[0.07] dark:opacity-[0.15] pointer-events-none"
          style={{ background: "var(--color-primary)" }}
        />

        {isCollapsed ? <LogoIcon /> : <LogoFull />}
      </SidebarHeader>

      {/* ════ NAV ════ */}
      <SidebarContent
        className="
          relative
          bg-white dark:bg-[#0f1117]
          px-3 py-4
          overflow-y-auto
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* Faint dot-grid texture — dark mode only */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <NavMain items={filteredNavItems} />
      </SidebarContent>

      {/* ════ FOOTER ════ */}
      <SidebarFooter
        className="
          relative shrink-0
          bg-white dark:bg-[#0f1117]
          border-t border-slate-100 dark:border-white/5
          px-3 py-3
        "
      >
        {/* User pill */}
        <div
          className={`
            flex items-center rounded-xl px-3 py-2.5 cursor-pointer
            bg-slate-50 hover:bg-slate-100
            dark:bg-white/5 dark:hover:bg-white/[0.08]
            border border-slate-200 dark:border-white/[0.06]
            transition-colors duration-150
            ${isCollapsed ? "justify-center px-2" : "gap-3"}
          `}
        >
          {/* Avatar */}
          <div className="relative shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center">
            <User2 className="w-3.5 h-3.5 text-white" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-white truncate leading-none mb-0.5">
                {admin?.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize truncate leading-none">
                {admin?.role || "user"}
              </p>
            </div>
          )}

          {!isCollapsed && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
          )}
        </div>
      </SidebarFooter>

      {/* ════ RAIL ════ */}
      <SidebarRail
        className="
          after:w-[2px]
          after:bg-transparent
          hover:after:bg-[var(--color-primary)]
          after:transition-all after:duration-300
        "
      />
    </Sidebar>
  );
}