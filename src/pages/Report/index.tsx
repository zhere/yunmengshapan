import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button } from 'antd';
import {
  FileText, Clock, Loader, CheckCircle, ArrowRight,
  ListChecks, SlidersHorizontal, Drill, BarChart3,
} from 'lucide-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { reportData, dashboardStats } from '@/mock/stats';
import { warningStats } from '@/mock/warnings';
import { urbanStats } from '@/mock/urbanCases';
import { gridStats } from '@/mock/grid';

export type ReportType = '日报' | '周报' | '月报' | '季报' | '年报';
export type ReportStatus = '已生成' | '生成中' | '待生成';

export interface ReportItem {
  id: string;
  name: string;
  type: ReportType;
  period: string;
  generateTime: string;
  status: ReportStatus;
  size: string;
  creator: string;
}

// 报表总览数据
export const reportItems: ReportItem[] = [
  { id: 'RPT20260623001', name: '云梦县综合业务日报', type: '日报', period: '2026-06-23', generateTime: '2026-06-23 08:00:12', status: '已生成', size: '2.3MB', creator: '系统自动' },
  { id: 'RPT20260623002', name: '城管案件周报', type: '周报', period: '2026-06-17~2026-06-23', generateTime: '2026-06-23 09:15:34', status: '已生成', size: '4.8MB', creator: '张明' },
  { id: 'RPT20260622003', name: '预警事件月报', type: '月报', period: '2026-06', generateTime: '2026-06-22 18:30:00', status: '已生成', size: '6.2MB', creator: '李强' },
  { id: 'RPT20260623004', name: '网格化管理季报', type: '季报', period: '2026Q2', generateTime: '2026-06-23 10:05:48', status: '生成中', size: '-', creator: '王伟' },
  { id: 'RPT20260623005', name: '一标三实核采月报', type: '月报', period: '2026-06', generateTime: '2026-06-23 10:30:21', status: '生成中', size: '-', creator: '系统自动' },
  { id: 'RPT20260623006', name: '设备运行状态日报', type: '日报', period: '2026-06-23', generateTime: '-', status: '待生成', size: '-', creator: '系统自动' },
  { id: 'RPT20260622007', name: 'AI分析结果周报', type: '周报', period: '2026-06-17~2026-06-23', generateTime: '2026-06-22 17:45:09', status: '已生成', size: '3.5MB', creator: '陈静' },
  { id: 'RPT20260621008', name: '云梦县综合业务年报', type: '年报', period: '2025', generateTime: '2026-06-21 14:20:33', status: '已生成', size: '12.6MB', creator: '系统自动' },
  { id: 'RPT20260623009', name: '部门处置率月报', type: '月报', period: '2026-06', generateTime: '-', status: '待生成', size: '-', creator: '刘洋' },
  { id: 'RPT20260620010', name: '应急事件季报', type: '季报', period: '2026Q2', generateTime: '2026-06-20 16:10:55', status: '已生成', size: '5.1MB', creator: '杨帆' },
];

const statusColor: Record<ReportStatus, string> = {
  '已生成': 'green',
  '生成中': 'processing',
  '待生成': 'default',
};

const typeColor: Record<ReportType, string> = {
  '日报': 'cyan',
  '周报': 'blue',
  '月报': 'geekblue',
  '季报': 'orange',
  '年报': 'purple',
};

const quickLinks = [
  { key: 'list', label: '报表列表', desc: '查看、生成、导出各类报表', path: '/report/list', icon: ListChecks, color: '#00D4FF' },
  { key: 'custom', label: '自定义报表', desc: '按维度自由组合生成报表', path: '/report/custom', icon: SlidersHorizontal, color: '#FF9500' },
  { key: 'drill', label: '报表钻取', desc: '逐级钻取分析数据细节', path: '/report/drill', icon: Drill, color: '#00FF88' },
];

