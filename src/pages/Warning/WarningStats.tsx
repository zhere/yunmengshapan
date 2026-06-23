import ReactECharts from 'echarts-for-react';
import { Table } from 'antd';
import ChartCard from '@/components/Common/ChartCard';
import { warningStats } from '@/mock/warnings';

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7' },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const palette = ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6'];

const deptData = [
  { name: '城管局', total: 423, closed: 402, rate: 95.0 },
  { name: '公安局', total: 312, closed: 286, rate: 91.7 },
  { name: '交通局', total: 267, closed: 236, rate: 88.4 },
  { name: '环保局', total: 156, closed: 145, rate: 92.9 },
  { name: '政务中心', total: 128, closed: 111, rate: 86.7 },
];

export default function WarningStats() {
  const lineOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: warningStats.trend30Days.map((d) => d.date) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [{
      name: '预警数', type: 'line', smooth: true,
      data: warningStats.trend30Days.map((d) => d.count),
      lineStyle: { color: '#00D4FF', width: 2 },
      itemStyle: { color: '#00D4FF' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(0,212,255,0.3)' }, { offset: 1, color: 'rgba(0,212,255,0)' }],
        },
      },
    }],
  };

  const pieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE' },
      data: warningStats.byType.map((d, i) => ({
        name: d.type, value: d.count,
        itemStyle: { color: palette[i % palette.length] },
      })),
    }],
  };

  const barOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: deptData.map((d) => d.name) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [{
      name: '预警数', type: 'bar', barWidth: 30,
      data: deptData.map((d, i) => ({
        value: d.total,
        itemStyle: { color: palette[i % palette.length] },
      })),
    }],
  };

  const stackedOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' }, data: ['高级', '中级', '低级'] },
    grid: { left: 40, right: 20, top: 30, bottom: 50 },
    xAxis: { ...darkAxis, type: 'category' as const, data: warningStats.trend30Days.map((d) => d.date) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [
      { name: '高级', type: 'bar', stack: 'total', barWidth: '60%', data: warningStats.trend30Days.map((d) => Math.round(d.count * 0.15)), itemStyle: { color: '#FF3B5C' } },
      { name: '中级', type: 'bar', stack: 'total', data: warningStats.trend30Days.map((d) => Math.round(d.count * 0.35)), itemStyle: { color: '#FF9500' } },
      { name: '低级', type: 'bar', stack: 'total', data: warningStats.trend30Days.map((d) => Math.round(d.count * 0.5)), itemStyle: { color: '#00D4FF' } },
    ],
  };

  const deptColumns = [
    { title: '部门', dataIndex: 'name', key: 'name' },
    { title: '预警总数', dataIndex: 'total', key: 'total' },
    { title: '已闭环', dataIndex: 'closed', key: 'closed' },
    {
      title: '处置率', dataIndex: 'rate', key: 'rate',
      render: (v: number) => (
        <span style={{ color: v >= 90 ? '#00FF88' : v >= 85 ? '#FF9500' : '#FF3B5C' }}>{v}%</span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="近30日预警趋势">
          <ReactECharts option={lineOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="预警类型分布">
          <ReactECharts option={pieOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="各部门预警数量">
          <ReactECharts option={barOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="预警级别趋势分布">
          <ReactECharts option={stackedOption} style={{ height: 280 }} />
        </ChartCard>
      </div>
      <ChartCard title="部门预警处置统计">
        <Table
          rowKey="name"
          columns={deptColumns}
          dataSource={deptData}
          size="small"
          pagination={false}
        />
      </ChartCard>
    </div>
  );
}
