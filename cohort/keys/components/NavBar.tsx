"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { KeyRound, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <nav className="w-full p-6 bg-background">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6">
        {/* Left: Logo + Name + Version */}
        <div className="flex items-center gap-2.5">
          <KeyRound className="size-5 text-foreground" strokeWidth={1.5} />
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            Keys
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-sm font-medium text-muted-foreground">
            1.0
          </span>
        </div>

        {/* Right: Theme switch */}
        <div className="flex items-center gap-2">
          <Sun className="size-5 text-muted-foreground" strokeWidth={1.5} />
          {mounted && (
            <Switch
              size="default"
              checked={isDark}
              onCheckedChange={handleToggle}
              aria-label="Toggle theme"
            />
          )}
          <Moon className="size-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
