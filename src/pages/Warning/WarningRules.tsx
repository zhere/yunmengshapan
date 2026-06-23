import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Checkbox, Space, message, Popconfirm, Tag } from 'antd';
import { Plus } from 'lucide-react';
import type { WarningType, WarningLevel } from '@/mock/warnings';

interface Rule {
  id: string;
  name: string;
  type: WarningType;
  level: WarningLevel;
  notify: string[];
  deadline: string;
  enabled: boolean;
}

const initialRules: Rule[] = [
  { id: '1', name: '占道经营预警', type: '城市管理', level: '中', notify: ['平台', '短信'], deadline: '2小时', enabled: true },
  { id: '2', name: '人员聚集预警', type: '公共安全', level: '高', notify: ['平台', '短信', '微信'], deadline: '30分钟', enabled: true },
  { id: '3', name: '交通拥堵预警', type: '交通出行', level: '中', notify: ['平台'], deadline: '1小时', enabled: true },
  { id: '4', name: '水质异常预警', type: '环境保护', level: '高', notify: ['平台', '短信'], deadline: '1小时', enabled: false },
  { id: '5', name: '排队过长预警', type: '政务服务', level: '低', notify: ['平台'], deadline: '4小时', enabled: true },
  { id: '6', name: '打架斗殴预警', type: '公共安全', level: '高', notify: ['平台', '短信', '微信'], deadline: '15分钟', enabled: true },
  { id: '7', name: '垃圾堆积预警', type: '城市管理', level: '低', notify: ['平台'], deadline: '4小时', enabled: true },
  { id: '8', name: '烟雾排放预警', type: '环境保护', level: '中', notify: ['平台', '短信'], deadline: '2小时', enabled: false },
];

const types: WarningType[] = ['城市管理', '公共安全', '交通出行', '环境保护', '政务服务'];
const levels: WarningLevel[] = ['高', '中', '低'];
const notifyOptions = [
  { label: '平台', value: '平台' },
  { label: '短信', value: '短信' },
  { label: '微信', value: '微信' },
];
const levelColor: Record<WarningLevel, string> = { '高': 'red', '中': 'orange', '低': 'blue' };

export default function WarningRules() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (rule: Rule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingRule) {
        setRules((prev) => prev.map((r) => (r.id === editingRule.id ? { ...r, ...values } : r)));
        message.success('规则已更新');
      } else {
        const newRule: Rule = { id: Date.now().toString(), ...values, enabled: true };
        setRules((prev) => [...prev, newRule]);
        message.success('规则已添加');
      }
      setModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    message.success('规则已删除');
  };

  const toggleEnabled = (record: Rule) => {
    const next = !record.enabled;
    setRules((prev) => prev.map((r) => (r.id === record.id ? { ...r, enabled: next } : r)));
    message.success(`规则已${next ? '启用' : '禁用'}`);
  };

  const columns = [
    { title: '规则名称', dataIndex: 'name', key: 'name', width: 160 },
    { title: '事件类型', dataIndex: 'type', key: 'type', width: 100 },
    {
      title: '告警级别', dataIndex: 'level', key: 'level', width: 90,
      render: (level: WarningLevel) => <Tag color={levelColor[level]}>{level}</Tag>,
    },
    { title: '通知方式', dataIndex: 'notify', key: 'notify', width: 160, render: (v: string[]) => v.join('、') },
    { title: '处置时限', dataIndex: 'deadline', key: 'deadline', width: 100 },
    {
      title: '状态', dataIndex: 'enabled', key: 'enabled', width: 80,
      render: (enabled: boolean) => <Tag color={enabled ? 'green' : 'default'}>{enabled ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作', key: 'action', width: 200,
      render: (_: unknown, record: Rule) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除此规则？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
          <Button type="link" size="small" danger={record.enabled} onClick={() => toggleEnabled(record)}>
            {record.enabled ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <Button type="primary" icon={<Plus size={16} />} onClick={openAdd}>新增规则</Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={rules}
        size="small"
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />

      <Modal
        title={editingRule ? '编辑规则' : '新增规则'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText="保存"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item name="type" label="事件类型" rules={[{ required: true, message: '请选择事件类型' }]}>
            <Select placeholder="请选择事件类型" options={types.map((t) => ({ label: t, value: t }))} />
          </Form.Item>
          <Form.Item name="level" label="告警级别" rules={[{ required: true, message: '请选择告警级别' }]}>
            <Select placeholder="请选择告警级别" options={levels.map((l) => ({ label: l, value: l }))} />
          </Form.Item>
          <Form.Item name="notify" label="通知方式" rules={[{ required: true, message: '请选择通知方式' }]}>
            <Checkbox.Group options={notifyOptions} />
          </Form.Item>
          <Form.Item name="deadline" label="处置时限" rules={[{ required: true, message: '请输入处置时限' }]}>
            <Input placeholder="如：2小时" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
