import ReactECharts from 'echarts-for-react';
import { ClipboardCheck } from 'lucide-react';

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7', fontSize: 10 },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = {
  backgroundColor: '#112240',
  borderColor: '#1E3A5F',
  textStyle: { color: '#E8F0FE' },
  formatter: '{b}<br/>采集完成率: {c}%',
};

function getRateColor(rate: number) {
  if (rate >= 85) return '#00FF88';
  if (rate >= 70) return '#00D4FF';
  if (rate >= 50) return '#FF9500';
  return '#FF3B5C';
}

// 各社区一标三实采集完成率
const communityRates = [
  { community: '曲阳社区', total: 420, completed: 398, rate: 94.8 },
  { community: '建设社区', total: 280, completed: 258, rate: 92.1 },
  { community: '楚王城社区', total: 350, completed: 318, rate: 90.9 },
  { community: '梦泽社区', total: 380, completed: 342, rate: 90.0 },
  { community: '西大社区', total: 260, completed: 228, rate: 87.7 },
  { community: '南环社区', total: 240, completed: 206, rate: 85.8 },
  { community: '义堂社区', total: 190, completed: 158, rate: 83.2 },
  { community: '珍珠坡社区', total: 220, completed: 176, rate: 80.0 },
  { community: '曾店社区', total: 160, completed: 124, rate: 77.5 },
  { community: '吴铺社区', total: 170, completed: 128, rate: 75.3 },
  { community: '伍洛社区', total: 150, completed: 108, rate: 72.0 },
  { community: '下辛店社区', total: 140, completed: 96, rate: 68.6 },
];

export default function DepartmentDisposalRate() {
  const data = [...communityRates].sort((a, b) => a.rate - b.rate);

  const option = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 56, right: 30, top: 10, bottom: 20 },
    xAxis: { ...darkAxis, type: 'value' as const, max: 100, splitNumber: 3 },
    yAxis: {
      ...darkAxis,
      type: 'category' as const,
      data: data.map((d) => d.community),
      axisTick: { show: false },
    },
    series: [
      {
        type: 'bar',
        barWidth: 10,
        data: data.map((d) => ({
          value: d.rate,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: getRateColor(d.rate) + '40' },
                { offset: 1, color: getRateColor(d.rate) },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
        })),
        label: {
          show: true,
          position: 'right' as const,
          formatter: '{c}%',
          color: '#E8F0FE',
          fontSize: 10,
          fontFamily: 'Orbitron',
        },
      },
    ],
  };

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">社区采集完成率</span>
        </div>
        <span className="text-xs text-[#8BA3C7]">本月</span>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
