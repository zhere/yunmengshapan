import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Progress } from 'antd';
import { Users, Home, Building2, MoveRight, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { collectionStats } from '@/mock/collection';

const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const darkAxis = { axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } };

const statusColor: Record<string, string> = { '进行中': '#00D4FF', '已完成': '#00FF88', '未开始': '#8BA3C7' };

const recentTasks = [
  { id: 'T001', name: '曲阳社区人口核采', grid: '曲阳社区第一网格', assignee: '张伟', type: '人口', progress: 78, status: '进行中', deadline: '2026-06-30' },
  { id: 'T002', name: '建设社区房屋核查', grid: '建设社区第一网格', assignee: '李强', type: '房屋', progress: 100, status: '已完成', deadline: '2026-06-20' },
  { id: 'T003', name: '楚王城社区单位核采', grid: '楚王城社区第一网格', assignee: '王磊', type: '单位', progress: 45, status: '进行中', deadline: '2026-07-15' },
  { id: 'T004', name: '珍珠坡社区流动人口登记', grid: '珍珠坡社区第一网格', assignee: '刘军', type: '流动人口', progress: 30, status: '进行中', deadline: '2026-07-20' },
  { id: 'T005', name: '梦泽社区全面核采', grid: '梦泽社区第一网格', assignee: '陈勇', type: '全面', progress: 0, status: '未开始', deadline: '2026-08-01' },
];

export default function CollectionOverview() {
  const navigate = useNavigate();

  const stats = [
    { title: '实有人口', value: collectionStats.populationTotal.toLocaleString(), icon: <Users size={22} />, color: '#00D4FF' },
    { title: '实有房屋', value: collectionStats.houseTotal.toLocaleString(), icon: <Home size={22} />, color: '#00FF88' },
    { title: '实有单位', value: collectionStats.unitTotal.toLocaleString(), icon: <Building2 size={22} />, color: '#FF9500' },
    { title: '流动人口', value: collectionStats.flowTotal.toLocaleString(), icon: <MoveRight size={22} />, color: '#A855F7' },
  ];

  const progressOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 60, right: 30, top: 30, bottom: 40 },
    xAxis: { ...darkAxis, type: 'category' as const, data: ['人口核采', '房屋核查', '单位核采', '流动人口', '全面核采'] },
    yAxis: { ...darkAxis, type: 'value' as const, max: 100, axisLabel: { ...darkAxis.axisLabel, formatter: '{value}%' } },
    series: [{
      type: 'bar', barWidth: 28,
      data: [
        { value: 86, itemStyle: { color: '#00D4FF' } },
        { value: 92, itemStyle: { color: '#00FF88' } },
        { value: 78, itemStyle: { color: '#FF9500' } },
        { value: 65, itemStyle: { color: '#A855F7' } },
        { value: 71, itemStyle: { color: '#FF3B5C' } },
      ],
      label: { show: true, position: 'top', color: '#E8F0FE', formatter: '{c}%' },
    }],
  };

  const gaugeOption = {
    series: [{
      type: 'gauge', radius: '85%', center: ['50%', '55%'],
      axisLine: { lineStyle: { width: 16, color: [[0.6, '#FF3B5C'], [0.85, '#FF9500'], [1, '#00FF88']] } },
      progress: { show: false },
      pointer: { itemStyle: { color: '#00D4FF' } },
      axisTick: { distance: -16, lineStyle: { color: '#1E3A5F' } },
      splitLine: { distance: -16, lineStyle: { color: '#8BA3C7' } },
      axisLabel: { color: '#8BA3C7', distance: -28, fontSize: 10 },
      detail: { valueAnimation: true, formatter: '{value}分', color: '#00D4FF', fontSize: 22, offsetCenter: [0, '35%'] },
      data: [{ value: 93.5 }],
    }],
  };

  const taskColumns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'type', key: 'type', width: 90, render: (v: string) => <Tag color="#A855F7">{v}</Tag> },
    { title: '网格', dataIndex: 'grid', key: 'grid', width: 160, ellipsis: true },
    { title: '进度', dataIndex: 'progress', key: 'progress', width: 140, render: (v: number) => <Progress percent={v} size="small" strokeColor="#00D4FF" /> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag> },
    { title: '截止', dataIndex: 'deadline', key: 'deadline', width: 110 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="核采进度（按类别完成率）">
          <ReactECharts option={progressOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="数据质量综合评分">
          <ReactECharts option={gaugeOption} style={{ height: 280 }} />
        </ChartCard>
      </div>

      <ChartCard
        title="最近核采任务"
        extra={
          <Button type="link" size="small" onClick={() => navigate('/collection/tasks')} className="!text-[#00D4FF] !p-0">
            查看全部 <ArrowRight size={12} className="inline" />
          </Button>
        }
      >
        <Table rowKey="id" columns={taskColumns} dataSource={recentTasks} size="small" pagination={false} scroll={{ x: 900 }} />
      </ChartCard>
    </div>
  );
}
