import { useState } from 'react';
import { Steps, Button, Descriptions, Tag, Space, message } from 'antd';
import { Image as ImageIcon } from 'lucide-react';
import type { Warning, WarningStatus } from '@/mock/warnings';

const levelColor: Record<string, string> = { '高': '#FF3B5C', '中': '#FF9500', '低': '#00D4FF' };

const statusStepMap: Record<WarningStatus, number> = {
  '待处置': 0, '已派发': 1, '处置中': 2, '已反馈': 3, '已闭环': 4,
};

const stepLabels = ['接收', '派发', '处置', '反馈', '闭环'];

interface Props {
  warning: Warning;
  onClose: () => void;
  onStatusChange?: (newStatus: WarningStatus) => void;
}

export default function WarningDetail({ warning, onClose, onStatusChange }: Props) {
  const [currentStatus, setCurrentStatus] = useState<WarningStatus>(warning.status);
  const currentStep = statusStepMap[currentStatus];

  const advanceStatus = (nextStatus: WarningStatus, label: string) => {
    setCurrentStatus(nextStatus);
    onStatusChange?.(nextStatus);
    message.success(`已${label}`);
  };

  const actionButtons: Record<number, { label: string; next: WarningStatus } | null> = {
    0: { label: '派发', next: '已派发' },
    1: { label: '处置', next: '处置中' },
    2: { label: '反馈', next: '已反馈' },
    3: { label: '闭环', next: '已闭环' },
  };

  return (
    <div className="space-y-5">
      <Descriptions column={2} size="small" bordered
        labelStyle={{ background: '#0D2137', color: '#8BA3C7', borderBlockColor: '#1E3A5F' }}
        contentStyle={{ background: 'transparent', color: '#E8F0FE', borderBlockColor: '#1E3A5F' }}
      >
        <Descriptions.Item label="事件类型">{warning.type}</Descriptions.Item>
        <Descriptions.Item label="子类型">{warning.subType}</Descriptions.Item>
        <Descriptions.Item label="预警级别">
          <Tag color={levelColor[warning.level] === '#FF3B5C' ? 'red' : levelColor[warning.level] === '#FF9500' ? 'orange' : 'blue'}>
            {warning.level}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="发生时间">{warning.time}</Descriptions.Item>
        <Descriptions.Item label="地点" span={2}>{warning.location}</Descriptions.Item>
        <Descriptions.Item label="采集设备" span={2}>{warning.deviceName}</Descriptions.Item>
        <Descriptions.Item label="事件描述" span={2}>{warning.description}</Descriptions.Item>
      </Descriptions>

      <div>
        <p className="text-xs text-[#8BA3C7] mb-2">事件截图</p>
        <div className="w-full h-40 rounded bg-[#0A1628] border border-[#1E3A5F] flex flex-col items-center justify-center gap-2">
          <ImageIcon size={36} className="text-[#1E3A5F]" />
          <span className="text-sm text-[#8BA3C7]">事件截图占位</span>
        </div>
      </div>

      <div>
        <p className="text-xs text-[#8BA3C7] mb-3">处置流程</p>
        <Steps current={currentStep} size="small"
          items={stepLabels.map(label => ({
            title: <span className="text-[#E8F0FE]">{label}</span>,
          }))}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Space>
          {currentStep < 4 && actionButtons[currentStep] && (
            <Button type="primary" onClick={() => advanceStatus(actionButtons[currentStep]!.next, actionButtons[currentStep]!.label)}>
              {actionButtons[currentStep]!.label}
            </Button>
          )}
          <Button onClick={onClose}>关闭</Button>
        </Space>
      </div>
    </div>
  );
}
