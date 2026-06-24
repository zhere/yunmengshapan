import { Grid3X3, Users, ClipboardCheck, CheckCircle2 } from 'lucide-react';

interface StatItem {
  label: string;
  value: number | string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
}

// 一标三实采集任务模拟数据
const collectionTasks = [
  { progress: 78, status: '进行中' },
  { progress: 100, status: '已完成' },
  { progress: 45, status: '进行中' },
  { progress: 30, status: '进行中' },
  { progress: 0, status: '未开始' },
  { progress: 100, status: '已完成' },
  { progress: 92, status: '进行中' },
  { progress: 65, status: '进行中' },
  { progress: 100, status: '已完成' },
  { progress: 55, status: '进行中' },
];

export default function GridOverview() {
  const todayTasks = collectionTasks.length;
  const completedTasks = collectionTasks.filter(t => t.status === '已完成').length;
  const completionRate = Math.round((completedTasks / todayTasks) * 100);

  const items: StatItem[] = [
    { label: '网格总数', value: 15, suffix: '个', icon: <Grid3X3 size={16} />, color: '#00D4FF' },
    { label: '在岗人员', value: '17/20', icon: <Users size={16} />, color: '#00FF88' },
    { label: '今日任务', value: todayTasks, suffix: '项', icon: <ClipboardCheck size={16} />, color: '#FF9500' },
    { label: '采集完成率', value: completionRate, suffix: '%', icon: <CheckCircle2 size={16} />, color: '#A855F7' },
  ];

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <Grid3X3 size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">网格概况</span>
        </div>
        <span className="text-xs text-[#8BA3C7]">
          累计采集 <span className="font-digital text-[#00D4FF]">{todayTasks + 23}</span>
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
            <div className="flex items-baseline gap-0.5">
              <span
                className="font-digital text-base font-bold tracking-wide"
                style={{ color: item.color }}
              >
                {item.value}
              </span>
              {item.suffix && <span className="text-[10px] text-[#8BA3C7]">{item.suffix}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
