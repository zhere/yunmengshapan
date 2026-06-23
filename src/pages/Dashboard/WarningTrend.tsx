import ReactECharts from 'echarts-for-react';
import { TrendingUp } from 'lucide-react';
import { warningTrend } from '@/mock/stats';

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7', fontSize: 10 },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = {
  backgroundColor: '#112240',
  borderColor: '#1E3A5F',
  textStyle: { color: '#E8F0FE' },
};

export default function WarningTrend() {
  const trend = warningTrend.trend7Days;

  const option = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: '#8BA3C7', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 6,
    },
    grid: { left: 30, right: 10, top: 28, bottom: 22 },
    xAxis: {
      ...darkAxis,
      type: 'category' as const,
      data: trend.map((d) => d.date),
      axisTick: { show: false },
    },
    yAxis: { ...darkAxis, type: 'value' as const, splitNumber: 3 },
    series: [
      {
        name: '总数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: trend.map((d) => d.count),
        lineStyle: { color: '#00D4FF', width: 2 },
        itemStyle: { color: '#00D4FF' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0,212,255,0.35)' },
              { offset: 1, color: 'rgba(0,212,255,0)' },
            ],
          },
        },
      },
      {
        name: '高级',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: trend.map((d) => d.high),
        lineStyle: { color: '#FF3B5C', width: 1.5 },
        itemStyle: { color: '#FF3B5C' },
      },
      {
        name: '中级',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        data: trend.map((d) => d.medium),
        lineStyle: { color: '#FF9500', width: 1.5 },
        itemStyle: { color: '#FF9500' },
      },
    ],
  };

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">预警趋势</span>
        </div>
        <span className="text-xs text-[#8BA3C7]">近7日</span>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
