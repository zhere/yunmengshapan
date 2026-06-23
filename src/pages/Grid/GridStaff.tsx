import { useState, useMemo } from 'react';
import { Table, Tag, Button, Select, Space, Card, Modal, message } from 'antd';
import { Search, MapPin, LogIn, LogOut, Route, Phone } from 'lucide-react';
import { staff, grids } from '@/mock/grid';
import type { GridStaff as StaffMember } from '@/mock/grid';

export default function GridStaff() {
  const [filterDuty, setFilterDuty] = useState<boolean | undefined>();
  const [filterGrid, setFilterGrid] = useState<string | undefined>();
  const [trackStaff, setTrackStaff] = useState<StaffMember | null>(null);
  const [dutyState, setDutyState] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    return staff.filter(s => {
      if (filterDuty !== undefined && (dutyState[s.id] ?? s.onDuty) !== filterDuty) return false;
      if (filterGrid && s.gridName !== filterGrid) return false;
      return true;
    });
  }, [filterDuty, filterGrid, dutyState]);

  const handleSignIn = (s: StaffMember) => {
    setDutyState(prev => ({ ...prev, [s.id]: true }));
    message.success(`${s.name} 签到成功`);
  };
  const handleSignOut = (s: StaffMember) => {
    setDutyState(prev => ({ ...prev, [s.id]: false }));
    message.success(`${s.name} 签退成功`);
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 60 },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '所属网格', dataIndex: 'gridName', key: 'gridName', ellipsis: true },
    {
      title: '在岗状态', dataIndex: 'onDuty', key: 'onDuty', width: 90,
      render: (_: boolean, r: StaffMember) => {
        const onDuty = dutyState[r.id] ?? r.onDuty;
        return <Tag color={onDuty ? 'green' : 'default'}>{onDuty ? '在岗' : '离岗'}</Tag>;
      },
    },
    { title: '今日任务', dataIndex: 'todayTasks', key: 'todayTasks', width: 80, render: (v: number) => <span className="text-[#00D4FF]">{v}</span> },
    { title: '已完成', dataIndex: 'completedTasks', key: 'completedTasks', width: 80, render: (v: number) => <span className="text-[#00FF88]">{v}</span> },
    { title: '最后签到', dataIndex: 'lastSignIn', key: 'lastSignIn', width: 160 },
    { title: '最后签退', dataIndex: 'lastSignOut', key: 'lastSignOut', width: 140, render: (v: string) => v || '-' },
    {
      title: '操作', key: 'action', width: 220, fixed: 'right' as const,
      render: (_: unknown, r: StaffMember) => {
        const onDuty = dutyState[r.id] ?? r.onDuty;
        return (
          <Space size="small">
            <Button type="link" size="small" className="!text-[#00D4FF] !p-0" onClick={() => setTrackStaff(r)}>查看轨迹</Button>
            {onDuty
              ? <Button type="link" size="small" className="!text-[#FF9500] !p-0" icon={<LogOut size={12} />} onClick={() => handleSignOut(r)}>签退</Button>
              : <Button type="link" size="small" className="!text-[#00FF88] !p-0" icon={<LogIn size={12} />} onClick={() => handleSignIn(r)}>签到</Button>}
          </Space>
        );
      },
    },
  ];

  const trackPath = trackStaff
    ? Array.from({ length: 8 }, (_, i) => ({ x: 50 + i * 55 + (i % 2) * 20, y: 80 + Math.sin(i) * 40 + i * 30 }))
    : [];

  return (
    <div className="space-y-4">
      <Card className="!bg-[#0D2137]/80 !border-[#1E3A5F]" styles={{ body: { padding: 16 } }}>
        <Space wrap>
          <Select
            placeholder="在岗状态" allowClear style={{ width: 140 }}
            value={filterDuty === undefined ? undefined : filterDuty ? 'on' : 'off'}
            onChange={v => setFilterDuty(v === undefined ? undefined : v === 'on')}
            options={[{ label: '在岗', value: 'on' }, { label: '离岗', value: 'off' }]}
          />
          <Select
            placeholder="所属网格" allowClear showSearch style={{ width: 200 }}
            value={filterGrid} onChange={v => setFilterGrid(v)}
            options={grids.map(g => ({ label: g.name, value: g.name }))}
          />
          <Button icon={<Search size={14} />} onClick={() => message.info(`筛选到 ${filtered.length} 名网格员`)}>查询</Button>
        </Space>
      </Card>

      <Table
        rowKey="id" columns={columns} dataSource={filtered} size="small"
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => <span className="text-[#8BA3C7]">共 {t} 条</span> }}
        scroll={{ x: 1300 }}
      />

      <Modal
        title={`巡查轨迹 - ${trackStaff?.name ?? ''}`} open={!!trackStaff}
        onCancel={() => setTrackStaff(null)} footer={null} width={620}
      >
        {trackStaff && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-[#8BA3C7]">
              <span className="flex items-center gap-1"><MapPin size={12} className="text-[#00D4FF]" />{trackStaff.gridName}</span>
              <span className="flex items-center gap-1"><Phone size={12} className="text-[#00D4FF]" />{trackStaff.phone}</span>
              <span>签到时间：{trackStaff.lastSignIn}</span>
            </div>
            <div className="relative h-80 rounded-lg border border-[#1E3A5F] bg-[#0A1628] overflow-hidden">
              <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(ellipse at center, #1E3A5F 0%, transparent 70%)' }} />
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1="0" y1={`${i * 8.3}%`} x2="100%" y2={`${i * 8.3}%`} stroke="#00D4FF" strokeWidth="0.5" />)}
                {Array.from({ length: 12 }, (_, i) => <line key={`v${i}`} x1={`${i * 8.3}%`} y1="0" x2={`${i * 8.3}%`} y2="100%" stroke="#00D4FF" strokeWidth="0.5" />)}
              </svg>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 320" preserveAspectRatio="xMidYMid meet">
                <polyline
                  points={trackPath.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none" stroke="#00D4FF" strokeWidth="2.5" strokeDasharray="6 4"
                />
                {trackPath.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={i === 0 ? 6 : i === trackPath.length - 1 ? 6 : 3}
                      fill={i === 0 ? '#00FF88' : i === trackPath.length - 1 ? '#FF3B5C' : '#00D4FF'} />
                    {i === 0 && <text x={p.x} y={p.y - 12} fill="#00FF88" fontSize="10" textAnchor="middle">起点</text>}
                    {i === trackPath.length - 1 && <text x={p.x} y={p.y - 12} fill="#FF3B5C" fontSize="10" textAnchor="middle">当前</text>}
                  </g>
                ))}
              </svg>
              <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-[#112240]/90 border border-[#1E3A5F] rounded px-3 py-1.5">
                <span className="flex items-center gap-1 text-xs text-[#00FF88]"><span className="w-2 h-2 rounded-full bg-[#00FF88]" />起点</span>
                <span className="flex items-center gap-1 text-xs text-[#00D4FF]"><span className="w-2 h-2 rounded-full bg-[#00D4FF]" />轨迹点</span>
                <span className="flex items-center gap-1 text-xs text-[#FF3B5C]"><span className="w-2 h-2 rounded-full bg-[#FF3B5C]" />当前位置</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#8BA3C7]">
              <span className="flex items-center gap-1"><Route size={12} />巡查轨迹共 {trackPath.length} 个点位</span>
              <Button type="primary" size="small" onClick={() => message.success('轨迹数据已导出')}>导出轨迹</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
