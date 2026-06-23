import ReactECharts from 'echarts-for-react';
import ChartCard from '@/components/Common/ChartCard';
import { urbanStats } from '@/mock/urbanCases';

const darkAxis = { axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } };
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const palette = ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6'];

const areaData = [
  { area: '城关镇', count: 286 }, { area: '义堂镇', count: 98 },
  { area: '曾店镇', count: 76 }, { area: '吴铺镇', count: 64 },
  { area: '伍洛镇', count: 58 }, { area: '下辛店镇', count: 52 },
  { area: '道桥镇', count: 48 }, { area: '隔蒲潭镇', count: 44 },
  { area: '胡金店镇', count: 30 },
];

const disposalTimeData = [
  { type: '占道经营', hours: 4.2 }, { type: '违规停车', hours: 2.8 },
  { type: '垃圾堆积', hours: 6.5 }, { type: '违规广告', hours: 12.3 },
  { type: '井盖缺失', hours: 3.6 },
];

export default function UrbanStats() {
  const trendOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: urbanStats.trend7Days.map(d => d.date) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [{
      name: '案件数', type: 'line', smooth: true,
      data: urbanStats.trend7Days.map(d => d.count),
      lineStyle: { color: '#00D4FF', width: 2 },
      itemStyle: { color: '#00D4FF' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(0,212,255,0.3)' }, { offset: 1, color: 'rgba(0,212,255,0)' }] } },
    }],
  };

  const pieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE' },
      data: urbanStats.byType.map((d, i) => ({
        name: d.type, value: d.count, itemStyle: { color: palette[i] },
      })),
    }],
  };

  const areaOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 80, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'value' as const },
    yAxis: { ...darkAxis, type: 'category' as const, data: areaData.map(d => d.area).reverse() },
    series: [{
      name: '案件数', type: 'bar', barWidth: 14,
      data: areaData.map(d => d.count).reverse().map((v) => ({
        value: v,
        itemStyle: { color: '#00D4FF' },
      })),
    }],
  };

  const disposalOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const, valueFormatter: (v: number) => `${v} 小时` },
    grid: { left: 50, right: 20, top: 30, bottom: 40 },
    xAxis: { ...darkAxis, type: 'category' as const, data: disposalTimeData.map(d => d.type), axisLabel: { color: '#8BA3C7', interval: 0, rotate: 15 } },
    yAxis: { ...darkAxis, type: 'value' as const, name: '小时', nameTextStyle: { color: '#8BA3C7' } },
    series: [{
      name: '平均处置时长', type: 'bar', barWidth: 32,
      data: disposalTimeData.map((d) => ({
        value: d.hours,
        itemStyle: { color: d.hours <= 4 ? '#00FF88' : d.hours <= 8 ? '#FF9500' : '#FF3B5C' },
      })),
      label: { show: true, position: 'top', color: '#E8F0FE', formatter: '{c}h' },
    }],
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ChartCard title="近7日案件趋势">
        <ReactECharts option={trendOption} style={{ height: 280 }} />
      </ChartCard>
      <ChartCard title="案件类型分布">
        <ReactECharts option={pieOption} style={{ height: 280 }} />
      </ChartCard>
      <ChartCard title="区域案件分布">
        <ReactECharts option={areaOption} style={{ height: 280 }} />
      </ChartCard>
      <ChartCard title="处置时长分析">
        <ReactECharts option={disposalOption} style={{ height: 280 }} />
      </ChartCard>
    </div>
  );
}
