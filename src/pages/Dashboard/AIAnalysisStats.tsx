import ReactECharts from 'echarts-for-react';
import { Brain } from 'lucide-react';
import { aiAnalysisStats } from '@/mock/stats';

const darkTooltip = {
  backgroundColor: '#112240',
  borderColor: '#1E3A5F',
  textStyle: { color: '#E8F0FE' },
  formatter: '{b}: {c} ({d}%)',
};

const colors = ['#00D4FF', '#00FF88', '#FF9500', '#A855F7', '#FF3B5C'];

export default function AIAnalysisStats() {
  const { byType, todayEvents, runningTasks } = aiAnalysisStats;

  const option = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: { color: '#8BA3C7', fontSize: 10 },
      itemWidth: 8,
      itemHeight: 8,
    },
    series: [
      {
        name: 'AI分析类型',
        type: 'pie',
        radius: ['42%', '66%'],
        center: ['50%', '42%'],
        roseType: 'radius' as const,
        label: { show: false },
        itemStyle: {
          borderColor: '#0D2137',
          borderWidth: 2,
        },
        data: byType.map((item, i) => ({
          value: item.count,
          name: item.type,
          itemStyle: { color: colors[i % colors.length] },
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <Brain size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">AI分析概况</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8BA3C7]">
            运行 <span className="font-digital text-[#00FF88]">{runningTasks}</span>
          </span>
          <span className="text-[#8BA3C7]">
            今日 <span className="font-digital text-[#00D4FF]">{todayEvents}</span>
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
