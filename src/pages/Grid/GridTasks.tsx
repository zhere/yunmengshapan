import { useState, useMemo } from 'react';
import { Table, Tag, Button, Select, Space, Card, Modal, Form, Input, DatePicker, Progress, message } from 'antd';
import { Search, Plus, ClipboardList } from 'lucide-react';
import dayjs from 'dayjs';
import { grids, staff } from '@/mock/grid';

type TaskType = '巡查' | '核采' | '处置';
type TaskStatus = '待分派' | '进行中' | '已完成' | '已逾期';

interface GridTask {
  id: string;
  name: string;
  type: TaskType;
  grid: string;
  assignee: string;
  status: TaskStatus;
  deadline: string;
  progress: number;
}

const typeColor: Record<TaskType, string> = { '巡查': 'cyan', '核采': 'blue', '处置': 'orange' };
const statusColor: Record<TaskStatus, string> = { '待分派': 'red', '进行中': 'processing', '已完成': 'green', '已逾期': 'volcano' };

const taskNames: Record<TaskType, string[]> = {
  '巡查': ['曲阳路日常巡查', '建设路夜间巡查', '楚王城大道安全巡查', '农贸市场周边巡查'],
  '核采': ['曲阳社区人口核采', '建设社区房屋核采', '梦泽社区单位核采', '南环社区流动人口核采'],
  '处置': ['占道经营处置', '垃圾堆积处置', '路灯损坏处置', '消防通道清理'],
};

function generateTasks(): GridTask[] {
  const types: TaskType[] = ['巡查', '核采', '处置'];
  const statuses: TaskStatus[] = ['待分派', '进行中', '已完成', '已逾期'];
  const result: GridTask[] = [];
  for (let i = 1; i <= 18; i++) {
    const type = types[i % 3];
    const grid = grids[i % grids.length];
    const rand = Math.random();
    const status: TaskStatus = rand < 0.2 ? '待分派' : rand < 0.55 ? '进行中' : rand < 0.85 ? '已完成' : '已逾期';
    const progress = status === '已完成' ? 100 : status === '待分派' ? 0 : Math.floor(Math.random() * 70) + 20;
    const deadline = dayjs('2026-06-23').add(Math.floor(Math.random() * 7) - 2, 'day').format('YYYY-MM-DD');
    result.push({
      id: `TSK${String(i).padStart(4, '0')}`,
      name: taskNames[type][i % taskNames[type].length],
      type, grid: grid.name, assignee: status === '待分派' ? '-' : staff[i % staff.length].name,
      status, deadline, progress,
    });
  }
  return result;
}

const initialTasks = generateTasks();

export default function GridTasks() {
  const [tasks, setTasks] = useState<GridTask[]>(initialTasks);
  const [filterType, setFilterType] = useState<TaskType | undefined>();
  const [filterStatus, setFilterStatus] = useState<TaskStatus | undefined>();
  const [assignOpen, setAssignOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterType && t.type !== filterType) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      return true;
    });
  }, [tasks, filterType, filterStatus]);

  const handleAssign = () => {
    form.validateFields().then(values => {
      const newTask: GridTask = {
        id: `TSK${String(tasks.length + 1).padStart(4, '0')}`,
        name: values.name,
        type: values.type,
        grid: values.grid,
        assignee: values.assignee,
        status: '进行中',
        deadline: values.deadline.format('YYYY-MM-DD'),
        progress: 0,
      };
      setTasks(prev => [newTask, ...prev]);
      message.success(`任务「${values.name}」已分派给 ${values.assignee}`);
      form.resetFields();
      setAssignOpen(false);
    }).catch(() => {});
  };

  const columns = [
    { title: '任务编号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (t: TaskType) => <Tag color={typeColor[t]}>{t}</Tag> },
    { title: '所属网格', dataIndex: 'grid', key: 'grid', ellipsis: true },
    { title: '执行人', dataIndex: 'assignee', key: 'assignee', width: 80 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: TaskStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    { title: '截止日期', dataIndex: 'deadline', key: 'deadline', width: 120 },
    { title: '进度', dataIndex: 'progress', key: 'progress', width: 160, render: (p: number) => <Progress percent={p} size="small" strokeColor={{ from: '#00D4FF', to: '#00FF88' }} /> },
    {
      title: '操作', key: 'action', width: 140, fixed: 'right' as const,
      render: (_: unknown, r: GridTask) => (
        <Space size="small">
          <Button type="link" size="small" className="!text-[#00D4FF] !p-0" onClick={() => message.info(`查看任务「${r.name}」详情`)}>详情</Button>
          <Button type="link" size="small" className="!text-[#FF9500] !p-0" onClick={() => message.success(`已催办 ${r.assignee}`)}>催办</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="!bg-[#0D2137]/80 !border-[#1E3A5F]" styles={{ body: { padding: 16 } }}>
        <Space wrap>
          <Select placeholder="任务类型" allowClear style={{ width: 140 }} value={filterType} onChange={v => setFilterType(v)}
            options={[{ label: '巡查', value: '巡查' }, { label: '核采', value: '核采' }, { label: '处置', value: '处置' }]} />
          <Select placeholder="任务状态" allowClear style={{ width: 140 }} value={filterStatus} onChange={v => setFilterStatus(v)}
            options={[{ label: '待分派', value: '待分派' }, { label: '进行中', value: '进行中' }, { label: '已完成', value: '已完成' }, { label: '已逾期', value: '已逾期' }]} />
          <Button icon={<Search size={14} />} onClick={() => message.info(`筛选到 ${filtered.length} 条任务`)}>查询</Button>
          <Button type="primary" icon={<Plus size={14} />} onClick={() => setAssignOpen(true)}>分派任务</Button>
        </Space>
      </Card>

      <Table
        rowKey="id" columns={columns} dataSource={filtered} size="small"
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => <span className="text-[#8BA3C7]">共 {t} 条</span> }}
        scroll={{ x: 1200 }}
      />

      <Modal title="分派任务" open={assignOpen} onOk={handleAssign} onCancel={() => { form.resetFields(); setAssignOpen(false); }} okText="分派" cancelText="取消" width={560}>
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="type" label="任务类型" rules={[{ required: true, message: '请选择任务类型' }]}>
              <Select options={[{ label: '巡查', value: '巡查' }, { label: '核采', value: '核采' }, { label: '处置', value: '处置' }]} placeholder="请选择" />
            </Form.Item>
            <Form.Item name="grid" label="所属网格" rules={[{ required: true, message: '请选择网格' }]}>
              <Select showSearch options={grids.map(g => ({ label: g.name, value: g.name }))} placeholder="请选择网格" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="assignee" label="执行人" rules={[{ required: true, message: '请选择执行人' }]}>
              <Select showSearch options={staff.map(s => ({ label: `${s.name} (${s.gridName})`, value: s.name }))} placeholder="请选择执行人" />
            </Form.Item>
            <Form.Item name="deadline" label="截止日期" rules={[{ required: true, message: '请选择截止日期' }]}>
              <DatePicker className="w-full" disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))} />
            </Form.Item>
          </div>
          <Form.Item name="remark" label="任务说明">
            <Input.TextArea rows={3} placeholder="请输入任务详细说明（选填）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
