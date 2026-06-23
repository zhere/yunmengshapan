import { useState, useMemo } from 'react';
import { Breadcrumb, Button, Table, Tag, Timeline, message, Card } from 'antd';
import {
  Drill, ChevronRight, ArrowLeft, MapPin, Users, AlertTriangle,
  FileText, TrendingUp, Home,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { reportData, dashboardStats } from '@/mock/stats';
import { warnings } from '@/mock/warnings';
import { urbanCases } from '@/mock/urbanCases';
import type { WarningType } from '@/mock/warnings';

type DrillLevel = 1 | 2 | 3;

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7' },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const palette = ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6', '#A855F7'];

const typeColor: Record<WarningType, string> = {
  '城市管理': 'cyan', '公共安全': 'red', '交通出行': 'orange', '环境保护': 'green', '政务服务': 'purple',
};

export default function ReportDrill() {
  const [level, setLevel] = useState<DrillLevel>(1);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<typeof warnings[0] | null>(null);

  // Level 1: 点击乡镇进入 Level 2
  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setLevel(2);
    message.info(`进入区域：${regionName}`);
  };

  // Level 2: 点击事件进入 Level 3
  const handleEventClick = (event: typeof warnings[0]) => {
    setSelectedEvent(event);
    setLevel(3);
    message.info(`查看事件详情：${event.subType}`);
  };

  const handleBack = () => {
    if (level === 3) { setLevel(2); setSelectedEvent(null); }
    else if (level === 2) { setLevel(1); setSelectedRegion(''); }
  };

  const handleBreadcrumb = (target: DrillLevel) => {
    setLevel(target);
    if (target === 1) { setSelectedRegion(''); setSelectedEvent(null); }
    if (target === 2) { setSelectedEvent(null); }
  };

  // ===== Level 1: 全县总览 =====
  const l1PieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE', formatter: '{b}: {c}' },
      data: dashboardStats.aiAnalysisStats.byType.map((d, i) => ({
        name: d.type, value: d.count, itemStyle: { color: palette[i % palette.length] },
      })),
    }],
  };

  const l1BarOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: reportData.townshipStats.slice(0, 8).map(t => t.name), axisLabel: { color: '#8BA3C7', rotate: 30 } },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [{
      name: '事件数', type: 'bar', barWidth: 20,
      data: reportData.townshipStats.slice(0, 8).map((t, i) => ({
        value: t.events,
        itemStyle: { color: palette[i % palette.length] },
      })),
    }],
  };

  const l1Columns = [
    { title: '乡镇', dataIndex: 'name', key: 'name', width: 120 },
    { title: '人口', dataIndex: 'population', key: 'population', width: 100, render: (v: number) => v.toLocaleString() },
    { title: '面积(km²)', dataIndex: 'area', key: 'area', width: 100 },
    { title: '事件数', dataIndex: 'events', key: 'events', width: 90, render: (v: number) => <span className="text-[#00D4FF] font-semibold">{v}</span> },
    { title: '案件数', dataIndex: 'cases', key: 'cases', width: 90 },
    { title: '网格数', dataIndex: 'grids', key: 'grids', width: 80 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: unknown, r: typeof reportData.townshipStats[0]) => (
        <Button type="link" size="small" onClick={() => handleRegionClick(r.name)} className="!text-[#00D4FF] !p-0">
          钻取 <ChevronRight size={12} className="inline" />
        </Button>
      ),
    },
  ];

  // ===== Level 2: 区域概览 =====
  const regionEvents = useMemo(() => {
    if (!selectedRegion) return [];
    // 按区域过滤预警事件（模拟：根据 location 包含乡镇名）
    const filtered = warnings.filter(w => w.location.includes(selectedRegion));
    return filtered.length > 0 ? filtered : warnings.slice(0, 8);
  }, [selectedRegion]);

  const l2BarOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: { textStyle: { color: '#8BA3C7' }, top: 0 },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: reportData.monthlyReports.map(m => m.month) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [
      { name: '事件', type: 'bar', barWidth: 16, data: reportData.monthlyReports.map(m => m.events), itemStyle: { color: '#00D4FF' } },
      { name: '案件', type: 'bar', barWidth: 16, data: reportData.monthlyReports.map(m => m.cases), itemStyle: { color: '#FF9500' } },
    ],
  };

  const l2LineOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: { textStyle: { color: '#8BA3C7' }, top: 0 },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: reportData.monthlyReports.map(m => m.month) },
    yAxis: { ...darkAxis, type: 'value' as const, max: 100, axisLabel: { color: '#8BA3C7', formatter: '{value}%' } },
    series: [{
      name: '处置率', type: 'line', smooth: true,
      data: reportData.monthlyReports.map(m => m.rate),
      itemStyle: { color: '#00FF88' }, lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(0,255,136,0.15)' },
    }],
  };

  const l2Columns = [
    { title: '事件编号', dataIndex: 'id', key: 'id', width: 120 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 90, render: (t: WarningType) => <Tag color={typeColor[t]}>{t}</Tag> },
    { title: '子类型', dataIndex: 'subType', key: 'subType', width: 100 },
    { title: '级别', dataIndex: 'level', key: 'level', width: 70, render: (l: string) => <Tag color={l === '高' ? 'red' : l === '中' ? 'orange' : 'default'}>{l}</Tag> },
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: unknown, r: typeof warnings[0]) => (
        <Button type="link" size="small" onClick={() => handleEventClick(r)} className="!text-[#00D4FF] !p-0">
          详情 <ChevronRight size={12} className="inline" />
        </Button>
      ),
    },
  ];

  // ===== Level 3: 具体事件 =====
  const timelineItems = selectedEvent ? [
    { color: '#00D4FF' as string, children: <span className="text-xs text-[#E8F0FE]">事件上报 · {selectedEvent.time}</span> },
    { color: '#00D4FF' as string, children: <span className="text-xs text-[#E8F0FE]">系统派发 · {selectedEvent.deviceName}</span> },
    { color: selectedEvent.status === '待处置' ? '#1E3A5F' : '#00D4FF' as string, children: <span className="text-xs text-[#E8F0FE]">处置人接单 · {selectedEvent.handler}</span> },
    { color: ['已反馈', '已闭环'].includes(selectedEvent.status) ? '#00D4FF' : '#1E3A5F' as string, children: <span className="text-xs text-[#E8F0FE]">现场处置</span> },
    { color: selectedEvent.status === '已闭环' ? '#00FF88' : '#1E3A5F' as string, children: <span className="text-xs text-[#E8F0FE]">事件闭环</span> },
  ] : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Drill size={20} className="text-[#00D4FF]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">数据钻取分析</h2>
        </div>
        {level > 1 && (
          <Button icon={<ArrowLeft size={14} />} onClick={handleBack}>返回上级</Button>
        )}
      </div>

      {/* 面包屑导航 */}
      <Card className="!bg-[#0D2137]/80 !border-[#1E3A5F]" styles={{ body: { padding: '12px 16px' } }}>
        <Breadcrumb
          items={[
            { title: <span className="flex items-center gap-1 cursor-pointer text-[#00D4FF]" onClick={() => handleBreadcrumb(1)}><Home size={12} />全县总览</span> },
            ...(level >= 2 ? [{ title: <span className="cursor-pointer text-[#00D4FF]" onClick={() => handleBreadcrumb(2)}>区域概览 · {selectedRegion}</span> }] : []),
            ...(level >= 3 ? [{ title: <span className="text-[#E8F0FE]">具体事件 · {selectedEvent?.subType}</span> }] : []),
          ]}
        />
      </Card>

      {/* Level 1: 全县总览 */}
      {level === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="全县总人口" value={reportData.townshipStats.reduce((s, t) => s + t.population, 0).toLocaleString()} icon={<Users size={22} />} color="#00D4FF" suffix="人" />
            <StatCard title="乡镇总数" value={reportData.townshipStats.length} icon={<MapPin size={22} />} color="#FF9500" suffix="个" />
            <StatCard title="事件总数" value={reportData.monthlyReports.reduce((s, m) => s + m.events, 0)} icon={<AlertTriangle size={22} />} color="#00FF88" suffix="起" />
            <StatCard title="案件总数" value={reportData.monthlyReports.reduce((s, m) => s + m.cases, 0)} icon={<FileText size={22} />} color="#8B5CF6" suffix="件" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ChartCard title="事件类型分布">
              <ReactECharts option={l1PieOption} style={{ height: 280 }} />
            </ChartCard>
            <ChartCard title="各乡镇事件数统计">
              <ReactECharts option={l1BarOption} style={{ height: 280 }} />
            </ChartCard>
          </div>

          {/* 地图占位 */}
          <ChartCard title="云梦县区域地图 · 点击乡镇钻取">
            <div className="relative w-full h-64 rounded bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.2), transparent 70%)' }} />
              <div className="text-center relative z-10">
                <MapPin size={48} className="text-[#00D4FF] mx-auto mb-2" />
                <p className="text-sm text-[#E8F0FE]">云梦县地图</p>
                <p className="text-xs text-[#8BA3C7] mt-1">点击下方表格中的"钻取"按钮查看乡镇详情</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="乡镇数据列表 · 点击钻取">
            <Table
              rowKey="name"
              columns={l1Columns}
              dataSource={reportData.townshipStats}
              size="small"
              pagination={{ pageSize: 6, showSizeChanger: false }}
              scroll={{ x: 700 }}
            />
          </ChartCard>
        </div>
      )}

      {/* Level 2: 区域概览 */}
      {level === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="区域事件数" value={regionEvents.length} icon={<AlertTriangle size={22} />} color="#00D4FF" suffix="起" />
            <StatCard title="区域案件数" value={Math.round(regionEvents.length * 0.7)} icon={<FileText size={22} />} color="#FF9500" suffix="件" />
            <StatCard title="处置率" value="92.5" icon={<TrendingUp size={22} />} color="#00FF88" suffix="%" />
            <StatCard title="在岗人员" value="17" icon={<Users size={22} />} color="#8B5CF6" suffix="人" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ChartCard title={`${selectedRegion} · 月度事件与案件统计`}>
              <ReactECharts option={l2BarOption} style={{ height: 280 }} />
            </ChartCard>
            <ChartCard title={`${selectedRegion} · 月度处置率趋势`}>
              <ReactECharts option={l2LineOption} style={{ height: 280 }} />
            </ChartCard>
          </div>

          <ChartCard title={`${selectedRegion} · 事件列表 · 点击查看详情`}>
            <Table
              rowKey="id"
              columns={l2Columns}
              dataSource={regionEvents}
              size="small"
              pagination={{ pageSize: 8, showSizeChanger: false }}
              scroll={{ x: 850 }}
            />
          </ChartCard>
        </div>
      )}

      {/* Level 3: 具体事件 */}
      {level === 3 && selectedEvent && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card title={<span className="text-sm text-[#E8F0FE] flex items-center gap-2"><FileText size={14} />事件信息</span>} className="!bg-[#0D2137]/80 !border-[#1E3A5F]">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#8BA3C7]">事件编号</span><span className="text-[#E8F0FE]">{selectedEvent.id}</span></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">事件类型</span><Tag color={typeColor[selectedEvent.type]}>{selectedEvent.type}</Tag></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">子类型</span><span className="text-[#E8F0FE]">{selectedEvent.subType}</span></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">级别</span><Tag color={selectedEvent.level === '高' ? 'red' : selectedEvent.level === '中' ? 'orange' : 'default'}>{selectedEvent.level}</Tag></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">状态</span><Tag color={selectedEvent.status === '已闭环' ? 'green' : 'processing'}>{selectedEvent.status}</Tag></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">发生时间</span><span className="text-[#E8F0FE]">{selectedEvent.time}</span></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">处置人</span><span className="text-[#E8F0FE]">{selectedEvent.handler}</span></div>
                <div className="flex justify-between"><span className="text-[#8BA3C7]">设备来源</span><span className="text-[#E8F0FE]">{selectedEvent.deviceName}</span></div>
              </div>
            </Card>

            <Card title={<span className="text-sm text-[#E8F0FE] flex items-center gap-2"><MapPin size={14} />位置与描述</span>} className="!bg-[#0D2137]/80 !border-[#1E3A5F]">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#8BA3C7] mb-1">发生位置</p>
                  <p className="text-sm text-[#E8F0FE]">{selectedEvent.location}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8BA3C7] mb-1">事件描述</p>
                  <p className="text-sm text-[#E8F0FE]">{selectedEvent.description}</p>
                </div>
                <div className="w-full h-32 rounded bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center">
                  <span className="text-xs text-[#8BA3C7]"><MapPin size={20} className="inline mr-1" />地图定位 · {selectedEvent.location}</span>
                </div>
              </div>
            </Card>
          </div>

          <ChartCard title="处置流程时间线">
            <Timeline items={timelineItems} />
          </ChartCard>

          <ChartCard title="关联事件">
            <Table
              rowKey="id"
              columns={l2Columns}
              dataSource={warnings.filter(w => w.type === selectedEvent.type && w.id !== selectedEvent.id).slice(0, 5)}
              size="small"
              pagination={false}
              scroll={{ x: 850 }}
            />
          </ChartCard>
        </div>
      )}
    </div>
  );
}
