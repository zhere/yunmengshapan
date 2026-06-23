import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button } from 'antd';
import { FileText, Clock, Loader, CheckCircle, Percent, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { urbanCases, urbanStats } from '@/mock/urbanCases';
import type { UrbanCaseSource, UrbanCaseStatus } from '@/mock/urbanCases';

const sourceColor: Record<UrbanCaseSource, string> = {
  'AI巡查': 'cyan', '12345热线': 'orange', '网格员上报': 'blue', '市民投诉': 'red',
};
const statusColor: Record<UrbanCaseStatus, string> = {
  '待派遣': 'red', '已派遣': 'orange', '处置中': 'processing', '待核查': 'cyan', '已结案': 'green',
};

const darkAxis = { axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } };
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };

export default function UrbanOverview() {
  const navigate = useNavigate();
  const recentCases = [...urbanCases].sort((a, b) => b.reportTime.localeCompare(a.reportTime)).slice(0, 5);

  const pieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE' },
      data: urbanStats.byType.map((d, i) => ({
        name: d.type, value: d.count,
        itemStyle: { color: ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6'][i] },
      })),
    }],
  };

  const barOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: urbanStats.bySource.map(d => d.source) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [{
      name: '案件数', type: 'bar', barWidth: 32,
      data: urbanStats.bySource.map((d, i) => ({
        value: d.count,
        itemStyle: { color: ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C'][i] },
      })),
    }],
  };

  const columns = [
    { title: '案件编号', dataIndex: 'caseNo', key: 'caseNo', width: 170 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 90 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 100, render: (s: UrbanCaseSource) => <Tag color={sourceColor[s]}>{s}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: UrbanCaseStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '上报时间', dataIndex: 'reportTime', key: 'reportTime', width: 170 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <StatCard title="今日案件" value={urbanStats.todayCount} icon={<FileText size={22} />} color="#00D4FF" />
        <StatCard title="待派遣" value={urbanStats.pendingCount} icon={<Clock size={22} />} color="#FF9500" />
        <StatCard title="处置中" value={urbanStats.processingCount} icon={<Loader size={22} />} color="#8B5CF6" />
        <StatCard title="已结案" value={urbanStats.closedCount} icon={<CheckCircle size={22} />} color="#00FF88" />
        <StatCard title="结案率" value={`${urbanStats.closeRate}%`} icon={<Percent size={22} />} color="#00FF88" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="案件类型分布">
          <ReactECharts option={pieOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="案件来源统计">
          <ReactECharts option={barOption} style={{ height: 280 }} />
        </ChartCard>
      </div>

      <ChartCard
        title="最近案件"
        extra={
          <Button type="link" size="small" onClick={() => navigate('/urban/cases')} className="!text-[#00D4FF] !p-0">
            查看全部 <ArrowRight size={12} className="inline" />
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recentCases}
          size="small"
          pagination={false}
          scroll={{ x: 850 }}
          onRow={(record) => ({ onClick: () => navigate('/urban/cases', { state: { caseId: record.id } }) })}
        />
      </ChartCard>
    </div>
  );
}
