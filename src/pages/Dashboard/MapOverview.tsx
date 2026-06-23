import { useMemo } from 'react';
import { Map as MapIcon, Cctv, AlertTriangle } from 'lucide-react';

interface Dot {
  x: number;
  y: number;
  type: 'online' | 'offline' | 'event';
  size: number;
  pulse?: boolean;
}

const dotConfig = {
  online: { color: '#00D4FF', label: '在线摄像头' },
  offline: { color: '#FF3B5C', label: '离线摄像头' },
  event: { color: '#FF9500', label: '事件预警' },
};

function seededPositions(): Dot[] {
  const dots: Dot[] = [];
  let s = 42;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < 38; i++) {
    const r = rand();
    const type: Dot['type'] = r < 0.72 ? 'online' : r < 0.85 ? 'offline' : 'event';
    dots.push({
      x: 8 + rand() * 84,
      y: 10 + rand() * 80,
      type,
      size: type === 'event' ? 8 : 6,
      pulse: type === 'event' || (rand() < 0.2 && type === 'online'),
    });
  }
  return dots;
}

// 云梦县乡镇坐标（相对于地图区域的百分比位置）
const towns = [
  { name: '城关镇', x: 50, y: 48, size: 'md' },
  { name: '义堂镇', x: 35, y: 25, size: 'sm' },
  { name: '曾店镇', x: 58, y: 18, size: 'sm' },
  { name: '吴铺镇', x: 62, y: 42, size: 'sm' },
  { name: '伍洛镇', x: 68, y: 55, size: 'sm' },
  { name: '下辛店镇', x: 65, y: 78, size: 'sm' },
  { name: '道桥镇', x: 45, y: 82, size: 'sm' },
  { name: '隔蒲潭镇', x: 38, y: 65, size: 'sm' },
  { name: '胡金店镇', x: 25, y: 35, size: 'sm' },
  { name: '倒店乡', x: 42, y: 15, size: 'sm' },
  { name: '沙河乡', x: 72, y: 68, size: 'sm' },
  { name: '清明河乡', x: 30, y: 50, size: 'sm' },
];

/* 县界轮廓路径（基于云梦县版图特征抽象）*/
const COUNTY_PATH = 'M20,30 C25,12 45,8 60,15 C72,20 78,35 82,50 C85,62 80,75 70,82 C58,88 42,85 35,78 C25,70 18,55 15,42 C13,35 15,32 20,30Z';

/* 主干道路 */
const roads = [
  { d: 'M25,15 L50,48 L72,68', opacity: 0.5 },
  { d: 'M35,8 L50,48 L45,85', opacity: 0.4 },
  { d: 'M15,42 L50,48 L82,55', opacity: 0.4 },
  { d: 'M38,65 L50,48 L65,78', opacity: 0.35 },
  { d: 'M50,15 L50,48 L50,82', opacity: 0.3 },
  { d: 'M20,50 L35,50 L68,50', opacity: 0.3 },
];

/* 河流（府河、漳水等） */
const rivers = [
  { d: 'M25,18 C30,25 28,35 35,40 C40,45 38,55 45,62 C50,68 48,78 55,85', opacity: 0.5, width: 4 },
  { d: 'M55,12 C58,20 55,30 62,38 C68,45 65,55 70,65', opacity: 0.35, width: 3 },
];

export default function MapOverview() {
  const dots = useMemo(() => seededPositions(), []);

  return (
    <div className="flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden shadow-[0_0_12px_rgba(0,212,255,0.06)] flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1E3A5F] shrink-0">
        <div className="flex items-center gap-2">
          <MapIcon size={14} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">云梦县全域态势</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          {(Object.keys(dotConfig) as Array<keyof typeof dotConfig>).map((key) => (
            <span key={key} className="flex items-center gap-1 text-[#8BA3C7]">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: dotConfig[key].color, boxShadow: `0 0 6px ${dotConfig[key].color}` }}
              />
              {dotConfig[key].label}
            </span>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-[#0A1628]">
        {/* SVG 云梦县地图 */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 背景渐变 */}
          <defs>
            <radialGradient id="countyGlow" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="townGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
            </radialGradient>
            <filter id="roadGlow">
              <feGaussianBlur stdDeviation="0.3" />
            </filter>
          </defs>

          {/* 辐射光晕 */}
          <circle cx="50" cy="48" r="45" fill="url(#countyGlow)" />

          {/* 河流 */}
          {rivers.map((river, i) => (
            <path key={`river-${i}`} d={river.d} fill="none" stroke="#00D4FF" strokeWidth={river.width} opacity={river.opacity} strokeLinecap="round" filter="url(#roadGlow)" />
          ))}

          {/* 县界 */}
          <path d={COUNTY_PATH} fill="none" stroke="#00D4FF" strokeWidth="0.8" opacity="0.35" strokeDasharray="1.5,1" />
          <path d={COUNTY_PATH} fill="#00D4FF" fillOpacity="0.03" />

          {/* 道路 */}
          {roads.map((road, i) => (
            <path key={`road-${i}`} d={road.d} fill="none" stroke="#00D4FF" strokeWidth="0.6" opacity={road.opacity} strokeLinecap="round" strokeDasharray="1,1.5" />
          ))}

          {/* 乡镇点位 */}
          {towns.map((town) => (
            <g key={town.name}>
              <circle cx={town.x} cy={town.y} r={town.size === 'md' ? 6 : 3.5} fill="url(#townGlow)" />
              <circle cx={town.x} cy={town.y} r={town.size === 'md' ? 2 : 1.2} fill="#00D4FF" opacity="0.9" />
            </g>
          ))}

          {/* 乡镇标注 */}
          {towns.map((town) => (
            <text
              key={`label-${town.name}`}
              x={town.x}
              y={town.y - (town.size === 'md' ? 9 : 7)}
              textAnchor="middle"
              fill="#8BA3C7"
              fontSize={town.size === 'md' ? 3.5 : 2.8}
              opacity="0.9"
              fontFamily="PingFang SC, sans-serif"
            >
              {town.name}
            </text>
          ))}
        </svg>

        {/* 设备/事件标注点 */}
        {dots.map((dot, i) => {
          const config = dotConfig[dot.type];
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            >
              <div
                className={`rounded-full ${dot.pulse ? 'animate-pulse-glow' : ''}`}
                style={{
                  width: dot.size,
                  height: dot.size,
                  backgroundColor: config.color,
                  boxShadow: `0 0 8px ${config.color}, 0 0 4px ${config.color}`,
                }}
              />
            </div>
          );
        })}

        {/* 底部统计 */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] z-20">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded bg-[#0A1628]/80 border border-[#1E3A5F]">
            <span className="flex items-center gap-1 text-[#8BA3C7]">
              <Cctv size={11} className="text-[#00D4FF]" />
              <span className="font-digital text-[#00D4FF]">2156</span> 路监控
            </span>
            <span className="flex items-center gap-1 text-[#8BA3C7]">
              <AlertTriangle size={11} className="text-[#FF9500]" />
              <span className="font-digital text-[#FF9500]">38</span> 今日预警
            </span>
          </div>
          <div className="px-3 py-1.5 rounded bg-[#0A1628]/80 border border-[#1E3A5F] text-[#8BA3C7]">
            覆盖 <span className="font-digital text-[#00D4FF]">12</span> 乡镇
          </div>
        </div>
      </div>
    </div>
  );
}
