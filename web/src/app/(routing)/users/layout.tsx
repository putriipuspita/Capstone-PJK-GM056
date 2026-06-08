'use client';

import { useState } from 'react';
import Sidebar from '@/components/navigasi/Sidebar';
import Navbar from '@/components/navigasi/Navbar';

export default function TataLetakDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Wrapper - Handles Responsive Visibility */}
      <div className={`
        fixed inset-y-0 left-0 z-[1000] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
