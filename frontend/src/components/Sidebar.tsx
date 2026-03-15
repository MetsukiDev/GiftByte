"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.1" />
        <rect x="9" y="1" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.1" />
        <rect x="1" y="9" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.1" />
        <rect x="9" y="9" width="5" height="5" rx="0.75" stroke="currentColor" strokeWidth="1.1" />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="7.5" cy="5" r="2.75" stroke="currentColor" strokeWidth="1.1" />
        <path d="M1.5 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "My Wishlists",
    href: "/wishlists",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="2" width="13" height="11" rx="1.25" stroke="currentColor" strokeWidth="1.1" />
        <line x1="4" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <line x1="4" y1="9" x2="8.5" y2="9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Create Wishlist",
    href: "/wishlists/create",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
        <line x1="7.5" y1="4.5" x2="7.5" y2="10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="4.5" y1="7.5" x2="10.5" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Participation",
    href: "/participation",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
        <circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M1 13c0-2.761 2.015-4 4.5-4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <circle cx="11" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.1" />
        <path d="M11 10c2 0 3.5 1.2 3.5 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Wallet",
    href: "/wallet",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="4" width="13" height="9" rx="1.25" stroke="currentColor" strokeWidth="1.1" />
        <path d="M1 7h13" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="11" cy="9.5" r="1.25" fill="currentColor" />
        <path d="M3.5 2.5h8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface SidebarProps {
  active: string;
  onLogout?: () => void;
}

export default function Sidebar({ active, onLogout }: SidebarProps) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
    }
    if (onLogout) {
      onLogout();
    } else {
      router.replace("/login");
    }
  }

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`} style={{ width: collapsed ? "3.5rem" : "15rem" }}>
      {/* Logo row */}
      <div className={`sidebar-logo flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && <span className="sidebar-logo-text">GIFTBYTE</span>}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="sidebar-toggle"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-nav-label">NAV</div>}
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.href;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => !isActive && router.push(item.href)}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span className="sidebar-item-label ml-2.5">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="sidebar-logout"
        title={collapsed ? "Logout" : undefined}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M9 9l3-2.5L9 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="12" y1="6.5" x2="5" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {!collapsed && <span className="sidebar-logout-label ml-2">Logout</span>}
      </button>
    </aside>
  );
}
