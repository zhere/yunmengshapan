import { Briefcase, Clock, Loader, CheckCircle2 } from 'lucide-react';
import { urbanCaseStats } from '@/mock/stats';

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function UrbanCaseOverview() {
  const items: StatItem[] = [
    { label: '今日新增', value: urbanCaseStats.todayCount, icon: <Briefcase size={14} />, color: '#00D4FF' },
    { label: '待处置', value: urbanCaseStats.pendingCount, icon: <Clock size={14} />, color: '#FF9500' },
    { label: '处置中', value: urbanCaseStats.processingCount, icon: <Loader size={14} />, color: '#A855F7' },
    { label: '已结案', value: urbanCaseStats.closedCount, icon: <CheckCircle2 size={14} />, color: '#00FF88' },
  ];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] shrink-0 px-3 py-2">
      <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[#1E3A5F]">
        <Briefcase size={14} className="text-[#00D4FF]" />
        <span className="text-sm font-semibold text-[#E8F0FE] whitespace-nowrap">城管案件</span>
      </div>
      <div className="flex items-center gap-4 flex-1 justify-around">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span style={{ color: item.color }}>{item.icon}</span>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-digital text-lg font-bold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
              <span className="text-[10px] text-[#8BA3C7]">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-[#1E3A5F]">
        <span className="text-[10px] text-[#8BA3C7]">结案率</span>
        <span className="font-digital text-lg font-bold text-[#00FF88]">
          {urbanCaseStats.closeRate}%
        </span>
      </div>
    </div>
  );
}
