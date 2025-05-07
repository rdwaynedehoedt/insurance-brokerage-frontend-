'use client';

import { ElementType } from 'react';
import StatCard from './StatCard';

export interface StatCardData {
  title: string;
  value: string | number;
  change: number;
  icon: ElementType;
  color: string;
}

interface StatsGridProps {
  stats: StatCardData[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
} 