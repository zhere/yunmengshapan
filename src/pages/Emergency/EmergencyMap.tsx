import { useState, useMemo, useRef } from 'react';
import { Checkbox, Input, Tag, message } from 'antd';
import { Search, MapPin, Phone, Navigation, X, Camera, Users, Truck, Package } from 'lucide-react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { resources } from '@/mock/emergency';
import { yunmengGeoJson } from '@/mock/yunmeng-map';
import type { EmergencyResourceType, EmergencyResource, EmergencyResourceStatus } from '@/mock/emergency';

// 注册云梦县地图
echarts.registerMap('yunmeng', yunmengGeoJson as any);

const typeColors: Record<EmergencyResourceType, string> = {
  摄像头: '#00D4FF', 应急队伍: '#00FF88', 车辆: '#FF9500', 物资: '#FF3B5C',
};
const statusMap: Record<EmergencyResourceStatus, string> = {
  可用: '#00FF88', 使用中: '#FF9500', 维护中: '#FF3B5C',
};
const resourceTypes: EmergencyResourceType[] = ['摄像头', '应急队伍', '车辆', '物资'];

// 资源类型对应的图标映射
const typeIcons: Record<EmergencyResourceType, React.ReactNode> = {
  摄像头: <Camera size={14} />,
  应急队伍: <Users size={14} />,
  车辆: <Truck size={14} />,
  物资: <Package size={14} />,
};

// ECharts 符号映射
const typeSymbols: Record<EmergencyResourceType, string> = {
  摄像头: 'circle',
  应急队伍: 'diamond',
  车辆: 'triangle',
  物资: 'rect',
};

