import { useState } from 'react';
import { Checkbox, Select, Tag, message } from 'antd';
import { Map, Monitor } from 'lucide-react';
import { devices } from '@/mock/devices';
import type { Device, DeviceDepartment, DeviceType, DeviceStatus } from '@/mock/devices';

const departments: DeviceDepartment[] = ['公安局', '城管局', '交通局', '环保局', '教育局', '社区'];
const deviceTypes: DeviceType[] = ['球机', '枪机', '半球'];

const statusColor: Record<DeviceStatus, string> = {
  online: '#52c41a',
  offline: '#ff4d4f',
  maintenance: '#faad14',
};

const statusLabel: Record<DeviceStatus, string> = {
  online: '在线',
  offline: '离线',
  maintenance: '维护',
};

// 经纬度映射为 x/y 百分比 (云梦县范围 lng:113.7~113.9, lat:30.9~31.1)
function lngToX(lng: number) {
  return Math.min(95, Math.max(5, ((lng - 113.7) / 0.2) * 90 + 5));
}
function latToY(lat: number) {
  return Math.min(95, Math.max(5, ((31.1 - lat) / 0.2) * 90 + 5));
}

export default function VideoMap() {
  const [selectedDepts, setSelectedDepts] = useState<DeviceDepartment[]>(departments);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selected, setSelected] = useState<Device | null>(null);

  const filtered = devices.filter(
    d => selectedDepts.includes(d.department) && (!typeFilter || d.type === typeFilter)
  );

  const onlineCount = filtered.filter(d => d.status === 'online').length;
  const offlineCount = filtered.filter(d => d.status === 'offline').length;
  const maintenanceCount = filtered.filter(d => d.status === 'maintenance').length;

  return (
    <div className="flex gap-4 h-full">
      {/* 左侧筛选面板 */}
      <div className="w-64 shrink-0 space-y-4">
        <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <h3 className="text-sm font-semibold text-[#E8F0FE] mb-3">部门筛选</h3>
          <Checkbox.Group
            value={selectedDepts}
            onChange={v => { setSelectedDepts(v as DeviceDepartment[]); setSelected(null); }}
            className="flex flex-col gap-2"
          >
            {departments.map(d => (
              <Checkbox key={d} value={d} className="text-[#8BA3C7]">{d}</Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <h3 className="text-sm font-semibold text-[#E8F0FE] mb-3">设备类型</h3>
          <Select
            placeholder="全部类型"
            value={typeFilter || undefined}
            onChange={v => { setTypeFilter(v || ''); setSelected(null); }}
            allowClear
            className="w-full"
            options={deviceTypes.map(t => ({ label: t, value: t }))}
          />
        </div>

        <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <h3 className="text-sm font-semibold text-[#E8F0FE] mb-3">统计</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#8BA3C7]">显示设备</span><span className="text-[#00D4FF]">{filtered.length}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">在线</span><span className="text-[#52c41a]">{onlineCount}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">离线</span><span className="text-[#ff4d4f]">{offlineCount}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">维护</span><span className="text-[#faad14]">{maintenanceCount}</span></div>
          </div>
        </div>
      </div>

      {/* 地图区域 */}
      <div className="flex-1 relative bg-[#0A1628] rounded-lg border border-[#1E3A5F] overflow-hidden min-h-[600px]">
        <span className="absolute top-4 left-4 text-[#8BA3C7] text-sm font-semibold flex items-center gap-2 z-10">
          <Monitor size={16} /> 设备分布地图
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Map size={96} className="text-[#1E3A5F]" />
        </div>

        {/* 设备散点 */}
        {filtered.slice(0, 80).map(d => (
          <button
            key={d.id}
            onClick={() => { setSelected(d); message.info(`查看设备: ${d.name}`); }}
            className="absolute group"
            style={{ left: `${lngToX(d.lng)}%`, top: `${latToY(d.lat)}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span
              className="block w-3 h-3 rounded-full border border-white/30"
              style={{ backgroundColor: statusColor[d.status] }}
            />
            <span
              className="absolute -top-1 -left-1 w-5 h-5 rounded-full opacity-40 animate-ping"
              style={{ backgroundColor: statusColor[d.status] }}
            />
          </button>
        ))}

        {/* 设备信息弹窗 */}
        {selected && (
          <div
            className="absolute z-20 p-3 rounded-lg border border-[#00D4FF] bg-[#0D2137]/95 shadow-lg w-56"
            style={{ left: `${lngToX(selected.lng)}%`, top: `${latToY(selected.lat)}%`, transform: 'translate(12px, 12px)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#E8F0FE]">{selected.name}</span>
              <button onClick={() => setSelected(null)} className="text-[#8BA3C7] hover:text-[#E8F0FE]">✕</button>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-[#8BA3C7]">位置</span><span className="text-[#E8F0FE]">{selected.location}</span></div>
              <div className="flex justify-between items-center"><span className="text-[#8BA3C7]">状态</span><Tag color={statusColor[selected.status]}>{statusLabel[selected.status]}</Tag></div>
              <div className="flex justify-between"><span className="text-[#8BA3C7]">类型</span><span className="text-[#E8F0FE]">{selected.type}</span></div>
              <div className="flex justify-between"><span className="text-[#8BA3C7]">部门</span><span className="text-[#E8F0FE]">{selected.department}</span></div>
              <div className="flex justify-between"><span className="text-[#8BA3C7]">IP</span><span className="text-[#E8F0FE]">{selected.ip}</span></div>
            </div>
          </div>
        )}

        {/* 图例 */}
        <div className="absolute bottom-4 right-4 p-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/90 space-y-2 text-xs z-10">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#52c41a]" /><span className="text-[#8BA3C7]">在线设备</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ff4d4f]" /><span className="text-[#8BA3C7]">离线设备</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#faad14]" /><span className="text-[#8BA3C7]">维护中</span></div>
        </div>
      </div>
    </div>
  );
}
