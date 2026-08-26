import { Link, Head } from '@inertiajs/react';
import LogoUangku from '/public/assets/logo_uangku.png'; // Sesuaikan path logo lo

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-[#413123] font-inter text-white selection:bg-[#365314]">
            <Head title="Selamat Datang di Uangku" />

            {/* --- NAVBAR --- */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <img src={LogoUangku} alt="Logo" className="h-10 w-auto" />
                    <span className="text-2xl font-black tracking-tight">Uangku.</span>
                </div>
                
                <div className="space-x-8 font-bold text-sm uppercase tracking-widest opacity-90">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="hover:text-[#365314] transition-colors">Dashboard</Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="hover:text-[#365314] transition-colors">Masuk</Link>
                            <Link 
                                href={route('register')} 
                                className="bg-white text-[#413123] px-6 py-3 rounded-full hover:bg-gray-200 transition-all shadow-xl"
                            >
                                Daftar Gratis
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center text-center">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-gray-300">
                    🚀 Versi 1.0.0 Sudah Tersedia
                </div>
                
                <h1 className="text-7xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                    Kelola Cuan <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                        Tanpa Ribet.
                    </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-2xl mb-12 font-medium leading-relaxed opacity-80">
                    Aplikasi finansial yang didesain khusus buat mahasiswa dan pekerja keras. Pantau pengeluaran, atur budget, dan capai kebebasan finansial lo dari sekarang.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        href={route('register')}
                        className="px-10 py-5 bg-[#365314] hover:bg-[#2d4511] text-white rounded-[30px] font-black text-xl shadow-2xl shadow-[#365314]/40 transition-all transform hover:scale-105 active:scale-95"
                    >
                        MULAI SEKARANG — GRATIS!
                    </Link>
                </div>
                
            </main>

            {/* --- FEATURES --- */}
            <section className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    title="Budgeting Cerdas" 
                    desc="Atur jatah makan, bensin, dan cicilan lo dengan sistem pos keuangan yang rapi."
                    icon="💰"
                />
                <FeatureCard 
                    title="Analisis Instan" 
                    desc="Lihat kemana uang lo lari lewat grafik yang nggak bikin pusing kepala."
                    icon="📊"
                />
                <FeatureCard 
                    title="Aman & Cepat" 
                    desc="Data lo aman tersimpan, akses kapan saja lewat perangkat apa saja."
                    icon="🔒"
                />
            </section>

            {/* --- FOOTER --- */}
            <footer className="text-center py-12 border-t border-white/10 opacity-50 text-xs font-bold uppercase tracking-widest">
                &copy; 2026 Uangku Financial Assistant. All Rights Reserved.
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc, icon }) {
    return (
        <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] hover:bg-white/10 transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-300">{icon}</div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
        </div>
    );
}