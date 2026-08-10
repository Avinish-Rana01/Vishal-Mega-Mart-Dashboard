import React from 'react';
import { Shirt, Layers, ScanLine, TrendingUp, TrendingDown, ArrowDownSquare } from 'lucide-react';
import DetailsModal from '../common/DetailsModal';

const mockArticleData = [
  { sr: 1, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110066191004', desc: 'DRIFTWOOD MEN SHIRT REGULAR BROWN XL', barcode: '10224978', sys: 1, scanned: 0, variance: -1, startDt: 'NA', startTime: 'NA', endDt: 'NA', endTime: 'NA' },
  { sr: 2, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110067129001', desc: 'VIVEZA MEN SHIRT SLIM BLACK S', barcode: '10227628', sys: 1, scanned: 0, variance: -1, startDt: 'NA', startTime: 'NA', endDt: 'NA', endTime: 'NA' },
  { sr: 3, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110065832003', desc: 'DRIFTWOOD MEN SHIRT REGULAR M BLUE L', barcode: '10223907', sys: 3, scanned: 3, variance: 0, startDt: '2026-07-18', startTime: '17:48:27', endDt: '2026-07-18', endTime: '17:48:27' },
  { sr: 4, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110065832004', desc: 'DRIFTWOOD MEN SHIRT REGULAR M BLUE XL', barcode: '10223908', sys: 1, scanned: 1, variance: 0, startDt: '2026-07-18', startTime: '17:48:32', endDt: '2026-07-18', endTime: '17:48:32' },
  { sr: 5, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110066386005', desc: 'DRIFTWOOD MEN SHIRT REGULAR WHITE XXL', barcode: '10225436', sys: 1, scanned: 1, variance: 0, startDt: '2026-07-18', startTime: '17:48:34', endDt: '2026-07-18', endTime: '17:48:34' },
  { sr: 6, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110065845005', desc: 'DRIFTWOOD MEN SHIRT REGULAR L GREY XXL', barcode: '10223939', sys: 1, scanned: 1, variance: 0, startDt: '2026-07-18', startTime: '17:48:34', endDt: '2026-07-18', endTime: '17:48:34' },
  { sr: 7, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110066191003', desc: 'DRIFTWOOD MEN SHIRT REGULAR BROWN L', barcode: '10224977', sys: 1, scanned: 1, variance: 0, startDt: '2026-07-18', startTime: '17:48:36', endDt: '2026-07-18', endTime: '17:48:36' },
  { sr: 8, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110066191002', desc: 'DRIFTWOOD MEN SHIRT REGULAR BROWN M', barcode: '10224976', sys: 1, scanned: 1, variance: 0, startDt: '2026-07-18', startTime: '17:48:36', endDt: '2026-07-18', endTime: '17:48:36' },
  { sr: 9, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110065832002', desc: 'DRIFTWOOD MEN SHIRT REGULAR M BLUE M', barcode: '10223906', sys: 4, scanned: 4, variance: 0, startDt: '2026-07-18', startTime: '17:48:26', endDt: '2026-07-18', endTime: '17:48:26' },
  { sr: 10, ref: '20260718054400', ecode: 'D8', mc: '111010005', mcText: 'MU_CAS SH_F/S_CHECK', article: '1110066718002', desc: 'DRIFTWOOD MEN SHIRT REGULAR M BLUE M', barcode: '10226408', sys: 1, scanned: 1, variance: 0, startDt: '2026-07-18', startTime: '17:48:40', endDt: '2026-07-18', endTime: '17:48:40' }
];

const modalColumns = [
  { key: 'sr', label: 'SR.NO' },
  { key: 'ref', label: 'REFERENCE NO' },
  { key: 'ecode', label: 'ECODE' },
  { key: 'mc', label: 'MC' },
  { key: 'mcText', label: 'MC TEXT' },
  { key: 'article', label: 'ARTICLE' },
  { key: 'desc', label: 'ARTICLE DESCRIPTION' },
  { key: 'barcode', label: 'BARCODE' },
  { key: 'sys', label: 'SYSTEM STOCK' },
  { key: 'scanned', label: 'SCANNED QTY' },
  { key: 'variance', label: 'VARIANCE', render: (val) => <span style={{color: val < 0 ? '#dc2626' : (val > 0 ? '#16a34a' : 'inherit'), fontWeight: val !== 0 ? 'bold' : 'normal'}}>{val}</span> },
  { key: 'startDt', label: 'START DATE' },
  { key: 'startTime', label: 'START TIME' },
  { key: 'endDt', label: 'END DATE' },
  { key: 'endTime', label: 'END TIME' }
];

export default function CycleCountModal({ modalData, onClose }) {
  if (!modalData) return null;

  const metaInfo = [
    { label: 'STORE', value: modalData.STORE_CODE || 'HD44 - UTTAM NAGAR 2', valueColor: '#004cff' },
    { label: 'CYCLE COUNT TYPE', value: modalData.CYCLE_COUNT_TYPE || 'ARTICLE LEVEL', valueColor: '#004cff' },
    { label: 'DATE', value: modalData.DATE ? String(modalData.DATE).split(' ')[0] : '2026-07-18' },
    { label: 'CYCLE COUNT TIME', value: modalData.Time_Taken || '00:54:13' }
  ];

  const summaryCards = [
    { title: "NO OF ARTICLES", value: "95", waveColor: ['#fecaca', '#f87171'], icon: <Shirt size={20} /> },
    { title: "SYSTEM STOCK", value: "448", waveColor: ['#fbcfe8', '#f472b6'], icon: <Layers size={20} /> },
    { title: "SCANNED QTY", value: "436", waveColor: ['#bbf7d0', '#4ade80'], icon: <ScanLine size={20} /> },
    { title: "NET DIFFERENCE", value: "-12", waveColor: ['#fecaca', '#f87171'], icon: <TrendingDown size={20} /> },
    { title: "SHORT QTY", value: "-12", waveColor: ['#d9f99d', '#a3e635'], icon: <ArrowDownSquare size={20} /> },
    { title: "EXCESS QTY", value: "0", waveColor: ['#bfdbfe', '#60a5fa'], icon: <TrendingUp size={20} /> }
  ];

  return (
    <DetailsModal
      title="VIEW DETAILS"
      onClose={onClose}
      metaInfo={metaInfo}
      summaryCards={summaryCards}
      tableColumns={modalColumns}
      tableData={mockArticleData}
      totalRecords={mockArticleData.length}
    />
  );
}
