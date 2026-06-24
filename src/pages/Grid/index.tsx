import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Progress } from 'antd';
import { Grid3X3, Users, ClipboardCheck, CheckCircle2, Smartphone, ArrowRight, User } from 'lucide-react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { grids, gridStats } from '@/mock/grid';
import { yunmengGeoJson, townCenters } from '@/mock/yunmeng-map';

const darkAxis = { axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } };
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };
const palette = ['#00D4FF', '#00FF88', '#FF9500', '#FF3B5C', '#8B5CF6'];

const statusColor: Record<string, string> = { '进行中': '#00D4FF', '已完成': '#00FF88', '未开始': '#8BA3C7' };

// 按社区分组统计
const communityStats = grids.reduce((acc, g) => {
  if (!acc[g.community]) acc[g.community] = { count: 0, households: 0, population: 0 };
  acc[g.community].count++;
  acc[g.community].households += g.householdCount;
  acc[g.community].population += g.populationCount;
  return acc;
}, {} as Record<string, { count: number; households: number; population: number }>);

// 一标三实采集任务模拟数据
const recentCollectionTasks = [
  { id: 'T001', name: '曲阳社区人口核采', grid: '曲阳社区第一网格', assignee: '张伟', phone: '138****5678', type: '人口', progress: 78, status: '进行中' },
  { id: 'T002', name: '建设社区房屋核查', grid: '建设社区第一网格', assignee: '李强', phone: '139****2345', type: '房屋', progress: 100, status: '已完成' },
  { id: 'T003', name: '楚王城社区单位核采', grid: '楚王城社区第一网格', assignee: '王磊', phone: '136****7890', type: '单位', progress: 45, status: '进行中' },
  { id: 'T004', name: '珍珠坡社区流动人口登记', grid: '珍珠坡社区第一网格', assignee: '刘军', phone: '158****3456', type: '流动人口', progress: 30, status: '进行中' },
  { id: 'T005', name: '梦泽社区全面核采', grid: '梦泽社区第一网格', assignee: '陈勇', phone: '159****6789', type: '全面', progress: 0, status: '未开始' },
  { id: 'T006', name: '义堂社区单位核采', grid: '义堂社区第一网格', assignee: '黄明', phone: '155****8901', type: '单位', progress: 100, status: '已完成' },
];

// 注册云梦县地图
echarts.registerMap('yunmeng', yunmengGeoJson as any);

