import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showClear?: boolean;
  onClear?: () => void;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  showClear = false,
  onClear,
  className = "",
}: SearchInputProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex-1 min-w-0">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs"
        />
      </div>

      {showClear && onClear && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          className="text-xs whitespace-nowrap"
        >
          <XIcon className="size-3 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
