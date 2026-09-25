"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code,
  File,
  Folder,
  Image as ImageIcon,
  Inbox,
  LayoutGrid,
  Link as LinkIcon,
  Sparkles,
  Star,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { type Collection, collections, currentUser, itemTypes, items } from "@/lib/mock-data";

const TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image: ImageIcon,
  Link: LinkIcon,
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const favoriteItemCount = items.filter((item) => item.isFavorite).length;

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
            badge={items.length}
            collapsed={collapsed}
            active={pathname === "/items"}
            onNavigate={onNavigate}
          />
          <NavLink
            href="/favorites"
            icon={Star}
            label="Favorites"
            badge={favoriteItemCount}
            collapsed={collapsed}
            active={pathname === "/favorites"}
            onNavigate={onNavigate}
          />
        </SidebarSection>

        <SidebarSection title="Item types" collapsed={collapsed}>
          {itemTypes.map((type) => {
            const Icon = TYPE_ICONS[type.icon];
            const count = items.filter((item) => item.itemTypeId === type.id).length;
            const href = `/items/${type.name.toLowerCase()}s`;
            return (
              <NavLink
                key={type.id}
                href={href}
                icon={Icon}
                iconColor={type.color}
                label={type.name}
                badge={count}
                collapsed={collapsed}
                active={pathname === href}
                onNavigate={onNavigate}
              />
            );
          })}
        </SidebarSection>

        <SidebarSection title="Collections" collapsed={collapsed}>
          {collections.map((collection) => (
            <CollectionLink
              key={collection.id}
              collection={collection}
              collapsed={collapsed}
              active={pathname === `/collections/${collection.id}`}
              onNavigate={onNavigate}
            />
          ))}
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
  label: string;
  badge?: number;
  collapsed: boolean;
  active: boolean;
  onNavigate: () => void;
}

function NavLink({
  href,
  icon: Icon,
  iconColor,
  label,
  badge,
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
      {Icon && <Icon className="size-4 shrink-0" style={iconColor ? { color: iconColor } : undefined} />}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {badge !== undefined && <span className="text-xs text-muted-foreground">{badge}</span>}
        </>
      )}
    </Link>
  );
}

interface CollectionLinkProps {
  collection: Collection;
  collapsed: boolean;
  active: boolean;
  onNavigate: () => void;
}

function CollectionLink({ collection, collapsed, active, onNavigate }: CollectionLinkProps) {
  return (
    <NavLink
      href={`/collections/${collection.id}`}
      icon={Folder}
      label={collection.name}
      collapsed={collapsed}
      active={active}
      onNavigate={onNavigate}
    />
  );
}
