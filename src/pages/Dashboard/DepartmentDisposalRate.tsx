import ReactECharts from 'echarts-for-react';
import { BarChart3 } from 'lucide-react';
import { departmentDisposalRate } from '@/mock/stats';

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7', fontSize: 10 },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = {
  backgroundColor: '#112240',
  borderColor: '#1E3A5F',
  textStyle: { color: '#E8F0FE' },
  formatter: '{b}<br/>处置率: {c}%',
};

function getRateColor(rate: number) {
  if (rate >= 92) return '#00FF88';
  if (rate >= 88) return '#00D4FF';
  if (rate >= 85) return '#FF9500';
  return '#FF3B5C';
}

export default function DepartmentDisposalRate() {
  const data = [...departmentDisposalRate].sort((a, b) => a.rate - b.rate);

  const option = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 56, right: 30, top: 10, bottom: 20 },
    xAxis: { ...darkAxis, type: 'value' as const, max: 100, splitNumber: 3 },
    yAxis: {
      ...darkAxis,
      type: 'category' as const,
      data: data.map((d) => d.department),
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
          <BarChart3 size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">部门处置率</span>
        </div>
        <span className="text-xs text-[#8BA3C7]">本月</span>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
