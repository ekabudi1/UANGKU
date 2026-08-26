import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

export default function HelpIndex({ auth }) {
    const [activeId, setActiveId] = useState(null);

    // 1. Edit di bagian array data ini (tambah property 'type')
    const helpData = [
        {
            id: 1,
            category: "Panduan Cepat",
            icon: "🚀",
            questions: [
                { q: "Gimana cara buat Budget?", a: "Pergi ke menu 'Budget', pilih 'Tambah Budget', lalu tentukan kategori dan limit maksimal pengeluaranmu." },
                { q: "Status 'Tidak Sehat' itu apa?", a: "Itu tandanya lebih dari 50% kategori pengeluaranmu sudah melewati batas budget yang kamu tentukan bulan ini." }
            ]
        },
        {
            id: 2,
            category: "Tips & Trik Keuangan",
            icon: "💡",
            questions: [
                { q: "Aturan 50/30/20", a: "Sisihkan 50% untuk kebutuhan pokok, 30% untuk keinginan, dan 20% untuk tabungan atau dana darurat." },
                { q: "Tips Hemat buat Ojol/Kurir", a: "Pisahkan saldo dompet khusus untuk operasional (bensin/servis) agar tidak tercampur dengan uang makan harian." }
            ]
        },
        {
            id: 3,
            category: "Kamus Istilah",
            icon: "📖",
            questions: [
                { q: "Apa itu Saldo Awal?", a: "Jumlah uang tunai atau saldo bank yang kamu miliki saat pertama kali mendaftarkan dompet di aplikasi ini." },
                { q: "Apa itu Over Budget?", a: "Kondisi saat pengeluaran di kategori tertentu sudah melewati batas (limit) yang sudah kamu tetapkan." }
            ]
        },
        {
            id: 4,
            category: "Hubungi Pengembang",
            icon: "📞",
            questions: [
                { 
                    q: "Mau lapor Bug atau error?", 
                    a: "Kamu bisa hubungi lewat WhatsApp admin atau klik tombol di bawah untuk kirim email langsung.",
                    type: "bug" 
                },
                { 
                    q: "Bisa request fitur baru?", 
                    a: "Sangat bisa! Kami terbuka untuk fitur yang mendukung efisiensi mahasiswa dan driver online.",
                    type: "request"
                }
            ]
        }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Pusat Bantuan" />

            <div className="py-12 px-6 max-w-4xl mx-auto flex flex-col gap-10">
                <div className="bg-white p-10 rounded-[35px] shadow-sm border border-gray-100 text-center">
                    <h1 className="text-black font-inter text-[42px] font-bold leading-tight mb-2">
                        Pusat Bantuan 💁‍♂️
                    </h1>
                    <p className="text-[#757575] font-inter text-[18px] font-medium">
                        Butuh bantuan navigasi atau tips kelola cuan?
                    </p>
                </div>

                <div className="space-y-6">
                    {helpData.map((section) => (
                        <div key={section.id} className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-50">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">{section.category}</h2>
                            </div>
                            
                            <div className="grid gap-3">
                                {section.questions.map((item, idx) => {
                                    const itemId = `${section.id}-${idx}`;
                                    const isOpen = activeId === itemId;
                                    
                                    return (
                                        <div key={itemId} className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'border-[#365314] bg-[#f8faf5]' : 'border-gray-100 bg-white'}`}>
                                            <button 
                                                onClick={() => setActiveId(isOpen ? null : itemId)}
                                                className="w-full flex justify-between items-center p-5 text-left"
                                            >
                                                <span className={`font-bold text-lg ${isOpen ? 'text-[#365314]' : 'text-gray-700'}`}>
                                                    {item.q}
                                                </span>
                                                <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#365314]' : 'text-gray-400'}`}>
                                                    ▼
                                                </span>
                                            </button>
                                            
                                            {isOpen && (
                                                <div className="px-5 pb-5 text-gray-600 leading-relaxed font-medium animate-fadeIn">
                                                    <p className={section.id === 4 ? "mb-4" : ""}>{item.a}</p>
                                                    
                                                    {/* 2. Logic Tombol Gmail Otomatis */}
                                                    {section.id === 4 && (
                                                        <a 
                                                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=ekabudip795@gmail.com&su=${
                                                                item.type === 'bug' ? 'KERJA WOYY' : 'REQUESTNYA QAQA'
                                                            }`}
                                                            target="_blank"
                                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#365314] text-white rounded-2xl text-sm font-bold hover:bg-[#2d4511] transition-all shadow-md"
                                                        >
                                                            📩 Kirim Email Sekarang
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center pb-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                        Uangku Financial Assistant v1.0.0
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}