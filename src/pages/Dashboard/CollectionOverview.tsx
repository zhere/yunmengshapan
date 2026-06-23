import { Users, Home, Building2, MapPin } from 'lucide-react';
import { collectionOverview } from '@/mock/stats';

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const formatNum = (n: number) => n.toLocaleString('en-US');

export default function CollectionOverview() {
  const items: StatItem[] = [
    { label: '人口总数', value: collectionOverview.populationTotal, icon: <Users size={16} />, color: '#00D4FF' },
    { label: '房屋总数', value: collectionOverview.houseTotal, icon: <Home size={16} />, color: '#00FF88' },
    { label: '单位总数', value: collectionOverview.unitTotal, icon: <Building2 size={16} />, color: '#FF9500' },
    { label: '地址总数', value: collectionOverview.addressTotal, icon: <MapPin size={16} />, color: '#A855F7' },
  ];

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">一标三实概况</span>
        </div>
        <span className="text-xs text-[#8BA3C7]">
          数据质量 <span className="font-digital text-[#00FF88]">{collectionOverview.dataQuality}%</span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 p-2 flex-1">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col justify-center px-2 py-1.5 rounded border border-[#1E3A5F]/60 bg-[#112240]/40"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span style={{ color: item.color }}>{item.icon}</span>
              <span className="text-[10px] text-[#8BA3C7]">{item.label}</span>
            </div>
            <span
              className="font-digital text-base font-bold tracking-wide"
              style={{ color: item.color }}
            >
              {formatNum(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
