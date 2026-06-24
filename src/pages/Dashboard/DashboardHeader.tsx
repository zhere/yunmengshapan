import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Clock, Activity, ShieldCheck } from 'lucide-react';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function DashboardHeader() {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.format('YYYY年MM月DD日');
  const timeStr = now.format('HH:mm:ss');
  const weekDay = weekDays[now.day()];

  return (
    <div className="relative flex items-center justify-between h-14 px-6 bg-gradient-to-r from-[#0D2137] via-[#112240] to-[#0D2137] border border-[#1E3A5F] rounded-lg overflow-hidden shrink-0 shadow-[0_0_20px_rgba(0,212,255,0.08)]">
      {/* Decorative corners */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00D4FF]" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00D4FF]" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00D4FF]" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00D4FF]" />

      {/* Left - status */}
      <div className="flex items-center gap-2 z-10">
        <ShieldCheck size={18} className="text-[#00D4FF]" />
        <span className="text-xs text-[#8BA3C7]">系统运行正常</span>
        <span className="ml-2 flex items-center gap-1 text-xs text-[#00FF88]">
          <Activity size={12} />
          <span className="animate-pulse">在线</span>
        </span>
      </div>

      {/* Center - title */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <h1
          className="text-xl font-bold text-[#E8F0FE] tracking-[0.3em] whitespace-nowrap"
          style={{ textShadow: '0 0 20px rgba(0,212,255,0.6)' }}
        >
          云梦县综合管理平台
        </h1>
      </div>

      {/* Right - time */}
      <div className="flex items-center gap-2 z-10">
        <Clock size={16} className="text-[#00D4FF]" />
        <div className="text-right leading-tight">
          <div className="text-xs text-[#8BA3C7]">
            {dateStr} 星期{weekDay}
          </div>
          <div className="text-sm font-digital text-[#E8F0FE] tracking-wider">
            {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
