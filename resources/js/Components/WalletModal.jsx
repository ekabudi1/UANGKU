import React, { useEffect, useState } from 'react';
import { useForm, router } from '@inertiajs/react';

const WalletModal = ({ show, onClose, walletToEdit = null }) => {
    const isEditing = !!walletToEdit;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'cash', 
        account_name: '',
        balance: '',
        norek: '',
        logo: null,
    });

    const [logoPreview, setLogoPreview] = useState("/assets/default-bank.png");

    useEffect(() => {
        if (show) {
            if (isEditing) {
                setData({
                    name: walletToEdit.name,
                    type: walletToEdit.type,
                    account_name: walletToEdit.account_name,
                    balance: walletToEdit.balance.toString(), // Ubah ke string biar gak kena math logic HTML
                    norek: walletToEdit.norek || '',
                    logo: null,
                });
                setLogoPreview(walletToEdit.logo ? `/storage/${walletToEdit.logo}` : "/assets/default-bank.png");
            } else {
                reset();
                setLogoPreview("/assets/default-bank.png");
            }
            clearErrors();
        }
    }, [show, isEditing, walletToEdit]);

    const handleDelete = () => {
        if (confirm(`Yakin mau hapus dompet "${data.name}"? Data saldo & riwayatnya bakal ilang total!`)) {
            router.delete(route('dompet.destroy', walletToEdit.id), {
                onBefore: () => onClose(),
                onSuccess: () => {},
            });
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Tambahkan pengaman agar norek terisi string kosong jika tipenya cash
        const finalData = {
            ...data,
            norek: data.type === 'cash' ? (data.norek || '-') : data.norek
        };

        if (isEditing) {
            // Gunakan post dengan _method put karena ada upload file (logo)
            post(route('dompet.update', walletToEdit.id), {
                forceFormData: true,
                data: { ...finalData, _method: 'put' },
                onSuccess: () => onClose(),
                onError: (err) => console.log("Error Update:", err)
            });
        } else {
            post(route('dompet.store'), {
                forceFormData: true,
                onSuccess: () => { 
                    reset(); 
                    onClose(); 
                },
                onError: (err) => console.log("Error Store:", err)
            });
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-inter">
            <div className="bg-white w-full max-w-lg rounded-[25px] p-8 shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
                <form onSubmit={submit} className="flex flex-col gap-5 text-left">
                    <h2 className="text-2xl font-bold text-black">
                        {isEditing ? 'Edit Data Dompet' : 'Tambah Dompet Baru'}
                    </h2>
                    
                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                        <div 
                            className="w-[60px] h-[60px] rounded-full bg-cover bg-center bg-white border border-gray-100 flex-shrink-0"
                            style={{ backgroundImage: `url('${logoPreview}')` }}
                        ></div>
                        <div className="flex flex-col flex-1 gap-1">
                            <span className="text-xs text-gray-400 uppercase font-medium">{isEditing ? data.type : 'LOGO PRATINJAU'}</span>
                            <span className="text-xl font-semibold text-black leading-tight break-words">{data.name || 'Nama Dompet'}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Nama Dompet / Bank</label>
                        <input type="text" placeholder="Contoh: Dompet Utama atau BCA" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#365314] outline-none" required />
                        {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Tipe</label>
                        <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#365314] outline-none">
                            <option value="cash">Cash (Tunai)</option>
                            <option value="mobile bank">Mobile Bank</option>
                            <option value="e-wallet">E-Wallet</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Nama Pemilik Akun</label>
                        <input type="text" value={data.account_name} onChange={e => setData('account_name', e.target.value)} className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#365314] outline-none" required />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Saldo Awal (Rp)</label>
                        <input 
                            type="number" 
                            step="any" 
                            value={data.balance} 
                            onChange={e => setData('balance', e.target.value)} 
                            className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#365314] outline-none" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">No Rekening / HP {data.type === 'cash' && '(Opsional)'}</label>
                        <input 
                            type="text" 
                            value={data.norek} 
                            onChange={e => setData('norek', e.target.value)} 
                            className="w-full border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#365314] outline-none" 
                            required={data.type !== 'cash'} 
                        />
                        {errors.norek && <div className="text-red-500 text-xs mt-1">{errors.norek}</div>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Unggah Logo</label>
                        <input type="file" onChange={handleLogoChange} className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 cursor-pointer" />
                    </div>

                    <div className="flex justify-between items-center gap-4 mt-6">
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={handleDelete}
                                className="px-5 py-3 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
                            >
                                Hapus Dompet
                            </button>
                        )}

                        <div className="flex gap-4 ml-auto">
                            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50">Batal</button>
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="px-6 py-3 bg-[#365314] text-white rounded-xl font-bold hover:bg-[#4a701c] transition-all shadow-md disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Dompet')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WalletModal;