import { useState } from 'react';
import { Table, Tag, Button, message, Progress } from 'antd';
import { ShieldCheck, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';

interface ProblemRecord {
  id: string;
  type: string;
  count: number;
  source: string;
  level: '高' | '中' | '低';
  status: '待整改' | '整改中' | '已整改';
}

const initialProblems: ProblemRecord[] = [
  { id: 'P001', type: '地址缺失', count: 23, source: '实有房屋', level: '中', status: '待整改' },
  { id: 'P002', type: '身份证号异常', count: 8, source: '实有人口', level: '高', status: '整改中' },
  { id: 'P003', type: '电话号码为空', count: 45, source: '实有人口', level: '低', status: '待整改' },
  { id: 'P004', type: '法人信息不全', count: 12, source: '实有单位', level: '中', status: '待整改' },
  { id: 'P005', type: '居住证过期', count: 67, source: '流动人口', level: '高', status: '整改中' },
  { id: 'P006', type: '地址编码重复', count: 3, source: '实有房屋', level: '高', status: '已整改' },
  { id: 'P007', type: '房屋面积异常', count: 15, source: '实有房屋', level: '低', status: '待整改' },
  { id: 'P008', type: '从业人数为0', count: 9, source: '实有单位', level: '中', status: '已整改' },
];

const levelColor: Record<string, string> = { '高': '#FF3B5C', '中': '#FF9500', '低': '#8BA3C7' };
const statusColor: Record<string, string> = { '待整改': '#FF9500', '整改中': '#00D4FF', '已整改': '#00FF88' };

const categoryScores = [
  { label: '完整性', value: 95.2, color: '#00D4FF', icon: <CheckCircle size={20} /> },
  { label: '准确性', value: 93.8, color: '#00FF88', icon: <ShieldCheck size={20} /> },
  { label: '一致性', value: 91.5, color: '#FF9500', icon: <RefreshCw size={20} /> },
  { label: '时效性', value: 89.7, color: '#A855F7', icon: <AlertTriangle size={20} /> },
];

export default function CollectionQuality() {
  const [problems, setProblems] = useState(initialProblems);

  const handleRectify = (id: string) => {
    setProblems(problems.map(p => p.id === id ? { ...p, status: '整改中' } : p));
    message.success('整改任务已下发，正在处理中');
  };

  const gaugeOption = {
    series: [{
      type: 'gauge', radius: '90%', center: ['50%', '55%'],
      axisLine: { lineStyle: { width: 18, color: [[0.6, '#FF3B5C'], [0.85, '#FF9500'], [1, '#00FF88']] } },
      pointer: { itemStyle: { color: '#00D4FF' }, length: '60%' },
      axisTick: { distance: -18, lineStyle: { color: '#1E3A5F' } },
      splitLine: { distance: -18, lineStyle: { color: '#8BA3C7' } },
      axisLabel: { color: '#8BA3C7', distance: -30, fontSize: 10 },
      detail: { valueAnimation: true, formatter: '{value}分', color: '#00D4FF', fontSize: 28, offsetCenter: [0, '40%'] },
      title: { show: true, offsetCenter: [0, '70%'], color: '#8BA3C7', fontSize: 12 },
      data: [{ value: 92.6, name: '综合评分' }],
    }],
  };

  const columns = [
    { title: '问题类型', dataIndex: 'type', key: 'type', width: 140 },
    { title: '数量', dataIndex: 'count', key: 'count', width: 80 },
    { title: '数据来源', dataIndex: 'source', key: 'source', width: 120 },
    { title: '严重程度', dataIndex: 'level', key: 'level', width: 100, render: (v: string) => <Tag color={levelColor[v]}>{v}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag> },
    {
      title: '操作', key: 'action', width: 120,
      render: (_: unknown, r: ProblemRecord) => (
        <Button type="link" size="small" onClick={() => handleRectify(r.id)} disabled={r.status !== '待整改'} className="!text-[#00D4FF] !p-0">整改</Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {categoryScores.map(s => (
          <StatCard key={s.label} title={`${s.label}评分`} value={`${s.value}%`} icon={s.icon} color={s.color} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ChartCard title="数据质量综合评分">
          <ReactECharts option={gaugeOption} style={{ height: 280 }} />
        </ChartCard>
        <div className="col-span-2">
          <ChartCard title="各维度质量评分">
            <div className="space-y-5 py-4">
              {categoryScores.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-[#E8F0FE]">{s.label}</span>
                    <span className="text-sm font-bold font-[Orbitron]" style={{ color: s.color }}>{s.value}%</span>
                  </div>
                  <Progress percent={s.value} strokeColor={s.color} trailColor="#1E3A5F" showInfo={false} strokeWidth={10} />
                </div>
              ))}
              <div className="pt-3 border-t border-[#1E3A5F]">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#8BA3C7]">问题数据总数</span>
                  <span className="text-2xl font-bold font-[Orbitron] text-[#FF3B5C]">{problems.reduce((s, p) => s + p.count, 0)}</span>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="问题数据列表">
        <Table rowKey="id" columns={columns} dataSource={problems} size="small" pagination={false} scroll={{ x: 700 }} />
      </ChartCard>
    </div>
  );
}
