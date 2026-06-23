import { useState } from 'react';
import { message, Progress } from 'antd';
import {
  AlertCircle, ClipboardList, Search, QrCode, Home, ListChecks, User,
  Bell, MapPin, Clock, ChevronRight, CheckCircle2, Phone, LogOut,
} from 'lucide-react';
import { staff, events } from '@/mock/grid';

type Tab = 'home' | 'tasks' | 'me';

const quickActions = [
  { label: '事件上报', icon: AlertCircle, color: '#FF3B5C', action: () => message.success('已打开事件上报页面') },
  { label: '任务接收', icon: ClipboardList, color: '#00D4FF', action: () => message.info('暂无新任务待接收') },
  { label: '信息查询', icon: Search, color: '#00FF88', action: () => message.info('请输入查询关键词') },
  { label: '扫码核验', icon: QrCode, color: '#FF9500', action: () => message.success('扫码功能已启动') },
];

const myTasks = [
  { id: 1, name: '曲阳路日常巡查', status: '进行中', time: '09:30', progress: 60 },
  { id: 2, name: '人口信息核采', status: '待开始', time: '14:00', progress: 0 },
  { id: 3, name: '占道经营处置', status: '已完成', time: '08:15', progress: 100 },
];

export default function GridMobile() {
  const [tab, setTab] = useState<Tab>('home');
  const worker = staff[0];
  const recentEvents = events.slice(0, 3);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] py-6">
      {/* Phone frame */}
      <div className="relative" style={{ width: 375, height: 720 }}>
        <div className="absolute inset-0 rounded-[2.5rem] border-[10px] border-[#1B3A5C] bg-[#0A1628] shadow-2xl overflow-hidden" style={{ boxShadow: '0 0 60px rgba(0,212,255,0.15)' }}>
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1B3A5C] rounded-b-2xl z-20" />

          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-2 pb-1 text-[11px] text-[#E8F0FE] font-medium relative z-10">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="text-[#00D4FF]">●●●</span>
              <span>5G</span>
              <span className="ml-1 inline-block w-5 h-2.5 border border-[#E8F0FE] rounded-sm relative">
                <span className="absolute inset-0.5 bg-[#00FF88] rounded-sm" style={{ width: '70%' }} />
              </span>
            </span>
          </div>

          {/* Content */}
          <div className="h-[calc(100%-86px)] overflow-y-auto">
            {tab === 'home' && (
              <div className="px-4 pb-4">
                {/* Header */}
                <div className="rounded-2xl p-4 mt-2" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #0066AA 100%)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/80">网格员</p>
                      <p className="text-lg font-bold text-white">{worker.name}</p>
                      <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1"><MapPin size={10} />{worker.gridName}</p>
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">{worker.name[0]}</div>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#00FF88] border-2 border-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-white/15 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{worker.todayTasks}</div>
                      <div className="text-[10px] text-white/80">今日任务</div>
                    </div>
                    <div className="bg-white/15 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{worker.completedTasks}</div>
                      <div className="text-[10px] text-white/80">已完成</div>
                    </div>
                    <div className="bg-white/15 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{Math.round((worker.completedTasks / worker.todayTasks) * 100)}%</div>
                      <div className="text-[10px] text-white/80">完成率</div>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {quickActions.map(a => (
                    <button key={a.label} onClick={a.action} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-[#112240] border border-[#1E3A5F] hover:border-[#00D4FF]/50 transition-colors">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${a.color}20`, color: a.color }}>
                        <a.icon size={20} />
                      </div>
                      <span className="text-[10px] text-[#E8F0FE]">{a.label}</span>
                    </button>
                  ))}
                </div>

                {/* Today tasks preview */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-[#E8F0FE]">今日任务</h4>
                    <button onClick={() => setTab('tasks')} className="text-[10px] text-[#00D4FF] flex items-center gap-0.5">全部 <ChevronRight size={10} /></button>
                  </div>
                  <div className="space-y-2">
                    {myTasks.slice(0, 2).map(t => (
                      <div key={t.id} className="p-3 rounded-xl bg-[#112240] border border-[#1E3A5F]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#E8F0FE] font-medium">{t.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.status === '已完成' ? 'bg-[#00FF88]/20 text-[#00FF88]' : t.status === '进行中' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#FF9500]/20 text-[#FF9500]'}`}>{t.status}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Progress percent={t.progress} size="small" strokeColor={{ from: '#00D4FF', to: '#00FF88' }} />
                          <span className="text-[10px] text-[#8BA3C7] flex items-center gap-0.5"><Clock size={9} />{t.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent events */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-[#E8F0FE] mb-2">网格动态</h4>
                  <div className="space-y-2">
                    {recentEvents.map(e => (
                      <div key={e.id} className="p-2.5 rounded-xl bg-[#112240] border border-[#1E3A5F]">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9500]" />
                          <span className="text-[11px] text-[#E8F0FE] truncate flex-1">{e.description}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 ml-3.5 text-[10px] text-[#8BA3C7]">
                          <MapPin size={9} />{e.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'tasks' && (
              <div className="px-4 pb-4 pt-3">
                <h4 className="text-sm font-semibold text-[#E8F0FE] mb-3">我的任务</h4>
                <div className="space-y-2.5">
                  {myTasks.map(t => (
                    <div key={t.id} className="p-3 rounded-xl bg-[#112240] border border-[#1E3A5F]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#E8F0FE] font-medium">{t.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === '已完成' ? 'bg-[#00FF88]/20 text-[#00FF88]' : t.status === '进行中' ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'bg-[#FF9500]/20 text-[#FF9500]'}`}>{t.status}</span>
                      </div>
                      <Progress percent={t.progress} size="small" strokeColor={{ from: '#00D4FF', to: '#00FF88' }} />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#8BA3C7] flex items-center gap-0.5"><Clock size={10} />{t.time}</span>
                        {t.status !== '已完成'
                          ? <button onClick={() => message.success(`任务「${t.name}」已开始执行`)} className="text-[10px] text-[#00D4FF] px-2 py-1 rounded bg-[#00D4FF]/10">开始执行</button>
                          : <span className="text-[10px] text-[#00FF88] flex items-center gap-0.5"><CheckCircle2 size={10} />已完成</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'me' && (
              <div className="px-4 pb-4 pt-3">
                <div className="flex flex-col items-center mt-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-3xl font-bold text-[#00D4FF]">{worker.name[0]}</div>
                  <p className="text-base font-semibold text-[#E8F0FE] mt-3">{worker.name}</p>
                  <p className="text-xs text-[#8BA3C7] mt-1">{worker.gridName}</p>
                  <span className="mt-2 px-3 py-0.5 rounded-full bg-[#00FF88]/20 text-[#00FF88] text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />在岗中</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-3 rounded-xl bg-[#112240] border border-[#1E3A5F] text-center">
                    <div className="text-lg font-bold text-[#00D4FF]">{worker.todayTasks}</div>
                    <div className="text-[10px] text-[#8BA3C7]">今日任务</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#112240] border border-[#1E3A5F] text-center">
                    <div className="text-lg font-bold text-[#00FF88]">{worker.completedTasks}</div>
                    <div className="text-[10px] text-[#8BA3C7]">已完成</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#112240] border border-[#1E3A5F] text-center">
                    <div className="text-lg font-bold text-[#FF9500]">96</div>
                    <div className="text-[10px] text-[#8BA3C7]">绩效分</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { icon: Bell, label: '消息通知', val: '3条未读' },
                    { icon: Phone, label: '联系网格长', val: worker.phone || '138****8888' },
                    { icon: ClipboardList, label: '历史任务', val: '' },
                    { icon: LogOut, label: '退出登录', val: '' },
                  ].map(item => (
                    <button key={item.label} onClick={() => message.info(`点击了「${item.label}」`)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#112240] border border-[#1E3A5F] hover:border-[#00D4FF]/50 transition-colors">
                      <item.icon size={18} className="text-[#00D4FF]" />
                      <span className="text-sm text-[#E8F0FE] flex-1 text-left">{item.label}</span>
                      {item.val && <span className="text-[10px] text-[#8BA3C7]">{item.val}</span>}
                      <ChevronRight size={14} className="text-[#8BA3C7]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#0D2137] border-t border-[#1E3A5F] flex items-center justify-around z-10">
            {([
              { key: 'home', label: '首页', icon: Home },
              { key: 'tasks', label: '任务', icon: ListChecks },
              { key: 'me', label: '我的', icon: User },
            ] as { key: Tab; label: string; icon: typeof Home }[]).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} className="flex flex-col items-center gap-0.5">
                <t.icon size={20} className={tab === t.key ? 'text-[#00D4FF]' : 'text-[#8BA3C7]'} />
                <span className={`text-[10px] ${tab === t.key ? 'text-[#00D4FF]' : 'text-[#8BA3C7]'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
