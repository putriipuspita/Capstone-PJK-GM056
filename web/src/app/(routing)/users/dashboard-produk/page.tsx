'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardProduk from '@/components/users/DashboardProduk';

function KontenDashboardProduk() {
  const paramPencarian = useSearchParams();
  const namaProduk = paramPencarian.get('p') || 'Produk Tanpa Nama';
  
  return <DashboardProduk namaProduk={namaProduk} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 font-medium">Memuat Analisis...</div>}>
      <KontenDashboardProduk />
    </Suspense>
  );
}
