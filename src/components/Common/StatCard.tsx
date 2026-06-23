import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  suffix?: string;
}

export default function StatCard({ title, value, icon, color, suffix }: StatCardProps) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80"
    >
      <div
        className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1">
          <span
            className="text-2xl font-bold font-[Orbitron] tracking-wider"
            style={{ color }}
          >
            {value}
          </span>
          {suffix && (
            <span className="text-xs text-[#8BA3C7]">{suffix}</span>
          )}
        </div>
        <p className="text-xs text-[#8BA3C7] mt-1 truncate">{title}</p>
      </div>
    </div>
  );
}
