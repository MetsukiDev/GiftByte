"use client";

import { useRouter } from "next/navigation";

type SidebarItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "My Wishlists", href: "/wishlists" },
  { label: "Create Wishlist", href: "/wishlists/create" },
  { label: "Participation", href: "/participation" },
  { label: "Wallet", href: "/wallet" },
];

interface SidebarProps {
  active: string; // href of the active item
  onLogout?: () => void;
}

export default function Sidebar({ active, onLogout }: SidebarProps) {
  const router = useRouter();

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
    <aside className="sidebar">
      <div className="sidebar-logo">GIFTBYTE</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.href;
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => !isActive && router.push(item.href)}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
      <button type="button" onClick={handleLogout} className="sidebar-logout">
        Logout
      </button>
    </aside>
  );
}
