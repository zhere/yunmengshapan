import { Radio, MapPin } from 'lucide-react';
import { warnings } from '@/mock/warnings';
import type { WarningLevel } from '@/mock/warnings';

const levelStyle: Record<WarningLevel, { color: string; bg: string; border: string }> = {
  '高': { color: '#FF3B5C', bg: 'rgba(255,59,92,0.12)', border: 'rgba(255,59,92,0.4)' },
  '中': { color: '#FF9500', bg: 'rgba(255,149,0,0.12)', border: 'rgba(255,149,0,0.4)' },
  '低': { color: '#00D4FF', bg: 'rgba(0,212,255,0.12)', border: 'rgba(0,212,255,0.4)' },
};

const recentEvents = warnings.slice(0, 10);

function EventRow({ event }: { event: typeof recentEvents[number] }) {
  const style = levelStyle[event.level];
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 border-b border-[#1E3A5F]/50 hover:bg-[#112240] transition-colors"
    >
      <span
        className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold"
        style={{ color: style.color, backgroundColor: style.bg, border: `1px solid ${style.border}` }}
      >
        {event.level}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[#E8F0FE] truncate">{event.subType}</span>
          <span className="text-[10px] text-[#8BA3C7] shrink-0">·{event.type}</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={10} className="text-[#8BA3C7] shrink-0" />
          <span className="text-[10px] text-[#8BA3C7] truncate">{event.location}</span>
        </div>
      </div>
      <span className="text-[10px] text-[#8BA3C7] font-digital shrink-0">
        {event.time.slice(11, 19)}
      </span>
    </div>
  );
}

export default function RealtimeEvents() {
  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-[#00D4FF] animate-pulse" />
          <span className="text-sm font-semibold text-[#E8F0FE]">实时事件</span>
        </div>
        <span className="text-xs text-[#00FF88] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
          实时滚动
        </span>
      </div>
      <div className="overflow-hidden" style={{ height: 180 }}>
        <div className="animate-scroll-up hover:[animation-play-state:paused]">
          {[...recentEvents, ...recentEvents].map((event, i) => (
            <EventRow key={`${event.id}-${i}`} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
