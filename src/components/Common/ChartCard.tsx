import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  extra?: ReactNode;
}

export default function ChartCard({ title, children, extra }: ChartCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E3A5F]">
        <h3 className="text-sm font-semibold text-[#E8F0FE]">{title}</h3>
        {extra && <div>{extra}</div>}
      </div>
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
}
