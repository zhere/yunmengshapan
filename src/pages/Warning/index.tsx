import { useState, useMemo } from 'react';
import { Tabs, Table, Tag, Button, Space, Input, Modal } from 'antd';
import { Bell, Clock, Loader, CheckCircle, Percent, Search } from 'lucide-react';
import StatCard from '@/components/Common/StatCard';
import { warnings, warningStats } from '@/mock/warnings';
import type { Warning, WarningLevel, WarningStatus } from '@/mock/warnings';
import WarningDetail from './WarningDetail';
import WarningRules from './WarningRules';
import WarningStats from './WarningStats';

const levelColor: Record<WarningLevel, string> = {
  '高': 'red',
  '中': 'orange',
  '低': 'blue',
};

const statusColor: Record<WarningStatus, string> = {
  '待处置': 'red',
  '已派发': 'orange',
  '处置中': 'processing',
  '已反馈': 'cyan',
  '已闭环': 'green',
};

const levelOptions = ['全部', '高', '中', '低'] as const;
const statusOptions = ['全部', '待处置', '已派发', '处置中', '已反馈', '已闭环'] as const;

type LevelFilter = typeof levelOptions[number];
type StatusFilter = typeof statusOptions[number];

export default function WarningCenter() {
  const [warningList, setWarningList] = useState<Warning[]>(warnings);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('全部');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('全部');
  const [keyword, setKeyword] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentWarning, setCurrentWarning] = useState<Warning | null>(null);

  const filteredWarnings = useMemo(() => {
    return warningList.filter((w) => {
      if (levelFilter !== '全部' && w.level !== levelFilter) return false;
      if (statusFilter !== '全部' && w.status !== statusFilter) return false;
      if (keyword && !w.location.includes(keyword)) return false;
      return true;
    });
  }, [warningList, levelFilter, statusFilter, keyword]);

  const handleDetail = (record: Warning) => {
    setCurrentWarning(record);
    setDetailVisible(true);
  };

  const handleStatusChange = (newStatus: WarningStatus) => {
    if (!currentWarning) return;
    const id = currentWarning.id;
    setWarningList((prev) => prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w)));
    setCurrentWarning((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setCurrentWarning(null);
  };

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 170 },
    {
      title: '事件类型', dataIndex: 'type', key: 'type', width: 100,
      render: (v: string) => <Tag color="cyan">{v}</Tag>,
    },
    { title: '子类型', dataIndex: 'subType', key: 'subType', width: 110 },
    {
      title: '级别', dataIndex: 'level', key: 'level', width: 70,
      render: (level: WarningLevel) => <Tag color={levelColor[level]}>{level}</Tag>,
    },
    { title: '地点', dataIndex: 'location', key: 'location', ellipsis: true },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (status: WarningStatus) => <Tag color={statusColor[status]}>{status}</Tag>,
    },
    { title: '处置人', dataIndex: 'handler', key: 'handler', width: 80 },
    {
      title: '操作', key: 'action', width: 150,
      render: (_: unknown, record: Warning) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleDetail(record)}>查看详情</Button>
          <Button type="link" size="small" onClick={() => handleDetail(record)}>处置</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        <StatCard title="今日预警总数" value={warningStats.todayCount} icon={<Bell size={22} />} color="#00D4FF" />
        <StatCard title="待处置" value={warningStats.pendingCount} icon={<Clock size={22} />} color="#FF9500" />
        <StatCard title="处置中" value={warningStats.processingCount} icon={<Loader size={22} />} color="#8B5CF6" />
        <StatCard title="已闭环" value={warningStats.closedCount} icon={<CheckCircle size={22} />} color="#00FF88" />
        <StatCard title="处置率" value={warningStats.closeRate} suffix="%" icon={<Percent size={22} />} color="#00D4FF" />
      </div>

      <Tabs
        defaultActiveKey="realtime"
        items={[
          {
            key: 'realtime',
            label: '实时预警',
            children: (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <Space>
                    <span className="text-xs text-[#8BA3C7]">级别：</span>
                    {levelOptions.map((lv) => (
                      <Button
                        key={lv}
                        size="small"
                        type={levelFilter === lv ? 'primary' : 'default'}
                        onClick={() => setLevelFilter(lv)}
                      >
                        {lv}
                      </Button>
                    ))}
                  </Space>
                  <Space>
                    <span className="text-xs text-[#8BA3C7]">状态：</span>
                    {statusOptions.map((st) => (
                      <Button
                        key={st}
                        size="small"
                        type={statusFilter === st ? 'primary' : 'default'}
                        onClick={() => setStatusFilter(st)}
                      >
                        {st}
                      </Button>
                    ))}
                  </Space>
                  <Input
                    size="small"
                    placeholder="搜索地点"
                    prefix={<Search size={14} className="text-[#8BA3C7]" />}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
                  />
                </div>
                <Table
                  rowKey="id"
                  columns={columns}
                  dataSource={filteredWarnings}
                  size="small"
                  pagination={{ pageSize: 10, showSizeChanger: false }}
                  scroll={{ x: 1050 }}
                />
              </div>
            ),
          },
          {
            key: 'rules',
            label: '预警规则',
            children: <WarningRules />,
          },
          {
            key: 'stats',
            label: '预警统计',
            children: <WarningStats />,
          },
        ]}
      />

      <Modal
        title="预警详情"
        open={detailVisible}
        onCancel={handleCloseDetail}
        footer={null}
        width={720}
        destroyOnClose
      >
        {currentWarning && (
          <WarningDetail
            warning={currentWarning}
            onClose={handleCloseDetail}
            onStatusChange={handleStatusChange}
          />
        )}
      </Modal>
    </div>
  );
}
