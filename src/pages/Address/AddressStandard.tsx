import { useState, useMemo } from 'react';
import { Tree, Input, Select, Table, Tag, Button, Modal, Descriptions, Space, message } from 'antd';
import type { TreeDataNode } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MapPin } from 'lucide-react';
import { addresses } from '@/mock/addresses';
import type { Address, AddressStatus } from '@/mock/addresses';

const statusColor: Record<AddressStatus, string> = {
  '正常': '#00FF88', '变更': '#FF9500', '注销': '#FF3B5C',
};

const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: '正常' },
  { label: '变更', value: '变更' },
  { label: '注销', value: '注销' },
];

const treeData: TreeDataNode[] = [
  {
    title: '湖北省', key: 'province', children: [
      {
        title: '孝感市', key: 'city', children: [
          {
            title: '云梦县', key: 'county', children: [
              {
                title: '城关镇', key: 'town', children: [
                  { title: '曲阳路', key: 'street-1' },
                  { title: '建设路', key: 'street-2' },
                  { title: '楚王城大道', key: 'street-3' },
                  { title: '珍珠坡路', key: 'street-4' },
                  { title: '梦泽大道', key: 'street-5' },
                  { title: '西大路', key: 'street-6' },
                  { title: '南环路', key: 'street-7' },
                  { title: '北环路', key: 'street-8' },
                ],
              },
              { title: '义堂镇', key: 'town-2', children: [{ title: '义堂大道', key: 'street-13' }] },
              { title: '曾店镇', key: 'town-3', children: [{ title: '振兴路', key: 'street-14' }] },
              { title: '吴铺镇', key: 'town-4', children: [{ title: '发展大道', key: 'street-15' }] },
              { title: '伍洛镇', key: 'town-5', children: [{ title: '滨河路', key: 'street-16' }] },
              { title: '下辛店镇', key: 'town-6', children: [{ title: '商贸路', key: 'street-17' }] },
              { title: '胡金店镇', key: 'town-7', children: [{ title: '金店大道', key: 'street-18' }] },
            ],
          },
        ],
      },
    ],
  },
];

export default function AddressStandard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [detail, setDetail] = useState<Address | null>(null);

  const filtered = useMemo(() => {
    return addresses.filter(a => {
      if (search && !a.fullAddress.includes(search) && !a.code.includes(search)) return false;
      if (statusFilter && a.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  const columns = [
    { title: '地址编码', dataIndex: 'code', key: 'code', width: 230, ellipsis: true },
    { title: '完整地址', dataIndex: 'fullAddress', key: 'fullAddress', ellipsis: true },
    { title: '门牌号', dataIndex: 'plateNo', key: 'plateNo', width: 90 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: AddressStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: unknown, r: Address) => <Button type="link" size="small" onClick={() => setDetail(r)} className="!text-[#00D4FF] !p-0">查看详情</Button>,
    },
  ];

  return (
    <div className="flex gap-4 h-full">
      <div className="w-64 shrink-0 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-3 overflow-auto">
        <div className="flex items-center gap-2 mb-3 px-1">
          <MapPin size={16} className="text-[#00D4FF]" />
          <span className="text-sm font-semibold text-[#E8F0FE]">地址层级</span>
        </div>
        <Tree
          treeData={treeData}
          selectedKeys={selectedKeys}
          onSelect={(keys) => { setSelectedKeys(keys); message.info(`已选择节点，筛选相关地址`); }}
          defaultExpandedKeys={['province', 'city', 'county', 'town']}
          blockNode
          className="address-tree"
        />
      </div>

      <div className="flex-1 flex flex-col rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E3A5F]">
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索地址或编码"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <Select
            value={statusFilter}
            onChange={v => setStatusFilter(v || '')}
            options={statusOptions}
            style={{ width: 120 }}
          />
          <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 条</span>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            size="small"
            pagination={{ pageSize: 10, showSizeChanger: false }}
            scroll={{ x: 800 }}
          />
        </div>
      </div>

      <Modal
        title="地址详情"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={<Button onClick={() => setDetail(null)}>关闭</Button>}
        width={640}
      >
        {detail && (
          <div className="space-y-4">
            <Descriptions column={1} size="small" labelStyle={{ color: '#8BA3C7', width: 90 }} contentStyle={{ color: '#E8F0FE' }}>
              <Descriptions.Item label="地址编码">{detail.code}</Descriptions.Item>
              <Descriptions.Item label="完整地址">{detail.fullAddress}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={statusColor[detail.status]}>{detail.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="经纬度">{detail.lng.toFixed(6)}, {detail.lat.toFixed(6)}</Descriptions.Item>
            </Descriptions>
            <div>
              <p className="text-xs text-[#8BA3C7] mb-3">地址七级拆分</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: '一级行政区划', value: detail.province, color: '#00D4FF' },
                  { label: '二级行政区划', value: detail.city, color: '#00FF88' },
                  { label: '三级行政区划', value: detail.county, color: '#FF9500' },
                  { label: '街路巷', value: detail.street, color: '#A855F7' },
                  { label: '门牌号', value: detail.plateNo, color: '#FF3B5C' },
                  { label: '小区', value: detail.community, color: '#8B5CF6' },
                  { label: '楼栋', value: detail.building, color: '#06B6D4' },
                  { label: '梯位', value: detail.unit, color: '#10B981' },
                  { label: '户室', value: detail.room, color: '#F59E0B' },
                ].map((seg, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded bg-[#0A1628] border border-[#1E3A5F]">
                    <span className="text-xs text-[#8BA3C7] w-24 shrink-0">{seg.label}</span>
                    <span className="text-sm" style={{ color: seg.color }}>{seg.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
