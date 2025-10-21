import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

function Layout() {
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <Navbar />
      <main>
        {/* Di sinilah konten halaman (HomePage, dll.) akan ditampilkan */}
        <Outlet /> 
      </main>
    </div>
  );
}
export default Layout;