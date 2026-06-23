import { useState, useMemo } from 'react';
import { Table, Button, Tag, Drawer, Descriptions, Input, Select, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MoveRight, FileCheck, Edit3 } from 'lucide-react';
import { flowPopulation } from '@/mock/collection';
import type { FlowPopulation, ResidenceType } from '@/mock/collection';

const maskIdCard = (id: string) => id.slice(0, 6) + '********' + id.slice(-4);

const residenceColor: Record<ResidenceType, string> = {
  '租赁': '#00D4FF', '借住': '#00FF88', '单位宿舍': '#FF9500', '其他': '#8BA3C7',
};

export default function CollectionFlow() {
  const [list, setList] = useState<FlowPopulation[]>(flowPopulation);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ResidenceType | undefined>();
  const [detail, setDetail] = useState<FlowPopulation | null>(null);

  const filtered = useMemo(() => list.filter(f => {
    if (search && !f.name.includes(search) && !f.fromPlace.includes(search)) return false;
    if (filterType && f.residenceType !== filterType) return false;
    return true;
  }), [list, search, filterType]);

  const handleRenew = (r: FlowPopulation) => {
    const newExpiry = '2027-06-23';
    setList(list.map(f => f.id === r.id ? { ...f, permitExpiry: newExpiry } : f));
    message.success(`${r.name} 的居住证签注成功，有效期至 ${newExpiry}`);
  };

  const handleRegister = (r: FlowPopulation) => {
    message.success(`${r.name} 流动人口登记成功`);
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 200, render: (v: string) => maskIdCard(v) },
    { title: '来源地', dataIndex: 'fromPlace', key: 'fromPlace', width: 140, ellipsis: true },
    { title: '居住地址', dataIndex: 'residenceAddress', key: 'residenceAddress', ellipsis: true },
    { title: '居住类型', dataIndex: 'residenceType', key: 'residenceType', width: 90, render: (v: ResidenceType) => <Tag color={residenceColor[v]}>{v}</Tag> },
    { title: '居住证号', dataIndex: 'permitNo', key: 'permitNo', width: 160 },
    { title: '居住证到期', dataIndex: 'permitExpiry', key: 'permitExpiry', width: 120 },
    { title: '登记日期', dataIndex: 'registerDate', key: 'registerDate', width: 120 },
    {
      title: '操作', key: 'action', width: 200,
      render: (_: unknown, r: FlowPopulation) => (
        <Space>
          <Button type="link" size="small" icon={<FileCheck />} onClick={() => handleRenew(r)} className="!text-[#00D4FF] !p-0">居住证签注</Button>
          <Button type="link" size="small" icon={<Edit3 />} onClick={() => handleRegister(r)} className="!text-[#00FF88] !p-0">登记</Button>
          <Button type="link" size="small" onClick={() => setDetail(r)} className="!text-[#A855F7] !p-0">详情</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MoveRight size={20} className="text-[#A855F7]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">流动人口信息</h2>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80">
        <Input prefix={<SearchOutlined />} placeholder="搜索姓名或来源地" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 280 }} />
        <Select placeholder="居住类型" allowClear value={filterType} onChange={v => setFilterType(v)} style={{ width: 130 }}
          options={[{ value: '租赁', label: '租赁' }, { value: '借住', label: '借住' }, { value: '单位宿舍', label: '单位宿舍' }, { value: '其他', label: '其他' }]} />
        <span className="text-xs text-[#8BA3C7] ml-auto">共 {filtered.length} 条</span>
      </div>

      <Table rowKey="id" columns={columns} dataSource={filtered} size="small" pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 1200 }} />

      <Drawer title="流动人口详情" open={!!detail} onClose={() => setDetail(null)} width={480}
        styles={{ header: { background: '#112240', borderBottom: '1px solid #1E3A5F' }, body: { background: '#0A1628' } }}>
        {detail && (
          <div className="space-y-4">
            <Descriptions column={1} size="small" labelStyle={{ color: '#8BA3C7', width: 100 }} contentStyle={{ color: '#E8F0FE' }}>
              <Descriptions.Item label="姓名">{detail.name}</Descriptions.Item>
              <Descriptions.Item label="身份证号">{detail.idCard}</Descriptions.Item>
              <Descriptions.Item label="性别">{detail.gender}</Descriptions.Item>
              <Descriptions.Item label="来源地">{detail.fromPlace}</Descriptions.Item>
              <Descriptions.Item label="居住地址">{detail.residenceAddress}</Descriptions.Item>
              <Descriptions.Item label="居住类型"><Tag color={residenceColor[detail.residenceType]}>{detail.residenceType}</Tag></Descriptions.Item>
              <Descriptions.Item label="居住证号">{detail.permitNo}</Descriptions.Item>
              <Descriptions.Item label="居住证到期">{detail.permitExpiry}</Descriptions.Item>
              <Descriptions.Item label="登记日期">{detail.registerDate}</Descriptions.Item>
            </Descriptions>
            <div className="flex gap-2">
              <Button type="primary" icon={<FileCheck />} onClick={() => handleRenew(detail)} style={{ background: '#00D4FF', borderColor: '#00D4FF' }}>居住证签注</Button>
              <Button icon={<Edit3 />} onClick={() => handleRegister(detail)}>登记</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
