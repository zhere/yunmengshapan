import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Tag, Drawer, Descriptions, Space, message } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Home } from 'lucide-react';
import { houses } from '@/mock/collection';
import type { House, PropertyType } from '@/mock/collection';

const propertyColor: Record<PropertyType, string> = {
  '自住': '#00FF88', '出租': '#00D4FF', '空置': '#8BA3C7', '商用': '#FF9500',
};

export default function CollectionHouse() {
  const [list, setList] = useState<House[]>(houses);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<PropertyType | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<House | null>(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => list.filter(h => {
    if (search && !h.address.includes(search) && !h.owner.includes(search)) return false;
    if (filterType && h.propertyType !== filterType) return false;
    return true;
  }), [list, search, filterType]);

  const handleAdd = () => {
    form.validateFields().then(values => {
      setList([{ ...values, id: `HSE${String(list.length + 1).padStart(5, '0')}`, isRented: values.propertyType === '出租', tenants: values.propertyType === '出租' ? values.tenants || 1 : 0 }, ...list]);
      setModalOpen(false); form.resetFields();
      message.success('房屋信息新增成功');
    });
  };

  const columns = [
    { title: '地址编码', dataIndex: 'addressCode', key: 'addressCode', width: 200, ellipsis: true },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '产权人', dataIndex: 'owner', key: 'owner', width: 80 },
    { title: '用途', dataIndex: 'propertyType', key: 'propertyType', width: 80, render: (v: PropertyType) => <Tag color={propertyColor[v]}>{v}</Tag> },
    { title: '面积(㎡)', dataIndex: 'area', key: 'area', width: 90 },
    { title: '房间数', dataIndex: 'rooms', key: 'rooms', width: 80 },
    { title: '出租状态', dataIndex: 'isRented', key: 'isRented', width: 90, render: (v: boolean) => <Tag color={v ? '#00D4FF' : '#8BA3C7'}>{v ? '已出租' : '未出租'}</Tag> },
    { title: '租户数', dataIndex: 'tenants', key: 'tenants', width: 70 },
    {
      title: '操作', key: 'action', width: 130,
      render: (_: unknown, r: House) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(r)} className="!text-[#00D4FF] !p-0">详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`编辑房屋：${r.address}`)} className="!text-[#FF9500] !p-0">编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Home size={20} className="text-[#00FF88]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">实有房屋信息</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }} style={{ background: '#00D4FF', borderColor: '#00D4FF' }}>新增房屋</Button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
        <Input prefix={<SearchOutlined />} placeholder="搜索地址或产权人" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
        <Select placeholder="房屋用途" allowClear value={filterType} onChange={v => setFilterType(v)} style={{ width: 130 }}
          options={[{ value: '自住', label: '自住' }, { value: '出租', label: '出租' }, { value: '空置', label: '空置' }, { value: '商用', label: '商用' }]} />
        <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 条</span>
      </div>

      <Table rowKey="id" columns={columns} dataSource={filtered} size="small" pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1100 }} />

      <Modal title="新增房屋" open={modalOpen} onOk={handleAdd} onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okButtonProps={{ style: { background: '#00D4FF', borderColor: '#00D4FF' } }} width={560}>
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="addressCode" label="地址编码" rules={[{ required: true, message: '请输入地址编码' }]}><Input /></Form.Item>
            <Form.Item name="owner" label="产权人" rules={[{ required: true, message: '请输入产权人' }]}><Input /></Form.Item>
            <Form.Item name="ownerPhone" label="产权人电话" rules={[{ required: true, message: '请输入电话' }]}><Input /></Form.Item>
            <Form.Item name="propertyType" label="房屋用途" rules={[{ required: true, message: '请选择用途' }]}>
              <Select options={[{ value: '自住', label: '自住' }, { value: '出租', label: '出租' }, { value: '空置', label: '空置' }, { value: '商用', label: '商用' }]} />
            </Form.Item>
            <Form.Item name="area" label="面积(㎡)" rules={[{ required: true, message: '请输入面积' }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="rooms" label="房间数" rules={[{ required: true, message: '请输入房间数' }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="tenants" label="租户数"><InputNumber min={0} style={{ width: '100%' }} /></Form.Item>
          </div>
          <Form.Item name="address" label="完整地址" rules={[{ required: true, message: '请输入地址' }]}><Input /></Form.Item>
        </Form>
      </Modal>

      <Drawer title="房屋详情" open={!!detail} onClose={() => setDetail(null)} width={480}
        styles={{ header: { background: '#112240', borderBottom: '1px solid #1E3A5F' }, body: { background: '#0A1628' } }}>
        {detail && (
          <Descriptions column={1} size="small" labelStyle={{ color: '#8BA3C7', width: 100 }} contentStyle={{ color: '#E8F0FE' }}>
            <Descriptions.Item label="地址编码">{detail.addressCode}</Descriptions.Item>
            <Descriptions.Item label="地址">{detail.address}</Descriptions.Item>
            <Descriptions.Item label="产权人">{detail.owner}</Descriptions.Item>
            <Descriptions.Item label="产权人电话">{detail.ownerPhone}</Descriptions.Item>
            <Descriptions.Item label="房屋用途"><Tag color={propertyColor[detail.propertyType]}>{detail.propertyType}</Tag></Descriptions.Item>
            <Descriptions.Item label="面积">{detail.area}㎡</Descriptions.Item>
            <Descriptions.Item label="房间数">{detail.rooms}</Descriptions.Item>
            <Descriptions.Item label="出租状态"><Tag color={detail.isRented ? '#00D4FF' : '#8BA3C7'}>{detail.isRented ? '已出租' : '未出租'}</Tag></Descriptions.Item>
            <Descriptions.Item label="租户数">{detail.tenants}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
