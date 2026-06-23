import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import dayjs from 'dayjs';
import Sidebar from './Sidebar';

interface BreadcrumbMap {
  [key: string]: string;
}

const breadcrumbNameMap: BreadcrumbMap = {
  '/': '综合驾驶舱',
  '/video': '视频资源管理',
  '/video/preview': '视频预览',
  '/video/playback': '视频回放',
  '/video/map': '视频地图',
  '/analysis': '行为分析',
  '/analysis/tasks': '分析任务',
  '/analysis/realtime': '实时分析',
  '/analysis/results': '分析结果',
  '/warning': '预警中心',
  '/warning/rules': '预警规则',
  '/warning/stats': '预警统计',
  '/urban': '城管业务协同',
  '/urban/cases': '案件管理',
  '/urban/patrol': '巡查管理',
  '/urban/stats': '城管统计',
  '/emergency': '应急指挥调度',
  '/emergency/map': '应急地图',
  '/emergency/plans': '应急预案',
  '/emergency/review': '应急复盘',
  '/address': '门牌管理',
  '/address/standard': '地址标准化',
  '/address/plate': '门牌管理',
  '/address/qrcode': '二维码管理',
  '/collection': '一标三实核采',
  '/collection/tasks': '核采任务',
  '/collection/population': '人口信息',
  '/collection/house': '房屋信息',
  '/collection/unit': '单位信息',
  '/collection/flow': '流动人口',
  '/collection/quality': '数据质量',
  '/collection/relation': '关联关系',
  '/grid': '网格化管理',
  '/grid/division': '网格划分',
  '/grid/staff': '网格人员',
  '/grid/tasks': '网格任务',
  '/grid/events': '网格事件',
  '/grid/performance': '绩效考核',
  '/grid/mobile': '移动端',
  '/report': '报表中心',
  '/report/list': '报表列表',
  '/report/custom': '自定义报表',
  '/report/drill': '报表钻取',
};

function buildBreadcrumbs(pathname: string) {
  const items = [{ path: '/', title: '首页' }];
  if (pathname === '/') return items;

  const segments = pathname.split('/').filter(Boolean);
  let currentPath = '';
  for (const segment of segments) {
    currentPath += '/' + segment;
    const title = breadcrumbNameMap[currentPath] || segment;
    items.push({ path: currentPath, title });
  }
  return items;
}

export default function AppLayout() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const breadcrumbItems = buildBreadcrumbs(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A1628]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between h-12 px-5 border-b border-[#1E3A5F] bg-[#0D2137] shrink-0">
          <Breadcrumb
            items={breadcrumbItems.map((item) => ({
              title: item.title,
            }))}
          />
          <span className="text-sm text-[#8BA3C7] font-mono">{currentTime}</span>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
