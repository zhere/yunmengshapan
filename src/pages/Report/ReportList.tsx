import { useState, useMemo } from 'react';
import {
  Table, Tag, Button, Modal, Select, DatePicker, Space, Card, Dropdown,
  message, Descriptions, Spin,
} from 'antd';
import {
  Search, Plus, Eye, Download, FileText, FileSpreadsheet, FileType,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import ChartCard from '@/components/Common/ChartCard';
import { reportData } from '@/mock/stats';
import { reportItems } from './index';
import type { ReportItem, ReportType, ReportStatus } from './index';

const { RangePicker } = DatePicker;

const typeOptions: { label: string; value: ReportType }[] = [
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '年报', value: '年报' },
];

const statusOptions: { label: string; value: ReportStatus }[] = [
  { label: '已生成', value: '已生成' },
  { label: '生成中', value: '生成中' },
  { label: '待生成', value: '待生成' },
];

const statusColor: Record<ReportStatus, string> = {
  '已生成': 'green',
  '生成中': 'processing',
  '待生成': 'default',
};

const typeColor: Record<ReportType, string> = {
  '日报': 'cyan',
  '周报': 'blue',
  '月报': 'geekblue',
  '季报': 'orange',
  '年报': 'purple',
};

const darkAxis = {
  axisLine: { lineStyle: { color: '#1E3A5F' } },
  axisLabel: { color: '#8BA3C7' },
  splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } },
};
const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };

