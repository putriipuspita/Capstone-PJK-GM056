'use client';
import React, { Suspense } from 'react';
import Riwayat from '@/components/users/Riwayat';

export default function Page() {
  return (
    <Suspense fallback={<div>Memuat riwayat...</div>}>
      <Riwayat />
    </Suspense>
  );
}
