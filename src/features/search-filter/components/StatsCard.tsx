/**
 * Search & Filter Feature - Stats Card Component
 * Interactive card that displays stats and acts as a filter toggle
 */

import React from "react";
import { Card, CardContent } from "../../../components/ui/card";
import type { FilterStatus } from "../types";

interface StatsCardProps {
  status: Exclude<FilterStatus, "all" | "depleted">;
  count: number;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  activeColor: string;
  inactiveColor: string;
  textColor: string;
}

export function StatsCard({
  status,
  count,
  label,
  icon,
  isActive,
  onClick,
  activeColor,
  inactiveColor,
  textColor,
}: StatsCardProps) {
  const ringColor = {
    fresh: "ring-green-500",
    expiring: "ring-orange-500",
    expired: "ring-red-500",
  }[status];

  const bgColor = {
    fresh: "bg-green-50",
    expiring: "bg-orange-50",
    expired: "bg-red-50",
  }[status];

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive
          ? `ring-2 ${ringColor} shadow-md ${bgColor}`
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 md:p-4 h-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1">
          <p className={`text-xl md:text-2xl font-semibold ${textColor}`}>
            {count}
          </p>
          <p className="text-xs md:text-sm text-gray-600">{label}</p>
          <div
            className={`w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 md:mt-1 transition-colors ${
              isActive ? activeColor : inactiveColor
            }`}
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: `w-4 h-4 transition-colors ${
                isActive ? "text-white" : textColor
              }`,
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