export default function GridOverview() {
  const navigate = useNavigate();

  // 网格分布图 — 社区颜色映射
  const communityColorMap: Record<string, string> = {
    '曲阳社区': '#00D4FF', '建设社区': '#00FF88', '楚王城社区': '#FF9500',
    '珍珠坡社区': '#FF3B5C', '梦泽社区': '#A855F7', '西大社区': '#8B5CF6',
    '南环社区': '#06B6D4', '义堂社区': '#10B981', '曾店社区': '#F59E0B',
    '吴铺社区': '#EC4899', '伍洛社区': '#6366F1', '下辛店社区': '#14B8A6',
  };
  const communityList = Object.keys(communityStats);

  const mapOption = {
    tooltip: {
      ...darkTooltip,
      trigger: 'item' as const,
      formatter: (params: { componentType: string; data?: { name: string; community: string; staffName: string; households: number; population: number } }) => {
        if (params.componentType !== 'series' || !params.data) return '';
        const d = params.data;
        return `<div style="font-size:13px;font-weight:bold;color:#E8F0FE;margin-bottom:6px">${d.name}</div>
                <div style="font-size:12px;color:#8BA3C7">所属社区：<span style="color:${communityColorMap[d.community] || '#E8F0FE'}">${d.community}</span></div>
                <div style="font-size:12px;color:#8BA3C7">网格员：<span style="color:#E8F0FE">${d.staffName}</span></div>
                <div style="font-size:12px;color:#8BA3C7">户数：<span style="color:#00D4FF">${d.households}</span></div>
                <div style="font-size:12px;color:#8BA3C7">人口：<span style="color:#00FF88">${d.population}</span></div>`;
      },
    },
    geo: {
      map: 'yunmeng',
      roam: true,
      zoom: 1.2,
      center: [113.755, 31.025],
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: '#0D2137',
        borderColor: '#1E3A5F',
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 212, 255, 0.08)',
      },
      emphasis: {
        disabled: true,
      },
    },
    series: [
      {
        name: '网格',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        symbolSize: (val: number[]) => Math.max(18, Math.min(42, val[2] / 50)),
        label: {
          show: true,
          formatter: (params: { data: { name: string } }) =>
            params.data.name.replace('社区', '').replace('第一网格', '').replace('第二网格', ''),
          position: 'top' as const,
          color: '#E8F0FE',
          fontSize: 10,
          distance: 6,
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowBlur: 4,
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold' as const,
            fontSize: 12,
          },
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 212, 255, 0.6)',
          },
        },
        data: grids.map(g => ({
          value: [g.lng, g.lat, g.populationCount],
          name: g.name,
          community: g.community,
          staffName: g.staffName,
          households: g.householdCount,
          population: g.populationCount,
          itemStyle: {
            color: communityColorMap[g.community] || '#00D4FF',
            shadowBlur: 8,
            shadowColor: `${communityColorMap[g.community] || '#00D4FF'}66`,
          },
        })),
      },
      {
        name: '乡镇标注',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: 20,
        silent: true,
        label: {
          show: true,
          position: 'bottom' as const,
          color: '#8BA3C7',
          fontSize: 9,
          distance: 2,
          textShadowColor: 'rgba(0,0,0,0.9)',
          textShadowBlur: 3,
        },
        itemStyle: {
          color: '#1E3A5F',
        },
        data: townCenters.map(t => ({
          value: [t.lng, t.lat],
          name: t.name,
        })),
      },
    ],
  };

  const collectionPieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE' },
      data: [
        { name: '人口核采', value: 156, itemStyle: { color: palette[0] } },
        { name: '房屋核查', value: 89, itemStyle: { color: palette[1] } },
        { name: '单位核采', value: 23, itemStyle: { color: palette[2] } },
        { name: '流动人口', value: 16, itemStyle: { color: palette[3] } },
        { name: '标准地址', value: 312, itemStyle: { color: palette[4] } },
      ],
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

  const typeColors: Record<string, string> = { '人口': '#00D4FF', '房屋': '#00FF88', '单位': '#FF9500', '流动人口': '#A855F7', '全面': '#FF3B5C' };

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 90,
      render: (v: string) => <Tag color={typeColors[v] || '#A855F7'}>{v}</Tag>,
    },
    { title: '所属网格', dataIndex: 'grid', key: 'grid', width: 150, ellipsis: true },
    {
      title: '网格员', key: 'assignee', width: 150,
      render: (_: unknown, record: typeof recentCollectionTasks[number]) => (
        <div className="flex items-center gap-1.5">
          <User size={12} className="text-[#00D4FF]" />
          <span className="text-xs text-[#E8F0FE]">{record.assignee}</span>
          <span className="text-[10px] text-[#8BA3C7] ml-1">{record.phone}</span>
        </div>
      ),
    },
    {
      title: '进度', dataIndex: 'progress', key: 'progress', width: 130,
      render: (v: number) => <Progress percent={v} size="small" strokeColor={{ from: '#00D4FF', to: '#00FF88' }} />,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <StatCard title="网格总数" value={gridStats.totalGrids} icon={<Grid3X3 size={22} />} color="#00D4FF" suffix="个" />
        <StatCard title="在岗网格员" value={`${gridStats.onDutyStaff}/${gridStats.totalStaff}`} icon={<Users size={22} />} color="#00FF88" suffix="人" />
        <StatCard title="一标三实任务" value={recentCollectionTasks.length} icon={<ClipboardCheck size={22} />} color="#FF9500" suffix="项" />
        <StatCard title="采集完成率" value={`${Math.round((recentCollectionTasks.filter(t => t.status === '已完成').length / recentCollectionTasks.length) * 100)}%`} icon={<CheckCircle2 size={22} />} color="#8B5CF6" />
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
        <ChartCard title="网格分布图">
          <div className="flex flex-col" style={{ height: 420 }}>
            {/* 社区图例 */}
            <div className="flex items-center gap-3 flex-wrap px-2 pt-1 pb-2">
              {communityList.slice(0, 6).map(c => (
                <span key={c} className="flex items-center gap-1 text-[10px] text-[#8BA3C7]">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: communityColorMap[c] }} />
                  {c}
                </span>
              ))}
              {communityList.length > 6 && (
                <span className="text-[10px] text-[#8BA3C7]">+{communityList.length - 6}...</span>
              )}
            </div>
            <ReactECharts option={mapOption} style={{ flex: 1, minHeight: 360 }} />
          </div>
        </ChartCard>
        <ChartCard title="一标三实采集分布">
          <ReactECharts option={collectionPieOption} style={{ height: 420 }} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="网格员在岗状态" extra={<Button type="link" size="small" onClick={() => navigate('/grid/staff')} className="!text-[#00D4FF] !p-0">人员管理 <ArrowRight size={12} className="inline" /></Button>}>
          <ReactECharts option={dutyPieOption} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="一标三实采集任务" extra={<Button type="link" size="small" onClick={() => navigate('/collection/tasks')} className="!text-[#00D4FF] !p-0">全部任务 <ArrowRight size={12} className="inline" /></Button>}>
          <Table rowKey="id" columns={columns} dataSource={recentCollectionTasks} size="small" pagination={false} scroll={{ x: 850 }} />
        </ChartCard>
      </div>
    </div>
  );
}
