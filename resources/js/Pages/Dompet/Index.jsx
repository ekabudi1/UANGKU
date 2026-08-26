import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import WalletCard from '@/Components/WalletCard';
import WalletModal from '@/Components/WalletModal'; 
import { useState } from 'react';
import { router } from '@inertiajs/react';

// Terima props 'wallets' dari Controller
export default function Index({ auth, wallets }) {
    const [showModal, setShowModal] = useState(false);
    
    // State untuk menyimpan data dompet yang sedang diedit
    const [selectedWalletForEdit, setSelectedWalletForEdit] = useState(null);

    // Fungsi untuk membuka modal mode "Tambah Baru"
    const openModalForCreate = () => {
        setSelectedWalletForEdit(null); // Penting: reset state agar mode tambah
        setShowModal(true);
    };

    // Fungsi untuk membuka modal mode "Edit", dipanggil dari WalletCard
    const openModalForEdit = (wallet) => {
        setSelectedWalletForEdit(wallet); // Set data dompet yang akan diedit
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Fungsi Delete Dompet
    const handleDelete = (id, name) => {
        if (confirm(`Yakin mau hapus dompet "${name}"? Saldo dan riwayat transaksinya bakal ilang!`)) {
            router.delete(route('dompet.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Berhasil dihapus
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dompet Saya</h2>}
        >
            <Head title="Dompet" />

            <div className="py-12 px-8">
                <div className="max-w-[1000px] mx-auto flex flex-col gap-10">
                    
                    {/* Header Bagian Atas */}
                    <div className="w-full bg-white rounded-[25px] p-8 flex justify-between items-center shadow-sm">
                        <div className="flex flex-col text-left">
                            <h1 className="text-black font-inter text-[48px] font-bold leading-tight">
                                Manajemen Dompet
                            </h1>
                            <p className="text-[#757575] font-inter text-[18px] font-medium">
                                Lihat dan atur semua saldo dompet digital & bank kamu.
                            </p>
                        </div>

                        {/* TOMBOL TAMBAH DOMPET */}
                        <button 
                            onClick={openModalForCreate}
                            className="bg-[#365314] hover:bg-[#4a701c] text-white px-8 py-4 rounded-[15px] font-bold text-[18px] shadow-lg transition-all"
                        >
                            + Tambah Dompet
                        </button>
                    </div>

                    {/* Modal Dompet */}
                    <WalletModal 
                        show={showModal} 
                        onClose={handleCloseModal} 
                        walletToEdit={selectedWalletForEdit}
                    />

                    {/* Grid List Dompet Dinamis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 justify-items-center">
                        {wallets && wallets.length > 0 ? (
                            wallets.map((wallet) => (
                                <WalletCard 
                                    key={wallet.id}
                                    name={wallet.name} 
                                    type={wallet.type} 
                                    balance={new Intl.NumberFormat('id-ID').format(wallet.balance)} 
                                    norek={wallet.norek}
                                    account_name={wallet.account_name}
                                    logo={wallet.logo ? `/storage/${wallet.logo}` : "/assets/default-bank.png"}
                                    
                                    // Klik Action
                                    onEdit={() => openModalForEdit(wallet)}
                                    onDelete={() => handleDelete(wallet.id, wallet.name)} 
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 opacity-40 text-center">
                                <p className="text-xl font-medium">Belum ada dompet yang ditambahkan.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}


