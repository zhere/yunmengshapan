import { useState } from 'react';
import { Table, Input, Select, Tag, Button, Space, message } from 'antd';
import { Search, Eye, History, Video, Wifi, WifiOff, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { devices, deviceStats } from '@/mock/devices';
import type { Device, DeviceStatus, DeviceDepartment } from '@/mock/devices';

const statusMap: Record<DeviceStatus, { color: string; label: string }> = {
  online: { color: '#52c41a', label: '在线' },
  offline: { color: '#ff4d4f', label: '离线' },
  maintenance: { color: '#faad14', label: '维护' },
};

const departments: DeviceDepartment[] = ['公安局', '城管局', '交通局', '环保局', '教育局', '社区'];

const statusOptions: { label: string; value: DeviceStatus }[] = [
  { label: '在线', value: 'online' },
  { label: '离线', value: 'offline' },
  { label: '维护', value: 'maintenance' },
];

const statCards = [
  { title: '设备总数', value: deviceStats.total, color: '#00D4FF', icon: <Video size={20} /> },
  { title: '在线设备', value: deviceStats.online, color: '#52c41a', icon: <Wifi size={20} /> },
  { title: '离线设备', value: deviceStats.offline, color: '#ff4d4f', icon: <WifiOff size={20} /> },
  { title: '维护设备', value: deviceStats.maintenance, color: '#faad14', icon: <Settings size={20} /> },
];

export default function VideoPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('');

  const filtered = devices.filter(d => {
    const matchSearch = !search || d.name.includes(search) || d.location.includes(search);
    const matchStatus = !statusFilter || d.status === statusFilter;
    const matchDept = !deptFilter || d.department === deptFilter;
    return matchSearch && matchStatus && matchDept;
  });

  const columns = [
    { title: '设备名称', dataIndex: 'name', width: 180 },
    { title: '位置', dataIndex: 'location', ellipsis: true },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: (s: DeviceStatus) => <Tag color={statusMap[s].color}>{statusMap[s].label}</Tag>,
    },
    { title: '类型', dataIndex: 'type', width: 80 },
    { title: '所属部门', dataIndex: 'department', width: 100 },
    { title: '设备分组', dataIndex: 'groupName', width: 140 },
    {
      title: '操作', key: 'action', width: 170,
      render: (_: unknown, record: Device) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<Eye size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              message.success(`正在打开预览: ${record.name}`);
              navigate(`/video/preview/${record.id}`);
            }}
          >
            预览
          </Button>
          <Button
            size="small"
            icon={<History size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              message.success(`正在打开回放: ${record.name}`);
              navigate(`/video/playback/${record.id}`);
            }}
          >
            回放
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(card => (
          <div
            key={card.title}
            className="p-4 rounded-lg border border-[#1E3A5F] flex items-center gap-4"
            style={{ background: `linear-gradient(135deg, ${card.color}22, ${card.color}08)` }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
              style={{ backgroundColor: `${card.color}20`, color: card.color }}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-2xl font-bold font-[Orbitron] tracking-wider" style={{ color: card.color }}>
                {card.value}
              </div>
              <div className="text-xs text-[#8BA3C7] mt-0.5">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className="flex gap-3 items-center">
        <Input.Search
          prefix={<Search size={14} className="text-[#8BA3C7]" />}
          placeholder="搜索设备名称或位置"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={() => message.success(`搜索完成，共 ${filtered.length} 条结果`)}
          className="max-w-xs"
          allowClear
        />
        <Select
          placeholder="设备状态"
          value={statusFilter || undefined}
          onChange={v => setStatusFilter(v || '')}
          allowClear
          className="w-32"
          options={statusOptions}
        />
        <Select
          placeholder="所属部门"
          value={deptFilter || undefined}
          onChange={v => setDeptFilter(v || '')}
          allowClear
          className="w-36"
          options={departments.map(d => ({ label: d, value: d }))}
        />
        <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 台设备</span>
      </div>

      {/* 设备表格 */}
      <Table<Device>
        dataSource={filtered}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 10,
          showTotal: t => `共 ${t} 台设备`,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
        }}
        columns={columns}
      />
    </div>
  );
}
