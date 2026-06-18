'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export interface TrenSentimenItem {
  name: string; // Bisa tanggal (misal '25 Apr') atau bulan (misal 'Jan')
  positif: number;
  netral: number;
  negatif: number;
}

interface GrafikTrenSentimenProps {
  data: TrenSentimenItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  rounded?: string;
}

const GrafikTrenSentimen: React.FC<GrafikTrenSentimenProps> = ({
  data,
  title = 'Tren Sentimen',
  subtitle = 'Perkembangan sentimen ulasan dari waktu ke waktu',
  className = '',
  rounded = 'rounded-3xl',
}) => {
  const [isMounted, setIsMounted] = React.useState(false);
  type FilterWaktuType = '1 Bulan Terakhir' | '3 Bulan Terakhir' | '1 Tahun Terakhir';
  const [filterWaktu, setFilterWaktu] = React.useState<FilterWaktuType>('1 Tahun Terakhir');

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Validasi dan pengurutan data berdasarkan tanggal
  const validDates = React.useMemo(() => {
    return data
      .filter(d => !isNaN(new Date(d.name).getTime()))
      .map(d => new Date(d.name).getTime());
  }, [data]);

  const maxDate = React.useMemo(() => {
    if (validDates.length === 0) return Date.now();
    return Math.max(...validDates);
  }, [validDates]);

  // Menentukan filter mana yang tersedia berdasarkan rentang waktu
  const availableFilters = React.useMemo(() => {
    if (validDates.length < 2) return ['1 Bulan Terakhir'];
    const minDate = Math.min(...validDates);
    const diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);

    const filters: FilterWaktuType[] = ['1 Bulan Terakhir'];
    if (diffDays >= 30) filters.push('3 Bulan Terakhir');
    if (diffDays >= 90) filters.push('1 Tahun Terakhir');
    return filters;
  }, [validDates, maxDate]);

  // Pastikan filter aktif selalu tersedia di dalam availableFilters
  React.useEffect(() => {
    if (!availableFilters.includes(filterWaktu as any)) {
      setFilterWaktu(availableFilters[availableFilters.length - 1]);
    }
  }, [availableFilters, filterWaktu]);

  // Fungsi Agregasi Data
  const aggregatedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (validDates.length < data.length * 0.5) return data; // Jika mayoritas bukan tanggal valid, fallback ke raw data

    // Hitung cutoff date berdasarkan filter
    let cutoffDays = 365;
    if (filterWaktu === '1 Bulan Terakhir') cutoffDays = 30;
    else if (filterWaktu === '3 Bulan Terakhir') cutoffDays = 90;
    else if (filterWaktu === '1 Tahun Terakhir') cutoffDays = 365;

    const cutoffTimestamp = maxDate - (cutoffDays * 24 * 60 * 60 * 1000);

    const aggregated: Record<string, { positif: number; netral: number; negatif: number; timestamp: number }> = {};

    data.forEach(item => {
      const d = new Date(item.name);
      const timestamp = d.getTime();
      
      // Abaikan data yang di luar rentang waktu (sebelum cutoff atau tanggal tidak valid)
      if (isNaN(timestamp) || timestamp < cutoffTimestamp) return;

      let key = item.name;
      let aggTimestamp = timestamp;

      if (filterWaktu === '1 Bulan Terakhir') {
        // x-axis: Harian
        key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      } else if (filterWaktu === '3 Bulan Terakhir') {
        // x-axis: Mingguan
        const day = d.getDay() || 7; 
        const startOfWeek = new Date(d);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(d.getDate() - day + 1);
        key = `Minggu ${startOfWeek.getDate()} ${startOfWeek.toLocaleDateString('id-ID', { month: 'short' })}`;
        aggTimestamp = startOfWeek.getTime();
      } else if (filterWaktu === '1 Tahun Terakhir') {
        // x-axis: Bulanan
        key = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        aggTimestamp = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      }

      if (!aggregated[key]) {
        aggregated[key] = { positif: 0, netral: 0, negatif: 0, timestamp: aggTimestamp };
      }
      aggregated[key].positif += item.positif;
      aggregated[key].netral += item.netral;
      aggregated[key].negatif += item.negatif;
    });

    return Object.entries(aggregated)
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .map(([name, vals]) => ({
        name,
        positif: vals.positif,
        netral: vals.netral,
        negatif: vals.negatif
      }));
  }, [data, filterWaktu, validDates, maxDate]);

  if (!isMounted) {
    return (
      <div className={`bg-white p-8 ${rounded} shadow-sm border border-gray-100 ${className}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="h-[240px] w-full animate-pulse bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-sm font-medium">
          Memuat Grafik...
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-8 ${rounded} shadow-sm border border-gray-100 ${className}`}>
      {/* Container Judul & Legenda */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        {/* Judul & Deskripsi */}
        <div className="flex-1">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium mt-1">{subtitle}</p>
          )}
        </div>

        {/* Kontrol Filter Waktu & Legenda */}
        <div className="flex flex-col items-start md:items-end gap-4">
          {/* Filter Waktu (Harian, Mingguan, dll) */}
          {availableFilters.length > 1 && (
            <div className="flex bg-slate-100/80 p-1 rounded-lg">
              {availableFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterWaktu(f as any)}
                  className={`px-3 py-1 text-xs font-bold capitalize rounded-md transition-all ${
                    filterWaktu === f
                      ? 'bg-white text-hero shadow-sm border border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Legenda */}
          <div className="flex items-center gap-4">
            {[
              { name: 'Positif', color: '#10b981' },
              { name: 'Netral', color: '#f59e0b' },
              { name: 'Negatif', color: '#ef4444' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-[0.65rem] font-bold text-slate-500 capitalize">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Container Grafik Line Chart */}
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregatedData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            {/* Grid & Sumbu */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />

            {/* Label Sumbu X */}
            <XAxis
              dataKey="name"
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
              dy={10}
            />

            {/* Label Sumbu Y */}
            <YAxis
              axisLine={{ stroke: '#e2e8f0', strokeWidth: 1 }}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
            />

            {/* Menampilkan Kotak Informasi Saat Hover */}
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px' }}
              labelStyle={{ fontWeight: 700, color: '#000000', marginBottom: '4px' }}
            />

            {/* Garis Grafik Positif */}
            <Line
              type="monotone"
              dataKey="positif"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 3, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#000000', stroke: '#000000' }}
            />

            {/* Garis Grafik Netral */}
            <Line
              type="monotone"
              dataKey="netral"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#000000', stroke: '#000000' }}
            />

            {/* Garis Grafik Negatif */}
            <Line
              type="monotone"
              dataKey="negatif"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#000000', stroke: '#000000' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrafikTrenSentimen;
