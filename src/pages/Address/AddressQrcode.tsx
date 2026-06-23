import { useState, useMemo } from 'react';
import { Select, Button, message, Divider } from 'antd';
import { Search, Download, Printer, QrCode, MapPin, User, Users, FileText } from 'lucide-react';
import { addresses } from '@/mock/addresses';
import type { Address } from '@/mock/addresses';

// 生成模拟二维码图案（伪随机但稳定）
function generateQrMatrix(seed: string): boolean[][] {
  const size = 21;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) & 0x7fffffff;
  const matrix: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
      row.push((hash >> 16) % 100 < 48);
    }
    matrix.push(row);
  }
  // 三个定位角
  const setCorner = (sr: number, sc: number) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
      const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      matrix[sr + r][sc + c] = onBorder || inner;
    }
  };
  setCorner(0, 0); setCorner(0, size - 7); setCorner(size - 7, 0);
  return matrix;
}

export default function AddressQrcode() {
  const [selectedId, setSelectedId] = useState<string>(addresses[0].id);
  const selected: Address = useMemo(
    () => addresses.find(a => a.id === selectedId) || addresses[0],
    [selectedId],
  );
  const matrix = useMemo(() => generateQrMatrix(selected.code), [selected.code]);

  const handleDownload = () => message.success(`门牌已下载：${selected.fullAddress}`);
  const handlePrint = () => message.success('已发送至打印队列');

  return (
    <div className="flex gap-4 h-full">
      {/* 左侧：地址选择 + 门牌预览 */}
      <div className="w-[420px] shrink-0 space-y-4">
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="text-[#00D4FF]" />
            <span className="text-sm font-semibold text-[#E8F0FE]">选择地址</span>
          </div>
          <Select
            showSearch
            value={selectedId}
            onChange={setSelectedId}
            style={{ width: '100%' }}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            options={addresses.slice(0, 40).map(a => ({ value: a.id, label: a.fullAddress }))}
          />
        </div>

        {/* 门牌预览 */}
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-xs text-[#8BA3C7] mb-3">门牌预览</p>
          <div className="rounded-lg border-2 border-[#00D4FF]/40 bg-[#0A1628] p-5">
            <div className="text-center mb-3">
              <div className="text-[10px] text-[#8BA3C7] tracking-widest">YUNMENG · 云梦县</div>
              <div className="text-lg font-bold text-[#00D4FF] mt-1">标准门牌</div>
            </div>
            <Divider className="!my-3 !border-[#1E3A5F]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[#E8F0FE] font-[Orbitron]">{selected.plateNo}</div>
              <div className="text-xs text-[#8BA3C7] mt-2 px-2 leading-relaxed">{selected.fullAddress}</div>
            </div>
            <Divider className="!my-3 !border-[#1E3A5F]" />
            <div className="text-center text-[10px] text-[#8BA3C7]">编码：{selected.code}</div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="primary" icon={<Download size={14} />} onClick={handleDownload} style={{ background: '#00D4FF', borderColor: '#00D4FF' }} className="flex-1">下载门牌</Button>
            <Button icon={<Printer size={14} />} onClick={handlePrint} className="flex-1">打印</Button>
          </div>
        </div>
      </div>

      {/* 右侧：二维码 + 扫码信息 */}
      <div className="flex-1 space-y-4">
        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <div className="flex items-center gap-2 mb-4">
            <QrCode size={18} className="text-[#00D4FF]" />
            <span className="text-sm font-semibold text-[#E8F0FE]">二维码门牌</span>
          </div>
          <div className="flex gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="grid" style={{ gridTemplateColumns: `repeat(21, 8px)`, gap: 0 }}>
                {matrix.map((row, ri) => row.map((cell, ci) => (
                  <div key={`${ri}-${ci}`} style={{ width: 8, height: 8, background: cell ? '#000' : '#fff' }} />
                )))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#8BA3C7] mb-2">扫码内容预览</p>
              <div className="p-3 rounded bg-[#0A1628] border border-[#1E3A5F] text-xs text-[#E8F0FE] font-mono break-all">
                https://ymgov.cn/addr?code={selected.code}
              </div>
              <p className="text-xs text-[#8BA3C7] mt-3 mb-2">门牌信息</p>
              <div className="space-y-1 text-xs text-[#E8F0FE]">
                <div>门牌号：<span className="text-[#00D4FF]">{selected.plateNo}</span></div>
                <div>地址：<span className="text-[#8BA3C7]">{selected.fullAddress}</span></div>
                <div>状态：<span className="text-[#00FF88]">{selected.status}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#1E3A5F] bg-[#0D2137]/80 p-4">
          <p className="text-sm font-semibold text-[#E8F0FE] mb-4">扫码模拟展示</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0A1628]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[#00D4FF]" />
                <span className="text-sm text-[#E8F0FE]">地址信息</span>
              </div>
              <p className="text-xs text-[#8BA3C7]">{selected.fullAddress}</p>
              <p className="text-xs text-[#8BA3C7] mt-1">编码：{selected.code}</p>
            </div>
            <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0A1628]">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-[#FF9500]" />
                <span className="text-sm text-[#E8F0FE]">辖区民警</span>
              </div>
              <p className="text-xs text-[#8BA3C7]">张伟 警官</p>
              <p className="text-xs text-[#8BA3C7] mt-1">电话：138****8888</p>
            </div>
            <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0A1628]">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-[#00FF88]" />
                <span className="text-sm text-[#E8F0FE]">网格员</span>
              </div>
              <p className="text-xs text-[#8BA3C7]">李强</p>
              <p className="text-xs text-[#8BA3C7] mt-1">曲阳社区第一网格</p>
            </div>
            <div className="p-4 rounded-lg border border-[#1E3A5F] bg-[#0A1628]">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-[#A855F7]" />
                <span className="text-sm text-[#E8F0FE]">政务服务</span>
              </div>
              <p className="text-xs text-[#8BA3C7]">户籍办理 · 居住证申领</p>
              <p className="text-xs text-[#8BA3C7] mt-1">便民服务一键直达</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
