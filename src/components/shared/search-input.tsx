"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/debounce.hook";

interface SearchInputProps {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  label?: string;
}

/** Debounced search box. Calls onSearch (usually writes to the URL) after typing pauses. */
export function SearchInput({
  value,
  onSearch,
  placeholder = "Search…",
  label = "Search",
}: SearchInputProps) {
  const [input, setInput] = useState(value);
  const debounced = useDebounce(input, 400);

  // Keep the box in sync when the URL changes (back button, reset).
  useEffect(() => {
    setInput(value);
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only react to the debounced value
  useEffect(() => {
    if (debounced.trim() !== value) {
      onSearch(debounced.trim());
    }
  }, [debounced]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        aria-label={label}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl bg-card pr-8 pl-9 md:h-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {input && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setInput("");
            onSearch("");
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
