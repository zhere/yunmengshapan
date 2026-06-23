import { useState, useMemo } from 'react';
import { Checkbox, Input, Tag, message } from 'antd';
import { Search, MapPin, Phone, Navigation, X } from 'lucide-react';
import { resources } from '@/mock/emergency';
import type { EmergencyResourceType, EmergencyResource, EmergencyResourceStatus } from '@/mock/emergency';

const typeColors: Record<EmergencyResourceType, string> = {
  摄像头: '#00D4FF', 应急队伍: '#00FF88', 车辆: '#FF9500', 物资: '#FF3B5C',
};
const statusMap: Record<EmergencyResourceStatus, string> = {
  可用: '#00FF88', 使用中: '#FF9500', 维护中: '#FF3B5C',
};
const resourceTypes: EmergencyResourceType[] = ['摄像头', '应急队伍', '车辆', '物资'];

export default function EmergencyMap() {
  const [checkedTypes, setCheckedTypes] = useState<EmergencyResourceType[]>(resourceTypes);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<EmergencyResource | null>(null);

  const filtered = useMemo(
    () => resources.filter(r => checkedTypes.includes(r.type) && r.name.includes(searchText)),
    [checkedTypes, searchText]
  );

  const visiblePoints = useMemo(
    () => resources.filter(r => checkedTypes.includes(r.type)),
    [checkedTypes]
  );

  return (
    <div className="relative h-[calc(100vh-120px)] rounded-lg border border-[#1E3A5F] bg-[#0A1628] overflow-hidden">
      {/* Map background */}
      <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(ellipse at 55% 45%, #1E3A5F 0%, transparent 65%)' }} />
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={`${i * 5}%`} x2="100%" y2={`${i * 5}%`} stroke="#00D4FF" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`v${i}`} x1={`${i * 5}%`} y1="0" x2={`${i * 5}%`} y2="100%" stroke="#00D4FF" strokeWidth="0.5" />
        ))}
      </svg>

      {/* Resource points */}
      {visiblePoints.map((r, i) => {
        const isSelected = selected?.id === r.id;
        return (
          <div
            key={r.id}
            className="absolute cursor-pointer group"
            style={{ left: `${10 + (i % 7) * 12}%`, top: `${18 + Math.floor(i / 7) * 14}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => { setSelected(r); }}
          >
            <div
              className={`rounded-full animate-pulse transition-transform ${isSelected ? 'scale-150' : 'group-hover:scale-150'}`}
              style={{
                width: isSelected ? 20 : 14, height: isSelected ? 20 : 14,
                backgroundColor: typeColors[r.type], boxShadow: `0 0 12px ${typeColors[r.type]}`,
                border: isSelected ? '2px solid #E8F0FE' : 'none',
              }}
            />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-[#E8F0FE] opacity-0 group-hover:opacity-100 transition-opacity bg-[#112240] px-2 py-0.5 rounded border border-[#1E3A5F]">
              {r.name}
            </div>
          </div>
        );
      })}

      {/* Left panel: filter + list */}
      <div className="absolute left-4 top-4 w-64 bg-[#112240]/95 border border-[#1E3A5F] rounded-lg p-4 max-h-[85%] flex flex-col">
        <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-2">
          <MapPin size={14} className="text-[#00D4FF]" />资源筛选
        </h4>
        <Checkbox.Group
          value={checkedTypes}
          onChange={v => setCheckedTypes(v as EmergencyResourceType[])}
          className="flex flex-col gap-2 mb-3"
        >
          {resourceTypes.map(t => (
            <Checkbox key={t} value={t}>
              <span style={{ color: typeColors[t] }}>● {t}</span>
            </Checkbox>
          ))}
        </Checkbox.Group>
        <Input
          placeholder="搜索资源..."
          prefix={<Search size={14} className="text-[#8BA3C7]" />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="mb-3"
        />
        <div className="flex-1 overflow-auto space-y-2">
          {filtered.map(r => (
            <div
              key={r.id}
              className={`p-2 rounded border cursor-pointer transition-all ${selected?.id === r.id ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-[#1E3A5F] bg-[#0A1628]/80 hover:border-[#00D4FF]/50'}`}
              onClick={() => setSelected(r)}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColors[r.type] }} />
                <span className="text-xs text-[#E8F0FE] font-medium truncate">{r.name}</span>
              </div>
              <div className="text-xs text-[#8BA3C7] mt-1 ml-4 truncate">{r.location}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: selected details */}
      {selected && (
        <div className="absolute right-4 top-4 w-72 bg-[#112240]/95 border border-[#00D4FF]/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#E8F0FE] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColors[selected.type] }} />
              {selected.name}
            </h4>
            <button onClick={() => setSelected(null)} className="text-[#8BA3C7] hover:text-[#E8F0FE]"><X size={16} /></button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-[#8BA3C7]">资源类型</span><span style={{ color: typeColors[selected.type] }}>{selected.type}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">状态</span><span style={{ color: statusMap[selected.status] }}>{selected.status}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">位置</span><span className="text-[#E8F0FE] text-right">{selected.location}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">坐标</span><span className="text-[#E8F0FE]">{selected.lng}, {selected.lat}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">联系人</span><span className="text-[#E8F0FE]">{selected.contact}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">电话</span><span className="text-[#00D4FF]">{selected.phone}</span></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => message.success(`已调度 ${selected.name}`)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded bg-[#00D4FF] text-[#0A1628] text-xs font-medium hover:opacity-90">
              <Navigation size={12} /> 调度
            </button>
            <button onClick={() => message.success(`正在呼叫 ${selected.contact}`)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded border border-[#1E3A5F] text-[#E8F0FE] text-xs hover:border-[#00D4FF]">
              <Phone size={12} /> 呼叫
            </button>
          </div>
        </div>
      )}

      {/* Bottom legend */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-[#112240]/95 border border-[#1E3A5F] rounded-lg px-5 py-2.5">
        {resourceTypes.map(t => (
          <div key={t} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColors[t], boxShadow: `0 0 6px ${typeColors[t]}` }} />
            <span className="text-xs text-[#8BA3C7]">{t}</span>
          </div>
        ))}
        <div className="w-px h-4 bg-[#1E3A5F]" />
        <div className="flex items-center gap-3">
          {(['可用', '使用中', '维护中'] as EmergencyResourceStatus[]).map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <Tag color={s === '可用' ? 'green' : s === '使用中' ? 'orange' : 'red'} style={{ margin: 0 }}>{s}</Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
