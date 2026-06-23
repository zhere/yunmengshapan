import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Modal, Form, Input, Select, Slider, Progress, Space, message } from 'antd';
import { Plus, Play, Pause, FileSearch } from 'lucide-react';
import { analysisTasks } from '@/mock/analysis';
import type { AnalysisTask, AnalysisType, AnalysisStatus } from '@/mock/analysis';
import dayjs from 'dayjs';

const typeColor: Record<AnalysisType, string> = {
  '城市管理': 'cyan',
  '公共安全': 'red',
  '交通出行': 'orange',
  '环境保护': 'green',
  '政务服务': 'purple',
};

const statusColor: Record<AnalysisStatus, string> = {
  '运行中': 'processing',
  '已暂停': 'orange',
  '已完成': 'green',
};

const typeOptions: AnalysisType[] = ['城市管理', '公共安全', '交通出行', '环境保护', '政务服务'];
const statusOptions: AnalysisStatus[] = ['运行中', '已暂停', '已完成'];
const deviceOptions = Array.from(new Set(analysisTasks.map((t) => t.deviceName)));
const alertRuleOptions = [
  '置信度≥75%触发告警',
  '置信度≥80%触发告警',
  '置信度≥85%触发告警',
  '置信度≥90%触发告警',
  '置信度≥85%触发告警，持续3秒',
  '置信度≥80%触发告警，持续5秒',
];

export default function AnalysisTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<AnalysisTask[]>(analysisTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<AnalysisStatus | '全部'>('全部');
  const [typeFilter, setTypeFilter] = useState<AnalysisType | '全部'>('全部');
  const [form] = Form.useForm();

  const filtered = tasks.filter(
    (t) =>
      (statusFilter === '全部' || t.status === statusFilter) &&
      (typeFilter === '全部' || t.analysisType === typeFilter),
  );

  const toggleStatus = (record: AnalysisTask) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === record.id
          ? { ...t, status: t.status === '运行中' ? '已暂停' : '运行中' }
          : t,
      ),
    );
    const next = record.status === '运行中' ? '已暂停' : '运行中';
    message.success(`任务「${record.name}」已${next === '运行中' ? '启动' : '暂停'}`);
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      const scheduleText = values.schedule
        ? `${values.schedule[0].format('HH:mm')}-${values.schedule[1].format('HH:mm')}`
        : '全天候运行';
      const newTask: AnalysisTask = {
        id: `AT${String(tasks.length + 1).padStart(3, '0')}`,
        name: values.name,
        deviceName: values.deviceName,
        analysisType: values.analysisType,
        status: '已暂停',
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        schedule: scheduleText,
        confidence: values.confidence,
        alertRule: values.alertRule,
      };
      setTasks((prev) => [newTask, ...prev]);
      message.success(`分析任务「${newTask.name}」已创建`);
      setModalOpen(false);
      form.resetFields();
    });
  };

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', width: 180, ellipsis: true },
    { title: '采集设备', dataIndex: 'deviceName', key: 'deviceName', width: 140 },
    {
      title: '分析类型', dataIndex: 'analysisType', key: 'analysisType', width: 100,
      render: (t: AnalysisType) => <Tag color={typeColor[t]}>{t}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: AnalysisStatus) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
    { title: '调度策略', dataIndex: 'schedule', key: 'schedule', width: 160, ellipsis: true },
    {
      title: '置信度阈值', dataIndex: 'confidence', key: 'confidence', width: 140,
      render: (v: number) => (
        <Progress
          percent={v}
          size="small"
          strokeColor={v >= 85 ? '#00FF88' : v >= 80 ? '#00D4FF' : '#FF9500'}
        />
      ),
    },
    {
      title: '操作', key: 'action', width: 200, fixed: 'right' as const,
      render: (_: unknown, record: AnalysisTask) => (
        <Space>
          {record.status === '运行中' ? (
            <Button type="link" size="small" icon={<Pause size={14} />} onClick={() => toggleStatus(record)}>
              暂停
            </Button>
          ) : (
            <Button type="link" size="small" icon={<Play size={14} />} onClick={() => toggleStatus(record)}>
              启动
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<FileSearch size={14} />}
            onClick={() => {
              message.info(`正在查看「${record.name}」分析结果`);
              navigate('/analysis/results');
            }}
          >
            查看结果
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <Space wrap>
          <span className="text-xs text-[#8BA3C7]">状态：</span>
          <Select
            size="small"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            style={{ width: 110 }}
            options={[{ label: '全部', value: '全部' }, ...statusOptions.map((s) => ({ label: s, value: s }))]}
          />
          <span className="text-xs text-[#8BA3C7] ml-2">类型：</span>
          <Select
            size="small"
            value={typeFilter}
            onChange={(v) => setTypeFilter(v)}
            style={{ width: 120 }}
            options={[{ label: '全部', value: '全部' }, ...typeOptions.map((t) => ({ label: t, value: t }))]}
          />
        </Space>
        <Button type="primary" icon={<Plus size={14} />} onClick={() => setModalOpen(true)}>
          新建分析任务
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        size="small"
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title="新建分析任务"
        open={modalOpen}
        onOk={handleCreate}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText="创建"
        cancelText="取消"
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4" initialValues={{ confidence: 80, alertRule: alertRuleOptions[2] }}>
          <Form.Item name="name" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="deviceName" label="采集设备" rules={[{ required: true, message: '请选择采集设备' }]}>
              <Select placeholder="请选择设备" options={deviceOptions.map((d) => ({ label: d, value: d }))} />
            </Form.Item>
            <Form.Item name="analysisType" label="分析类型" rules={[{ required: true, message: '请选择分析类型' }]}>
              <Select placeholder="请选择类型" options={typeOptions.map((t) => ({ label: t, value: t }))} />
            </Form.Item>
          </div>
          <Form.Item name="schedule" label="调度时间范围">
            <Select
              placeholder="请选择调度策略"
              options={[
                { label: '全天候运行', value: '全天候运行' },
                { label: '工作日 08:00-20:00', value: '工作日 08:00-20:00' },
                { label: '每日 06:00-22:00', value: '每日 06:00-22:00' },
                { label: '每日 08:00-18:00', value: '每日 08:00-18:00' },
                { label: '工作日 07:00-19:00', value: '工作日 07:00-19:00' },
              ]}
            />
          </Form.Item>
          <Form.Item name="confidence" label={`置信度阈值：${form.getFieldValue('confidence') ?? 80}%`}>
            <Slider min={60} max={95} step={5} tooltip={{ formatter: (v) => `${v}%` }} />
          </Form.Item>
          <Form.Item name="alertRule" label="告警规则" rules={[{ required: true, message: '请选择告警规则' }]}>
            <Select placeholder="请选择告警规则" options={alertRuleOptions.map((r) => ({ label: r, value: r }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
