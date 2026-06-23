import { useState } from 'react';
import { Table, Tag, Button, Drawer, Modal, Form, Input, Select, Timeline, message, Space } from 'antd';
import { FileText, Plus, Eye, Edit, Phone, User, Package } from 'lucide-react';
import { plans as initialPlans } from '@/mock/emergency';
import type { EmergencyPlan, EmergencyPlanLevel, EmergencyPlanType } from '@/mock/emergency';

const levelColors: Record<EmergencyPlanLevel, string> = {
  'I级': 'red', 'II级': 'orange', 'III级': 'blue', 'IV级': 'green',
};
const typeOptions: EmergencyPlanType[] = ['防汛抗旱', '火灾', '群体事件', '交通事故', '环境事故'];
const levelOptions: EmergencyPlanLevel[] = ['I级', 'II级', 'III级', 'IV级'];

export default function EmergencyPlans() {
  const [plans, setPlans] = useState<EmergencyPlan[]>(initialPlans);
  const [drawerPlan, setDrawerPlan] = useState<EmergencyPlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: '预案名称', dataIndex: 'name', key: 'name', render: (t: string) => <span className="text-[#E8F0FE] font-medium">{t}</span> },
    { title: '类型', dataIndex: 'type', key: 'type', render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: '级别', dataIndex: 'level', key: 'level', render: (l: EmergencyPlanLevel) => <Tag color={levelColors[l]}>{l}</Tag> },
    { title: '责任人', dataIndex: 'responsiblePerson', key: 'responsiblePerson', render: (t: string) => <span className="text-[#E8F0FE]">{t}</span> },
    { title: '联系电话', dataIndex: 'phone', key: 'phone', render: (t: string) => <span className="text-[#8BA3C7]">{t}</span> },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', render: (t: string) => <span className="text-[#8BA3C7]">{t}</span> },
    {
      title: '操作', key: 'action', width: 140,
      render: (_: unknown, r: EmergencyPlan) => (
        <Space>
          <Button type="link" size="small" icon={<Eye size={13} />} className="!text-[#00D4FF] !p-0" onClick={() => setDrawerPlan(r)}>查看</Button>
          <Button type="link" size="small" icon={<Edit size={13} />} className="!text-[#FF9500] !p-0" onClick={() => message.info(`编辑预案：${r.name}`)}>编辑</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(values => {
      const newPlan: EmergencyPlan = {
        id: `EP${String(plans.length + 1).padStart(3, '0')}`,
        name: values.name,
        type: values.type,
        level: values.level,
        responsiblePerson: values.responsiblePerson,
        phone: values.phone,
        resources: values.resources ? values.resources.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean) : [],
        procedures: values.procedures ? values.procedures.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
        updateTime: new Date().toISOString().slice(0, 10),
      };
      setPlans([newPlan, ...plans]);
      message.success('预案新增成功');
      form.resetFields();
      setModalOpen(false);
    }).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-[#00D4FF]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">应急预案管理</h2>
          <Tag color="blue" className="ml-2">共 {plans.length} 项</Tag>
        </div>
        <Button type="primary" icon={<Plus size={14} />} onClick={() => setModalOpen(true)}>新增预案</Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={plans}
        size="small"
        pagination={{ pageSize: 8, showSizeChanger: false }}
      />

      {/* Detail Drawer */}
      <Drawer
        title="预案详情"
        open={!!drawerPlan}
        onClose={() => setDrawerPlan(null)}
        width={560}
        destroyOnClose
      >
        {drawerPlan && (
          <div className="space-y-5">
            <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0A1628]/80">
              <h3 className="text-base font-semibold text-[#E8F0FE] mb-3">{drawerPlan.name}</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2"><Tag color="blue">{drawerPlan.type}</Tag></div>
                <div className="flex items-center gap-2"><Tag color={levelColors[drawerPlan.level]}>{drawerPlan.level}</Tag></div>
                <div className="flex items-center gap-2 text-[#E8F0FE]"><User size={13} className="text-[#8BA3C7]" />{drawerPlan.responsiblePerson}</div>
                <div className="flex items-center gap-2 text-[#E8F0FE]"><Phone size={13} className="text-[#8BA3C7]" />{drawerPlan.phone}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-1.5">
                <FileText size={14} className="text-[#00D4FF]" />响应流程
              </h4>
              <Timeline
                items={drawerPlan.procedures.map((p, i) => ({
                  color: '#00D4FF',
                  children: <span className="text-xs text-[#E8F0FE]">{i + 1}. {p}</span>,
                }))}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3 flex items-center gap-1.5">
                <Package size={14} className="text-[#FF9500]" />应急资源
              </h4>
              <div className="flex flex-wrap gap-2">
                {drawerPlan.resources.map(r => <Tag key={r} color="blue">{r}</Tag>)}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#1E3A5F]">
              <Button type="primary" className="flex-1" onClick={() => message.success(`已启动预案：${drawerPlan.name}`)}>启动预案</Button>
              <Button onClick={() => { setDrawerPlan(null); message.info('编辑功能'); }}>编辑</Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Add Modal */}
      <Modal
        title="新增应急预案"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAdd}
        okText="保存"
        cancelText="取消"
        width={560}
      >
        <Form form={form} layout="vertical" className="mt-2">
          <Form.Item label="预案名称" name="name" rules={[{ required: true, message: '请输入预案名称' }]}>
            <Input placeholder="请输入预案名称" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
              <Select placeholder="请选择" options={typeOptions.map(t => ({ label: t, value: t }))} />
            </Form.Item>
            <Form.Item label="响应级别" name="level" rules={[{ required: true, message: '请选择级别' }]}>
              <Select placeholder="请选择" options={levelOptions.map(l => ({ label: l, value: l }))} />
            </Form.Item>
            <Form.Item label="责任人" name="responsiblePerson" rules={[{ required: true, message: '请输入责任人' }]}>
              <Input placeholder="请输入责任人" />
            </Form.Item>
            <Form.Item label="联系电话" name="phone" rules={[{ required: true, message: '请输入电话' }]}>
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </div>
          <Form.Item label="应急资源（逗号分隔）" name="resources">
            <Input placeholder="如：消防车2辆, 应急分队" />
          </Form.Item>
          <Form.Item label="响应流程（每行一条）" name="procedures">
            <Input.TextArea rows={4} placeholder="每行输入一个流程步骤" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
