import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button } from 'antd';
import { MapPin, CheckCircle, RefreshCw, XCircle, ArrowRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatCard from '@/components/Common/StatCard';
import ChartCard from '@/components/Common/ChartCard';
import { addresses, addressStats } from '@/mock/addresses';
import type { AddressStatus } from '@/mock/addresses';

const statusColor: Record<AddressStatus, string> = {
  '正常': '#00FF88', '变更': '#FF9500', '注销': '#FF3B5C',
};

const darkTooltip = { backgroundColor: '#112240', borderColor: '#1E3A5F', textStyle: { color: '#E8F0FE' } };

export default function AddressOverview() {
  const navigate = useNavigate();
  const recentAddresses = addresses.slice(0, 8);

  const pieOption = {
    tooltip: { ...darkTooltip, trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: '#8BA3C7' }, icon: 'circle' },
    series: [{
      type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
      label: { color: '#E8F0FE', formatter: '{b}: {d}%' },
      data: [
        { name: '行政区划', value: 12, itemStyle: { color: '#00D4FF' } },
        { name: '街路巷', value: 18, itemStyle: { color: '#00FF88' } },
        { name: '门牌号', value: 25, itemStyle: { color: '#FF9500' } },
        { name: '小区', value: 15, itemStyle: { color: '#A855F7' } },
        { name: '楼栋', value: 12, itemStyle: { color: '#FF3B5C' } },
        { name: '梯位', value: 8, itemStyle: { color: '#8B5CF6' } },
        { name: '户室', value: 10, itemStyle: { color: '#06B6D4' } },
      ],
    }],
  };

  const columns = [
    { title: '地址编码', dataIndex: 'code', key: 'code', width: 220, ellipsis: true },
    { title: '完整地址', dataIndex: 'fullAddress', key: 'fullAddress', ellipsis: true },
    { title: '门牌号', dataIndex: 'plateNo', key: 'plateNo', width: 90 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: AddressStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="标准地址总数" value={addressStats.total.toLocaleString()} icon={<MapPin size={22} />} color="#00D4FF" />
        <StatCard title="正常" value={addressStats.normalCount.toLocaleString()} icon={<CheckCircle size={22} />} color="#00FF88" />
        <StatCard title="变更" value={addressStats.changedCount.toLocaleString()} icon={<RefreshCw size={22} />} color="#FF9500" />
        <StatCard title="注销" value={addressStats.cancelledCount.toLocaleString()} icon={<XCircle size={22} />} color="#FF3B5C" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="地址层级分布">
          <ReactECharts option={pieOption} style={{ height: 300 }} />
        </ChartCard>
        <ChartCard title="街路巷地址统计">
          <ReactECharts
            option={{
              tooltip: { ...darkTooltip, trigger: 'axis' as const },
              grid: { left: 50, right: 20, top: 20, bottom: 60 },
              xAxis: { type: 'category' as const, data: addressStats.byStreet.map(d => d.street), axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7', rotate: 35 } },
              yAxis: { type: 'value' as const, axisLine: { lineStyle: { color: '#1E3A5F' } }, axisLabel: { color: '#8BA3C7' }, splitLine: { lineStyle: { color: '#1E3A5F', type: 'dashed' as const } } },
              series: [{ type: 'bar', barWidth: 20, data: addressStats.byStreet.map(d => ({ value: d.count, itemStyle: { color: '#00D4FF' } })) }],
            }}
            style={{ height: 300 }}
          />
        </ChartCard>
      </div>

      <ChartCard
        title="最近地址"
        extra={
          <Button type="link" size="small" onClick={() => navigate('/address/standard')} className="!text-[#00D4FF] !p-0">
            查看全部 <ArrowRight size={12} className="inline" />
          </Button>
        }
      >
        <Table rowKey="id" columns={columns} dataSource={recentAddresses} size="small" pagination={false} scroll={{ x: 800 }} />
      </ChartCard>
    </div>
  );
}
