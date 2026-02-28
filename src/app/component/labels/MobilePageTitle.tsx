"use client";

// Drop-in replacement — just swap your existing div+h1 with this snippet
// Props: title (string), optional subtitle or badge text

interface PageTitleProps {
  title: string;
  subtitle?: string;
  count?: number;
}

const MobilePageTitle = ({ title, subtitle, count }: PageTitleProps) => (
  <div className="flex items-center justify-between px-0 py-2 mb-1">
    <div className="flex items-center gap-3">
      {/* Vertical accent bar */}
      <span
        className="h-8 w-[3.5px] rounded-full shrink-0"
        style={{ background: "linear-gradient(180deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, transparent))" }}
      />

      <div className="flex flex-col leading-none gap-1">
        {subtitle && (
          <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-gray-400 dark:text-gray-500">
            {subtitle}
          </span>
        )}
        <h1
          className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none"
        >
          {title}
        </h1>
      </div>
    </div>

    {/* Optional count badge */}
    {count !== undefined && (
      <span
        className="text-[11px] font-bold tabular-nums px-2.5 py-1 rounded-lg border"
        style={{
          color: "var(--color-primary)",
          borderColor: "color-mix(in srgb, var(--color-primary) 30%, transparent)",
          backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default MobilePageTitle;


// ─── Usage example ────────────────────────────────────────────────────────────
//
// Before:
//   <div className="flex justify-between items-center px-0">
//     <h1 className="text-[var(--color-primary)] font-extrabold text-2xl">Leads</h1>
//   </div>
//
// After (simple drop-in):
//   <PageTitle title="Leads" />
//
// With subtitle + count:
//   <PageTitle title="Leads" subtitle="CRM" count={42} />
//
// Or as raw JSX without the component:
//
// <div className="flex items-center justify-between px-0 py-2 mb-1">
//   <div className="flex items-center gap-3">
//     <span
//       className="h-8 w-[3.5px] rounded-full shrink-0"
//       style={{ background: "linear-gradient(180deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, transparent))" }}
//     />
//     <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
//       Leads
//     </h1>
//   </div>
// </div>