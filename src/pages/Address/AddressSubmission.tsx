import { useState, useMemo } from 'react';
import { Table, Tag, Button, Select, Input, Modal, Descriptions, Space, Empty, message } from 'antd';
import { Smartphone, Search, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Image, User, MapPin, Grid3X3, ClipboardCheck } from 'lucide-react';
import { submissionRecords as initialRecords } from '@/mock/submission';
import type { SubmissionRecord, CollectionType, SystemCheck, ReviewStatus } from '@/mock/submission';

const { TextArea } = Input;

const systemCheckColor: Record<SystemCheck, string> = {
  '通过': '#00FF88',
  '未通过': '#FF3B5C',
  '待校验': '#FF9500',
};

const reviewStatusColor: Record<ReviewStatus, string> = {
  '待审核': '#FF9500',
  '已通过': '#00FF88',
  '已驳回': '#FF3B5C',
};

const reviewStatusBg: Record<ReviewStatus, string> = {
  '待审核': 'rgba(255,149,0,0.15)',
  '已通过': 'rgba(0,255,136,0.15)',
  '已驳回': 'rgba(255,59,92,0.15)',
};

const collectionTypeColor: Record<CollectionType, string> = {
  '人口核采': '#00D4FF',
  '房屋核查': '#00FF88',
  '单位核采': '#FF9500',
  '标准地址校对': '#A855F7',
  '门牌申报': '#FF3B5C',
};

// 提取筛选选项
const gridOptions = [...new Set(initialRecords.map(r => r.gridName))];
const collectionTypeOptions: CollectionType[] = ['人口核采', '房屋核查', '单位核采', '标准地址校对', '门牌申报'];
const systemCheckOptions: SystemCheck[] = ['通过', '未通过', '待校验'];
const reviewStatusOptions: ReviewStatus[] = ['待审核', '已通过', '已驳回'];

