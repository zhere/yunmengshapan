import { useState, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import { Search, MapPin, Phone, Users, Edit3, X as XIcon } from 'lucide-react';
import { grids } from '@/mock/grid';
import type { Grid } from '@/mock/grid';

const VIEW_W = 1000;
const VIEW_H = 700;
const PAD = 60;

export default function GridDivision() {
  const [selected, setSelected] = useState<Grid | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editForm] = Form.useForm();

  const bounds = useMemo(() => {
    const pts = grids.flatMap(g => g.boundaryPoints);
    const lngs = pts.map(p => p.lng);
    const lats = pts.map(p => p.lat);
    return {
      minLng: Math.min(...lngs), maxLng: Math.max(...lngs),
      minLat: Math.min(...lats), maxLat: Math.max(...lats),
    };
  }, []);

  const project = (lng: number, lat: number) => {
    const x = PAD + ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (VIEW_W - PAD * 2);
    const y = PAD + ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (VIEW_H - PAD * 2);
    return { x, y };
  };

  const polygonPoints = (g: Grid) =>
    g.boundaryPoints.map(p => { const { x, y } = project(p.lng, p.lat); return `${x},${y}`; }).join(' ');

  const filtered = grids.filter(g => g.name.includes(searchText) || g.code.includes(searchText));

  const handleEdit = () => {
    if (!selected) return;
    editForm.setFieldsValue({
      name: selected.name, code: selected.code, area: selected.area,
      community: selected.community, staffName: selected.staffName, staffPhone: selected.staffPhone,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = () => {
    editForm.validateFields().then(() => {
      message.success(`网格「${selected?.name}」信息已更新`);
      setEditOpen(false);
    }).catch(() => {});
  };

  return (
    <div className="relative h-[calc(100vh-120px)] rounded-lg border border-[#1E3A5F] bg-[#0A1628] overflow-hidden">
      <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(ellipse at 55% 45%, #1E3A5F 0%, transparent 65%)' }} />
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        {Array.from({ length: 24 }, (_, i) => <line key={`h${i}`} x1="0" y1={`${i * 4.2}%`} x2="100%" y2={`${i * 4.2}%`} stroke="#00D4FF" strokeWidth="0.5" />)}
        {Array.from({ length: 24 }, (_, i) => <line key={`v${i}`} x1={`${i * 4.2}%`} y1="0" x2={`${i * 4.2}%`} y2="100%" stroke="#00D4FF" strokeWidth="0.5" />)}
      </svg>

      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
        {grids.map(g => {
          const isSel = selected?.id === g.id;
          const isHov = hovered === g.id;
          const c = project(g.lng, g.lat);
          return (
            <g key={g.id} className="cursor-pointer" onMouseEnter={() => setHovered(g.id)} onMouseLeave={() => setHovered(null)} onClick={() => setSelected(g)}>
              <polygon
                points={polygonPoints(g)}
                fill={isSel ? 'rgba(0,212,255,0.25)' : isHov ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.06)'}
                stroke={isSel ? '#00D4FF' : isHov ? '#00D4FF' : '#1E3A5F'}
                strokeWidth={isSel ? 2 : 1}
              />
              <circle cx={c.x} cy={c.y} r={isSel ? 5 : 3} fill="#00D4FF" />
              <text x={c.x} y={c.y - 10} fill="#E8F0FE" fontSize="11" textAnchor="middle" className="pointer-events-none">{g.name}</text>
              <text x={c.x} y={c.y + 16} fill="#8BA3C7" fontSize="9" textAnchor="middle" className="pointer-events-none">{g.staffName}</text>
            </g>
          );
        })}
      </svg>

      {/* Left panel */}
      <div className="absolute left-4 top-4 w-72 bg-[#112240]/95 border border-[#1E3A5F] rounded-lg p-4 max-h-[85%] flex flex-col">
        <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-2"><MapPin size={14} className="text-[#00D4FF]" />网格列表 ({grids.length})</h4>
        <Input placeholder="搜索网格名称/编号" allowClear prefix={<Search size={14} className="text-[#8BA3C7]" />} value={searchText} onChange={e => setSearchText(e.target.value)} className="mb-3" />
        <div className="flex-1 overflow-auto space-y-1.5">
          {filtered.map(g => (
            <div key={g.id} onClick={() => setSelected(g)} className={`p-2 rounded border cursor-pointer transition-all ${selected?.id === g.id ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-[#1E3A5F] bg-[#0A1628]/80 hover:border-[#00D4FF]/50'}`}>
              <div className="text-xs text-[#E8F0FE] font-medium truncate">{g.name}</div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-[#8BA3C7]">
                <span>{g.code}</span><span>{g.staffName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info popup */}
      {selected && (
        <div className="absolute right-4 top-4 w-72 bg-[#112240]/95 border border-[#00D4FF]/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[#E8F0FE] flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00D4FF]" />{selected.name}</h4>
            <button onClick={() => setSelected(null)} className="text-[#8BA3C7] hover:text-[#E8F0FE]"><XIcon size={16} /></button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-[#8BA3C7]">网格编号</span><span className="text-[#E8F0FE]">{selected.code}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">所属社区</span><span className="text-[#E8F0FE]">{selected.community}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">网格面积</span><span className="text-[#E8F0FE]">{selected.area} km²</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">户数</span><span className="text-[#E8F0FE]">{selected.householdCount}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">人口</span><span className="text-[#E8F0FE]">{selected.populationCount}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">事件数</span><span className="text-[#E8F0FE]">{selected.eventCount}</span></div>
            <div className="flex justify-between items-center"><span className="text-[#8BA3C7]">网格员</span><span className="text-[#E8F0FE] flex items-center gap-1"><Users size={11} />{selected.staffName}</span></div>
            <div className="flex justify-between"><span className="text-[#8BA3C7]">联系电话</span><span className="text-[#00D4FF] flex items-center gap-1"><Phone size={11} />{selected.staffPhone}</span></div>
          </div>
          <button onClick={handleEdit} className="w-full mt-4 flex items-center justify-center gap-1 py-2 rounded bg-[#00D4FF] text-[#0A1628] text-xs font-medium hover:opacity-90"><Edit3 size={12} /> 编辑网格</button>
        </div>
      )}

      <Modal title="编辑网格" open={editOpen} onOk={handleEditSubmit} onCancel={() => setEditOpen(false)} okText="保存" cancelText="取消">
        <Form form={editForm} layout="vertical" className="mt-4">
          <Form.Item name="name" label="网格名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="网格编号" rules={[{ required: true }]}><Input disabled /></Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="community" label="所属社区"><Input /></Form.Item>
            <Form.Item name="area" label="网格面积(km²)"><InputNumber className="w-full" min={0} step={0.01} /></Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="staffName" label="网格员"><Input /></Form.Item>
            <Form.Item name="staffPhone" label="联系电话"><Input /></Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
