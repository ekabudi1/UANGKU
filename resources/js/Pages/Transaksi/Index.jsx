import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, transactions, wallets }) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // --- LOGIKA SUMMARY CARD ---
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    // --- LOGIKA STACKED BAR CHART ---
    const getStackedChartData = () => {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const dailyData = {
            'Sen': { income: 0, expense: 0 },
            'Sel': { income: 0, expense: 0 },
            'Rab': { income: 0, expense: 0 },
            'Kam': { income: 0, expense: 0 },
            'Jum': { income: 0, expense: 0 },
            'Sab': { income: 0, expense: 0 },
            'Min': { income: 0, expense: 0 },
        };

        transactions.forEach(t => {
            const dayName = days[new Date(t.date).getDay()];
            if (dailyData[dayName]) {
                if (t.type === 'expense') {
                    dailyData[dayName].expense += Number(t.amount);
                } else {
                    dailyData[dayName].income += Number(t.amount);
                }
            }
        });

        const maxAmount = Math.max(
            ...Object.values(dailyData).map(d => d.income + d.expense), 
            100000 
        );

        return Object.keys(dailyData).map(day => ({
            label: day,
            incomeHeight: `${(dailyData[day].income / maxAmount) * 100}%`,
            expenseHeight: `${(dailyData[day].expense / maxAmount) * 100}%`,
        }));
    };

    const chartData = getStackedChartData();

    // Form logic menggunakan Inertia useForm
    const { data, setData, post, put, reset, processing, errors } = useForm({
        wallet_id: '',
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
    });

    // Fungsi untuk membuka modal tambah
    const openAddModal = () => {
        setIsEditing(false);
        setEditId(null);
        reset();
        setShowModal(true);
    };

    // Fungsi untuk membuka modal edit & mengisi data
    const handleEdit = (transaction) => {
        setIsEditing(true);
        setEditId(transaction.id);
        setData({
            wallet_id: transaction.wallet_id,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            description: transaction.description || '',
        });
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            // Gunakan string URL manual
            // Pastikan URL ini sesuai dengan yang ada di web.php (misal: /transaksi/{id})
            put(`/transaksi/${editId}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
                onError: (err) => {
                    console.error("Gagal update:", err);
                }
            });
        } else {
            // Untuk simpan data baru
            post('/transaksi', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Transaksi" />

            <div className="py-12 px-8 max-w-[1100px] mx-auto flex flex-col gap-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="w-full bg-white rounded-[25px] p-8 flex justify-between items-center shadow-sm">
                    <div className="flex flex-col text-left">
                        <h1 className="text-black font-inter text-[40px] font-bold leading-tight">
                            Riwayat Transaksi
                        </h1>
                        <p className="text-[#757575] font-inter text-[18px] font-medium">
                            Catat setiap pemasukan dan pengeluaranmu.
                        </p>
                    </div>

                    <button 
                        onClick={openAddModal}
                        className="bg-[#365314] hover:bg-[#2d4611] text-white px-8 py-4 rounded-[15px] font-bold text-[18px] shadow-lg transition-all"
                    >
                        + Transaksi Baru
                    </button>
                </div>

                {/* --- RINGKASAN SALDO CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#DCFCE7] p-6 rounded-[25px] flex items-center gap-4 border border-green-200">
                        <div className="text-3xl">📈</div>
                        <div>
                            <p className="text-green-800 font-medium">Total Pemasukan</p>
                            <h2 className="text-2xl font-bold text-green-900">
                                Rp {totalIncome.toLocaleString('id-ID')}
                            </h2>
                        </div>
                    </div>
                    <div className="bg-[#FEE2E2] p-6 rounded-[25px] flex items-center gap-4 border border-red-200">
                        <div className="text-3xl">📉</div>
                        <div>
                            <p className="text-red-800 font-medium">Total Pengeluaran</p>
                            <h2 className="text-2xl font-bold text-red-900">
                                Rp {totalExpense.toLocaleString('id-ID')}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* --- TABEL TRANSAKSI --- */}
                <div className="bg-white rounded-[25px] shadow-sm overflow-hidden p-6">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="pb-4 font-bold text-gray-600">Tanggal</th>
                                <th className="pb-4 font-bold text-gray-600">Kategori</th>
                                <th className="pb-4 font-bold text-gray-600">Dompet</th>
                                <th className="pb-4 font-bold text-gray-600">Jumlah</th>
                                <th className="pb-4 font-bold text-gray-600 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                                        <td className="py-4 text-gray-700">{item.date}</td>
                                        <td className="py-4">
                                            <span className="font-semibold text-gray-900">{item.category}</span>
                                            <p className="text-xs text-gray-400">{item.description}</p>
                                        </td>
                                        <td className="py-4 text-gray-600">{item.wallet?.name}</td>
                                        <td className={`py-4 font-bold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.type === 'income' ? '+' : '-'} Rp {item.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 text-center">
                                            <button 
                                                onClick={() => handleEdit(item)}
                                                className="text-blue-500 hover:underline mr-2"
                                            >
                                                Edit
                                            </button>
                                            {/* <button className="text-red-500 hover:underline">Hapus</button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-gray-400 italic">
                                        Belum ada riwayat transaksi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL TRANSAKSI (CREATE/EDIT) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[30px] w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            {isEditing ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
                        </h2>
                        
                        <form onSubmit={submit} className="flex flex-col gap-4">
                            {/* Pilih Dompet */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Pilih Dompet</label>
                                <select 
                                    className="w-full rounded-xl border-gray-300 focus:ring-[#365314]"
                                    value={data.wallet_id}
                                    onChange={e => setData('wallet_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Dompet --</option>
                                    {wallets.map(w => (
                                        <option key={w.id} value={w.id}>{w.name} (Saldo: Rp {w.balance.toLocaleString()})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Jenis Transaksi */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Jenis</label>
                                <div className="flex gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setData('type', 'expense')}
                                        className={`flex-1 py-2 rounded-xl border font-bold transition-all ${data.type === 'expense' ? 'bg-red-100 border-red-500 text-red-600' : 'bg-gray-50 border-gray-200'}`}
                                    >
                                        Pengeluaran
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setData('type', 'income')}
                                        className={`flex-1 py-2 rounded-xl border font-bold transition-all ${data.type === 'income' ? 'bg-green-100 border-green-500 text-green-600' : 'bg-gray-50 border-gray-200'}`}
                                    >
                                        Pemasukan
                                    </button>
                                </div>
                            </div>

                            {/* Jumlah & Kategori */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah</label>
                                    <input 
                                        type="number" 
                                        className="w-full rounded-xl border-gray-300"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Kategori</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-xl border-gray-300"
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        placeholder="Makan/Gaji"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Keterangan</label>
                                <textarea 
                                    className="w-full rounded-xl border-gray-300"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows="2"
                                ></textarea>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-3 mt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="flex-1 py-3 bg-[#365314] text-white rounded-xl font-bold hover:bg-[#2d4611] disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}