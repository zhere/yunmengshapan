import { useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, Select, Space, message } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { RefreshCw, XCircle } from 'lucide-react';
import { addresses } from '@/mock/addresses';
import type { Address, AddressStatus } from '@/mock/addresses';

const statusColor: Record<AddressStatus, string> = {
  '正常': '#00FF88', '变更': '#FF9500', '注销': '#FF3B5C',
};

interface PlateRecord {
  id: string;
  plateNo: string;
  address: string;
  status: AddressStatus;
  updateTime: string;
}

const initialPlates: PlateRecord[] = addresses.slice(0, 20).map((a, i) => ({
  id: a.id,
  plateNo: a.plateNo,
  address: a.fullAddress,
  status: a.status,
  updateTime: `2026-06-${String(23 - (i % 20)).padStart(2, '0')}`,
}));

export default function AddressPlate() {
  const [plates, setPlates] = useState<PlateRecord[]>(initialPlates);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PlateRecord | null>(null);
  const [form] = Form.useForm();

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: PlateRecord) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editing) {
        setPlates(plates.map(p => p.id === editing.id ? { ...p, ...values, updateTime: '2026-06-23' } : p));
        message.success('门牌信息已更新');
      } else {
        setPlates([{ ...values, id: `PLT${String(plates.length + 1).padStart(4, '0')}`, status: '正常', updateTime: '2026-06-23' }, ...plates]);
        message.success('门牌新增成功');
      }
      setModalOpen(false);
      form.resetFields();
      setEditing(null);
    });
  };

  const handleChange = (id: string) => {
    setPlates(plates.map(p => p.id === id ? { ...p, status: '变更', updateTime: '2026-06-23' } : p));
    message.success('门牌已标记为变更状态');
  };

  const handleCancel = (id: string) => {
    setPlates(plates.map(p => p.id === id ? { ...p, status: '注销', updateTime: '2026-06-23' } : p));
    message.success('门牌已注销');
  };

  const columns = [
    { title: '门牌号', dataIndex: 'plateNo', key: 'plateNo', width: 100 },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: AddressStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 130 },
    {
      title: '操作', key: 'action', width: 220,
      render: (_: unknown, r: PlateRecord) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} className="!text-[#00D4FF] !p-0">编辑</Button>
          <Button type="link" size="small" icon={<RefreshCw />} onClick={() => handleChange(r.id)} className="!text-[#FF9500] !p-0">变更</Button>
          <Button type="link" size="small" icon={<XCircle />} danger onClick={() => handleCancel(r.id)} className="!p-0">注销</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-[#E8F0FE]">门牌管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd} style={{ background: '#00D4FF', borderColor: '#00D4FF' }}>新增门牌</Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={plates} size="small" pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 800 }} />

      <Modal
        title={editing ? '编辑门牌' : '新增门牌'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditing(null); }}
        okButtonProps={{ style: { background: '#00D4FF', borderColor: '#00D4FF' } }}
        width={560}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="plateNo" label="门牌号" rules={[{ required: true, message: '请输入门牌号' }]}>
            <Input placeholder="如: 058号" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="province" label="省" rules={[{ required: true, message: '请输入省' }]}>
              <Input placeholder="湖北省" />
            </Form.Item>
            <Form.Item name="city" label="市" rules={[{ required: true, message: '请输入市' }]}>
              <Input placeholder="孝感市" />
            </Form.Item>
            <Form.Item name="county" label="县/区" rules={[{ required: true, message: '请输入县/区' }]}>
              <Input placeholder="云梦县" />
            </Form.Item>
            <Form.Item name="street" label="街路巷" rules={[{ required: true, message: '请输入街路巷' }]}>
              <Input placeholder="城关镇曲阳路" />
            </Form.Item>
            <Form.Item name="community" label="小区" rules={[{ required: true, message: '请输入小区' }]}>
              <Input placeholder="曲阳社区" />
            </Form.Item>
            <Form.Item name="building" label="楼栋" rules={[{ required: true, message: '请输入楼栋' }]}>
              <Input placeholder="01栋" />
            </Form.Item>
            <Form.Item name="unit" label="梯位" rules={[{ required: true, message: '请输入梯位' }]}>
              <Input placeholder="1单元" />
            </Form.Item>
            <Form.Item name="room" label="户室" rules={[{ required: true, message: '请输入户室' }]}>
              <Input placeholder="101室" />
            </Form.Item>
          </div>
          <Form.Item name="address" label="完整地址" rules={[{ required: true, message: '请输入完整地址' }]}>
            <Input placeholder="湖北省孝感市云梦县城关镇曲阳路058号曲阳社区01栋1单元101室" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
