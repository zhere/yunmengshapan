import { useState, useMemo } from 'react';
import { Card, Radio, Button, Select, Space, message, Divider, Tag } from 'antd';
import {
  SlidersHorizontal, BarChart3, LineChart, PieChart, Activity,
  Sparkles, Download, RefreshCw,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import ChartCard from '@/components/Common/ChartCard';
import { reportData } from '@/mock/stats';
import { warningStats } from '@/mock/warnings';
import { urbanStats } from '@/mock/urbanCases';
import { gridStats } from '@/mock/grid';

type TimeDim = '日' | '周' | '月' | '季' | '年';
type RegionDim = '全县' | '乡镇' | '社区';
type EventTypeDim = '全部' | '城管' | '安全' | '交通' | '环保';
type DepartmentDim = '全部' | '公安局' | '城管局' | '交通局' | '环保局' | '教育局';
type ChartType = '柱状图' | '折线图' | '饼图' | '热力图' | '趋势图';

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7' },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };

const palette = ['#00D4FF', '#FF9500', '#00FF88', '#FF3B5C', '#8B5CF6', '#A855F7'];

// 根据维度生成模拟数据
function generateMockData(
  timeDim: TimeDim,
  regionDim: RegionDim,
  eventType: EventTypeDim,
  department: DepartmentDim,
): { categories: string[]; values: number[]; seriesName: string } {
  let categories: string[] = [];
  let baseValue = 100;

  // 时间维度决定 categories
  switch (timeDim) {
    case '日':
      categories = ['00时', '04时', '08时', '12时', '16时', '20时'];
      baseValue = 30;
      break;
    case '周':
      categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      baseValue = 60;
      break;
    case '月':
      categories = reportData.monthlyReports.map(m => m.month);
      baseValue = 800;
      break;
    case '季':
      categories = reportData.quarterlyComparison.map(q => q.quarter);
      baseValue = 2500;
      break;
    case '年':
      categories = ['2022', '2023', '2024', '2025', '2026'];
      baseValue = 12000;
      break;
  }

  // 区域维度调整
  if (regionDim === '乡镇') {
    categories = reportData.townshipStats.slice(0, 6).map(t => t.name);
    baseValue = 80;
  } else if (regionDim === '社区') {
    categories = ['城关社区', '义堂社区', '曾店社区', '吴铺社区', '伍洛社区', '道桥社区'];
    baseValue = 25;
  }

  // 事件类型调整
  const typeMultiplier: Record<EventTypeDim, number> = {
    '全部': 1.0, '城管': 0.35, '安全': 0.25, '交通': 0.22, '环保': 0.13,
  };
  baseValue = Math.round(baseValue * typeMultiplier[eventType]);

  // 部门调整
  if (department !== '全部') {
    const deptMultiplier: Record<string, number> = {
      '公安局': 0.28, '城管局': 0.35, '交通局': 0.21, '环保局': 0.11, '教育局': 0.05,
    };
    baseValue = Math.round(baseValue * deptMultiplier[department]);
  }

  const values = categories.map(() => Math.round(baseValue * (0.7 + Math.random() * 0.6)));

  const seriesName = `${department === '全部' ? '全部部门' : department} · ${eventType === '全部' ? '全部事件' : eventType}事件`;

  return { categories, values, seriesName };
}

const chartTypeOptions: { label: string; value: ChartType; icon: typeof BarChart3 }[] = [
  { label: '柱状图', value: '柱状图', icon: BarChart3 },
  { label: '折线图', value: '折线图', icon: LineChart },
  { label: '饼图', value: '饼图', icon: PieChart },
  { label: '热力图', value: '热力图', icon: Activity },
  { label: '趋势图', value: '趋势图', icon: Sparkles },
];

export default function ReportCustom() {
  const [timeDim, setTimeDim] = useState<TimeDim>('月');
  const [regionDim, setRegionDim] = useState<RegionDim>('全县');
  const [eventType, setEventType] = useState<EventTypeDim>('全部');
  const [department, setDepartment] = useState<DepartmentDim>('全部');
  const [chartType, setChartType] = useState<ChartType>('柱状图');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(true);

  const data = useMemo(
    () => generateMockData(timeDim, regionDim, eventType, department),
    [timeDim, regionDim, eventType, department],
  );

  const handleGenerate = () => {
    setGenerating(true);
    message.loading({ content: '正在生成自定义报表...', key: 'gen', duration: 0 });
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      message.success({ content: '自定义报表生成成功！', key: 'gen', duration: 2 });
    }, 1200);
  };

  const handleExport = (format: 'PDF' | 'Excel') => {
    message.loading({ content: `正在导出${format}格式...`, key: 'exp', duration: 0 });
    setTimeout(() => {
      message.success({ content: `自定义报表.${format === 'PDF' ? 'pdf' : 'xlsx'} 导出成功！`, key: 'exp', duration: 2 });
    }, 1000);
  };

  // 构建图表配置
  const buildOption = () => {
    const baseSeries = {
      name: data.seriesName,
      type: chartType === '柱状图' ? 'bar' : chartType === '折线图' || chartType === '趋势图' ? 'line' : 'pie',
      data: data.values.map((v, i) => ({
        value: v,
        itemStyle: { color: palette[i % palette.length] },
      })),
    };

    if (chartType === '饼图') {
      return {
        tooltip: { ...darkTooltip, trigger: 'item' as const },
        legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
        series: [{
          ...baseSeries,
          radius: ['40%', '65%'],
          center: ['50%', '45%'],
          label: { color: '#E8F0FE', formatter: '{b}: {c} ({d}%)' },
        }],
      };
    }

    if (chartType === '热力图') {
      // 热力图：行=类别，列=指标
      const hours = ['事件', '案件', '处置', '结案'];
      const heatData: [number, number, number][] = [];
      data.categories.forEach((_, i) => {
        hours.forEach((_, j) => {
          heatData.push([j, i, Math.round(data.values[i] * (0.4 + Math.random() * 0.6))]);
        });
      });
      return {
        tooltip: { ...darkTooltip, position: 'top' as const },
        grid: { left: 80, right: 20, top: 30, bottom: 60 },
        xAxis: { ...darkAxis, type: 'category' as const, data: hours, splitArea: { show: true } },
        yAxis: { ...darkAxis, type: 'category' as const, data: data.categories, splitArea: { show: true } },
        visualMap: {
          min: 0, max: Math.max(...data.values),
          calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
          textStyle: { color: '#8BA3C7' },
          inRange: { color: ['#112240', '#00D4FF', '#FF9500'] },
        },
        series: [{
          name: data.seriesName, type: 'heatmap',
          data: heatData,
          label: { show: true, color: '#E8F0FE', fontSize: 10 },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,212,255,0.5)' } },
        }],
      };
    }

    // 柱状图 / 折线图 / 趋势图
    const isBar = chartType === '柱状图';
    const isTrend = chartType === '趋势图';
    return {
      tooltip: { ...darkTooltip, trigger: 'axis' as const },
      legend: { textStyle: { color: '#8BA3C7' }, top: 0 },
      grid: { left: 60, right: 20, top: 40, bottom: 40 },
      xAxis: { ...darkAxis, type: 'category' as const, data: data.categories },
      yAxis: { ...darkAxis, type: 'value' as const },
      series: [{
        name: data.seriesName,
        type: isBar ? 'bar' : 'line',
        barWidth: isBar ? 28 : undefined,
        smooth: !isBar,
        data: data.values.map((v, i) => ({
          value: v,
          itemStyle: isBar ? {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: palette[i % palette.length] },
                { offset: 1, color: `${palette[i % palette.length]}33` },
              ],
            },
          } : { color: palette[0] },
        })),
        lineStyle: isBar ? undefined : { width: 3, color: palette[0] },
        areaStyle: isTrend ? { color: 'rgba(0,212,255,0.15)' } : undefined,
      }],
    };
  };

  const option = buildOption();

  // 维度统计卡片
  const summaryStats = [
    { label: '数据总量', value: data.values.reduce((a, b) => a + b, 0), color: '#00D4FF' },
    { label: '最大值', value: Math.max(...data.values), color: '#FF9500' },
    { label: '最小值', value: Math.min(...data.values), color: '#00FF88' },
    { label: '平均值', value: Math.round(data.values.reduce((a, b) => a + b, 0) / data.values.length), color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={20} className="text-[#00D4FF]" />
        <h2 className="text-lg font-semibold text-[#E8F0FE]">自定义报表</h2>
        <span className="text-xs text-[#8BA3C7] ml-2">· 按维度自由组合生成报表</span>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-4">
        {/* 左侧维度选择面板 */}
        <Card
          title={<span className="text-sm text-[#E8F0FE] flex items-center gap-2"><SlidersHorizontal size={14} />维度配置</span>}
          className="!bg-[#0D2137]/80 !border-[#1E3A5F]"
          styles={{ body: { padding: 16 } }}
        >
          <div className="space-y-5">
            <div>
              <p className="text-xs text-[#8BA3C7] mb-2">时间维度</p>
              <Radio.Group
                value={timeDim}
                onChange={e => { setTimeDim(e.target.value); setGenerated(false); }}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="日">日</Radio.Button>
                <Radio.Button value="周">周</Radio.Button>
                <Radio.Button value="月">月</Radio.Button>
                <Radio.Button value="季">季</Radio.Button>
                <Radio.Button value="年">年</Radio.Button>
              </Radio.Group>
            </div>

            <Divider className="!my-3 !border-[#1E3A5F]" />

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2">区域维度</p>
              <Radio.Group
                value={regionDim}
                onChange={e => { setRegionDim(e.target.value); setGenerated(false); }}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="全县">全县</Radio.Button>
                <Radio.Button value="乡镇">乡镇</Radio.Button>
                <Radio.Button value="社区">社区</Radio.Button>
              </Radio.Group>
            </div>

            <Divider className="!my-3 !border-[#1E3A5F]" />

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2">事件类型</p>
              <Select
                value={eventType}
                onChange={v => { setEventType(v); setGenerated(false); }}
                className="w-full"
                size="small"
                options={[
                  { label: '全部事件', value: '全部' },
                  { label: '城管事件', value: '城管' },
                  { label: '安全事件', value: '安全' },
                  { label: '交通事件', value: '交通' },
                  { label: '环保事件', value: '环保' },
                ]}
              />
            </div>

            <Divider className="!my-3 !border-[#1E3A5F]" />

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2">部门</p>
              <Select
                value={department}
                onChange={v => { setDepartment(v); setGenerated(false); }}
                className="w-full"
                size="small"
                options={[
                  { label: '全部部门', value: '全部' },
                  { label: '公安局', value: '公安局' },
                  { label: '城管局', value: '城管局' },
                  { label: '交通局', value: '交通局' },
                  { label: '环保局', value: '环保局' },
                  { label: '教育局', value: '教育局' },
                ]}
              />
            </div>

            <Divider className="!my-3 !border-[#1E3A5F]" />

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2">图表类型</p>
              <div className="grid grid-cols-3 gap-2">
                {chartTypeOptions.map(opt => {
                  const Icon = opt.icon;
                  const active = chartType === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setChartType(opt.value); setGenerated(false); }}
                      className={`flex flex-col items-center gap-1 py-2 rounded border text-xs transition-all ${
                        active
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10 text-[#00D4FF]'
                          : 'border-[#1E3A5F] bg-[#0A1628] text-[#8BA3C7] hover:border-[#00D4FF]/50'
                      }`}
                    >
                      <Icon size={16} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Divider className="!my-3 !border-[#1E3A5F]" />

            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                icon={<RefreshCw size={14} />}
                loading={generating}
                onClick={handleGenerate}
                block
                className="!bg-[#00D4FF] !border-[#00D4FF]"
              >
                生成报表
              </Button>
              <Button icon={<Download size={14} />} block onClick={() => handleExport('Excel')}>
                导出 Excel
              </Button>
              <Button icon={<Download size={14} />} block onClick={() => handleExport('PDF')}>
                导出 PDF
              </Button>
            </Space>
          </div>
        </Card>

        {/* 右侧图表展示区 */}
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {summaryStats.map(s => (
              <div key={s.label} className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-3">
                <p className="text-xs text-[#8BA3C7]">{s.label}</p>
                <p className="text-xl font-bold font-[Orbitron] mt-1" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          <ChartCard
            title="自定义报表图表"
            extra={
              <div className="flex items-center gap-2">
                {generated ? (
                  <Tag color="green" style={{ margin: 0 }}>已生成</Tag>
                ) : (
                  <Tag color="orange" style={{ margin: 0 }}>待生成</Tag>
                )}
                <span className="text-xs text-[#8BA3C7]">
                  {data.seriesName} · {chartType}
                </span>
              </div>
            }
          >
            <ReactECharts option={option} style={{ height: 380 }} />
          </ChartCard>

          <ChartCard title="数据明细">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1E3A5F]">
                    <th className="text-left py-2 px-3 text-[#8BA3C7] font-normal">类别</th>
                    <th className="text-right py-2 px-3 text-[#8BA3C7] font-normal">数值</th>
                    <th className="text-right py-2 px-3 text-[#8BA3C7] font-normal">占比</th>
                    <th className="text-right py-2 px-3 text-[#8BA3C7] font-normal">趋势</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map((cat, i) => {
                    const total = data.values.reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? ((data.values[i] / total) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={cat} className="border-b border-[#1E3A5F]/50 hover:bg-[#112240]/50">
                        <td className="py-2 px-3 text-[#E8F0FE]">{cat}</td>
                        <td className="py-2 px-3 text-right text-[#00D4FF] font-semibold">{data.values[i]}</td>
                        <td className="py-2 px-3 text-right text-[#8BA3C7]">{pct}%</td>
                        <td className="py-2 px-3 text-right">
                          <div className="inline-block w-24 h-2 bg-[#1E3A5F] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: palette[i % palette.length] }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
              <p className="text-xs text-[#8BA3C7] mb-1">预警事件参考</p>
              <p className="text-lg font-bold text-[#00D4FF] font-[Orbitron]">{warningStats.total}</p>
              <p className="text-xs text-[#8BA3C7] mt-1">处置率 {warningStats.closeRate}%</p>
            </div>
            <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
              <p className="text-xs text-[#8BA3C7] mb-1">城管案件参考</p>
              <p className="text-lg font-bold text-[#FF9500] font-[Orbitron]">{urbanStats.total}</p>
              <p className="text-xs text-[#8BA3C7] mt-1">结案率 {urbanStats.closeRate}%</p>
            </div>
            <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
              <p className="text-xs text-[#8BA3C7] mb-1">网格事件参考</p>
              <p className="text-lg font-bold text-[#00FF88] font-[Orbitron]">{gridStats.totalEvents}</p>
              <p className="text-xs text-[#8BA3C7] mt-1">处置率 {gridStats.processedRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
