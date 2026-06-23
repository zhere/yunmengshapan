import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import { Brain, Activity, Layers, Gauge, ListChecks, Radio, FileSearch } from 'lucide-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { analysisTasks, analysisResults } from '@/mock/analysis';
import type { AnalysisType } from '@/mock/analysis';
import dayjs from 'dayjs';

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7' },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };

const typeColors: Record<AnalysisType, string> = {
  '城市管理': '#00D4FF',
  '公共安全': '#FF3B5C',
  '交通出行': '#FF9500',
  '环境保护': '#00FF88',
  '政务服务': '#A855F7',
};

const quickLinks = [
  { key: 'tasks', label: '分析任务', desc: '管理AI分析任务与调度策略', path: '/analysis/tasks', icon: ListChecks, color: '#00D4FF' },
  { key: 'realtime', label: '实时分析', desc: '查看运行中任务的实时检测画面', path: '/analysis/realtime', icon: Radio, color: '#00FF88' },
  { key: 'results', label: '分析结果', desc: '检索与导出历史分析事件', path: '/analysis/results', icon: FileSearch, color: '#FF9500' },
];

export default function AnalysisOverview() {
  const navigate = useNavigate();

  const runningCount = analysisTasks.filter((t) => t.status === '运行中').length;
  const todayCount = analysisResults.filter((r) => dayjs(r.captureTime).isSame(dayjs('2026-06-23'), 'day')).length
    || analysisResults.length;
  const sceneCount = new Set(analysisTasks.map((t) => t.analysisType)).size;
  const avgConfidence = (
    analysisTasks.reduce((sum, t) => sum + t.confidence, 0) / analysisTasks.length
  ).toFixed(1);

  // 分析类型分布饼图
  const typeCountMap: Record<string, number> = {};
  analysisTasks.forEach((t) => {
    typeCountMap[t.analysisType] = (typeCountMap[t.analysisType] || 0) + 1;
  });
  const pieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' } },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        label: { color: '#E8F0FE', formatter: '{b}: {c}' },
        data: Object.keys(typeCountMap).map((name) => ({
          name,
          value: typeCountMap[name],
          itemStyle: { color: typeColors[name as AnalysisType] },
        })),
      },
    ],
  };

  // 近7日分析事件数柱状图
  const days = Array.from({ length: 7 }, (_, i) => dayjs('2026-06-23').subtract(6 - i, 'day'));
  const dayLabels = days.map((d) => d.format('MM-DD'));
  const dayCounts = days.map((d) =>
    analysisResults.filter((r) => dayjs(r.captureTime).isSame(d, 'day')).length,
  );
  const barOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: dayLabels },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [
      {
        name: '分析事件数',
        type: 'bar',
        barWidth: 24,
        data: dayCounts.map((v) => ({
          value: v,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#00D4FF' },
                { offset: 1, color: 'rgba(0,212,255,0.2)' },
              ],
            },
          },
        })),
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain size={20} className="text-[#00D4FF]" />
        <h2 className="text-lg font-semibold text-[#E8F0FE]">行为分析总览</h2>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard title="运行中任务数" value={runningCount} icon={<Activity size={22} />} color="#00D4FF" suffix="个" />
        <StatCard title="今日分析事件数" value={todayCount} icon={<Layers size={22} />} color="#00FF88" suffix="条" />
        <StatCard title="分析场景数" value={sceneCount} icon={<Brain size={22} />} color="#FF9500" suffix="类" />
        <StatCard title="平均置信度" value={avgConfidence} icon={<Gauge size={22} />} color="#A855F7" suffix="%" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="分析类型分布">
          <ReactECharts option={pieOption} style={{ height: 280 }} />
        </ChartCard>
        <ChartCard title="近7日分析事件数">
          <ReactECharts option={barOption} style={{ height: 280 }} />
        </ChartCard>
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
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#E8F0FE] group-hover:text-[#00D4FF] transition-colors">
                    {link.label}
                  </div>
                  <p className="text-xs text-[#8BA3C7] mt-1 truncate">{link.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
