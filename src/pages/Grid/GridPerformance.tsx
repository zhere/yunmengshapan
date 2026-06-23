import { useMemo } from 'react';
import { Table, Button, Tag, message } from 'antd';
import { Download, Trophy } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '@/components/Common/ChartCard';
import { grids } from '@/mock/grid';

interface PerfRow {
  rank: number;
  name: string;
  eventCount: number;
  disposalRate: number;
  collectionRate: number;
  responseTime: number;
  totalScore: number;
}

const darkAxis = { axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } };
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const palette = ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6'];

function buildPerfData(): PerfRow[] {
  return grids.map((g, i) => {
    const eventCount = g.eventCount;
    const disposalRate = Math.min(99, Math.round(85 + (i % 5) * 2.5 + Math.random() * 3));
    const collectionRate = Math.min(99, Math.round(80 + (g.householdCount / 700) * 12 + (i % 3)));
    const responseTime = +(0.8 + (eventCount % 5) * 0.4 + Math.random() * 0.5).toFixed(1);
    const totalScore = Math.round(disposalRate * 0.35 + collectionRate * 0.3 + (100 - responseTime * 10) * 0.2 + (100 - eventCount) * 0.15);
    return { rank: 0, name: g.name, eventCount, disposalRate, collectionRate, responseTime, totalScore: Math.max(60, Math.min(99, totalScore)) };
  }).sort((a, b) => b.totalScore - a.totalScore).map((r, i) => ({ ...r, rank: i + 1 }));
}

export default function GridPerformance() {
  const data = useMemo(() => buildPerfData(), []);
  const top5 = data.slice(0, 5);

  const barOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: { data: ['处置率', '采集率', '综合分'], textStyle: { color: '#8BA3C7' }, top: 0 },
    grid: { left: 10, right: 20, top: 40, bottom: 10, containLabel: true },
    xAxis: { ...darkAxis, type: 'category' as const, data: data.slice(0, 10).map(d => d.name.replace('网格', '')), axisLabel: { color: '#8BA3C7', interval: 0, rotate: 25 } },
    yAxis: { ...darkAxis, type: 'value' as const, max: 100 },
    series: [
      { name: '处置率', type: 'bar', barWidth: 8, data: data.slice(0, 10).map(d => d.disposalRate), itemStyle: { color: '#00D4FF' } },
      { name: '采集率', type: 'bar', barWidth: 8, data: data.slice(0, 10).map(d => d.collectionRate), itemStyle: { color: '#00FF88' } },
      { name: '综合分', type: 'bar', barWidth: 8, data: data.slice(0, 10).map(d => d.totalScore), itemStyle: { color: '#FF9500' } },
    ],
  };

  const radarOption = {
    tooltip: { ...darkTooltip },
    legend: { data: top5.map(d => d.name.replace('网格', '')), textStyle: { color: '#8BA3C7' }, bottom: 0, type: 'scroll' as const },
    radar: {
      indicator: [
        { name: '处置率', max: 100 }, { name: '采集率', max: 100 }, { name: '响应速度', max: 100 },
        { name: '事件控制', max: 100 }, { name: '综合分', max: 100 },
      ],
      axisName: { color: '#8BA3C7' },
      splitLine: { lineStyle: { color: '#1E3A5F' } },
      splitArea: { areaStyle: { color: ['rgba(0,212,255,0.03)', 'rgba(0,212,255,0.06)'] } },
      axisLine: { lineStyle: { color: '#1E3A5F' } },
    },
    series: [{
      type: 'radar',
      data: top5.map((d, i) => ({
        name: d.name.replace('网格', ''),
        value: [d.disposalRate, d.collectionRate, Math.round(100 - d.responseTime * 10), Math.round(100 - d.eventCount), d.totalScore],
        lineStyle: { color: palette[i] }, itemStyle: { color: palette[i] },
        areaStyle: { color: palette[i], opacity: 0.1 },
      })),
    }],
  };

  const columns = [
    { title: '排名', dataIndex: 'rank', key: 'rank', width: 70, render: (r: number) => r <= 3 ? <Tag color={r === 1 ? 'gold' : r === 2 ? 'default' : 'orange'}><Trophy size={11} className="inline mr-1" />{r}</Tag> : <span className="text-[#8BA3C7]">{r}</span> },
    { title: '网格名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '事件数', dataIndex: 'eventCount', key: 'eventCount', width: 80, sorter: (a: PerfRow, b: PerfRow) => a.eventCount - b.eventCount, render: (v: number) => <span className="text-[#FF9500]">{v}</span> },
    { title: '处置率', dataIndex: 'disposalRate', key: 'disposalRate', width: 90, sorter: (a: PerfRow, b: PerfRow) => a.disposalRate - b.disposalRate, render: (v: number) => <span className="text-[#00FF88]">{v}%</span> },
    { title: '采集完成率', dataIndex: 'collectionRate', key: 'collectionRate', width: 110, sorter: (a: PerfRow, b: PerfRow) => a.collectionRate - b.collectionRate, render: (v: number) => <span className="text-[#00D4FF]">{v}%</span> },
    { title: '响应时长(h)', dataIndex: 'responseTime', key: 'responseTime', width: 110, sorter: (a: PerfRow, b: PerfRow) => a.responseTime - b.responseTime, render: (v: number) => <span className="text-[#8BA3C7]">{v}h</span> },
    { title: '综合得分', dataIndex: 'totalScore', key: 'totalScore', width: 100, sorter: (a: PerfRow, b: PerfRow) => a.totalScore - b.totalScore, defaultSortOrder: 'descend' as const, render: (v: number) => <span className="text-[#00D4FF] font-bold font-[Orbitron]">{v}</span> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#E8F0FE] flex items-center gap-2"><Trophy size={18} className="text-[#FFD600]" />网格绩效考核排名</h3>
        <Button icon={<Download size={14} />} onClick={() => message.success('绩效报表已导出为 Excel')}>导出报表</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="网格绩效对比 TOP10">
          <ReactECharts option={barOption} style={{ height: 320 }} />
        </ChartCard>
        <ChartCard title="TOP5 网格能力雷达图">
          <ReactECharts option={radarOption} style={{ height: 320 }} />
        </ChartCard>
      </div>

      <ChartCard title="绩效排名明细">
        <Table
          rowKey="rank" columns={columns} dataSource={data} size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => <span className="text-[#8BA3C7]">共 {t} 条</span> }}
          scroll={{ x: 800 }}
        />
      </ChartCard>
    </div>
  );
}
