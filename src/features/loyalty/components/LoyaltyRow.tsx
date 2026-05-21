import { Check, Copy, Eye, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SailorLoyalty } from "../types/loyalty";

interface LoyaltyRowProps {
  sailor: SailorLoyalty;
  onViewDetails: (sailor: SailorLoyalty) => void;
}

export function LoyaltyRow({ sailor, onViewDetails }: LoyaltyRowProps) {
  const { showToast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  // Computed fields
  const fullName =
    [sailor.first_name, sailor.last_name].filter(Boolean).join(" ").trim() || "Unnamed Sailor";

  // Initials generator for avatar fallback
  const initials = (() => {
    const f = (sailor.first_name || "").trim().charAt(0).toUpperCase();
    const l = (sailor.last_name || "").trim().charAt(0).toUpperCase();
    if (f && l) return `${f}${l}`;
    if (f) return f;
    if (l) return l;

    const emailPrefix = sailor.user_email.split("@")[0] || "";
    if (emailPrefix.length >= 2) {
      return emailPrefix.substring(0, 2).toUpperCase();
    }
    return emailPrefix.charAt(0).toUpperCase() || "US";
  })();

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(sailor.user_email);
      setIsCopied(true);
      showToast("Email copied to clipboard!", "success", 2000);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast("Failed to copy email", "error", 2000);
    }
  };

  return (
    <tr className="border-b border-border text-xs transition-colors hover:bg-muted/50 group/row">
      {/* Sailor Info */}
      <td className="px-3 py-2 align-middle font-medium text-foreground">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate max-w-[150px] sm:max-w-none">{fullName}</span>
        </div>
      </td>

      {/* Email with copy */}
      <td className="px-3 py-2 align-middle">
        <div className="flex items-center gap-1.5 group/email">
          <span className="text-muted-foreground truncate max-w-[180px] sm:max-w-none">
            {sailor.user_email}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 opacity-0 group-hover/email:opacity-100 transition-opacity duration-200 hover:bg-muted rounded text-muted-foreground hover:text-foreground shrink-0"
                  aria-label="Copy email address"
                  disabled={isCopied}
                >
                  <div className="relative size-3">
                    <Copy
                      className={`absolute inset-0 size-3 transition-all duration-200 ${
                        isCopied ? "opacity-0 scale-50" : "opacity-100 scale-100"
                      }`}
                    />
                    <Check
                      className={`absolute inset-0 size-3 text-green-600 dark:text-green-500 transition-all duration-200 ${
                        isCopied ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      }`}
                    />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs bg-slate-900 text-white">
                {isCopied ? "Copied!" : "Copy email"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>

      {/* Referral Points */}
      <td className="px-3 py-2 align-middle">
        <span className="text-foreground">{sailor.referral_points} pts</span>
      </td>

      {/* Loyalty Points */}
      <td className="px-3 py-2 align-middle">
        <span className="text-foreground">{sailor.loyalty_points} pts</span>
      </td>

      {/* Total Points */}
      <td className="px-3 py-2 align-middle font-semibold text-foreground">
        {sailor.total_points}
      </td>

      {/* Actions */}
      <td className="px-3 py-2 align-middle text-right">
        <div className="flex items-center justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onViewDetails(sailor)}
                  aria-label="View sailor loyalty details"
                >
                  <Eye className="size-3.5 mr-4 text-muted-foreground hover:text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                View Details
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>
    </tr>
  );
}
