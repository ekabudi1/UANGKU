import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    return (
        <div 
            className="h-screen w-full flex overflow-hidden" 
            style={{ 
                background: 'linear-gradient(135deg, rgba(56, 24, 3, 1) 0%, rgba(117, 77, 53, 1) 50%, rgba(27, 4, 0, 1) 100%)' 
            }}
        >
            {/* --- SIDEBAR LEFT (STAY / FIXED POSITION) --- */}
           {/* --- SIDEBAR LEFT --- */}
            <nav className="/* 1. Ukuran: Lebar tetap, tinggi otomatis pas layar */
                w-[260px] h-[calc(100vh-20px)] 
                
                /* 2. Layout: Hilangkan scroll, pakai flex-col */
                bg-white p-8 flex flex-col justify-between 
                sticky top-[10px] m-[10px] 
                rounded-[18px] shadow-sm flex-shrink-0 
                
                /* 3. Buang Scrollbar */
                overflow-hidden">
                <div>
                    {/* Logo UANGKU */}
                    <div className="flex justify-center mb-10">
                        <Link href="/">
                            <img src="/assets/logo_uangku.png" alt="Logo UANGKU" className="h-24 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Navigasi Menu */}
                    {/* Navigasi Menu */}
                    <div className="flex flex-col gap-1">
                        
                        {/* DASHBOARD */}
                        <NavLink 
                            href={route('dashboard')} 
                            active={route().current('dashboard')}
                        >
                            <div className={`flex items-center px-4 py-3 text-lg rounded-xl transition-all duration-200 hover:bg-gray-100 ${route().current('dashboard') ? 'font-bold bg-gray-50' : 'font-medium text-gray-600'}`}>
                                <span className="mr-3 text-xl">🏠</span> Dashboard
                            </div>
                        </NavLink>

                        {/* DOMPET - Desain Acuan */}
                        <NavLink 
                            href={route('dompet.index')} 
                            active={route().current('dompet.*')}
                        >
                            <div className={`flex items-center px-4 py-3 text-lg rounded-xl transition-all duration-200 hover:bg-gray-100 ${route().current('dompet.*') ? 'font-bold bg-gray-50' : 'font-medium text-gray-600'}`}>
                                <span className="mr-3 text-xl">📖</span> Dompet
                            </div>
                        </NavLink>

                        {/* TRANSAKSI - Sekarang sudah seragam! */}
                        <NavLink 
                            href={route('transaksi.index')} 
                            active={route().current('transaksi.*')}
                        >
                            <div className={`flex items-center px-4 py-3 text-lg rounded-xl transition-all duration-200 hover:bg-gray-100 ${route().current('transaksi.*') ? 'font-bold bg-gray-50' : 'font-medium text-gray-600'}`}>
                                <span className="mr-3 text-xl">💸</span> Transaksi
                                {/* Transaksi */}
                            </div>
                        </NavLink>

                        {/* LAPORAN */}
                        <NavLink 
                            href={route('laporan.index')} 
                            active={route().current('laporan.index')}
                        >
                            <div className={`flex items-center px-4 py-3 text-lg rounded-xl transition-all duration-200 hover:bg-gray-100 ${
                                route().current('laporan.index') ? 'font-bold bg-gray-50' : 'font-medium text-gray-600'}
                            }`}>
                                <span className="mr-3 text-xl">📊</span> Laporan
                            </div>
                        </NavLink>

                        {/* BUDGETING */}
                        <NavLink 
                            href={route('budgeting.index')} 
                            active={route().current('budgeting.index')}
                        >
                            <div className={`flex items-center px-4 py-3 text-lg rounded-xl transition-all duration-200 hover:bg-gray-100 ${
                                route().current('budgeting.index') 
                                ? 'font-bold bg-gray-50 border-b-2 ' // Tambah border bawah ungu & font bold
                                : 'font-medium text-gray-600'
                            }`}>
                                <span className="mr-3 text-xl">💰</span> 
                                Budgeting
                            </div>
                        </NavLink>
                    </div>
                </div>

                {/* Bottom Menu */}
                <div className="space-y-1 border-t border-gray-100 pt-4">
                    <NavLink href={route('help.index')} active={route().current('help.index')}>
                        <div className="flex items-center py-2 text-lg font-medium text-gray-600">
                            <span className="mr-3 text-xl">❓</span> Bantuan
                        </div>
                    </NavLink>

                    <NavLink href={route('profile.edit')}>
                        <div className="flex items-center py-2 text-lg font-medium text-gray-600">
                            <span className="mr-3 text-xl">⚙️</span> Setting
                        </div>
                    </NavLink>
                </div>
            </nav>

            {/* --- MAIN CONTENT (SCROLLABLE AREA) --- */}
            {/* flex-1 agar mengambil sisa ruang, overflow-y-auto biar area ini aja yang bisa di-scroll */}
            <div className="flex-1 h-screen overflow-y-auto no-scrollbar">
                <main className="pl-4 pt-4 pr-6 pb-10">
                    {children}
                </main>
            </div>
        </div>
    );
}