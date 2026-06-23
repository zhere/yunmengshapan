import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Brain,
  AlertTriangle,
  Building2,
  Siren,
  MapPin,
  ClipboardList,
  Grid3X3,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  Monitor,
} from 'lucide-react';

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: '综合驾驶舱', icon: <LayoutDashboard size={20} />, path: '/' },
  { key: 'video', label: '视频资源管理', icon: <Video size={20} />, path: '/video' },
  { key: 'analysis', label: '行为分析', icon: <Brain size={20} />, path: '/analysis' },
  { key: 'warning', label: '预警中心', icon: <AlertTriangle size={20} />, path: '/warning' },
  { key: 'urban', label: '城管业务协同', icon: <Building2 size={20} />, path: '/urban' },
  { key: 'emergency', label: '应急指挥调度', icon: <Siren size={20} />, path: '/emergency' },
  { key: 'address', label: '门牌管理', icon: <MapPin size={20} />, path: '/address' },
  { key: 'collection', label: '一标三实核采', icon: <ClipboardList size={20} />, path: '/collection' },
  { key: 'grid', label: '网格化管理', icon: <Grid3X3 size={20} />, path: '/grid' },
  { key: 'report', label: '报表中心', icon: <BarChart3 size={20} />, path: '/report' },
];

function getActiveKey(pathname: string): string {
  if (pathname === '/') return 'dashboard';
  const segment = '/' + pathname.split('/')[1];
  const found = navItems.find((item) => item.path === segment);
  return found ? found.key : '';
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = getActiveKey(location.pathname);

  return (
    <aside
      className="flex flex-col h-full bg-[#0D2137] border-r border-[#1E3A5F] transition-all duration-300 ease-in-out shrink-0"
      style={{ width: collapsed ? 64 : 220 }}
    >
      {/* Logo / Title */}
      <div className="flex items-center h-14 px-4 border-b border-[#1E3A5F] shrink-0 overflow-hidden">
        <Monitor size={24} className="text-[#00D4FF] shrink-0" />
        {!collapsed && (
          <span className="ml-3 text-sm font-bold text-[#E8F0FE] whitespace-nowrap truncate">
            云梦县综合业务分析系统
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <div
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`
                flex items-center h-11 mx-2 px-3 rounded cursor-pointer
                transition-all duration-200 group
                ${isActive
                  ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-l-2 border-[#00D4FF]'
                  : 'text-[#8BA3C7] hover:bg-[#112240] hover:text-[#E8F0FE]'
                }
              `}
              title={collapsed ? item.label : undefined}
            >
              <span className={`shrink-0 ${isActive ? 'text-[#00D4FF]' : 'text-[#8BA3C7] group-hover:text-[#E8F0FE]'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="ml-3 text-sm whitespace-nowrap truncate">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="shrink-0 border-t border-[#1E3A5F] p-2">
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-9 rounded cursor-pointer text-[#8BA3C7] hover:bg-[#112240] hover:text-[#E8F0FE] transition-colors"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </div>
      </div>
    </aside>
  );
}
