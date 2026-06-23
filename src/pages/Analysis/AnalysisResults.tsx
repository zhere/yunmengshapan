import { useState } from 'react';
import { Table, Tag, Button, Modal, Select, DatePicker, Space, message, Descriptions, Progress } from 'antd';
import { Download, FileSearch, ImageOff } from 'lucide-react';
import { analysisResults } from '@/mock/analysis';
import type { AnalysisResult, AnalysisType } from '@/mock/analysis';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const tagColor: Record<AnalysisType, string> = {
  '城市管理': 'cyan',
  '公共安全': 'red',
  '交通出行': 'orange',
  '环境保护': 'green',
  '政务服务': 'purple',
};

const typeOptions: AnalysisType[] = ['城市管理', '公共安全', '交通出行', '环境保护', '政务服务'];

function confidenceColor(v: number): string {
  return v >= 90 ? '#00FF88' : v >= 85 ? '#00D4FF' : v >= 80 ? '#FF9500' : '#FF3B5C';
}

export default function AnalysisResults() {
  const [typeFilter, setTypeFilter] = useState<AnalysisType | '全部'>('全部');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [detail, setDetail] = useState<AnalysisResult | null>(null);

  const filtered = analysisResults.filter((r) => {
    const typeOk = typeFilter === '全部' || r.type === typeFilter;
    const capture = dayjs(r.captureTime).valueOf();
    const dateOk = !dateRange || (capture >= dateRange[0].startOf('day').valueOf() && capture <= dateRange[1].endOf('day').valueOf());
    return typeOk && dateOk;
  });

  const handleExport = () => {
    message.success(`已导出 ${filtered.length} 条分析结果`);
  };

  const columns = [
    { title: '采集时间', dataIndex: 'captureTime', key: 'captureTime', width: 170 },
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 180, ellipsis: true },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 100,
      render: (t: AnalysisType) => <Tag color={tagColor[t]}>{t}</Tag>,
    },
    { title: '子类型', dataIndex: 'subType', key: 'subType', width: 110 },
    {
      title: '置信度', dataIndex: 'confidence', key: 'confidence', width: 130,
      render: (v: number) => (
        <Space size={4}>
          <Progress
            type="circle"
            percent={v}
            size={32}
            strokeColor={confidenceColor(v)}
            format={() => ''}
          />
          <span style={{ color: confidenceColor(v) }} className="text-xs font-mono">{v}%</span>
        </Space>
      ),
    },
    { title: '采集设备', dataIndex: 'deviceName', key: 'deviceName', width: 140 },
    { title: '位置', dataIndex: 'location', key: 'location', ellipsis: true },
    {
      title: '操作', key: 'action', width: 90, fixed: 'right' as const,
      render: (_: unknown, record: AnalysisResult) => (
        <Button type="link" size="small" icon={<FileSearch size={14} />} onClick={() => setDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <Space wrap>
          <span className="text-xs text-[#8BA3C7]">类型：</span>
          <Select
            size="small"
            value={typeFilter}
            onChange={(v) => setTypeFilter(v)}
            style={{ width: 120 }}
            options={[{ label: '全部', value: '全部' }, ...typeOptions.map((t) => ({ label: t, value: t }))]}
          />
          <span className="text-xs text-[#8BA3C7] ml-2">时间范围：</span>
          <RangePicker
            size="small"
            value={dateRange}
            onChange={(v) => setDateRange(v as [Dayjs, Dayjs] | null)}
            style={{ width: 240 }}
          />
        </Space>
        <Button type="primary" icon={<Download size={14} />} onClick={handleExport}>
          导出结果
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        size="small"
        pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
        scroll={{ x: 1100 }}
      />

      <Modal
        title="分析结果详情"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={<Button onClick={() => setDetail(null)}>关闭</Button>}
        width={680}
        destroyOnClose
      >
        {detail && (
          <div className="space-y-4 mt-2">
            <div className="w-full h-56 rounded-lg bg-[#0A1628] border border-[#1E3A5F] flex flex-col items-center justify-center">
              <ImageOff size={40} className="text-[#1E3A5F] mb-2" />
              <span className="text-xs text-[#8BA3C7]">结果图像占位 · {detail.imageUrl}</span>
            </div>

            <Descriptions column={2} size="small" bordered
              labelStyle={{ background: '#0D2137', color: '#8BA3C7', borderBlockColor: '#1E3A5F' }}
              contentStyle={{ background: 'transparent', color: '#E8F0FE', borderBlockColor: '#1E3A5F' }}
            >
              <Descriptions.Item label="任务名称">{detail.taskName}</Descriptions.Item>
              <Descriptions.Item label="子类型">{detail.subType}</Descriptions.Item>
              <Descriptions.Item label="事件类型">
                <Tag color={tagColor[detail.type]}>{detail.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="采集时间">{detail.captureTime}</Descriptions.Item>
              <Descriptions.Item label="采集设备">{detail.deviceName}</Descriptions.Item>
              <Descriptions.Item label="发生位置">{detail.location}</Descriptions.Item>
              <Descriptions.Item label="置信度" span={2}>
                <Space>
                  <Progress percent={detail.confidence} size="small" style={{ width: 160 }} strokeColor={confidenceColor(detail.confidence)} />
                  <span style={{ color: confidenceColor(detail.confidence) }} className="font-mono">{detail.confidence}%</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="检测描述" span={2}>{detail.description}</Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
