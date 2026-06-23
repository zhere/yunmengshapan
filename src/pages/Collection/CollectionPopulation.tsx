import { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Drawer, Descriptions, Space, message } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Users } from 'lucide-react';
import { population } from '@/mock/collection';
import type { Population } from '@/mock/collection';

const maskIdCard = (id: string) => id.slice(0, 6) + '********' + id.slice(-4);

export default function CollectionPopulation() {
  const [list, setList] = useState<Population[]>(population);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState<string | undefined>();
  const [filterResident, setFilterResident] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [detail, setDetail] = useState<Population | null>(null);
  const [form] = Form.useForm();

  const filtered = useMemo(() => list.filter(p => {
    if (search && !p.name.includes(search) && !p.idCard.includes(search)) return false;
    if (filterGender && p.gender !== filterGender) return false;
    if (filterResident && (filterResident === '是') !== p.isResident) return false;
    return true;
  }), [list, search, filterGender, filterResident]);

  const handleAdd = () => {
    form.validateFields().then(values => {
      setList([{ ...values, id: `POP${String(list.length + 1).padStart(5, '0')}`, updateTime: '2026-06-23', isResident: values.isResident === '是' }, ...list]);
      setModalOpen(false); form.resetFields();
      message.success('人口信息新增成功');
    });
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 200, render: (v: string) => maskIdCard(v) },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 60, render: (v: string) => <Tag color={v === '男' ? '#00D4FF' : '#FF3B5C'}>{v}</Tag> },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: '学历', dataIndex: 'education', key: 'education', width: 70 },
    { title: '职业', dataIndex: 'occupation', key: 'occupation', width: 90 },
    { title: '住址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '常住人口', dataIndex: 'isResident', key: 'isResident', width: 90, render: (v: boolean) => <Tag color={v ? '#00FF88' : '#8BA3C7'}>{v ? '是' : '否'}</Tag> },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 110 },
    {
      title: '操作', key: 'action', width: 130,
      render: (_: unknown, r: Population) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setDetail(r)} className="!text-[#00D4FF] !p-0">详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => message.info(`编辑人口：${r.name}`)} className="!text-[#FF9500] !p-0">编辑</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-[#00D4FF]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">实有人口信息</h2>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setModalOpen(true); }} style={{ background: '#00D4FF', borderColor: '#00D4FF' }}>新增人口</Button>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
        <Input prefix={<SearchOutlined />} placeholder="搜索姓名或身份证号" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
        <Select placeholder="性别" allowClear value={filterGender} onChange={v => setFilterGender(v)} style={{ width: 100 }} options={[{ value: '男', label: '男' }, { value: '女', label: '女' }]} />
        <Select placeholder="常住人口" allowClear value={filterResident} onChange={v => setFilterResident(v)} style={{ width: 130 }} options={[{ value: '是', label: '是' }, { value: '否', label: '否' }]} />
        <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 条</span>
      </div>

      <Table rowKey="id" columns={columns} dataSource={filtered} size="small" pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1200 }} />

      <Modal title="新增人口" open={modalOpen} onOk={handleAdd} onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okButtonProps={{ style: { background: '#00D4FF', borderColor: '#00D4FF' } }} width={560}>
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}><Input /></Form.Item>
            <Form.Item name="idCard" label="身份证号" rules={[{ required: true, message: '请输入身份证号' }]}><Input /></Form.Item>
            <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}><Select options={[{ value: '男', label: '男' }, { value: '女', label: '女' }]} /></Form.Item>
            <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}><Input /></Form.Item>
            <Form.Item name="education" label="学历" rules={[{ required: true, message: '请选择学历' }]}><Select options={['小学', '初中', '高中', '大专', '本科', '硕士'].map(v => ({ value: v, label: v }))} /></Form.Item>
            <Form.Item name="occupation" label="职业" rules={[{ required: true, message: '请输入职业' }]}><Input /></Form.Item>
            <Form.Item name="maritalStatus" label="婚姻状况" rules={[{ required: true, message: '请选择婚姻状况' }]}><Select options={['未婚', '已婚', '离异', '丧偶'].map(v => ({ value: v, label: v }))} /></Form.Item>
            <Form.Item name="isResident" label="是否常住人口" rules={[{ required: true, message: '请选择' }]}><Select options={[{ value: '是', label: '是' }, { value: '否', label: '否' }]} /></Form.Item>
          </div>
          <Form.Item name="address" label="住址" rules={[{ required: true, message: '请输入住址' }]}><Input /></Form.Item>
        </Form>
      </Modal>

      <Drawer title="人口详情" open={!!detail} onClose={() => setDetail(null)} width={480}
        styles={{ header: { background: '#112240', borderBottom: '1px solid #1E3A5F' }, body: { background: '#0A1628' } }}>
        {detail && (
          <Descriptions column={1} size="small" labelStyle={{ color: '#8BA3C7', width: 100 }} contentStyle={{ color: '#E8F0FE' }}>
            <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{detail.idCard}</Descriptions.Item>
            <Descriptions.Item label="性别">{detail.gender}</Descriptions.Item>
            <Descriptions.Item label="电话">{detail.phone}</Descriptions.Item>
            <Descriptions.Item label="学历">{detail.education}</Descriptions.Item>
            <Descriptions.Item label="职业">{detail.occupation}</Descriptions.Item>
            <Descriptions.Item label="婚姻状况">{detail.maritalStatus}</Descriptions.Item>
            <Descriptions.Item label="地址编码">{detail.addressCode}</Descriptions.Item>
            <Descriptions.Item label="住址">{detail.address}</Descriptions.Item>
            <Descriptions.Item label="是否常住人口">{detail.isResident ? '是' : '否'}</Descriptions.Item>
            <Descriptions.Item label="更新时间">{detail.updateTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
}
