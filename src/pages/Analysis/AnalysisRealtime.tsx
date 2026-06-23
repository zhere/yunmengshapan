import { useState, useEffect } from 'react';
import { Tag, Badge } from 'antd';
import { Video, Radio, Activity } from 'lucide-react';
import { analysisTasks, analysisResults } from '@/mock/analysis';
import type { AnalysisTask, AnalysisType } from '@/mock/analysis';
import dayjs from 'dayjs';

const typeColor: Record<AnalysisType, string> = {
  '城市管理': '#00D4FF',
  '公共安全': '#FF3B5C',
  '交通出行': '#FF9500',
  '环境保护': '#00FF88',
  '政务服务': '#A855F7',
};

const tagColor: Record<AnalysisType, string> = {
  '城市管理': 'cyan',
  '公共安全': 'red',
  '交通出行': 'orange',
  '环境保护': 'green',
  '政务服务': 'purple',
};

interface DetectionBox {
  label: string;
  confidence: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

function buildBoxes(task: AnalysisTask): DetectionBox[] {
  const presets: Record<AnalysisType, string[]> = {
    '城市管理': ['占道经营', '违规停车'],
    '公共安全': ['人员聚集', '异常徘徊'],
    '交通出行': ['车辆', '行人'],
    '环境保护': ['烟雾', '扬尘'],
    '政务服务': ['排队人群'],
  };
  const labels = presets[task.analysisType];
  return labels.map((label, i) => ({
    label,
    confidence: +(task.confidence + Math.random() * 8 - 4).toFixed(1),
    top: 20 + i * 28 + Math.random() * 10,
    left: 12 + i * 30 + Math.random() * 8,
    width: 26 + Math.random() * 12,
    height: 22 + Math.random() * 10,
  }));
}

function VideoCard({ task }: { task: AnalysisTask }) {
  const [boxes, setBoxes] = useState<DetectionBox[]>(() => buildBoxes(task));
  const color = typeColor[task.analysisType];

  useEffect(() => {
    const timer = setInterval(() => {
      setBoxes((prev) =>
        prev.map((b) => ({
          ...b,
          confidence: +(task.confidence + Math.random() * 8 - 4).toFixed(1),
          top: Math.max(8, Math.min(62, b.top + (Math.random() * 6 - 3))),
          left: Math.max(4, Math.min(60, b.left + (Math.random() * 6 - 3))),
        })),
      );
    }, 2000);
    return () => clearInterval(timer);
  }, [task]);

  return (
    <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden">
      <div className="relative aspect-video bg-[#0A1628] flex items-center justify-center">
        <Video size={36} className="text-[#1E3A5F]" />
        {boxes.map((b, i) => (
          <div
            key={i}
            className="absolute border-2 rounded"
            style={{
              top: `${b.top}%`,
              left: `${b.left}%`,
              width: `${b.width}%`,
              height: `${b.height}%`,
              borderColor: color,
              boxShadow: `0 0 6px ${color}80`,
            }}
          >
            <span
              className="absolute -top-5 left-0 text-[10px] px-1 rounded whitespace-nowrap"
              style={{ backgroundColor: color, color: '#0A1628' }}
            >
              {b.label} {b.confidence}%
            </span>
          </div>
        ))}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-xs text-[#E8F0FE] font-medium truncate">{task.name}</span>
          <Badge status="processing" text={<span className="text-[10px] text-[#00FF88]">LIVE</span>} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
          <Tag color={tagColor[task.analysisType]} style={{ margin: 0 }}>{task.analysisType}</Tag>
          <span className="text-[10px] text-[#8BA3C7] font-mono">{task.deviceName}</span>
        </div>
      </div>
      <div className="p-2 space-y-1">
        <div className="flex items-center gap-1 text-[10px] text-[#8BA3C7]">
          <Activity size={11} className="text-[#00D4FF]" /> 实时检测结果
        </div>
        {boxes.map((b, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-[#E8F0FE]">{b.label}</span>
            <span style={{ color: b.confidence >= 85 ? '#00FF88' : b.confidence >= 80 ? '#00D4FF' : '#FF9500' }}>
              {b.confidence}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalysisRealtime() {
  const runningTasks = analysisTasks.filter((t) => t.status === '运行中').slice(0, 6);
  const scrollResults = [...analysisResults, ...analysisResults];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={20} className="text-[#00FF88]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">实时分析</h2>
          <Badge status="processing" text={<span className="text-xs text-[#00FF88]">{runningTasks.length} 路运行中</span>} />
        </div>
        <span className="text-xs text-[#8BA3C7] font-mono">{dayjs().format('YYYY-MM-DD HH:mm:ss')}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {runningTasks.map((task) => (
          <VideoCard key={task.id} task={task} />
        ))}
      </div>

      <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1E3A5F]">
          <Activity size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">实时检测结果</span>
        </div>
        <div className="h-48 overflow-hidden relative">
          <div className="animate-scroll-up">
            {scrollResults.map((r, i) => (
              <div
                key={`${r.id}-${i}`}
                className="flex items-center justify-between px-4 py-2 border-b border-[#1E3A5F]/50 hover:bg-[#112240]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: typeColor[r.type] }} />
                  <span className="text-xs text-[#8BA3C7] font-mono shrink-0">{r.captureTime}</span>
                  <span className="text-xs text-[#E8F0FE] truncate">{r.taskName}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Tag color={tagColor[r.type]} style={{ margin: 0 }}>{r.subType}</Tag>
                  <span style={{ color: r.confidence >= 85 ? '#00FF88' : r.confidence >= 80 ? '#00D4FF' : '#FF9500' }} className="text-xs font-mono">
                    {r.confidence}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
