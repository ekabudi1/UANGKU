import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, topExpenses, totalSpent, healthStatus, labelHalaman, filters }) {
    
    // Fungsi ganti filter (Minggu/Bulan)
    const changeFilter = (newFilter) => {
        router.get(route('laporan.index'), { filter: newFilter, date: filters.currentDate }, { preserveState: true });
    };

    // Fungsi navigasi tanggal (Prev/Next)
    const navigateDate = (targetDate) => {
        router.get(route('laporan.index'), { filter: filters.currentFilter, date: targetDate }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Keuangan</h2>}
        >
            <Head title="Laporan" />

            <div className="py-12 px-6 max-w-5xl mx-auto flex flex-col gap-10">
                
                {/* --- Container Filter Putih Terpadu --- */}
                <div className="bg-white p-8 rounded-[35px] shadow-sm flex justify-between items-center border border-gray-100">
                    <div className="flex flex-col text-left gap-2">
                        <h1 className="text-black font-inter text-[42px] font-bold leading-tight">
                            Ringkasan Evaluasi
                        </h1>
                        
                        {/* Navigasi History (Minggu/Bulan Lalu) */}
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigateDate(filters.prevDate)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-600"
                            >
                                <span className="text-xl">◀</span>
                            </button>
                            
                            <p className="text-[#757575] font-inter text-[18px] font-semibold min-w-[150px] text-center">
                                {labelHalaman}
                            </p>

                            <button 
                                onClick={() => navigateDate(filters.nextDate)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all text-gray-600"
                            >
                                <span className="text-xl">▶</span>
                            </button>
                        </div>
                    </div>

                    {/* Switcher Filter */}
                    <div className="bg-gray-100 p-1.5 rounded-full flex gap-1 shadow-inner flex-shrink-0">
                        <button 
                            onClick={() => changeFilter('week')}
                            className={`px-8 py-3 rounded-full font-bold text-base transition-all ${filters.currentFilter === 'week' ? 'bg-white shadow-md text-[#365314]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Mingguan
                        </button>
                        <button 
                            onClick={() => changeFilter('month')}
                            className={`px-8 py-3 rounded-full font-bold text-base transition-all ${filters.currentFilter === 'month' ? 'bg-white shadow-md text-[#365314]' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Bulanan
                        </button>
                    </div>
                </div>

                {/* Card Fokus Utama: Total Pengeluaran */}
                <div className="bg-white rounded-[35px] p-12 shadow-sm border border-gray-50 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Total Pengeluaran</p>
                    <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8">
                        Rp{new Intl.NumberFormat('id-ID').format(totalSpent)}
                    </h1>
                    
                    <div className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-black text-lg ${
                        healthStatus === 'Sehat' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        <span className="text-2xl">{healthStatus === 'Sehat' ? '✅' : '⚠️'}</span>
                        Status: {healthStatus}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Ranking 3 Teratas */}
                    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-50">
                        <h4 className="font-bold text-xl mb-6 text-gray-800">Top 3 Pengeluaran</h4>
                        <div className="flex flex-col gap-4">
                            {topExpenses.length > 0 ? topExpenses.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl transition-all hover:bg-gray-100/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#365314] text-white flex items-center justify-center font-bold text-lg">
                                            {index + 1}
                                        </div>
                                        <p className="font-bold text-gray-800">{item.category}</p>
                                    </div>
                                    <p className="font-black text-gray-900">
                                        Rp{new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(item.total_amount)}
                                    </p>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-gray-400 italic">Belum ada transaksi</p>
                            )}
                        </div>
                    </div>

                    {/* Card Ringkasan Evaluasi */}
                    <div className="bg-[#365314] rounded-[30px] p-8 text-white flex flex-col justify-between shadow-lg">
                        <div>
                            <h4 className="font-bold text-xl mb-4 text-orange-300">Tips Evaluasi Keuangan 📊</h4>
                            <p className="text-gray-100 leading-relaxed text-base">
                                {healthStatus === 'Sehat' 
                                    ? "Dompetmu aman terkendali! Sebagian besar pengeluaran masih sesuai rencana budget. Pertahankanritme ini sampai akhir periode." 
                                    : "Waduh, pengeluaranmu sudah melebihi 50% dari daftar budget yang kamu buat. Cek kategori paling boros dan rem dulu belanjaannya!"}
                            </p>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-xs text-gray-300 font-medium italic">
                                *Status dihitung dari jumlah kategori yang melebihi budget bulanan (Rasio &gt; 50% Over Budget).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}