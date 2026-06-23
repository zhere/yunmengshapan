import { useState, useMemo } from 'react';
import { Input, Select, Tag, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Users, Home, Building2, MapPin, Network } from 'lucide-react';
import { collectionStats } from '@/mock/collection';

interface GraphNode {
  id: string;
  label: string;
  type: 'person' | 'house' | 'unit' | 'addr';
  x: number;
  y: number;
  color: string;
  count: number;
}

interface GraphLink {
  from: string;
  to: string;
  label: string;
}

const nodeConfig: Record<string, { color: string; icon: typeof Users; label: string; count: number }> = {
  person: { color: '#00D4FF', icon: Users, label: '人', count: collectionStats.populationTotal },
  house: { color: '#00FF88', icon: Home, label: '房', count: collectionStats.houseTotal },
  unit: { color: '#FF9500', icon: Building2, label: '企', count: collectionStats.unitTotal },
  addr: { color: '#A855F7', icon: MapPin, label: '址', count: 32567 },
};

const nodes: GraphNode[] = [
  { id: 'person', label: '实有人口', type: 'person', x: 300, y: 120, color: '#00D4FF', count: collectionStats.populationTotal },
  { id: 'house', label: '实有房屋', type: 'house', x: 520, y: 220, color: '#00FF88', count: collectionStats.houseTotal },
  { id: 'unit', label: '实有单位', type: 'unit', x: 480, y: 400, color: '#FF9500', count: collectionStats.unitTotal },
  { id: 'addr', label: '标准地址', type: 'addr', x: 180, y: 340, color: '#A855F7', count: 32567 },
];

const links: GraphLink[] = [
  { from: 'person', to: 'house', label: '居住于' },
  { from: 'person', to: 'unit', label: '就职于' },
  { from: 'person', to: 'addr', label: '登记于' },
  { from: 'house', to: 'addr', label: '位于' },
  { from: 'unit', to: 'addr', label: '驻于' },
  { from: 'house', to: 'unit', label: '商用' },
];

export default function CollectionRelation() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | undefined>();

  const visibleLinks = useMemo(() => {
    if (!filterType) return links;
    return links.filter(l => l.from === filterType || l.to === filterType);
  }, [filterType]);

  const selected = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const relatedLinks = selected ? links.filter(l => l.from === selected.id || l.to === selected.id) : [];

  const handleNodeClick = (id: string) => {
    setSelectedNode(id);
    const cfg = nodeConfig[id];
    message.info(`已选中：${cfg.label}数据，共 ${cfg.count.toLocaleString()} 条`);
  };

  return (
    <div className="flex gap-4 h-full">
      {/* 左侧：搜索筛选 */}
      <div className="w-64 shrink-0 space-y-4">
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Network size={16} className="text-[#00D4FF]" />
            <span className="text-sm font-semibold text-[#E8F0FE]">关联关系</span>
          </div>
          <Input prefix={<SearchOutlined />} placeholder="搜索节点" value={search} onChange={e => setSearch(e.target.value)} className="mb-3" />
          <Select
            placeholder="按类型筛选" allowClear value={filterType} onChange={v => setFilterType(v)}
            style={{ width: '100%' }}
            options={[
              { value: 'person', label: '人' },
              { value: 'house', label: '房' },
              { value: 'unit', label: '企' },
              { value: 'addr', label: '址' },
            ]}
          />
        </div>

        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-xs text-[#8BA3C7] mb-3">节点图例</p>
          <div className="space-y-2">
            {Object.entries(nodeConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={key} className="flex items-center gap-2 p-2 rounded bg-[#0A1628] border border-[#1E3A5F]">
                  <div className="flex items-center justify-center w-7 h-7 rounded" style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}>
                    <Icon size={14} />
                  </div>
                  <span className="text-sm text-[#E8F0FE]">{cfg.label}</span>
                  <span className="text-xs text-[#8BA3C7] ml-auto font-[Orbitron]">{(cfg.count / 10000).toFixed(1)}万</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 中间：关系图谱 */}
      <div className="flex-1 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <h3 className="text-sm font-semibold text-[#E8F0FE]">人-房-企-址 关联图谱</h3>
          <p className="text-xs text-[#8BA3C7] mt-1">点击节点查看关联详情</p>
        </div>
        <svg width="100%" height="100%" viewBox="0 0 700 500" className="absolute inset-0">
          {/* 连线 */}
          {visibleLinks.map((l, i) => {
            const from = nodes.find(n => n.id === l.from)!;
            const to = nodes.find(n => n.id === l.to)!;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return (
              <g key={i}>
                <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#1E3A5F" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
                <text x={midX} y={midY - 6} textAnchor="middle" fill="#8BA3C7" fontSize="11">{l.label}</text>
              </g>
            );
          })}
          {/* 节点 */}
          {nodes.map(n => {
            const isSel = selectedNode === n.id;
            const r = isSel ? 44 : 38;
            return (
              <g key={n.id} onClick={() => handleNodeClick(n.id)} style={{ cursor: 'pointer' }}>
                <circle cx={n.x} cy={n.y} r={r + 6} fill={`${n.color}10`} stroke={n.color} strokeWidth="1" opacity={isSel ? 0.6 : 0.2} />
                <circle cx={n.x} cy={n.y} r={r} fill={`${n.color}25`} stroke={n.color} strokeWidth="2" />
                <text x={n.x} y={n.y - 4} textAnchor="middle" fill={n.color} fontSize="20" fontWeight="bold">{n.label[0]}</text>
                <text x={n.x} y={n.y + 16} textAnchor="middle" fill="#8BA3C7" fontSize="11">{(n.count / 10000).toFixed(1)}万</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 右侧：节点详情 */}
      <div className="w-72 shrink-0 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
        <h3 className="text-sm font-semibold text-[#E8F0FE] mb-4">关联详情</h3>
        {selected ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#0A1628] border border-[#1E3A5F]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: selected.color }} />
                <span className="text-base font-bold" style={{ color: selected.color }}>{selected.label}</span>
              </div>
              <div className="text-xs text-[#8BA3C7]">数据总量</div>
              <div className="text-2xl font-bold font-[Orbitron]" style={{ color: selected.color }}>{selected.count.toLocaleString()}</div>
            </div>

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2">关联关系（{relatedLinks.length} 条）</p>
              <div className="space-y-2">
                {relatedLinks.map((l, i) => {
                  const otherId = l.from === selected.id ? l.to : l.from;
                  const other = nodes.find(n => n.id === otherId)!;
                  return (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-[#0A1628] border border-[#1E3A5F]">
                      <span className="text-xs text-[#8BA3C7]">{l.label}</span>
                      <Tag color={other.color} style={{ margin: 0 }}>{other.label}</Tag>
                      <span className="text-xs text-[#8BA3C7] ml-auto">{(other.count / 10000).toFixed(1)}万</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A1628] border border-[#1E3A5F]">
              <p className="text-xs text-[#8BA3C7] mb-1">关联说明</p>
              <p className="text-xs text-[#E8F0FE] leading-relaxed">
                {selected.label}数据通过标准地址与其他实体建立关联，实现"人-房-企-址"四位一体的数据治理体系。
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#8BA3C7] text-center mt-8">点击图谱节点查看关联详情</p>
        )}
      </div>
    </div>
  );
}
