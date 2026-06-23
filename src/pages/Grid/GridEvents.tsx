import { useState, useMemo } from 'react';
import { Table, Tag, Button, Select, Space, Card, Drawer, Modal, Form, Input, Upload, Timeline, Descriptions, message } from 'antd';
import { Search, Plus, Camera, MapPin, Clock, User } from 'lucide-react';
import { events as initialEvents, staff } from '@/mock/grid';
import type { GridEvent, GridEventType, GridEventStatus } from '@/mock/grid';

const typeColor: Record<GridEventType, string> = {
  '城管问题': 'orange', '安全隐患': 'red', '矛盾纠纷': 'purple', '环境卫生': 'cyan', '设施损坏': 'blue',
};
const statusColor: Record<GridEventStatus, string> = {
  '待处理': 'red', '处理中': 'processing', '已处理': 'green',
};
const statusStepMap: Record<GridEventStatus, number> = { '待处理': 0, '处理中': 1, '已处理': 2 };

export default function GridEvents() {
  const [events, setEvents] = useState<GridEvent[]>(initialEvents);
  const [filterType, setFilterType] = useState<GridEventType | undefined>();
  const [filterStatus, setFilterStatus] = useState<GridEventStatus | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [current, setCurrent] = useState<GridEvent | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    return events.filter(e => {
      if (filterType && e.type !== filterType) return false;
      if (filterStatus && e.status !== filterStatus) return false;
      return true;
    });
  }, [events, filterType, filterStatus]);

  const handleView = (r: GridEvent) => { setCurrent(r); setDrawerOpen(true); };

  const handleReport = () => {
    form.validateFields().then(values => {
      const newEvent: GridEvent = {
        id: `GEV${String(events.length + 1).padStart(5, '0')}`,
        type: values.type,
        description: values.description,
        location: values.location,
        reportTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        reporter: staff[0].name,
        status: '待处理',
        images: [],
      };
      setEvents(prev => [newEvent, ...prev]);
      message.success(`事件「${values.type}」已上报，待处理`);
      form.resetFields();
      setReportOpen(false);
    }).catch(() => {});
  };

  const columns = [
    { title: '事件编号', dataIndex: 'id', key: 'id', width: 110 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 100, render: (t: GridEventType) => <Tag color={typeColor[t]}>{t}</Tag> },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    { title: '上报时间', dataIndex: 'reportTime', key: 'reportTime', width: 160 },
    { title: '上报人', dataIndex: 'reporter', key: 'reporter', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: GridEventStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    {
      title: '操作', key: 'action', width: 100, fixed: 'right' as const,
      render: (_: unknown, r: GridEvent) => <Button type="link" size="small" className="!text-[#00D4FF] !p-0" onClick={() => handleView(r)}>查看详情</Button>,
    },
  ];

  const timelineItems = current
    ? ['事件上报', '受理分派', '现场处置', '核查结案'].map((label, i) => ({
        color: (i <= statusStepMap[current.status] ? '#00D4FF' : '#1E3A5F') as string,
        children: <span className="text-xs text-[#E8F0FE]">{label}</span>,
      }))
    : [];

  return (
    <div className="space-y-4">
      <Card className="!bg-[#0D2137]/80 !border-[#1E3A5F]" styles={{ body: { padding: 16 } }}>
        <Space wrap>
          <Select placeholder="事件类型" allowClear style={{ width: 140 }} value={filterType} onChange={v => setFilterType(v)}
            options={[{ label: '城管问题', value: '城管问题' }, { label: '安全隐患', value: '安全隐患' }, { label: '矛盾纠纷', value: '矛盾纠纷' }, { label: '环境卫生', value: '环境卫生' }, { label: '设施损坏', value: '设施损坏' }]} />
          <Select placeholder="事件状态" allowClear style={{ width: 140 }} value={filterStatus} onChange={v => setFilterStatus(v)}
            options={[{ label: '待处理', value: '待处理' }, { label: '处理中', value: '处理中' }, { label: '已处理', value: '已处理' }]} />
          <Button icon={<Search size={14} />} onClick={() => message.info(`筛选到 ${filtered.length} 条事件`)}>查询</Button>
          <Button type="primary" icon={<Plus size={14} />} onClick={() => setReportOpen(true)}>上报事件</Button>
        </Space>
      </Card>

      <Table
        rowKey="id" columns={columns} dataSource={filtered} size="small"
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => <span className="text-[#8BA3C7]">共 {t} 条</span> }}
        scroll={{ x: 1100 }}
      />

      <Drawer title="事件详情" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={580} destroyOnClose
        extra={current && current.status !== '已处理'
          ? <Button type="primary" size="small" onClick={() => { setCurrent({ ...current, status: '已处理' }); message.success('事件已处理完成'); }}>标记已处理</Button>
          : undefined}
      >
        {current && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Tag color={typeColor[current.type]}>{current.type}</Tag>
              <Tag color={statusColor[current.status]}>{current.status}</Tag>
              <span className="text-xs text-[#8BA3C7]">{current.id}</span>
            </div>
            <Descriptions column={2} size="small" className="p-3 rounded-lg border border-[#1E3A5F] bg-[#0A1628]">
              <Descriptions.Item label="描述" span={2}>{current.description}</Descriptions.Item>
              <Descriptions.Item label="位置" span={2}><span className="flex items-center gap-1"><MapPin size={12} className="text-[#00D4FF]" />{current.location}</span></Descriptions.Item>
              <Descriptions.Item label="上报时间"><span className="flex items-center gap-1"><Clock size={12} />{current.reportTime}</span></Descriptions.Item>
              <Descriptions.Item label="上报人"><span className="flex items-center gap-1"><User size={12} />{current.reporter}</span></Descriptions.Item>
            </Descriptions>
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
              <p className="text-xs text-[#8BA3C7] mb-3">处理流程</p>
              <Timeline items={timelineItems} />
            </div>
            <div>
              <p className="text-xs text-[#8BA3C7] mb-2 flex items-center gap-1"><MapPin size={12} />事件定位</p>
              <div className="w-full h-32 rounded bg-[#0A1628] border border-[#1E3A5F] flex items-center justify-center">
                <span className="text-xs text-[#8BA3C7]">地图定位 · {current.location}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <Modal title="上报事件" open={reportOpen} onOk={handleReport} onCancel={() => { form.resetFields(); setReportOpen(false); }} okText="提交" cancelText="取消" width={560}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="type" label="事件类型" rules={[{ required: true, message: '请选择事件类型' }]}>
            <Select options={[{ label: '城管问题', value: '城管问题' }, { label: '安全隐患', value: '安全隐患' }, { label: '矛盾纠纷', value: '矛盾纠纷' }, { label: '环境卫生', value: '环境卫生' }, { label: '设施损坏', value: '设施损坏' }]} placeholder="请选择事件类型" />
          </Form.Item>
          <Form.Item name="location" label="发生位置" rules={[{ required: true, message: '请输入发生位置' }]}>
            <Input placeholder="请输入详细地址" prefix={<MapPin size={14} className="text-[#8BA3C7]" />} />
          </Form.Item>
          <Form.Item name="description" label="事件描述" rules={[{ required: true, message: '请输入事件描述' }]}>
            <Input.TextArea rows={3} placeholder="请详细描述事件情况" />
          </Form.Item>
          <Form.Item label="现场照片">
            <Upload listType="picture-card" maxCount={3} beforeUpload={() => false}>
              <div className="flex flex-col items-center text-[#8BA3C7]"><Camera size={20} /><span className="text-xs mt-1">上传照片</span></div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
