import { useState, useMemo } from 'react';
import { Tag, Button, message, Empty } from 'antd';
import { Camera, MapPin, Clock, Sparkles, CheckCircle2, Brain } from 'lucide-react';
import { warnings } from '@/mock/warnings';
import type { Warning } from '@/mock/warnings';

const levelColor: Record<string, string> = { '高': '#FF3B5C', '中': '#FF9500', '低': '#00D4FF' };

function getConfidence(id: string): number {
  const num = parseInt(id.replace(/\D/g, ''), 10) || 1;
  return 85 + (num % 14);
}

export default function UrbanPatrol() {
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  const urbanEvents = useMemo(
    () => warnings.filter(w => w.type === '城市管理'),
    []
  );

  const handleGenerate = (event: Warning) => {
    setProcessedIds(prev => new Set(prev).add(event.id));
    message.success(`已根据 AI 识别事件生成案件：${event.subType} @ ${event.location}`);
  };

  const pendingCount = urbanEvents.length - processedIds.size;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#00D4FF]/20">
            <Brain size={20} className="text-[#00D4FF]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#E8F0FE]">AI 智能巡查</h3>
            <p className="text-xs text-[#8BA3C7]">基于视频分析自动发现城市管理问题</p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-[#00D4FF] font-[Orbitron]">{urbanEvents.length}</div>
            <div className="text-xs text-[#8BA3C7]">发现事件</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#FF9500] font-[Orbitron]">{pendingCount}</div>
            <div className="text-xs text-[#8BA3C7]">待处理</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-[#00FF88] font-[Orbitron]">{processedIds.size}</div>
            <div className="text-xs text-[#8BA3C7]">已生成</div>
          </div>
        </div>
      </div>

      {urbanEvents.length === 0 ? (
        <Empty description={<span className="text-[#8BA3C7]">暂无 AI 巡查事件</span>} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {urbanEvents.map(event => {
            const processed = processedIds.has(event.id);
            const confidence = getConfidence(event.id);
            return (
              <div
                key={event.id}
                className={`rounded-lg border overflow-hidden transition-all ${processed ? 'border-[#00FF88]/40 opacity-70' : 'border-[#1E3A5F] hover:border-[#00D4FF]/60'}`}
                style={{ background: '#0D2137' }}
              >
                <div className="relative h-32 bg-[#0A1628] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at center, #1E3A5F 0%, transparent 70%)' }} />
                  <Camera size={32} className="text-[#1E3A5F] relative z-10" />
                  <span className="absolute bottom-2 left-2 text-xs text-[#8BA3C7] z-10">{event.deviceName}</span>
                  <Tag color="cyan" className="absolute top-2 left-2 z-10 flex items-center gap-1" style={{ margin: 0 }}>
                    <Sparkles size={10} /> AI识别
                  </Tag>
                  {processed && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded bg-[#00FF88]/20">
                      <CheckCircle2 size={12} className="text-[#00FF88]" />
                      <span className="text-xs text-[#00FF88]">已生成</span>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#E8F0FE] font-medium">{event.subType}</span>
                    <span style={{ color: levelColor[event.level] }} className="text-xs font-medium">{event.level}级</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#8BA3C7]">
                    <MapPin size={11} /> {event.location}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#8BA3C7]">
                    <Clock size={11} /> {event.time}
                  </div>
                  <p className="text-xs text-[#8BA3C7] line-clamp-2">{event.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E3A5F]">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#8BA3C7]">置信度</span>
                      <span className="text-sm font-bold font-[Orbitron]" style={{ color: confidence >= 90 ? '#00FF88' : '#FF9500' }}>
                        {confidence}%
                      </span>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      disabled={processed}
                      onClick={() => handleGenerate(event)}
                    >
                      {processed ? '已生成' : '生成案件'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
