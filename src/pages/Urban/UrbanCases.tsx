import { useState, useMemo } from 'react';
import { Table, Tag, Button, Drawer, Select, DatePicker, Space, Card, Timeline, message, Descriptions } from 'antd';
import { Search, MapPin, Camera, CheckCircle, Send, FileCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { urbanCases } from '@/mock/urbanCases';
import type { UrbanCase, UrbanCaseType, UrbanCaseSource, UrbanCaseStatus } from '@/mock/urbanCases';

const { RangePicker } = DatePicker;

const typeOptions: { label: string; value: UrbanCaseType }[] = [
  { label: '占道经营', value: '占道经营' }, { label: '违规停车', value: '违规停车' },
  { label: '垃圾堆积', value: '垃圾堆积' }, { label: '违规广告', value: '违规广告' },
  { label: '井盖缺失', value: '井盖缺失' },
];
const sourceOptions: { label: string; value: UrbanCaseSource }[] = [
  { label: 'AI巡查', value: 'AI巡查' }, { label: '12345热线', value: '12345热线' },
  { label: '网格员上报', value: '网格员上报' }, { label: '市民投诉', value: '市民投诉' },
];
const statusOptions: { label: string; value: UrbanCaseStatus }[] = [
  { label: '待派遣', value: '待派遣' }, { label: '已派遣', value: '已派遣' },
  { label: '处置中', value: '处置中' }, { label: '待核查', value: '待核查' },
  { label: '已结案', value: '已结案' },
];

const sourceColor: Record<UrbanCaseSource, string> = {
  'AI巡查': 'cyan', '12345热线': 'orange', '网格员上报': 'blue', '市民投诉': 'red',
};
const statusColor: Record<UrbanCaseStatus, string> = {
  '待派遣': 'red', '已派遣': 'orange', '处置中': 'processing', '待核查': 'cyan', '已结案': 'green',
};
const statusStepMap: Record<UrbanCaseStatus, number> = {
  '待派遣': 0, '已派遣': 1, '处置中': 2, '待核查': 3, '已结案': 4,
};

export default function UrbanCases() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState<UrbanCase | null>(null);
  const [filterType, setFilterType] = useState<UrbanCaseType | undefined>();
  const [filterSource, setFilterSource] = useState<UrbanCaseSource | undefined>();
  const [filterStatus, setFilterStatus] = useState<UrbanCaseStatus | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const filtered = useMemo(() => {
    return urbanCases.filter(c => {
      if (filterType && c.type !== filterType) return false;
      if (filterSource && c.source !== filterSource) return false;
      if (filterStatus && c.status !== filterStatus) return false;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const t = dayjs(c.reportTime);
        if (t.isBefore(dateRange[0], 'day') || t.isAfter(dateRange[1], 'day')) return false;
      }
      return true;
    });
  }, [filterType, filterSource, filterStatus, dateRange]);

  const handleView = (record: UrbanCase) => {
    setCurrentCase(record);
    setDrawerOpen(true);
  };

  const handleAction = (action: string) => {
    message.success(`已执行操作：${action}`);
    if (action === '结案' && currentCase) {
      setCurrentCase({ ...currentCase, status: '已结案' });
    } else if (action === '派遣' && currentCase) {
      setCurrentCase({ ...currentCase, status: '已派遣' });
    }
  };

  const columns = [
    { title: '案件编号', dataIndex: 'caseNo', key: 'caseNo', width: 170 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 90 },
    { title: '来源', dataIndex: 'source', key: 'source', width: 100, render: (s: UrbanCaseSource) => <Tag color={sourceColor[s]}>{s}</Tag> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: UrbanCaseStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '上报时间', dataIndex: 'reportTime', key: 'reportTime', width: 160 },
    { title: '处置时限', dataIndex: 'deadline', key: 'deadline', width: 160 },
    { title: '处置人', dataIndex: 'handler', key: 'handler', width: 80, render: (v: string) => v || '-' },
    { title: '操作', key: 'action', width: 90, render: (_: unknown, r: UrbanCase) => <Button type="link" size="small" onClick={() => handleView(r)}>查看详情</Button> },
  ];

  const timelineItems = currentCase
    ? ['案件上报', '任务派遣', '现场处置', '核查验收', '案件结案'].map((label, i) => ({
        color: (i <= statusStepMap[currentCase.status] ? '#00D4FF' : '#1E3A5F') as string,
        children: <span className="text-xs text-[#E8F0FE]">{label}</span>,
      }))
    : [];

  const renderActions = () => {
    if (!currentCase) return null;
    const s = currentCase.status;
    if (s === '待派遣') return <Button type="primary" icon={<Send size={14} />} onClick={() => handleAction('派遣')}>派遣案件</Button>;
    if (s === '已派遣') return <Button type="primary" icon={<FileCheck size={14} />} onClick={() => handleAction('开始处置')}>开始处置</Button>;
    if (s === '处置中') return <Button type="primary" icon={<CheckCircle size={14} />} onClick={() => handleAction('提交核查')}>提交核查</Button>;
    if (s === '待核查') return <Button type="primary" icon={<CheckCircle size={14} />} onClick={() => handleAction('结案')}>结案</Button>;
    return <Button disabled>案件已结案</Button>;
  };

  return (
    <div className="space-y-4">
      <Card className="!bg-[#0D2137]/80 !border-[#1E3A5F]" styles={{ body: { padding: 16 } }}>
        <Space wrap>
          <Select placeholder="案件类型" allowClear style={{ width: 140 }} value={filterType} onChange={v => setFilterType(v)} options={typeOptions} />
          <Select placeholder="来源" allowClear style={{ width: 140 }} value={filterSource} onChange={v => setFilterSource(v)} options={sourceOptions} />
          <Select placeholder="状态" allowClear style={{ width: 140 }} value={filterStatus} onChange={v => setFilterStatus(v)} options={statusOptions} />
          <RangePicker value={dateRange} onChange={v => setDateRange(v as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)} />
          <Button icon={<Search size={14} />} onClick={() => message.info(`筛选到 ${filtered.length} 条案件`)}>查询</Button>
        </Space>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        size="small"
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => <span className="text-[#8BA3C7]">共 {t} 条</span> }}
        scroll={{ x: 1100 }}
      />

      <Drawer
        title="案件详情"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={620}
        destroyOnClose
        extra={renderActions()}
      >
        {currentCase && (
          <div className="space-y-5">
            <Card size="small" title={<span className="text-sm text-[#E8F0FE]">案件信息</span>} className="!bg-[#0A1628] !border-[#1E3A5F]">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="编号">{currentCase.caseNo}</Descriptions.Item>
                <Descriptions.Item label="类型">{currentCase.type}</Descriptions.Item>
                <Descriptions.Item label="来源"><Tag color={sourceColor[currentCase.source]}>{currentCase.source}</Tag></Descriptions.Item>
                <Descriptions.Item label="状态"><Tag color={statusColor[currentCase.status]}>{currentCase.status}</Tag></Descriptions.Item>
                <Descriptions.Item label="位置" span={2}>{currentCase.location}</Descriptions.Item>
                <Descriptions.Item label="上报时间">{currentCase.reportTime}</Descriptions.Item>
                <Descriptions.Item label="处置时限">{currentCase.deadline}</Descriptions.Item>
                <Descriptions.Item label="处置人" span={2}>{currentCase.handler || '待分配'}</Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>{currentCase.description}</Descriptions.Item>
              </Descriptions>
            </Card>

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2 flex items-center gap-1"><Camera size={12} />现场照片</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 rounded bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center">
                    <span className="text-xs text-[#8BA3C7]">现场照片{i}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#8BA3C7] mb-3">处置流程</p>
              <Timeline items={timelineItems} />
            </div>

            <div>
              <p className="text-xs text-[#8BA3C7] mb-2 flex items-center gap-1"><MapPin size={12} />定位信息</p>
              <div className="w-full h-36 rounded bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center">
                <span className="text-xs text-[#8BA3C7]">地图定位 · {currentCase.location}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
