import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, Modal, Descriptions, Select } from 'antd';
import { Users, Home, Building2, MoveRight, ArrowRight, Eye, Phone, User, Grid3X3 } from 'lucide-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { collectionStats } from '@/mock/collection';

const statusColor: Record<string, string> = { '进行中': '#00D4FF', '已完成': '#00FF88', '未开始': '#8BA3C7' };

const typeColors: Record<string, string> = { '人口': '#00D4FF', '房屋': '#00FF88', '单位': '#FF9500', '流动人口': '#A855F7', '全面': '#FF3B5C' };

const recentTasks = [
  { id: 'T001', name: '曲阳社区人口核采', grid: '曲阳社区第一网格', assignee: '张伟', phone: '138****5678', type: '人口', progress: 78, status: '进行中', deadline: '2026-06-30' },
  { id: 'T002', name: '建设社区房屋核查', grid: '建设社区第一网格', assignee: '李强', phone: '139****2345', type: '房屋', progress: 100, status: '已完成', deadline: '2026-06-20' },
  { id: 'T003', name: '楚王城社区单位核采', grid: '楚王城社区第一网格', assignee: '王磊', phone: '136****7890', type: '单位', progress: 45, status: '进行中', deadline: '2026-07-15' },
  { id: 'T004', name: '珍珠坡社区流动人口登记', grid: '珍珠坡社区第一网格', assignee: '刘军', phone: '158****3456', type: '流动人口', progress: 30, status: '进行中', deadline: '2026-07-20' },
  { id: 'T005', name: '梦泽社区全面核采', grid: '梦泽社区第一网格', assignee: '陈勇', phone: '159****6789', type: '全面', progress: 0, status: '未开始', deadline: '2026-08-01' },
  { id: 'T006', name: '西大社区人口核采', grid: '西大社区第一网格', assignee: '杨杰', phone: '137****9012', type: '人口', progress: 92, status: '进行中', deadline: '2026-06-28' },
  { id: 'T007', name: '南环社区房屋核查', grid: '南环社区第一网格', assignee: '赵涛', phone: '188****4567', type: '房屋', progress: 65, status: '进行中', deadline: '2026-07-10' },
  { id: 'T008', name: '义堂社区单位核采', grid: '义堂社区第一网格', assignee: '黄明', phone: '155****8901', type: '单位', progress: 100, status: '已完成', deadline: '2026-06-15' },
];

// 提取所有网格员用于筛选
const assigneeOptions = [...new Set(recentTasks.map(t => t.assignee))];
const gridOptions = [...new Set(recentTasks.map(t => t.grid))];
const typeOptions = [...new Set(recentTasks.map(t => t.type))];
const statusOptions = ['全部', '进行中', '已完成', '未开始'];

