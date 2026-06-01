import { Award, Share2, Users } from "lucide-react";
import type React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { SailorLoyalty } from "../types/loyalty";

interface LoyaltyStatsProps {
  sailors: SailorLoyalty[];
  totalSailors: number;
  isLoading: boolean;
}

export function LoyaltyStats({ sailors, totalSailors, isLoading }: LoyaltyStatsProps) {
  // Aggregate stats from the current page
  const totalLoyaltyPoints = sailors.reduce((acc, curr) => acc + (curr.loyalty_points || 0), 0);
  const totalReferralPoints = sailors.reduce((acc, curr) => acc + (curr.referral_points || 0), 0);
  const totalPoints = sailors.reduce((acc, curr) => acc + (curr.total_points || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-4 px-4 py-3">
      {/* Total Sailors */}
      <StatCard
        title="Total Sailors"
        value={totalSailors.toLocaleString()}
        description="Registered in system"
        icon={<Users className="size-4 text-primary" />}
        isLoading={isLoading}
      />

      {/* Total Points (Page) */}
      <StatCard
        title="Total Points"
        value={totalPoints.toLocaleString()}
        description="Combined loyalty & referral"
        icon={<Award className="size-4 text-purple-500" />}
        isLoading={isLoading}
      />

      {/* Loyalty Points (Page) */}
      <StatCard
        title="Loyalty Points"
        value={totalLoyaltyPoints.toLocaleString()}
        description="Earned from purchases"
        icon={<Award className="size-4 text-emerald-500" />}
        isLoading={isLoading}
      />

      {/* Referral Points (Page) */}
      <StatCard
        title="Referral Points"
        value={totalReferralPoints.toLocaleString()}
        description="Earned from referrals"
        icon={<Share2 className="size-4 text-blue-500" />}
        isLoading={isLoading}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  isLoading: boolean;
}

function StatCard({ title, value, description, icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted/60">{icon}</div>
      </div>
      <div className="mt-1.5">
        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
      </div>
      <div className="mt-1">
        <span className="text-[10px] text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}
