"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Folder, Folders, Inbox, LayoutGrid, Star, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TYPE_ICONS } from "@/lib/item-type-icons";
import { currentUser } from "@/lib/mock-data";
import type { SidebarCollection } from "@/types/collection";
import type { SidebarNav } from "@/types/nav";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SidebarProps {
  nav: SidebarNav;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ nav, collapsed, mobileOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-65 shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 md:static md:translate-x-0 md:transition-[width]",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "md:w-16" : "md:w-65"
      )}
    >
      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        <SidebarSection collapsed={collapsed}>
          <NavLink
            href="/dashboard"
            icon={LayoutGrid}
            label="Overview"
            collapsed={collapsed}
            active={pathname === "/dashboard"}
            onNavigate={onNavigate}
          />
          <NavLink
            href="/items"
            icon={Inbox}
            label="All items"
            badge={nav.itemCount}
            collapsed={collapsed}
            active={pathname === "/items"}
            onNavigate={onNavigate}
          />
          <NavLink
            href="/favorites"
            icon={Star}
            label="Favorites"
            badge={nav.favoriteItemCount}
            collapsed={collapsed}
            active={pathname === "/favorites"}
            onNavigate={onNavigate}
          />
        </SidebarSection>

        <SidebarSection title="Item types" collapsed={collapsed}>
          {nav.itemTypes.map((type) => {
            const href = `/items/${type.name.toLowerCase()}s`;
            return (
              <NavLink
                key={type.id}
                href={href}
                icon={TYPE_ICONS[type.icon] ?? Folder}
                iconColor={type.color}
                label={type.name}
                badge={type.itemCount}
                collapsed={collapsed}
                active={pathname === href}
                onNavigate={onNavigate}
              />
            );
          })}
        </SidebarSection>

        <SidebarSection title="Collections" collapsed={collapsed}>
          {nav.collections.map((collection) => (
            <CollectionLink
              key={collection.id}
              collection={collection}
              collapsed={collapsed}
              active={pathname === `/collections/${collection.id}`}
              onNavigate={onNavigate}
            />
          ))}
          <NavLink
            href="/collections"
            icon={Folders}
            label="View all collections"
            collapsed={collapsed}
            active={pathname === "/collections"}
            onNavigate={onNavigate}
          />
        </SidebarSection>
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 px-1 py-1.5" title={currentUser.name}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials(currentUser.name)}
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{currentUser.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.isPro ? "Pro" : "Free workspace"}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface SidebarSectionProps {
  title?: string;
  collapsed: boolean;
  children: React.ReactNode;
}

function SidebarSection({ title, collapsed, children }: SidebarSectionProps) {
  return (
    <div>
      {!collapsed && title && (
        <h3 className="px-2.5 pb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  icon?: LucideIcon;
  iconColor?: string;
  /** Renders a colored circle in place of an icon — how collections are marked. */
  dotColor?: string | null;
  label: string;
  badge?: number;
  /** Sits after the label, where a badge would go — the favorite star. */
  trailing?: React.ReactNode;
  collapsed: boolean;
  active: boolean;
  onNavigate: () => void;
}

function NavLink({
  href,
  icon: Icon,
  iconColor,
  dotColor,
  label,
  badge,
  trailing,
  collapsed,
  active,
  onNavigate,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      title={label}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground",
        active ? "bg-secondary text-foreground" : "text-muted-foreground"
      )}
    >
      {dotColor !== undefined ? (
        // Kept in an icon-sized box so dots and icons line up down the list.
        <span className="flex size-4 shrink-0 items-center justify-center">
          <span
            className={cn("size-2.5 rounded-full", dotColor === null && "bg-muted-foreground/40")}
            style={dotColor ? { backgroundColor: dotColor } : undefined}
          />
        </span>
      ) : (
        Icon && (
          <Icon className="size-4 shrink-0" style={iconColor ? { color: iconColor } : undefined} />
        )
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge !== undefined && <span className="text-xs text-muted-foreground">{badge}</span>}
          {trailing}
        </>
      )}
    </Link>
  );
}

interface CollectionLinkProps {
  collection: SidebarCollection;
  collapsed: boolean;
  active: boolean;
  onNavigate: () => void;
}

function CollectionLink({ collection, collapsed, active, onNavigate }: CollectionLinkProps) {
  return (
    <NavLink
      href={`/collections/${collection.id}`}
      dotColor={collection.dominantType?.color ?? null}
      label={collection.name}
      trailing={
        collection.isFavorite ? (
          <Star className="size-3 shrink-0 fill-pro text-pro" />
        ) : undefined
      }
      collapsed={collapsed}
      active={active}
      onNavigate={onNavigate}
    />
  );
}