export default function CollectionOverview() {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState<{ visible: boolean; task: typeof recentTasks[number] | null }>({ visible: false, task: null });

  // 筛选条件
  const [filters, setFilters] = useState({ type: '全部', status: '全部', grid: '全部', assignee: '全部' });

  // 筛选逻辑
  const filteredTasks = recentTasks.filter(t => {
    if (filters.type !== '全部' && t.type !== filters.type) return false;
    if (filters.status !== '全部' && t.status !== filters.status) return false;
    if (filters.grid !== '全部' && t.grid !== filters.grid) return false;
    if (filters.assignee !== '全部' && t.assignee !== filters.assignee) return false;
    return true;
  });

  const stats = [
    { title: '实有人口', value: collectionStats.populationTotal.toLocaleString(), icon: <Users size={22} />, color: '#00D4FF' },
    { title: '实有房屋', value: collectionStats.houseTotal.toLocaleString(), icon: <Home size={22} />, color: '#00FF88' },
    { title: '实有单位', value: collectionStats.unitTotal.toLocaleString(), icon: <Building2 size={22} />, color: '#FF9500' },
    { title: '流动人口', value: collectionStats.flowTotal.toLocaleString(), icon: <MoveRight size={22} />, color: '#A855F7' },
  ];

  const taskColumns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 100,
      render: (v: string) => <Tag color={typeColors[v] || '#A855F7'}>{v}</Tag>,
    },
    { title: '所属网格', dataIndex: 'grid', key: 'grid', width: 160, ellipsis: true },
    {
      title: '网格员信息', key: 'assigneeInfo', width: 180,
      render: (_: unknown, record: typeof recentTasks[number]) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#00D4FF]/15 flex items-center justify-center">
            <User size={14} className="text-[#00D4FF]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#E8F0FE]">{record.assignee}</span>
            <span className="text-[10px] text-[#8BA3C7] flex items-center gap-1"><Phone size={9} />{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag>,
    },
    { title: '截止日期', dataIndex: 'deadline', key: 'deadline', width: 100 },
    {
      title: '操作', key: 'action', width: 70,
      render: (_: unknown, record: typeof recentTasks[number]) => (
        <Button
          type="link"
          size="small"
          icon={<Eye size={14} />}
          className="!text-[#00D4FF]"
          onClick={() => setDetailModal({ visible: true, task: record })}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      <ChartCard
        title="最近核采任务"
        extra={
          <Button type="link" size="small" onClick={() => navigate('/collection/tasks')} className="!text-[#00D4FF] !p-0">
            查看全部 <ArrowRight size={12} className="inline" />
          </Button>
        }
      >
        {/* 筛选条件 */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8BA3C7] whitespace-nowrap">采集类型：</span>
            <Select
              value={filters.type}
              onChange={v => setFilters(f => ({ ...f, type: v }))}
              className="w-28"
              size="small"
              style={{ width: 110 }}
              options={['全部', ...typeOptions].map(t => ({ label: t, value: t }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8BA3C7] whitespace-nowrap">状态：</span>
            <Select
              value={filters.status}
              onChange={v => setFilters(f => ({ ...f, status: v }))}
              size="small"
              style={{ width: 100 }}
              options={statusOptions.map(s => ({ label: s, value: s }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8BA3C7] whitespace-nowrap">网格：</span>
            <Select
              value={filters.grid}
              onChange={v => setFilters(f => ({ ...f, grid: v }))}
              size="small"
              style={{ width: 150 }}
              options={['全部', ...gridOptions].map(g => ({ label: g, value: g }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8BA3C7] whitespace-nowrap">网格员：</span>
            <Select
              value={filters.assignee}
              onChange={v => setFilters(f => ({ ...f, assignee: v }))}
              size="small"
              style={{ width: 100 }}
              options={['全部', ...assigneeOptions].map(a => ({ label: a, value: a }))}
            />
          </div>
        </div>
        <Table rowKey="id" columns={taskColumns} dataSource={filteredTasks} size="small" pagination={false} scroll={{ x: 950 }} />
      </ChartCard>

      {/* 任务详情弹窗 */}
      <Modal
        title={null}
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, task: null })}
        footer={[
          <Button key="close" onClick={() => setDetailModal({ visible: false, task: null })}>
            关闭
          </Button>,
        ]}
        width={560}
        className="dark-modal"
        styles={{ body: { background: '#0A1628', padding: '0 24px 24px' } }}
      >
        {detailModal.task && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1E3A5F]">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/15 flex items-center justify-center">
                <Grid3X3 size={20} className="text-[#00D4FF]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8F0FE]">{detailModal.task.name}</h3>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                  detailModal.task.status === '已完成' ? 'bg-[#00FF88]/20 text-[#00FF88]' :
                  detailModal.task.status === '进行中' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' :
                  'bg-[#8BA3C7]/20 text-[#8BA3C7]'
                }`}>{detailModal.task.status}</span>
              </div>
            </div>
            <Descriptions column={2} size="small"
              styles={{
                label: { color: '#8BA3C7', fontSize: 12 },
                content: { color: '#E8F0FE', fontSize: 13 },
              }}
            >
              <Descriptions.Item label="任务编号">{detailModal.task.id}</Descriptions.Item>
              <Descriptions.Item label="采集类型">
                <Tag color={typeColors[detailModal.task.type] || '#A855F7'}>{detailModal.task.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="所属网格" span={2}>{detailModal.task.grid}</Descriptions.Item>
              <Descriptions.Item label="网格员姓名">
                <span className="flex items-center gap-1">
                  <User size={12} className="text-[#00D4FF]" /> {detailModal.task.assignee}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="网格员电话">
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-[#00FF88]" /> {detailModal.task.phone}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="采集进度" span={2}>
                <div className="flex items-center gap-2">
                  <div className="flex-1 max-w-[200px]">
                    <div className="h-2 rounded-full bg-[#1E3A5F] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${detailModal.task.progress}%`,
                          background: 'linear-gradient(90deg, #00D4FF, #00FF88)',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-[#00D4FF] font-bold">{detailModal.task.progress}%</span>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="截止日期">{detailModal.task.deadline}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Modal 样式 */}
      <style>{`
        .dark-modal .ant-modal-content {
          background: #0A1628 !important;
          border: 1px solid #1E3A5F;
          border-radius: 12px;
        }
        .dark-modal .ant-modal-header {
          background: #0A1628 !important;
          border-bottom: 1px solid #1E3A5F;
          border-radius: 12px 12px 0 0;
        }
        .dark-modal .ant-modal-close {
          color: #8BA3C7;
        }
        .dark-modal .ant-btn {
          background: #112240;
          border-color: #1E3A5F;
          color: #E8F0FE;
        }
        .dark-modal .ant-btn:hover {
          border-color: #00D4FF;
          color: #00D4FF;
        }
        .dark-modal .ant-descriptions-item-label {
          color: #8BA3C7 !important;
        }
        .dark-modal .ant-descriptions-item-content {
          color: #E8F0FE !important;
        }
      `}</style>
    </div>
  );
}
