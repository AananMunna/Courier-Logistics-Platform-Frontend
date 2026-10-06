"use client";

import { cn } from "@/lib/utils";

interface FilterTabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: readonly (readonly [T, string])[];
  label?: string;
}

/** Horizontally scrollable pill filters — thumb friendly on phones. */
export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
  label = "Filter",
}: FilterTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {options.map(([optionValue, optionLabel]) => {
        const active = optionValue === value;
        return (
          <button
            key={optionValue}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(optionValue)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95",
              active
                ? "border-primary bg-primary text-primary-foreground shadow-[0_6px_16px_-8px_var(--primary)]"
                : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {optionLabel}
          </button>
        );
      })}
    </div>
  );
}