export default function ReportList() {
  const [filterType, setFilterType] = useState<ReportType | undefined>();
  const [filterStatus, setFilterStatus] = useState<ReportStatus | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [current, setCurrent] = useState<ReportItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [dataSource, setDataSource] = useState<ReportItem[]>(reportItems);

  const filtered = useMemo(() => {
    return dataSource.filter(r => {
      if (filterType && r.type !== filterType) return false;
      if (filterStatus && r.status !== filterStatus) return false;
      if (dateRange && dateRange[0] && dateRange[1] && r.generateTime !== '-') {
        const t = dayjs(r.generateTime);
        if (t.isBefore(dateRange[0], 'day') || t.isAfter(dateRange[1], 'day')) return false;
      }
      return true;
    });
  }, [dataSource, filterType, filterStatus, dateRange]);

  const handleGenerate = () => {
    setGenerating(true);
    message.loading({ content: '正在生成报表，请稍候...', key: 'gen', duration: 0 });
    setTimeout(() => {
      const newReport: ReportItem = {
        id: `RPT${dayjs().format('YYYYMMDDHHmmss')}`,
        name: `综合业务日报-${dayjs().format('MM-DD')}`,
        type: '日报',
        period: dayjs().format('YYYY-MM-DD'),
        generateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: '已生成',
        size: '2.1MB',
        creator: '当前用户',
      };
      setDataSource(prev => [newReport, ...prev]);
      setGenerating(false);
      message.success({ content: '报表生成成功！', key: 'gen', duration: 2 });
    }, 1500);
  };

  const handleView = (record: ReportItem) => {
    if (record.status !== '已生成') {
      message.warning('该报表尚未生成完成，暂无法预览');
      return;
    }
    setCurrent(record);
    setPreviewOpen(true);
  };

  const handleExport = (record: ReportItem, format: 'PDF' | 'Excel') => {
    if (record.status !== '已生成') {
      message.warning('该报表尚未生成完成，暂无法导出');
      return;
    }
    message.loading({ content: `正在导出${format}格式报表...`, key: 'exp', duration: 0 });
    setTimeout(() => {
      message.success({ content: `${record.name}.${format === 'PDF' ? 'pdf' : 'xlsx'} 导出成功！`, key: 'exp', duration: 2 });
    }, 1200);
  };

  const columns = [
    { title: '报表名称', dataIndex: 'name', key: 'name', width: 220, ellipsis: true },
    { title: '类型', dataIndex: 'type', key: 'type', width: 80, render: (t: ReportType) => <Tag color={typeColor[t]}>{t}</Tag> },
    { title: '周期', dataIndex: 'period', key: 'period', width: 170 },
    { title: '生成时间', dataIndex: 'generateTime', key: 'generateTime', width: 170 },
    { title: '大小', dataIndex: 'size', key: 'size', width: 80 },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 100 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: ReportStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    {
      title: '操作', key: 'action', width: 180, fixed: 'right' as const,
      render: (_: unknown, r: ReportItem) => (
        <Space size="small">
          <Button type="link" size="small" icon={<Eye size={14} />} onClick={() => handleView(r)} className="!text-[#00D4FF] !p-0">查看</Button>
          <Dropdown
            menu={{
              items: [
                { key: 'pdf', label: '导出 PDF', icon: <FileType size={14} /> },
                { key: 'excel', label: '导出 Excel', icon: <FileSpreadsheet size={14} /> },
              ],
              onClick: ({ key }) => handleExport(r, key === 'pdf' ? 'PDF' : 'Excel'),
            }}
          >
            <Button type="link" size="small" icon={<Download size={14} />} className="!text-[#00FF88] !p-0">导出</Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 预览弹窗的图表
  const barOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: { textStyle: { color: '#8BA3C7' }, top: 0 },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: reportData.monthlyReports.map(m => m.month) },
    yAxis: { ...darkAxis, type: 'value' as const },
    series: [
      {
        name: '事件总数', type: 'bar', barWidth: 16,
        data: reportData.monthlyReports.map(m => m.events),
        itemStyle: { color: '#00D4FF' },
      },
      {
        name: '已处置', type: 'bar', barWidth: 16,
        data: reportData.monthlyReports.map(m => m.disposed),
        itemStyle: { color: '#00FF88' },
      },
    ],
  };

  const lineOption = {
    tooltip: { ...darkTooltip, trigger: 'axis' as const },
    legend: { textStyle: { color: '#8BA3C7' }, top: 0 },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: { ...darkAxis, type: 'category' as const, data: reportData.monthlyReports.map(m => m.month) },
    yAxis: { ...darkAxis, type: 'value' as const, max: 100, axisLabel: { color: '#8BA3C7', formatter: '{value}%' } },
    series: [{
      name: '处置率', type: 'line', smooth: true,
      data: reportData.monthlyReports.map(m => m.rate),
      itemStyle: { color: '#FF9500' },
      lineStyle: { width: 3 },
      areaStyle: { color: 'rgba(255,149,0,0.15)' },
    }],
  };

  const exportMenuItems = [
    { key: 'pdf', label: '批量导出 PDF', icon: <FileType size={14} /> },
    { key: 'excel', label: '批量导出 Excel', icon: <FileSpreadsheet size={14} /> },
  ];

  const handleBatchExport = (format: 'PDF' | 'Excel') => {
    const ready = filtered.filter(r => r.status === '已生成');
    if (ready.length === 0) {
      message.warning('没有可导出的已生成报表');
      return;
    }
    message.loading({ content: `正在批量导出 ${ready.length} 份报表为${format}格式...`, key: 'batch', duration: 0 });
    setTimeout(() => {
      message.success({ content: `成功导出 ${ready.length} 份${format}报表`, key: 'batch', duration: 2 });
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <Card className="!bg-[#0D2137]/80 !border-[#1E3A5F]" styles={{ body: { padding: 16 } }}>
        <Space wrap className="w-full justify-between">
          <Space wrap>
            <Select
              placeholder="报表类型"
              allowClear
              style={{ width: 140 }}
              value={filterType}
              onChange={v => setFilterType(v)}
              options={typeOptions}
            />
            <Select
              placeholder="报表状态"
              allowClear
              style={{ width: 140 }}
              value={filterStatus}
              onChange={v => setFilterStatus(v)}
              options={statusOptions}
            />
            <RangePicker
              value={dateRange}
              onChange={v => setDateRange(v as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
            />
            <Button icon={<Search size={14} />} onClick={() => message.info(`筛选到 ${filtered.length} 份报表`)}>查询</Button>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<Plus size={14} />}
              loading={generating}
              onClick={handleGenerate}
              className="!bg-[#00D4FF] !border-[#00D4FF]"
            >
              生成报表
            </Button>
            <Dropdown
              menu={{
                items: exportMenuItems,
                onClick: ({ key }) => handleBatchExport(key === 'pdf' ? 'PDF' : 'Excel'),
              }}
            >
              <Button icon={<Download size={14} />}>批量导出</Button>
            </Dropdown>
          </Space>
        </Space>
      </Card>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (t) => <span className="text-[#8BA3C7]">共 {t} 份报表</span>,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#00D4FF]" />
            <span className="text-[#E8F0FE]">报表预览 · {current?.name}</span>
          </div>
        }
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={900}
        footer={
          <Space>
            <Button onClick={() => setPreviewOpen(false)}>关闭</Button>
            <Button
              type="primary"
              icon={<Download size={14} />}
              className="!bg-[#00D4FF] !border-[#00D4FF]"
              onClick={() => current && handleExport(current, 'PDF')}
            >
              导出 PDF
            </Button>
            <Button
              icon={<FileSpreadsheet size={14} />}
              onClick={() => current && handleExport(current, 'Excel')}
            >
              导出 Excel
            </Button>
          </Space>
        }
      >
        {current && (
          <Spin spinning={false}>
            <div className="space-y-4">
              <Card size="small" className="!bg-[#0A1628] !border-[#1E3A5F]">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="报表编号">{current.id}</Descriptions.Item>
                  <Descriptions.Item label="报表类型"><Tag color={typeColor[current.type]}>{current.type}</Tag></Descriptions.Item>
                  <Descriptions.Item label="统计周期">{current.period}</Descriptions.Item>
                  <Descriptions.Item label="生成时间">{current.generateTime}</Descriptions.Item>
                  <Descriptions.Item label="文件大小">{current.size}</Descriptions.Item>
                  <Descriptions.Item label="创建人">{current.creator}</Descriptions.Item>
                </Descriptions>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <ChartCard title="月度事件统计">
                  <ReactECharts option={barOption} style={{ height: 240 }} />
                </ChartCard>
                <ChartCard title="月度处置率趋势">
                  <ReactECharts option={lineOption} style={{ height: 240 }} />
                </ChartCard>
              </div>

              <Card size="small" title={<span className="text-sm text-[#E8F0FE]">报表摘要</span>} className="!bg-[#0A1628] !border-[#1E3A5F]">
                <div className="space-y-2 text-sm text-[#E8F0FE]">
                  <p>· 本周期共采集事件 <span className="text-[#00D4FF] font-semibold">{reportData.weeklyData.events}</span> 起，已处置 <span className="text-[#00FF88] font-semibold">{reportData.weeklyData.disposed}</span> 起，处置率 <span className="text-[#FF9500] font-semibold">{reportData.weeklyData.rate}%</span>。</p>
                  <p>· 城管案件新增 <span className="text-[#00D4FF] font-semibold">{reportData.weeklyData.cases}</span> 件，已结案 <span className="text-[#00FF88] font-semibold">{reportData.weeklyData.closed}</span> 件。</p>
                  <p>· AI智能分析检测事件 <span className="text-[#00D4FF] font-semibold">{reportData.weeklyData.aiDetections}</span> 起，网格员上报 <span className="text-[#00D4FF] font-semibold">{reportData.weeklyData.gridEvents}</span> 起。</p>
                  <p>· 在岗网格员 <span className="text-[#00D4FF] font-semibold">{reportData.weeklyData.staffOnDuty}</span> 人，整体运行平稳。</p>
                </div>
              </Card>
            </div>
          </Spin>
        )}
      </Modal>
    </div>
  );
}
