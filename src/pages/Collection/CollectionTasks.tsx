import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, Progress, Tag, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { ClipboardList } from 'lucide-react';

interface TaskRecord {
  id: string;
  name: string;
  grid: string;
  assignee: string;
  type: string;
  progress: number;
  status: string;
  deadline: string;
}

const initialTasks: TaskRecord[] = [
  { id: 'T001', name: '曲阳社区人口核采', grid: '曲阳社区第一网格', assignee: '张伟', type: '人口', progress: 78, status: '进行中', deadline: '2026-06-30' },
  { id: 'T002', name: '建设社区房屋核查', grid: '建设社区第一网格', assignee: '李强', type: '房屋', progress: 100, status: '已完成', deadline: '2026-06-20' },
  { id: 'T003', name: '楚王城社区单位核采', grid: '楚王城社区第一网格', assignee: '王磊', type: '单位', progress: 45, status: '进行中', deadline: '2026-07-15' },
  { id: 'T004', name: '珍珠坡社区流动人口登记', grid: '珍珠坡社区第一网格', assignee: '刘军', type: '流动人口', progress: 30, status: '进行中', deadline: '2026-07-20' },
  { id: 'T005', name: '梦泽社区全面核采', grid: '梦泽社区第一网格', assignee: '陈勇', type: '全面', progress: 0, status: '未开始', deadline: '2026-08-01' },
  { id: 'T006', name: '西大社区房屋核查', grid: '西大社区第一网格', assignee: '杨杰', type: '房屋', progress: 60, status: '进行中', deadline: '2026-07-10' },
  { id: 'T007', name: '南环社区人口核采', grid: '南环社区第一网格', assignee: '赵涛', type: '人口', progress: 100, status: '已完成', deadline: '2026-06-15' },
  { id: 'T008', name: '北环社区单位核采', grid: '北环社区第一网格', assignee: '孙明', type: '单位', progress: 20, status: '进行中', deadline: '2026-07-25' },
];

const statusColor: Record<string, string> = { '进行中': '#00D4FF', '已完成': '#00FF88', '未开始': '#8BA3C7', '已暂停': '#FF9500' };
const typeColor: Record<string, string> = { '人口': '#00D4FF', '房屋': '#00FF88', '单位': '#FF9500', '流动人口': '#A855F7', '全面': '#FF3B5C' };

const gridOptions = ['曲阳社区第一网格', '建设社区第一网格', '楚王城社区第一网格', '珍珠坡社区第一网格', '梦泽社区第一网格', '西大社区第一网格', '南环社区第一网格', '北环社区第一网格'];

export default function CollectionTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TaskRecord | null>(null);
  const [filterType, setFilterType] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [form] = Form.useForm();

  const filtered = useMemo(() => tasks.filter(t => {
    if (filterType && t.type !== filterType) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  }), [tasks, filterType, filterStatus]);

  const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: TaskRecord) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editing) {
        setTasks(tasks.map(t => t.id === editing.id ? { ...t, ...values } : t));
        message.success('任务更新成功');
      } else {
        setTasks([...tasks, { ...values, id: `T${String(tasks.length + 1).padStart(3, '0')}`, progress: 0, status: '未开始' }]);
        message.success('核采任务创建成功');
      }
      setModalOpen(false); form.resetFields(); setEditing(null);
    });
  };

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', width: 200, ellipsis: true },
    { title: '类型', dataIndex: 'type', key: 'type', width: 90, render: (v: string) => <Tag color={typeColor[v]}>{v}</Tag> },
    { title: '网格/片区', dataIndex: 'grid', key: 'grid', width: 170, ellipsis: true },
    { title: '负责人', dataIndex: 'assignee', key: 'assignee', width: 80 },
    { title: '进度', dataIndex: 'progress', key: 'progress', width: 150, render: (v: number) => <Progress percent={v} size="small" strokeColor="#00D4FF" /> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag> },
    { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 120 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_: unknown, r: TaskRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => message.info(`查看任务：${r.name}`)} className="!text-[#00D4FF] !p-0">查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} className="!text-[#FF9500] !p-0">编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ClipboardList size={20} className="text-[#00D4FF]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">核采任务管理</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#00D4FF', borderColor: '#00D4FF' }}>创建核采任务</Button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
        <Select placeholder="任务类型" allowClear value={filterType} onChange={v => setFilterType(v)} style={{ width: 140 }}
          options={[{ value: '人口', label: '人口' }, { value: '房屋', label: '房屋' }, { value: '单位', label: '单位' }, { value: '流动人口', label: '流动人口' }, { value: '全面', label: '全面' }]} />
        <Select placeholder="状态" allowClear value={filterStatus} onChange={v => setFilterStatus(v)} style={{ width: 140 }}
          options={[{ value: '进行中', label: '进行中' }, { value: '已完成', label: '已完成' }, { value: '未开始', label: '未开始' }]} />
        <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 条任务</span>
      </div>

      <Table rowKey="id" columns={columns} dataSource={filtered} size="small" pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1100 }} />

      <Modal title={editing ? '编辑任务' : '创建核采任务'} open={modalOpen} onOk={handleSave}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditing(null); }}
        okButtonProps={{ style: { background: '#00D4FF', borderColor: '#00D4FF' } }} width={520}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="如：曲阳社区人口核采" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="type" label="任务类型" rules={[{ required: true, message: '请选择任务类型' }]}>
              <Select options={[{ value: '人口', label: '人口' }, { value: '房屋', label: '房屋' }, { value: '单位', label: '单位' }, { value: '流动人口', label: '流动人口' }, { value: '全面', label: '全面' }]} />
            </Form.Item>
            <Form.Item name="grid" label="网格/片区" rules={[{ required: true, message: '请选择网格' }]}>
              <Select options={gridOptions.map(g => ({ value: g, label: g }))} />
            </Form.Item>
            <Form.Item name="assignee" label="负责人" rules={[{ required: true, message: '请输入负责人' }]}>
              <Input placeholder="如：张伟" />
            </Form.Item>
            <Form.Item name="deadline" label="截止时间" rules={[{ required: true, message: '请输入截止时间' }]}>
              <Input placeholder="如：2026-07-30" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
