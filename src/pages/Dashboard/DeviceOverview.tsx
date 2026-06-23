import ReactECharts from 'echarts-for-react';
import { Cctv } from 'lucide-react';
import { deviceStats } from '@/mock/stats';

const darkTooltip = {
  backgroundColor: '#112240',
  borderColor: '#1E3A5F',
  textStyle: { color: '#E8F0FE' },
};

export default function DeviceOverview() {
  const option = {
    tooltip: { ...darkTooltip, trigger: 'item' as const, formatter: '{b}: {c} ({d}%)' },
    legend: {
      bottom: 0,
      left: 'center',
      textStyle: { color: '#8BA3C7', fontSize: 11 },
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['52%', '72%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: () => `{a|${deviceStats.onlineRate}%}\n{b|在线率}`,
          rich: {
            a: { fontSize: 22, fontWeight: 'bold', color: '#00D4FF', fontFamily: 'Orbitron' },
            b: { fontSize: 11, color: '#8BA3C7', padding: [6, 0, 0, 0] },
          },
        },
        emphasis: {
          label: { show: true },
          itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,212,255,0.4)' },
        },
        itemStyle: {
          borderColor: '#0D2137',
          borderWidth: 2,
        },
        data: [
          { value: deviceStats.online, name: '在线', itemStyle: { color: '#00D4FF' } },
          { value: deviceStats.offline, name: '离线', itemStyle: { color: '#FF3B5C' } },
          { value: deviceStats.maintenance, name: '维护', itemStyle: { color: '#FF9500' } },
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <Cctv size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">设备概况</span>
        </div>
        <span className="text-xs text-[#8BA3C7]">
          总数 <span className="font-digital text-[#00D4FF]">{deviceStats.total}</span>
        </span>
      </div>
      <div className="flex-1 min-h-0 p-1">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
