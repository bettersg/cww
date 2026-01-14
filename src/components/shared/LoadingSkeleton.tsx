import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";

export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-2 md:p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="w-7 h-7 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter Skeleton */}
        <Card>
          <CardContent className="p-6 md:p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1 h-12 md:h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-full sm:w-48 h-12 md:h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border-b p-4">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
