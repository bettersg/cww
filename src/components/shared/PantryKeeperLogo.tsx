import React from 'react';
import cwwLogo from 'figma:asset/7616a4fc469dd221ea397db78d0d2cbf80cf6ace.png';

interface PantryKeeperLogoProps {
  className?: string;
}

export function PantryKeeperLogo({ className = "w-12 h-12" }: PantryKeeperLogoProps) {
  return (
    <img
      src={cwwLogo}
      alt="Children's Wishing Well"
      className={className}
    />
  );
}