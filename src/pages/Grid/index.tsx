import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button } from 'antd';
import { Grid3X3, Users, AlertCircle, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { grids, staff, events, gridStats } from '@/mock/grid';
import type { GridEventStatus } from '@/mock/grid';

const darkAxis = { axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } };
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const palette = ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6'];

const statusColor: Record<GridEventStatus, string> = {
  '待处理': 'red', '处理中': 'processing', '已处理': 'green',
};

function gridPerformance(g: { eventCount: number; householdCount: number; populationCount: number }): number {
  const score = 100 - g.eventCount * 1.4 + g.householdCount / 100 + g.populationCount / 2000;
  return Math.max(60, Math.min(99, Math.round(score)));
}

export default function GridOverview() {
  const navigate = useNavigate();
  const recentEvents = [...events].sort((a, b) => b.reportTime.localeCompare(a.reportTime)).slice(0, 6);
  const ranking = [...grids].map(g => ({ name: g.name, score: gridPerformance(g) })).sort((a, b) => b.score - a.score).slice(0, 10);

  const barOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 10, right: 20, top: 20, bottom: 10, containLabel: true },
    xAxis: { ...darkAxis, type: 'value' as const, max: 100 },
    yAxis: { ...darkAxis, type: 'category' as const, data: ranking.map(d => d.name).reverse(), axisLabel: { color: '#8BA3C7', width: 90, overflow: 'truncate' as const } },
    series: [{
      name: '绩效分', type: 'bar', barWidth: 14,
      data: ranking.map(d => d.score).reverse().map((v, i) => ({
        value: v,
        itemStyle: { color: i >= 7 ? '#00FF88' : i >= 4 ? '#00D4FF' : '#FF9500' },
      })),
      label: { show: true, position: 'right' as const, color: '#E8F0FE', formatter: '{c}' },
    }],
  };

  const typePieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE' },
      data: gridStats.byType.map((d, i) => ({ name: d.type, value: d.count, itemStyle: { color: palette[i] } })),
    }],
  };

  const dutyPieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE', formatter: '{b}\n{c}人' },
      data: [
        { name: '在岗', value: gridStats.onDutyStaff, itemStyle: { color: '#00FF88' } },
        { name: '离岗', value: gridStats.totalStaff - gridStats.onDutyStaff, itemStyle: { color: '#FF3B5C' } },
      ],
    }],
  };

  const columns = [
    { title: '事件类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '上报时间', dataIndex: 'reportTime', key: 'reportTime', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: GridEventStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <StatCard title="网格总数" value={gridStats.totalGrids} icon={<Grid3X3 size={22} />} color="#00D4FF" suffix="个" />
        <StatCard title="在岗网格员" value={`${gridStats.onDutyStaff}/${gridStats.totalStaff}`} icon={<Users size={22} />} color="#00FF88" suffix="人" />
        <StatCard title="今日事件" value={gridStats.todayEvents} icon={<AlertCircle size={22} />} color="#FF9500" suffix="件" />
        <StatCard title="处置率" value={`${gridStats.processedRate}%`} icon={<CheckCircle2 size={22} />} color="#8B5CF6" />
        <div
          onClick={() => navigate('/grid/mobile')}
          className="flex flex-col items-center justify-center rounded-lg border border-[#1E3A5F] bg-gradient-to-br from-[#00D4FF]/10 to-[#00FF88]/5 hover:from-[#00D4FF]/20 hover:to-[#00FF88]/10 cursor-pointer transition-all shadow-[0_0_12px_rgba(0,212,255,0.06)] hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] p-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#00D4FF]/15 flex items-center justify-center mb-1">
            <Smartphone size={22} className="text-[#00D4FF]" />
          </div>
          <span className="text-xs font-semibold text-[#E8F0FE]">移动工作台</span>
          <span className="text-[10px] text-[#8BA3C7] mt-0.5">点击进入</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="网格绩效排名 TOP10" extra={<Button type="link" size="small" onClick={() => navigate('/grid/performance')} className="!text-[#00D4FF] !p-0">详情 <ArrowRight size={12} className="inline" /></Button>}>
          <ReactECharts option={barOption} style={{ height: 320 }} />
        </ChartCard>
        <ChartCard title="事件类型分布">
          <ReactECharts option={typePieOption} style={{ height: 320 }} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="网格员在岗状态" extra={<Button type="link" size="small" onClick={() => navigate('/grid/staff')} className="!text-[#00D4FF] !p-0">人员管理 <ArrowRight size={12} className="inline" /></Button>}>
          <ReactECharts option={dutyPieOption} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="最近事件" extra={<Button type="link" size="small" onClick={() => navigate('/grid/events')} className="!text-[#00D4FF] !p-0">全部事件 <ArrowRight size={12} className="inline" /></Button>}>
          <Table rowKey="id" columns={columns} dataSource={recentEvents} size="small" pagination={false} scroll={{ x: 700 }} />
        </ChartCard>
      </div>
    </div>
  );
}
