import { useNavigate } from 'react-router-dom';
import { Tag, Button, message, List } from 'antd';
import { FileText, Package, Video, Users, AlertTriangle, Radio, MapPin, ArrowRight, Phone } from 'lucide-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { plans, resources, emergencyEvents } from '@/mock/emergency';
import type { EmergencyPlanLevel, EmergencyEventStatus } from '@/mock/emergency';

const levelColors: Record<EmergencyPlanLevel, string> = {
  'I级': '#FF3B5C', 'II级': '#FF9500', 'III级': '#00D4FF', 'IV级': '#00FF88',
};
const statusColor: Record<EmergencyEventStatus, string> = {
  '接报': 'red', '响应中': 'orange', '处置中': 'processing', '已结束': 'green',
};

export default function EmergencyOverview() {
  const navigate = useNavigate();
  const cameraCount = resources.filter(r => r.type === '摄像头').length;
  const teamCount = resources.filter(r => r.type === '应急队伍').length;
  const recentEvents = [...emergencyEvents].sort((a, b) => b.reportTime.localeCompare(a.reportTime));

  const quickActions = [
    { label: '事件接报', icon: <AlertTriangle size={18} />, color: '#FF3B5C', action: () => message.info('打开事件接报表单') },
    { label: '视频调度', icon: <Video size={18} />, color: '#00D4FF', action: () => navigate('/emergency/map') },
    { label: '人员调度', icon: <Users size={18} />, color: '#00FF88', action: () => navigate('/emergency/map') },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="应急预案数" value={plans.length} icon={<FileText size={22} />} color="#00D4FF" />
        <StatCard title="应急资源数" value={resources.length} icon={<Package size={22} />} color="#FF9500" />
        <StatCard title="在线摄像头" value={cameraCount} icon={<Video size={22} />} color="#00FF88" />
        <StatCard title="应急队伍" value={teamCount} icon={<Users size={22} />} color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {quickActions.map(a => (
          <button
            key={a.label}
            onClick={a.action}
            className="flex items-center gap-4 p-5 rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 hover:border-[#00D4FF]/60 transition-all group"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg" style={{ backgroundColor: `${a.color}20`, color: a.color }}>
              {a.icon}
            </div>
            <div className="text-left">
              <div className="text-base font-semibold text-[#E8F0FE]">{a.label}</div>
              <div className="text-xs text-[#8BA3C7] mt-1 flex items-center gap-1">
                <Radio size={11} /> 点击进入
              </div>
            </div>
            <ArrowRight size={16} className="text-[#8BA3C7] ml-auto group-hover:text-[#00D4FF] transition-colors" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard
          title="最近应急事件"
          extra={<Button type="link" size="small" onClick={() => navigate('/emergency/review')} className="!text-[#00D4FF] !p-0">复盘中心 <ArrowRight size={12} className="inline" /></Button>}
        >
          <List
            dataSource={recentEvents}
            renderItem={(event) => (
              <List.Item className="!border-[#1E3A5F] !px-0">
                <div className="w-full flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0" style={{ backgroundColor: `${levelColors[event.level]}20`, color: levelColors[event.level] }}>
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#E8F0FE] font-medium truncate">{event.name}</span>
                      <Tag color={levelColors[event.level] === '#FF3B5C' ? 'red' : levelColors[event.level] === '#FF9500' ? 'orange' : levelColors[event.level] === '#00D4FF' ? 'blue' : 'green'} style={{ margin: 0 }}>{event.level}</Tag>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[#8BA3C7]">
                      <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                      <span>{event.reportTime}</span>
                    </div>
                  </div>
                  <Tag color={statusColor[event.status]} style={{ margin: 0 }}>{event.status}</Tag>
                </div>
              </List.Item>
            )}
          />
        </ChartCard>

        <ChartCard
          title="应急预案列表"
          extra={<Button type="link" size="small" onClick={() => navigate('/emergency/plans')} className="!text-[#00D4FF] !p-0">全部预案 <ArrowRight size={12} className="inline" /></Button>}
        >
          <List
            dataSource={plans.slice(0, 6)}
            renderItem={(plan) => (
              <List.Item className="!border-[#1E3A5F] !px-0">
                <div className="w-full flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0 bg-[#00D4FF]/20">
                    <FileText size={16} className="text-[#00D4FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#E8F0FE] font-medium truncate">{plan.name}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#8BA3C7]">
                      <span>{plan.type}</span>
                      <span className="flex items-center gap-1"><Phone size={11} />{plan.responsiblePerson}</span>
                    </div>
                  </div>
                  <Tag color={levelColors[plan.level] === '#FF3B5C' ? 'red' : levelColors[plan.level] === '#FF9500' ? 'orange' : levelColors[plan.level] === '#00D4FF' ? 'blue' : 'green'} style={{ margin: 0 }}>{plan.level}</Tag>
                </div>
              </List.Item>
            )}
          />
        </ChartCard>
      </div>
    </div>
  );
}
