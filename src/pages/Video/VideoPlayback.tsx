import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Slider, DatePicker, Button, Tag, message } from 'antd';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, Video } from 'lucide-react';
import dayjs from 'dayjs';
import { devices } from '@/mock/devices';
import type { DeviceStatus } from '@/mock/devices';

const statusMap: Record<DeviceStatus, { color: string; label: string }> = {
  online: { color: '#52c41a', label: '在线' },
  offline: { color: '#ff4d4f', label: '离线' },
  maintenance: { color: '#faad14', label: '维护' },
};

// 模拟录像片段
const recordedSegments = [
  { start: 0, end: 6, label: '凌晨录像' },
  { start: 6, end: 12, label: '上午录像' },
  { start: 12, end: 18, label: '下午录像' },
  { start: 18, end: 24, label: '晚间录像' },
];

export interface VideoPlaybackProps {
  id?: string;
}

export default function VideoPlayback({ id: propId }: VideoPlaybackProps) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = propId || paramId;
  const device = devices.find(d => d.id === id) || devices[0];
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(8);
  const [date, setDate] = useState<dayjs.Dayjs | null>(dayjs());
  const statusInfo = statusMap[device.status];

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <Button icon={<ArrowLeft size={14} />} onClick={() => navigate('/video')}>返回列表</Button>
          <span className="text-sm text-[#8BA3C7]">{device.name} - 录像回放</span>
        </div>

        <div className="relative bg-[#0A1628] rounded-lg border border-[#1E3A5F] flex items-center justify-center min-h-[300px] flex-1">
          <div className="text-center">
            <Video size={48} className="text-[#1E3A5F] mx-auto mb-3" />
            <p className="text-[#E8F0FE] text-lg">{device.name}</p>
            <p className="text-[#8BA3C7] text-sm mt-1">录像回放区域</p>
          </div>
          {playing && (
            <span className="absolute top-3 right-3 px-2 py-1 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
              PLAYING
            </span>
          )}
        </div>

        <div className="mt-4 p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[#8BA3C7] text-sm shrink-0">回放日期</span>
            <DatePicker
              value={date}
              onChange={v => { setDate(v); message.success(`已选择 ${v?.format('YYYY-MM-DD') || ''} 录像`); }}
              className="flex-1"
            />
          </div>

          <div className="mb-3">
            <span className="text-[#8BA3C7] text-sm">录像片段</span>
            <div className="relative h-6 mt-2 bg-[#0A1628] rounded border border-[#1E3A5F] overflow-hidden">
              {recordedSegments.map(seg => (
                <div
                  key={seg.label}
                  className="absolute h-full bg-[#00D4FF]/40 border-r border-[#0A1628]"
                  style={{ left: `${(seg.start / 24) * 100}%`, width: `${((seg.end - seg.start) / 24) * 100}%` }}
                  title={`${seg.label}: ${seg.start}:00 - ${seg.end}:00`}
                />
              ))}
              <div className="absolute top-0 bottom-0 w-0.5 bg-[#00D4FF]" style={{ left: `${(time / 24) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#8BA3C7] mt-1">
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <span className="text-[#00D4FF] text-sm font-mono shrink-0">{String(Math.floor(time)).padStart(2, '0')}:00</span>
            <Slider
              min={0}
              max={24}
              step={0.25}
              value={time}
              onChange={v => setTime(v)}
              className="flex-1"
              tooltip={{ formatter: v => `${v}:00` }}
            />
            <span className="text-[#8BA3C7] text-sm font-mono shrink-0">24:00</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={() => message.info('上一帧')} icon={<SkipBack size={14} />}>上一帧</Button>
              <Button
                type="primary"
                onClick={() => { setPlaying(!playing); message.success(playing ? '暂停播放' : '开始播放'); }}
                className={playing ? '' : 'bg-[#00D4FF] border-[#00D4FF]'}
                icon={playing ? <Pause size={14} /> : <Play size={14} />}
              >
                {playing ? '暂停' : '播放'}
              </Button>
              <Button onClick={() => message.info('下一帧')} icon={<SkipForward size={14} />}>下一帧</Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8BA3C7] text-sm">倍速</span>
              {[1, 2, 4, 8].map(s => (
                <Button
                  key={s}
                  size="small"
                  type={speed === s ? 'primary' : 'default'}
                  onClick={() => { setSpeed(s); message.info(`播放速度 ${s}x`); }}
                  className={speed === s ? 'bg-[#00D4FF] border-[#00D4FF]' : ''}
                >
                  {s}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-64 shrink-0 space-y-4">
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
        <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
          <h3 className="text-sm font-semibold text-[#E8F0FE] mb-3">录像信息</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-[#8BA3C7]">录像状态</span><span className="text-[#52c41a]">有录像</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">起始时间</span><span className="text-[#E8F0FE]">00:00</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">结束时间</span><span className="text-[#E8F0FE]">24:00</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">文件大小</span><span className="text-[#E8F0FE]">2.4 GB</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
