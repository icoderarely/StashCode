"use client";

import { useState } from "react";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import type { SidebarNav } from "@/types/nav";

const MOBILE_BREAKPOINT_PX = 768;

interface DashboardShellProps {
  /** Fetched by the page — the sidebar is a client component and cannot query. */
  nav: SidebarNav;
  children: React.ReactNode;
}

export function DashboardShell({ nav, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleToggleSidebar() {
    if (typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT_PX) {
      setMobileOpen((open) => !open);
    } else {
      setCollapsed((value) => !value);
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar onToggleSidebar={handleToggleSidebar} />
      <div className="relative flex flex-1 overflow-hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <Sidebar
          nav={nav}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