export default function AddressSubmission() {
  const [records, setRecords] = useState<SubmissionRecord[]>(initialRecords);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<{
    grid: string;
    collectionType: string;
    systemCheck: string;
    reviewStatus: string;
  }>({ grid: '', collectionType: '', systemCheck: '', reviewStatus: '' });

  const [detailModal, setDetailModal] = useState<{ visible: boolean; record: SubmissionRecord | null }>({
    visible: false,
    record: null,
  });
  const [reviewModal, setReviewModal] = useState<{ visible: boolean; record: SubmissionRecord | null; comment: string }>({
    visible: false,
    record: null,
    comment: '',
  });
  const [imagePreview, setImagePreview] = useState<{ visible: boolean; url: string }>({ visible: false, url: '' });

  // 审核处理
  const handleReview = (record: SubmissionRecord, status: '已通过' | '已驳回') => {
    const now = new Date();
    const reviewTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
    const comment = status === '已通过' ? '数据核实无误，审核通过。' : reviewModal.comment || '信息有误，请重新采集。';

    setRecords(prev => prev.map(r =>
      r.id === record.id
        ? { ...r, reviewStatus: status, reviewTime, reviewComment: comment, exceptionTag: status === '已驳回' ? '信息不完整' : r.exceptionTag }
        : r
    ));
    setReviewModal({ visible: false, record: null, comment: '' });
    message.success(status === '已通过' ? '审核通过' : '已驳回');
  };

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (searchText && !r.submitNo.includes(searchText) && !r.standardAddress.includes(searchText) && !r.submitter.includes(searchText)) {
        return false;
      }
      if (filters.grid && r.gridName !== filters.grid) return false;
      if (filters.collectionType && r.collectionType !== filters.collectionType) return false;
      if (filters.systemCheck && r.systemCheck !== filters.systemCheck) return false;
      if (filters.reviewStatus && r.reviewStatus !== filters.reviewStatus) return false;
      return true;
    });
  }, [searchText, filters]);

  const columns = [
    {
      title: '提交编号', dataIndex: 'submitNo', key: 'submitNo', width: 190,
      render: (v: string) => (
        <span className="text-xs font-mono text-[#00D4FF]">{v}</span>
      ),
    },
    {
      title: '标准地址', dataIndex: 'standardAddress', key: 'standardAddress', ellipsis: true,
      render: (v: string) => (
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-[#8BA3C7] shrink-0" />
          <span className="text-xs truncate">{v}</span>
        </span>
      ),
    },
    {
      title: '所属网格', dataIndex: 'gridName', key: 'gridName', width: 150,
      render: (v: string) => (
        <span className="text-xs text-[#E8F0FE]">{v}</span>
      ),
    },
    {
      title: '提交人', key: 'submitter', width: 120,
      render: (_: unknown, r: SubmissionRecord) => (
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#00D4FF]/15 flex items-center justify-center">
            <User size={11} className="text-[#00D4FF]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#E8F0FE] leading-tight">{r.submitter}</span>
            <span className="text-[9px] text-[#8BA3C7] leading-tight">{r.submitterPhone}</span>
          </div>
        </div>
      ),
    },
    {
      title: '采集类型', dataIndex: 'collectionType', key: 'collectionType', width: 110,
      render: (v: CollectionType) => (
        <Tag color={collectionTypeColor[v]}>{v}</Tag>
      ),
    },
    {
      title: '系统校验', dataIndex: 'systemCheck', key: 'systemCheck', width: 100,
      render: (v: SystemCheck) => (
        <div className="flex items-center gap-1">
          {v === '通过' && <CheckCircle size={12} className="text-[#00FF88]" />}
          {v === '未通过' && <XCircle size={12} className="text-[#FF3B5C]" />}
          {v === '待校验' && <Clock size={12} className="text-[#FF9500]" />}
          <span style={{ color: systemCheckColor[v] }} className="text-xs">{v}</span>
        </div>
      ),
    },
    {
      title: '审核状态', dataIndex: 'reviewStatus', key: 'reviewStatus', width: 90,
      render: (v: ReviewStatus) => (
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
          style={{ color: reviewStatusColor[v], backgroundColor: reviewStatusBg[v] }}
        >
          {v === '待审核' && <Clock size={11} />}
          {v === '已通过' && <CheckCircle size={11} />}
          {v === '已驳回' && <XCircle size={11} />}
          {v}
        </span>
      ),
    },
    {
      title: '异常标签', dataIndex: 'exceptionTag', key: 'exceptionTag', width: 100,
      render: (v: string) =>
        v === '—' ? (
          <span className="text-xs text-[#8BA3C7]">—</span>
        ) : (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#FF3B5C]/15 text-[#FF3B5C]">
            <AlertTriangle size={10} />
            {v}
          </span>
        ),
    },
    {
      title: '操作', key: 'action', width: 120, fixed: 'right' as const,
      render: (_: unknown, r: SubmissionRecord) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<Eye size={13} />}
            className="!text-[#00D4FF] !p-1"
            onClick={() => setDetailModal({ visible: true, record: r })}
          >
            查看
          </Button>
          {r.reviewStatus === '待审核' ? (
            <Button
              type="link"
              size="small"
              icon={<ClipboardCheck size={13} />}
              className="!text-[#FF9500] !p-1 font-semibold"
              onClick={() => setReviewModal({ visible: true, record: r, comment: '' })}
            >
              审核
            </Button>
          ) : (
            <span className="text-[10px] text-[#8BA3C7] ml-1">已审核</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone size={20} className="text-[#00D4FF]" />
          <h2 className="text-lg font-semibold text-[#E8F0FE]">小程序提交记录</h2>
          <span className="text-xs text-[#8BA3C7] ml-2">共 {records.length} 条</span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Input
            prefix={<Search size={14} className="text-[#8BA3C7]" />}
            placeholder="搜索编号 / 地址 / 提交人"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 240 }}
          />
          <div className="w-px h-6 bg-[#1E3A5F]" />
          <Select
            value={filters.grid || undefined}
            onChange={v => setFilters(f => ({ ...f, grid: v || '' }))}
            placeholder="所属网格"
            allowClear
            style={{ width: 150 }}
            options={gridOptions.map(g => ({ label: g, value: g }))}
          />
          <Select
            value={filters.collectionType || undefined}
            onChange={v => setFilters(f => ({ ...f, collectionType: v || '' }))}
            placeholder="采集类型"
            allowClear
            style={{ width: 120 }}
            options={collectionTypeOptions.map(t => ({ label: t, value: t }))}
          />
          <Select
            value={filters.systemCheck || undefined}
            onChange={v => setFilters(f => ({ ...f, systemCheck: v || '' }))}
            placeholder="系统校验"
            allowClear
            style={{ width: 120 }}
            options={systemCheckOptions.map(s => ({ label: s, value: s }))}
          />
          <Select
            value={filters.reviewStatus || undefined}
            onChange={v => setFilters(f => ({ ...f, reviewStatus: v || '' }))}
            placeholder="审核状态"
            allowClear
            style={{ width: 120 }}
            options={reviewStatusOptions.map(s => ({ label: s, value: s }))}
          />
          <span className="text-xs text-[#8BA3C7] ml-auto">筛选结果：{filtered.length} 条</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 overflow-hidden">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          size="small"
          pagination={{ pageSize: 15, showSizeChanger: false, showTotal: total => `共 ${total} 条` }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: <Empty description="暂无提交记录" />,
          }}
        />
      </div>

      {/* Detail Modal */}
      <Modal
        title={null}
        open={detailModal.visible}
        onCancel={() => setDetailModal({ visible: false, record: null })}
        footer={[
          <Button key="close" onClick={() => setDetailModal({ visible: false, record: null })}>
            关闭
          </Button>,
        ]}
        width={680}
        className="submission-detail-modal"
        styles={{ body: { background: '#0A1628', padding: '0 24px 24px' } }}
      >
        {detailModal.record && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1E3A5F]">
              <div className="w-10 h-10 rounded-full bg-[#00D4FF]/15 flex items-center justify-center">
                <Smartphone size={20} className="text-[#00D4FF]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-[#E8F0FE]">提交详情</h3>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{
                      color: reviewStatusColor[detailModal.record.reviewStatus],
                      backgroundColor: reviewStatusBg[detailModal.record.reviewStatus],
                    }}
                  >
                    {detailModal.record.reviewStatus}
                  </span>
                  {detailModal.record.exceptionTag !== '—' && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[#FF3B5C]/15 text-[#FF3B5C]">
                      <AlertTriangle size={10} />
                      {detailModal.record.exceptionTag}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#00D4FF] font-mono">{detailModal.record.submitNo}</span>
              </div>
            </div>

            {/* Info */}
            <Descriptions column={2} size="small"
              styles={{
                label: { color: '#8BA3C7', fontSize: 12, paddingBottom: 12 },
                content: { color: '#E8F0FE', fontSize: 13, paddingBottom: 12 },
              }}
            >
              <Descriptions.Item label="提交编号" span={2}>
                <span className="font-mono text-[#00D4FF]">{detailModal.record.submitNo}</span>
              </Descriptions.Item>
              <Descriptions.Item label="标准地址" span={2}>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-[#8BA3C7]" />
                  {detailModal.record.standardAddress}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="地址编码">
                <span className="font-mono text-xs text-[#8BA3C7]">{detailModal.record.addressCode}</span>
              </Descriptions.Item>
              <Descriptions.Item label="所属网格">
                <span className="flex items-center gap-1">
                  <Grid3X3 size={12} className="text-[#00D4FF]" />
                  {detailModal.record.gridName}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="提交人">
                <span className="flex items-center gap-1">
                  <User size={12} className="text-[#00D4FF]" />
                  {detailModal.record.submitter}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="提交人电话">
                {detailModal.record.submitterPhone}
              </Descriptions.Item>
              <Descriptions.Item label="采集类型">
                <Tag color={collectionTypeColor[detailModal.record.collectionType]}>
                  {detailModal.record.collectionType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="提交时间">
                {detailModal.record.submitTime}
              </Descriptions.Item>
              <Descriptions.Item label="系统校验">
                <span className="flex items-center gap-1">
                  {detailModal.record.systemCheck === '通过' && <CheckCircle size={12} className="text-[#00FF88]" />}
                  {detailModal.record.systemCheck === '未通过' && <XCircle size={12} className="text-[#FF3B5C]" />}
                  {detailModal.record.systemCheck === '待校验' && <Clock size={12} className="text-[#FF9500]" />}
                  <span style={{ color: systemCheckColor[detailModal.record.systemCheck] }}>
                    {detailModal.record.systemCheck}
                  </span>
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="审核时间">
                {detailModal.record.reviewTime}
              </Descriptions.Item>
            </Descriptions>

            {/* Review Comment */}
            {detailModal.record.reviewComment && (
              <div className="mt-3 p-3 rounded-lg bg-[#112240] border border-[#1E3A5F]">
                <p className="text-xs text-[#8BA3C7] mb-1">审核意见</p>
                <p className="text-sm text-[#E8F0FE]">{detailModal.record.reviewComment}</p>
              </div>
            )}

            {/* Images */}
            <div className="mt-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Image size={14} className="text-[#8BA3C7]" />
                <span className="text-xs text-[#8BA3C7]">现场照片（{detailModal.record.images} 张）</span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: Math.min(detailModal.record.images, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 rounded-lg bg-[#112240] border border-[#1E3A5F] flex items-center justify-center cursor-pointer hover:border-[#00D4FF]/50 transition-colors"
                    onClick={() => setImagePreview({ visible: true, url: `现场照片 ${i + 1}` })}
                  >
                    <Image size={24} className="text-[#8BA3C7]" />
                  </div>
                ))}
                {detailModal.record.images > 4 && (
                  <div className="w-20 h-20 rounded-lg bg-[#112240] border border-[#1E3A5F] flex items-center justify-center text-xs text-[#8BA3C7]">
                    +{detailModal.record.images - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        title={null}
        open={reviewModal.visible}
        onCancel={() => setReviewModal({ visible: false, record: null, comment: '' })}
        footer={null}
        width={520}
        className="submission-detail-modal"
        styles={{ body: { background: '#0A1628', padding: '0 24px 24px' } }}
      >
        {reviewModal.record && (
          <div>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#1E3A5F]">
              <div className="w-10 h-10 rounded-full bg-[#FF9500]/15 flex items-center justify-center">
                <ClipboardCheck size={20} className="text-[#FF9500]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#E8F0FE]">审核提交记录</h3>
                <span className="text-[11px] text-[#00D4FF] font-mono">{reviewModal.record.submitNo}</span>
              </div>
            </div>

            <Descriptions column={1} size="small"
              styles={{
                label: { color: '#8BA3C7', fontSize: 12, paddingBottom: 10 },
                content: { color: '#E8F0FE', fontSize: 13, paddingBottom: 10 },
              }}
            >
              <Descriptions.Item label="标准地址">{reviewModal.record.standardAddress}</Descriptions.Item>
              <Descriptions.Item label="提交人">{reviewModal.record.submitter}（{reviewModal.record.submitterPhone}）</Descriptions.Item>
              <Descriptions.Item label="采集类型">
                <Tag color={collectionTypeColor[reviewModal.record.collectionType]}>{reviewModal.record.collectionType}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="系统校验">
                <span style={{ color: systemCheckColor[reviewModal.record.systemCheck] }}>{reviewModal.record.systemCheck}</span>
              </Descriptions.Item>
            </Descriptions>

            {/* 审核意见 */}
            <div className="mt-2 mb-4">
              <label className="text-xs text-[#8BA3C7] block mb-1.5">审核意见</label>
              <TextArea
                value={reviewModal.comment}
                onChange={e => setReviewModal(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="请输入审核意见（驳回时必填）"
                rows={3}
                className="!bg-[#112240] !border-[#1E3A5F] !text-[#E8F0FE] !placeholder-[#8BA3C7]"
              />
            </div>

            <div className="flex items-center gap-3 justify-end">
              <Button
                onClick={() => setReviewModal({ visible: false, record: null, comment: '' })}
              >
                取消
              </Button>
              <Button
                danger
                type="primary"
                icon={<XCircle size={14} />}
                onClick={() => {
                  if (!reviewModal.comment.trim()) {
                    message.warning('驳回时请填写审核意见');
                    return;
                  }
                  handleReview(reviewModal.record!, '已驳回');
                }}
                style={{ background: '#FF3B5C', borderColor: '#FF3B5C' }}
              >
                驳回
              </Button>
              <Button
                type="primary"
                icon={<CheckCircle size={14} />}
                onClick={() => handleReview(reviewModal.record!, '已通过')}
                style={{ background: '#00FF88', borderColor: '#00FF88', color: '#0A1628' }}
              >
                通过
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        title="现场照片"
        open={imagePreview.visible}
        onCancel={() => setImagePreview({ visible: false, url: '' })}
        footer={null}
        width={400}
        className="submission-detail-modal"
      >
        <div className="flex items-center justify-center h-60 bg-[#112240] rounded-lg border border-[#1E3A5F]">
          <Image size={48} className="text-[#8BA3C7]" />
          <span className="text-xs text-[#8BA3C7] ml-2">{imagePreview.url}</span>
        </div>
      </Modal>

      {/* Styles */}
      <style>{`
        .submission-detail-modal .ant-modal-content {
          background: #0A1628 !important;
          border: 1px solid #1E3A5F;
          border-radius: 12px;
        }
        .submission-detail-modal .ant-modal-header {
          background: #0A1628 !important;
          border-bottom: 1px solid #1E3A5F;
          border-radius: 12px 12px 0 0;
        }
        .submission-detail-modal .ant-modal-close {
          color: #8BA3C7;
        }
        .submission-detail-modal .ant-btn {
          background: #112240;
          border-color: #1E3A5F;
          color: #E8F0FE;
        }
        .submission-detail-modal .ant-btn:hover {
          border-color: #00D4FF;
          color: #00D4FF;
        }
        .submission-detail-modal .ant-descriptions-item-label {
          color: #8BA3C7 !important;
        }
        .submission-detail-modal .ant-descriptions-item-content {
          color: #E8F0FE !important;
        }
        .submission-detail-modal .ant-select {
          color: #E8F0FE;
        }
      `}</style>
    </div>
  );
}