export default function ReportOverview() {
  const navigate = useNavigate();

  const totalCount = reportItems.length + 142;
  const todayCount = reportItems.filter(r => r.generateTime.startsWith('2026-06-23')).length;
  const pendingCount = reportItems.filter(r => r.status === '待生成').length + 8;
  const exportedCount = reportItems.filter(r => r.status === '已生成').length + 96;

  const recentReports = [...reportItems]
    .sort((a, b) => b.generateTime.localeCompare(a.generateTime))
    .slice(0, 6);

  const columns = [
    { title: '报表名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (t: ReportType) => <Tag color={typeColor[t]}>{t}</Tag> },
    { title: '周期', dataIndex: 'period', key: 'period', width: 170 },
    { title: '生成时间', dataIndex: 'generateTime', key: 'generateTime', width: 170 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: ReportStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    {
      title: '操作', key: 'action', width: 90,
      render: () => (
        <Button type="link" size="small" onClick={() => navigate('/report/list')} className="!text-[#00D4FF] !p-0">
          查看 <ArrowRight size={12} className="inline" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={20} className="text-[#00D4FF]" />
        <h2 className="text-lg font-semibold text-[#E8F0FE]">报表中心</h2>
        <span className="text-xs text-[#8BA3C7] ml-2">
          · 综合业务数据汇总与分析
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="报表总数" value={totalCount} icon={<FileText size={22} />} color="#00D4FF" suffix="份" />
        <StatCard title="今日生成" value={todayCount} icon={<Clock size={22} />} color="#FF9500" suffix="份" />
        <StatCard title="待审核" value={pendingCount} icon={<Loader size={22} />} color="#8B5CF6" suffix="份" />
        <StatCard title="已导出" value={exportedCount} icon={<CheckCircle size={22} />} color="#00FF88" suffix="份" />
      </div>

      <ChartCard title="快捷入口">
        <div className="grid grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div
                key={link.key}
                onClick={() => navigate(link.path)}
                className="group flex items-center gap-3 p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 cursor-pointer transition-all hover:border-[#00D4FF] hover:bg-[#112240]"
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
                  style={{ backgroundColor: `${link.color}20`, color: link.color }}
                >
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#E8F0FE] group-hover:text-[#00D4FF] transition-colors">
                    {link.label}
                  </div>
                  <p className="text-xs text-[#8BA3C7] mt-1 truncate">{link.desc}</p>
                </div>
                <ArrowRight size={16} className="text-[#8BA3C7] group-hover:text-[#00D4FF] transition-colors" />
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard
        title="最近报表"
        extra={
          <Button type="link" size="small" onClick={() => navigate('/report/list')} className="!text-[#00D4FF] !p-0">
            查看全部 <ArrowRight size={12} className="inline" />
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={recentReports}
          size="small"
          pagination={false}
          scroll={{ x: 850 }}
        />
      </ChartCard>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-xs text-[#8BA3C7] mb-2">预警事件总数</p>
          <p className="text-xl font-bold text-[#00D4FF] font-[Orbitron]">{warningStats.total}</p>
          <p className="text-xs text-[#8BA3C7] mt-1">今日新增 {warningStats.todayCount}</p>
        </div>
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-xs text-[#8BA3C7] mb-2">城管案件总数</p>
          <p className="text-xl font-bold text-[#FF9500] font-[Orbitron]">{urbanStats.total}</p>
          <p className="text-xs text-[#8BA3C7] mt-1">结案率 {urbanStats.closeRate}%</p>
        </div>
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-xs text-[#8BA3C7] mb-2">网格事件总数</p>
          <p className="text-xl font-bold text-[#00FF88] font-[Orbitron]">{gridStats.totalEvents}</p>
          <p className="text-xs text-[#8BA3C7] mt-1">处置率 {gridStats.processedRate}%</p>
        </div>
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-xs text-[#8BA3C7] mb-2">本月事件总数</p>
          <p className="text-xl font-bold text-[#8B5CF6] font-[Orbitron]">
            {reportData.monthlyReports[reportData.monthlyReports.length - 1].events}
          </p>
          <p className="text-xs text-[#8BA3C7] mt-1">
            处置率 {reportData.monthlyReports[reportData.monthlyReports.length - 1].rate}%
          </p>
        </div>
      </div>

      <p className="text-xs text-[#8BA3C7] text-center">
        数据更新时间：{dashboardStats.recentEvents[0].time} · 数据来源：综合业务分析系统
      </p>
    </div>
  );
}
