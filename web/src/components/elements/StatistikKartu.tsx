'use client';
import React from 'react';

// Definisi data yang dibutuhkan oleh setiap kartu statistik
interface StatistikItem {
  label: string;
  value: string | number;
  color: string;
  iconColor: string;
  icon: React.ReactNode;
}

interface StatistikKartuProps {
  data: StatistikItem[];
}

const StatistikKartu: React.FC<StatistikKartuProps> = ({ data }) => {
  return (
    // 4 Kartu Statistik Utama
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-0">
      {data.map((statistik, i) => (
        <div key={i} className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100 flex gap-5 items-center group hover:shadow-md transition-all">

          {/* Ikon */}
          <div className={`${statistik.color} ${statistik.iconColor} p-2.5 rounded-2xl flex items-center justify-center`}>
            {statistik.icon}
          </div>

          {/* Teks Label dan Nilai */}
          <div>
            <p className="text-slate-500 text-sm font-medium capitalize">{statistik.label}</p>
            <h3 className="text-xl font-extrabold text-slate-800 leading-none mt-2.5">{statistik.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatistikKartu;
