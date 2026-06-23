import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, InputNumber, Tag, Drawer, Descriptions, Space, message } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Building2 } from 'lucide-react';
import { units } from '@/mock/collection';
import type { Unit, UnitType } from '@/mock/collection';

const typeColor: Record<UnitType, string> = {
  '机关': '#A855F7', '团体': '#00D4FF', '企业': '#00FF88', '事业单位': '#FF9500', '个体工商户': '#8BA3C7',
};

export default function CollectionUnit() {
  const [list, setList] = useState<Unit[]>(units);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<UnitType | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<Unit | null>(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => list.filter(u => {
    if (search && !u.name.includes(search) && !u.legalPerson.includes(search)) return false;
    if (filterType && u.type !== filterType) return false;
    return true;
  }), [list, search, filterType]);

  const handleAdd = () => {
    form.validateFields().then(values => {
      setList([{ ...values, id: `UNT${String(list.length + 1).padStart(5, '0')}` }, ...list]);
      setModalOpen(false); form.resetFields();
      message.success('单位信息新增成功');
    });
  };

  const columns = [
    { title: '单位名称', dataIndex: 'name', key: 'name', width: 220, ellipsis: true },
    { title: '类别', dataIndex: 'type', key: 'type', width: 100, render: (v: UnitType) => <Tag color={typeColor[v]}>{v}</Tag> },
    { title: '行业分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '法人', dataIndex: 'legalPerson', key: 'legalPerson', width: 80 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '从业人数', dataIndex: 'employeeCount', key: 'employeeCount', width: 90 },
    {
      title: '操作', key: 'action', width: 130,
      render: (_: unknown, r: Unit) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(r)} className="!text-[#00D4FF] !p-0">详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`编辑单位：${r.name}`)} className="!text-[#FF9500] !p-0">编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 size={20} className="text-[#FF9500]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">实有单位信息</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }} style={{ background: '#00D4FF', borderColor: '#00D4FF' }}>新增单位</Button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
        <Input prefix={<SearchOutlined />} placeholder="搜索单位名称或法人" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
        <Select placeholder="单位类别" allowClear value={filterType} onChange={v => setFilterType(v)} style={{ width: 140 }}
          options={[{ value: '机关', label: '机关' }, { value: '团体', label: '团体' }, { value: '企业', label: '企业' }, { value: '事业单位', label: '事业单位' }, { value: '个体工商户', label: '个体工商户' }]} />
        <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 条</span>
      </div>

      <Table rowKey="id" columns={columns} dataSource={filtered} size="small" pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1000 }} />

      <Modal title="新增单位" open={modalOpen} onOk={handleAdd} onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okButtonProps={{ style: { background: '#00D4FF', borderColor: '#00D4FF' } }} width={560}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="单位名称" rules={[{ required: true, message: '请输入单位名称' }]}><Input /></Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="type" label="单位类别" rules={[{ required: true, message: '请选择类别' }]}>
              <Select options={[{ value: '机关', label: '机关' }, { value: '团体', label: '团体' }, { value: '企业', label: '企业' }, { value: '事业单位', label: '事业单位' }, { value: '个体工商户', label: '个体工商户' }]} />
            </Form.Item>
            <Form.Item name="category" label="行业分类" rules={[{ required: true, message: '请输入行业分类' }]}><Input /></Form.Item>
            <Form.Item name="legalPerson" label="法人代表" rules={[{ required: true, message: '请输入法人' }]}><Input /></Form.Item>
            <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入电话' }]}><Input /></Form.Item>
            <Form.Item name="employeeCount" label="从业人数" rules={[{ required: true, message: '请输入人数' }]}><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="businessScope" label="经营范围" rules={[{ required: true, message: '请输入经营范围' }]}><Input /></Form.Item>
          </div>
          <Form.Item name="address" label="单位地址" rules={[{ required: true, message: '请输入地址' }]}><Input /></Form.Item>
        </Form>
      </Modal>

      <Drawer title="单位详情" open={!!detail} onClose={() => setDetail(null)} width={480}
        styles={{ header: { background: '#112240', borderBottom: '1px solid #1E3A5F' }, body: { background: '#0A1628' } }}>
        {detail && (
          <Descriptions column={1} size="small" labelStyle={{ color: '#8BA3C7', width: 100 }} contentStyle={{ color: '#E8F0FE' }}>
            <Descriptions.Item label="单位名称">{detail.name}</Descriptions.Item>
            <Descriptions.Item label="单位类别"><Tag color={typeColor[detail.type]}>{detail.type}</Tag></Descriptions.Item>
            <Descriptions.Item label="行业分类">{detail.category}</Descriptions.Item>
            <Descriptions.Item label="法人代表">{detail.legalPerson}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="单位地址">{detail.address}</Descriptions.Item>
            <Descriptions.Item label="从业人数">{detail.employeeCount}</Descriptions.Item>
            <Descriptions.Item label="经营范围">{detail.businessScope}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
