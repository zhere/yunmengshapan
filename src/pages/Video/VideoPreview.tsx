import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Tag, message } from 'antd';
import {
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Video, RotateCcw, ArrowLeft,
} from 'lucide-react';
import { devices } from '@/mock/devices';
import type { DeviceStatus } from '@/mock/devices';

const statusMap: Record<DeviceStatus, { color: string; label: string }> = {
  online: { color: '#52c41a', label: '在线' },
  offline: { color: '#ff4d4f', label: '离线' },
  maintenance: { color: '#faad14', label: '维护' },
};

export interface VideoPreviewProps {
  id?: string;
}

export default function VideoPreview({ id: propId }: VideoPreviewProps) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = propId || paramId;
  const device = devices.find(d => d.id === id) || devices[0];
  const [layout, setLayout] = useState(4);

  const cols = layout === 1 ? 1 : layout === 4 ? 2 : layout === 9 ? 3 : 4;
  const previewDevices = devices.slice(0, layout);
  const statusInfo = statusMap[device.status];

  const ptzButtons = [
    { icon: <ChevronUp size={18} />, label: '上', pos: 'col-start-2 row-start-1', onClick: () => message.success('云台向上转动') },
    { icon: <ChevronLeft size={18} />, label: '左', pos: 'col-start-1 row-start-2', onClick: () => message.success('云台向左转动') },
    { icon: <RotateCcw size={18} />, label: '复位', pos: 'col-start-2 row-start-2', onClick: () => message.success('云台已复位') },
    { icon: <ChevronRight size={18} />, label: '右', pos: 'col-start-3 row-start-2', onClick: () => message.success('云台向右转动') },
    { icon: <ChevronDown size={18} />, label: '下', pos: 'col-start-2 row-start-3', onClick: () => message.success('云台向下转动') },
  ];

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate('/video')}>返回列表</Button>
          <div className="flex gap-2">
            {[1, 4, 9, 16].map(n => (
              <Button
                key={n}
                size="small"
                type={layout === n ? 'primary' : 'default'}
                onClick={() => { setLayout(n); message.info(`切换为 ${n} 宫格布局`); }}
                className={layout === n ? 'bg-[#00D4FF] border-[#00D4FF]' : ''}
              >
                {n}宫格
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {previewDevices.map(d => (
            <div
              key={d.id}
              className="relative bg-[#0A1628] rounded border border-[#1E3A5F] flex flex-col items-center justify-center overflow-hidden min-h-[120px]"
            >
              <Video size={32} className="text-[#1E3A5F] mb-2" />
              <span className="text-[#8BA3C7] text-xs">实时视频流</span>
              <span className="absolute top-2 left-2 text-xs text-[#E8F0FE] bg-[#0A1628]/80 px-1.5 py-0.5 rounded truncate max-w-[80%]">
                {d.name}
              </span>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded animate-pulse">
                LIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-64 shrink-0 space-y-4">
        <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <h3 className="text-sm font-semibold text-[#E8F0FE] mb-3">云台控制</h3>
          <div className="grid grid-cols-3 gap-2 w-36 mx-auto">
            {ptzButtons.map(btn => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                title={btn.label}
                className={`${btn.pos} flex items-center justify-center w-10 h-10 rounded-lg border border-[#1E3A5F] bg-[#0A1628] text-[#8BA3C7] hover:text-[#00D4FF] hover:border-[#00D4FF] transition-colors`}
              >
                {btn.icon}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button icon={<ZoomIn size={14} />} onClick={() => message.success('变倍放大')}>变倍+</Button>
            <Button icon={<ZoomOut size={14} />} onClick={() => message.success('变倍缩小')}>变倍-</Button>
            <Button icon={<ZoomIn size={14} />} onClick={() => message.success('聚焦拉近')}>聚焦+</Button>
            <Button icon={<ZoomOut size={14} />} onClick={() => message.success('聚焦拉远')}>聚焦-</Button>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <h3 className="text-sm font-semibold text-[#E8F0FE] mb-3">设备信息</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#8BA3C7]">名称</span><span className="text-[#E8F0FE]">{device.name}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">位置</span><span className="text-[#E8F0FE] truncate max-w-[140px]">{device.location}</span></div>
            <div className="flex justify-between items-center"><span className="text-[#8BA3C7]">状态</span><Tag color={statusInfo.color}>{statusInfo.label}</Tag></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">类型</span><span className="text-[#E8F0FE]">{device.type}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">IP</span><span className="text-[#E8F0FE]">{device.ip}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
