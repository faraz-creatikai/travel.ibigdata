'use client'

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { state } = useSidebar()
  const pathname = usePathname()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup className="p-0 gap-0">
      <SidebarMenu className="gap-[2px]">
        {items.map((item) => {
          const isActive = pathname === item.url
          const hasChildren = Boolean(item.items?.length)
          const isParentActive =
            isActive || item.items?.some((sub) => pathname === sub.url)

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className="list-none">

                <CollapsibleTrigger asChild>
                  <Link href={item.url} className="block">
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`
                        group/btn relative w-full
                        flex items-center
                        rounded-xl
                        text-[13px] font-medium
                        transition-all duration-150
                        cursor-pointer outline-none select-none
                        overflow-hidden
                        ${isCollapsed ? "justify-center p-2" : "gap-3 px-0 pr-3 py-2"}
                        ${isParentActive
                          ? `
                              bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary)]/[0.12]
                              text-[var(--color-primary)]
                              font-semibold
                              
                            `
                          : `
                              text-slate-600 dark:text-slate-400
                              hover:bg-slate-100 dark:hover:bg-white/[0.05]
                              hover:text-slate-900 dark:hover:text-white
                            `
                        }
                      `}
                    >
                      {/* ── Icon badge ── */}
                      {item.icon && (
                        <span
                          className={`
                            shrink-0 flex items-center justify-center rounded-lg
                            transition-all duration-150
                            ${isCollapsed ? "w-7 h-7" : "w-[28px] h-[28px]"}
                            ${isParentActive
                              ? "bg-[var(--color-primary)] text-white shadow-sm shadow-[var(--color-primary)]/30"
                              : "bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 group-hover/btn:bg-slate-200 dark:group-hover/btn:bg-white/[0.1] group-hover/btn:text-slate-700 dark:group-hover/btn:text-white"
                            }
                          `}
                        >
                          <item.icon className="w-[14px] h-[14px] shrink-0" strokeWidth={2} />
                        </span>
                      )}

                      {/* ── Label + chevron (hidden when collapsed) ── */}
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate leading-none">{item.title}</span>
                          {hasChildren && (
                            <ChevronRight
                              className={`
                                w-3 h-3 shrink-0 ml-auto
                                transition-transform duration-200
                                group-data-[state=open]/collapsible:rotate-90
                                ${isParentActive ? "text-[var(--color-primary)]" : "text-slate-300 dark:text-slate-600"}
                              `}
                            />
                          )}
                        </>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>

                {/* ── Sub items (never shown when collapsed) ── */}
                {hasChildren && !isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub
                      className="
                        ml-[22px] mt-[2px] mb-1
                        border-l-2 border-slate-100 dark:border-white/[0.06]
                        pl-3 gap-0
                      "
                    >
                      {item.items!.map((subItem) => {
                        const isSubActive = pathname === subItem.url
                        return (
                          <SidebarMenuSubItem key={subItem.title} className="list-none">
                            <SidebarMenuSubButton
                              asChild
                              className={`
                                relative w-full flex items-center gap-2.5
                                px-2.5 py-[6px] rounded-lg
                                text-[11.5px] transition-all duration-100
                                cursor-pointer outline-none
                                ${isSubActive
                                  ? `
                                      text-[var(--color-primary)] font-semibold
                                      bg-[var(--color-primary-lighter)] dark:bg-[var(--color-primary)]/[0.1]
                                      before:absolute before:left-[-13px] before:top-1/2 before:-translate-y-1/2
                                      before:w-[3px] before:h-4 before:rounded-r-full
                                      before:bg-[var(--color-primary)]
                                    `
                                  : `
                                      text-slate-500 dark:text-slate-500
                                      hover:text-slate-800 dark:hover:text-white
                                      hover:bg-slate-100 dark:hover:bg-white/[0.05]
                                    `
                                }
                              `}
                            >
                              <Link href={subItem.url} className="flex items-center gap-2.5 w-full">
                                <span
                                  className={`
                                    shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-150
                                    ${isSubActive
                                      ? "bg-[var(--color-primary)]"
                                      : "bg-slate-300 dark:bg-slate-700"
                                    }
                                  `}
                                />
                                <span className="truncate">{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}