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
  return (
    <div className={`bg-white p-8 ${rounded} shadow-sm border border-gray-100 ${className}`}>
      {/* Container Judul & Legenda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        {/* Judul & Deskripsi */}
        <div>
          <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium mt-1">{subtitle}</p>
          )}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4">
          {[
            { name: 'Positif', color: '#10b981' },
            { name: 'Netral', color: '#f59e0b' },
            { name: 'Negatif', color: '#ef4444' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-[0.65rem] font-medium text-slate-500 capitalize">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Container Grafik Line Chart */}
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
