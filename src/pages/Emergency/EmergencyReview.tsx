import { useState } from 'react';
import { Tag, Button, Timeline, message, Empty } from 'antd';
import { RotateCcw, Video, MapPin, FileText, AlertTriangle, Clock, Users, Map } from 'lucide-react';
import { emergencyEvents } from '@/mock/emergency';
import type { EmergencyEvent, EmergencyPlanLevel, EmergencyEventStatus } from '@/mock/emergency';

const levelColors: Record<EmergencyPlanLevel, string> = {
  'I级': 'red', 'II级': 'orange', 'III级': 'blue', 'IV级': 'green',
};
const statusColor: Record<EmergencyEventStatus, string> = {
  '接报': '#FF3B5C', '响应中': '#FF9500', '处置中': '#00D4FF', '已结束': '#00FF88',
};

function buildTimeline(event: EmergencyEvent) {
  return [
    { time: event.reportTime, title: '事件接报', desc: event.description, color: '#FF3B5C' },
    { time: event.reportTime, title: '启动响应', desc: `启动 ${event.level} 应急响应，通知相关单位`, color: '#FF9500' },
    { time: event.reportTime, title: '力量调集', desc: '调集应急队伍、车辆、物资前往现场', color: '#00D4FF' },
    { time: event.reportTime, title: '现场处置', desc: '开展救援处置工作，控制事态发展', color: '#8B5CF6' },
    { time: event.reportTime, title: '事件结束', desc: event.status === '已结束' ? '事态已控制，处置完成' : '处置进行中', color: statusColor[event.status] },
  ];
}

export default function EmergencyReview() {
  const [selectedId, setSelectedId] = useState<string | null>(emergencyEvents[0]?.id ?? null);
  const selected = emergencyEvents.find(e => e.id === selectedId) || null;

  const handleGenerateReport = () => {
    if (!selected) return;
    message.success(`已生成复盘报告：${selected.name}`);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      {/* Left: event list */}
      <div className="w-80 shrink-0 bg-[#0D2137]/80 border border-[#1E3A5F] rounded-lg p-4 overflow-auto">
        <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-2">
          <RotateCcw size={14} className="text-[#00D4FF]" />历史事件
        </h4>
        <div className="space-y-2">
          {emergencyEvents.map(event => (
            <div
              key={event.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedId === event.id ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-[#1E3A5F] bg-[#0A1628]/60 hover:border-[#00D4FF]/50'}`}
              onClick={() => setSelectedId(event.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#E8F0FE] font-medium truncate flex-1">{event.name}</span>
                <Tag color={levelColors[event.level]} style={{ margin: 0 }}>{event.level}</Tag>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#8BA3C7]">
                <Clock size={10} />{event.reportTime}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Tag color="blue" style={{ margin: 0 }}>{event.type}</Tag>
                <span className="text-xs" style={{ color: statusColor[event.status] }}>{event.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: detail */}
      <div className="flex-1 bg-[#0D2137]/80 border border-[#1E3A5F] rounded-lg p-5 overflow-auto">
        {selected ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF3B5C]/20">
                  <AlertTriangle size={20} className="text-[#FF3B5C]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#E8F0FE]">{selected.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8BA3C7]">
                    <MapPin size={11} />{selected.location}
                  </div>
                </div>
              </div>
              <Button type="primary" icon={<FileText size={14} />} onClick={handleGenerateReport}>生成复盘报告</Button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80">
                <div className="text-xs text-[#8BA3C7]">事件类型</div>
                <div className="text-sm text-[#E8F0FE] mt-1">{selected.type}</div>
              </div>
              <div className="p-3 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80">
                <div className="text-xs text-[#8BA3C7]">响应级别</div>
                <div className="mt-1"><Tag color={levelColors[selected.level]}>{selected.level}</Tag></div>
              </div>
              <div className="p-3 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80">
                <div className="text-xs text-[#8BA3C7]">伤亡人数</div>
                <div className="text-sm text-[#E8F0FE] mt-1">{selected.casualties} 人</div>
              </div>
              <div className="p-3 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80">
                <div className="text-xs text-[#8BA3C7]">影响范围</div>
                <div className="text-sm text-[#E8F0FE] mt-1">{selected.affectedArea} m²</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-1.5">
                  <Video size={14} className="text-[#00D4FF]" />视频回放
                </h4>
                <div className="aspect-video bg-[#0A1628] border border-[#1E3A5F] rounded-lg flex flex-col items-center justify-center relative">
                  <Video size={40} className="text-[#1E3A5F] mb-2" />
                  <span className="text-xs text-[#8BA3C7]">视频回放区域</span>
                  <span className="absolute top-2 right-2 flex items-center gap-1 text-xs text-[#FF3B5C]">
                    <span className="w-2 h-2 rounded-full bg-[#FF3B5C] animate-pulse" />REC
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-1.5">
                  <Map size={14} className="text-[#00FF88]" />人员轨迹
                </h4>
                <div className="aspect-video bg-[#0A1628] border border-[#1E3A5F] rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at center, #1E3A5F 0%, transparent 70%)' }} />
                  <MapPin size={32} className="text-[#1E3A5F]" />
                  <span className="text-xs text-[#8BA3C7] ml-2">人员轨迹回放</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-1.5">
                <Users size={14} className="text-[#FF9500]" />处置时间线
              </h4>
              <Timeline
                items={buildTimeline(selected).map(item => ({
                  color: item.color,
                  children: (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#E8F0FE] font-medium">{item.title}</span>
                        <span className="text-xs text-[#8BA3C7]">{item.time}</span>
                      </div>
                      <p className="text-xs text-[#8BA3C7] mt-1">{item.desc}</p>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description={<span className="text-[#8BA3C7]">请选择左侧事件查看复盘</span>} />
          </div>
        )}
      </div>
    </div>
  );
}
