'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardProduk from '@/components/users/DashboardProduk';

function KontenDashboardProduk() {
  const paramPencarian = useSearchParams();
  const namaProduk = paramPencarian.get('p') || 'Produk Tanpa Nama';
  const analysisId = paramPencarian.get('id') || '';
  const productId = paramPencarian.get('product_id') || '';
  
  return <DashboardProduk analysisId={analysisId} productId={productId} namaProduk={namaProduk} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 font-medium">Memuat Analisis...</div>}>
      <KontenDashboardProduk />
    </Suspense>
  );
}
