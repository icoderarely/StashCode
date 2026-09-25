import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
          S
        </span>
        <span className="text-sm font-semibold text-foreground">
          stashcode
        </span>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your stash..."
            className="pl-8"
            disabled
          />
        </div>
        <Button size="sm">
          <Plus />
          New item
        </Button>
      </div>
    </header>
  );
}
