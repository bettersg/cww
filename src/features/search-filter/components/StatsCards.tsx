/**
 * Search & Filter Feature - Stats Cards Container
 * Grid of interactive stats cards for filtering
 */

import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { StatsCard } from "./StatsCard";
import type { FilterStatus } from "../types";

interface StatsData {
  fresh: number;
  expiring: number;
  expired: number;
  depleted: number;
}

interface StatsCardsProps {
  stats: StatsData;
  activeFilter: FilterStatus;
  onFilterToggle: (status: Exclude<FilterStatus, "all" | "depleted">) => void;
}

export function StatsCards({ stats, activeFilter, onFilterToggle }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4">
      <StatsCard
        status="fresh"
        count={stats.fresh}
        label="Fresh"
        icon={<CheckCircle />}
        isActive={activeFilter === "fresh"}
        onClick={() => onFilterToggle("fresh")}
        activeColor="bg-green-600"
        inactiveColor="bg-green-100"
        textColor="text-green-600"
      />

      <StatsCard
        status="expiring"
        count={stats.expiring}
        label="Expiring"
        icon={<AlertCircle />}
        isActive={activeFilter === "expiring"}
        onClick={() => onFilterToggle("expiring")}
        activeColor="bg-orange-600"
        inactiveColor="bg-orange-100"
        textColor="text-orange-600"
      />

      <StatsCard
        status="expired"
        count={stats.expired}
        label="Expired"
        icon={<AlertCircle />}
        isActive={activeFilter === "expired"}
        onClick={() => onFilterToggle("expired")}
        activeColor="bg-red-600"
        inactiveColor="bg-red-100"
        textColor="text-red-600"
      />
    </div>
  );
}
