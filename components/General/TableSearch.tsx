"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
};

export default function TableSearch({
  value,
  onChange,
  placeholder,
  clearLabel,
}: Props) {
  return (
    <div className="relative mb-4 max-w-md">
      <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel}
          title={clearLabel}
          className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