export default function EmergencyMap() {
  const [checkedTypes, setCheckedTypes] = useState<EmergencyResourceType[]>(resourceTypes);
  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<EmergencyResource | null>(null);
  const chartRef = useRef<ReactECharts>(null);

  const filtered = useMemo(
    () => resources.filter(r => checkedTypes.includes(r.type) && r.name.includes(searchText)),
    [checkedTypes, searchText]
  );

  // 地图配置
  const mapOption = useMemo(() => ({
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#112240',
      borderColor: '#1E3A5F',
      textStyle: { color: '#E8F0FE' },
      formatter: (params: { data?: { name: string; type: EmergencyResourceType; status: EmergencyResourceStatus; location: string; contact: string; phone: string } }) => {
        if (!params.data) return '';
        const d = params.data;
        return `<div style="font-size:13px;font-weight:bold;color:#E8F0FE;margin-bottom:6px">${d.name}</div>
                <div style="font-size:12px;color:#8BA3C7">类型：<span style="color:${typeColors[d.type]}">${d.type}</span></div>
                <div style="font-size:12px;color:#8BA3C7">状态：<span style="color:${statusMap[d.status]}">${d.status}</span></div>
                <div style="font-size:12px;color:#8BA3C7">位置：<span style="color:#E8F0FE">${d.location}</span></div>
                <div style="font-size:12px;color:#8BA3C7">联系人：<span style="color:#E8F0FE">${d.contact}</span></div>
                <div style="font-size:12px;color:#8BA3C7">电话：<span style="color:#00D4FF">${d.phone}</span></div>`;
      },
    },
    geo: {
      map: 'yunmeng',
      roam: true,
      zoom: 1.2,
      center: [113.755, 31.025],
      label: { show: false },
      itemStyle: {
        areaColor: '#0D2137',
        borderColor: '#1E3A5F',
        borderWidth: 2,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 212, 255, 0.08)',
      },
      emphasis: { disabled: true },
    },
    series: [{
      type: 'scatter',
      coordinateSystem: 'geo',
      symbolSize: 22,
      label: {
        show: true,
        formatter: (params: { data: { name: string; type: EmergencyResourceType } }) => {
          // 摄像头和物资只显示图标不显示文字，队伍和车辆显示简称
          if (params.data.type === '摄像头') return '';
          return params.data.name.replace('云梦县', '').replace('县', '').replace('镇', '').substring(0, 4);
        },
        position: 'top' as const,
        color: '#E8F0FE',
        fontSize: 9,
        distance: 4,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowBlur: 3,
      },
      emphasis: {
        label: { show: true, fontWeight: 'bold' as const, fontSize: 11 },
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0, 212, 255, 0.6)' },
      },
      data: resources
        .filter(r => checkedTypes.includes(r.type))
        .map(r => ({
          value: [r.lng, r.lat],
          name: r.name,
          type: r.type,
          status: r.status,
          location: r.location,
          contact: r.contact,
          phone: r.phone,
          symbol: typeSymbols[r.type],
          itemStyle: {
            color: typeColors[r.type],
            shadowBlur: 8,
            shadowColor: `${typeColors[r.type]}66`,
          },
        })),
    }],
  }), [checkedTypes]);

  // 处理地图点击事件
  const onEvents = useMemo(() => ({
    click: (params: { data?: { name: string } }) => {
      if (params.data) {
        const found = resources.find(r => r.name === params.data!.name);
        if (found) setSelected(found);
      }
    },
  }), []);

  // 左侧列表点击同步到地图
  const handleListSelect = (r: EmergencyResource) => {
    setSelected(r);
    // 高亮对应点
    const chart = chartRef.current?.getEchartsInstance();
    if (chart) {
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: resources.findIndex(item => item.id === r.id),
      });
    }
  };

  return (
    <div className="relative h-[calc(100vh-120px)] rounded-lg border border-[#1E3A5F] bg-[#0A1628] overflow-hidden">
      {/* ECharts 地图 */}
      <ReactECharts
        ref={chartRef}
        option={mapOption}
        style={{ height: '100%', width: '100%' }}
        onEvents={onEvents}
        className="absolute inset-0"
      />

      {/* Left panel: filter + list */}
      <div className="absolute left-4 top-4 w-64 bg-[#112240]/95 border border-[#1E3A5F] rounded-lg p-4 max-h-[85%] flex flex-col z-10">
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
        <div className="flex-1 overflow-auto space-y-2" style={{ maxHeight: 380 }}>
          {filtered.length === 0 ? (
            <div className="text-xs text-[#8BA3C7] text-center py-4">无匹配资源</div>
          ) : (
            filtered.map(r => (
              <div
                key={r.id}
                className={`p-2.5 rounded border cursor-pointer transition-all ${
                  selected?.id === r.id
                    ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                    : 'border-[#1E3A5F] bg-[#0A1628]/80 hover:border-[#00D4FF]/50'
                }`}
                onClick={() => handleListSelect(r)}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: typeColors[r.type] }} />
                  <span className="text-xs text-[#E8F0FE] font-medium truncate">{r.name}</span>
                  <span className="ml-auto text-[10px] px-1 py-0.5 rounded" style={{
                    color: statusMap[r.status],
                    backgroundColor: `${statusMap[r.status]}20`,
                  }}>{r.status}</span>
                </div>
                <div className="text-xs text-[#8BA3C7] mt-1 ml-4 truncate">{r.location}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel: selected details */}
      {selected && (
        <div className="absolute right-4 top-4 w-72 bg-[#112240]/95 border border-[#00D4FF]/50 rounded-lg p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#E8F0FE] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: typeColors[selected.type] }} />
              <span className="truncate">{selected.name}</span>
            </h4>
            <button onClick={() => setSelected(null)} className="text-[#8BA3C7] hover:text-[#E8F0FE] shrink-0"><X size={16} /></button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8BA3C7]">资源类型</span>
              <span className="flex items-center gap-1" style={{ color: typeColors[selected.type] }}>
                {typeIcons[selected.type]} {selected.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8BA3C7]">状态</span>
              <Tag color={selected.status === '可用' ? 'green' : selected.status === '使用中' ? 'orange' : 'red'} style={{ margin: 0 }}>{selected.status}</Tag>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8BA3C7]">位置</span>
              <span className="text-[#E8F0FE] text-right max-w-[160px] truncate">{selected.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8BA3C7]">坐标</span>
              <span className="text-[#E8F0FE]">{selected.lng.toFixed(4)}, {selected.lat.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8BA3C7]">联系人</span>
              <span className="text-[#E8F0FE]">{selected.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8BA3C7]">电话</span>
              <span className="text-[#00D4FF]">{selected.phone}</span>
            </div>
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-[#112240]/95 border border-[#1E3A5F] rounded-lg px-5 py-2.5 z-10">
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
