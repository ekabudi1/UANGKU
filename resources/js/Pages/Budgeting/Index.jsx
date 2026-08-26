import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, budgets }) {
    const [showModal, setShowModal] = useState(false);

    // Logic Form Inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        category_name: '',
        limit_amount: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('budgeting.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Budgeting</h2>}
        >
            <Head title="Budgeting" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-2">
                    
                    {/* Header Section */}
                    <div className="bg-white p-8 rounded-[35px] shadow-sm mb-10 flex justify-between items-center border border-gray-100">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-2">Budgeting</h1>
                            <p className="text-gray-500 text-lg">Atur batas pengeluaranmu di sini.</p>
                        </div>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-[20px] font-bold transition-all shadow-md text-lg"
                        >
                            + Tambah Budget
                        </button>
                    </div>

                    {/* Grid Budget Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets && budgets.length > 0 ? (
                            budgets.map((budget) => (
                                <div key={budget.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-orange-100 rounded-2xl text-2xl">💰</div>
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-lg">{budget.category_name}</h3>
                                                <p className="text-sm text-gray-400 font-medium">Bulan Ini</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500 font-medium">Terpakai</span>
                                            <span className={`font-bold ${budget.is_over ? 'text-red-500' : 'text-gray-700'}`}>
                                                Rp {new Intl.NumberFormat('id-ID').format(budget.spent)} / Rp {new Intl.NumberFormat('id-ID').format(budget.limit_amount)}
                                            </span>
                                        </div>
                                        
                                        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-700 rounded-full ${budget.is_over ? 'bg-red-500' : 'bg-orange-400'}`}
                                                style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs font-bold text-gray-400">{budget.percentage}% Terpakai</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${budget.is_over ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {budget.is_over ? 'Over Budget' : 'Aman'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-white p-10 rounded-[30px] text-center border border-gray-100 shadow-sm">
                                <span className="text-5xl mb-4 block">📭</span>
                                <h3 className="text-xl font-bold text-gray-800">Belum ada budget</h3>
                                <p className="text-gray-500">Klik tombol di atas untuk membuat rencana keuanganmu.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Input Tambah Budget */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[30px] p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Buat Budget Baru</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kategori</label>
                                <input 
                                    type="text"
                                    className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="Contoh: Makan, Bensin, dll"
                                    value={data.category_name}
                                    onChange={e => setData('category_name', e.target.value)}
                                    required
                                />
                                {errors.category_name && <p className="text-red-500 text-xs mt-1">{errors.category_name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Limit Anggaran (Rp)</label>
                                <input 
                                    type="number"
                                    className="w-full border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                                    placeholder="0"
                                    value={data.limit_amount}
                                    onChange={e => setData('limit_amount', e.target.value)}
                                    required
                                />
                                {errors.limit_amount && <p className="text-red-500 text-xs mt-1">{errors.limit_amount}</p>}
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}