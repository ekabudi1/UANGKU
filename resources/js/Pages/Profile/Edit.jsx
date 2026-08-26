import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth }) {
    // Pastikan kedua state ini ada
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [localErrors, setLocalErrors] = useState({});

    // Form Edit Profile (Gunakan route 'settings.update')
    const { data, setData, post, errors, processing, reset } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        occupation: auth.user.occupation || 'Pelajar/Mahasiswa',
        password: '',
        password_confirmation: '',
        photo: null,
    });

    // Form Delete Account (Gunakan route 'settings.destroy')
    const { 
        data: deleteData, 
        setData: setDeleteData, 
        delete: destroy, 
        processing: deleting, 
        errors: deleteErrors, 
        reset: resetDelete 
    } = useForm({
        password: '',
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalErrors({});
        if (data.password && data.password !== data.password_confirmation) {
            setLocalErrors({ password_confirmation: 'Konfirmasi password tidak sesuai!' });
            return;
        }
        // Pastikan route sesuai dengan yang ada di web.php
        post(route('settings.update'), {
        forceFormData: true, 
        preserveScroll: true,
        onSuccess: () => {
            setShowModal(false);
            reset('password', 'password_confirmation');
        },
        });
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        // Pastikan route sesuai dengan yang ada di web.php
        destroy(route('settings.destroy'), {
            preserveScroll: true,
            onSuccess: () => setShowDeleteModal(false),
            onError: () => setDeleteData('password', ''),
            onFinish: () => resetDelete(),
        });
    };

    const interFont = { fontFamily: "'Inter', sans-serif" };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Settings" />
            
            <div className="flex justify-center items-center min-h-screen p-6 relative">
                
                {/* --- HALAMAN PROFIL --- */}
                <div style={{
                    width: '602px', height: '844px', borderRadius: '18px', background: '#F0F9FF',
                    padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px',
                    boxShadow: '0 4px 25px rgba(0,0,0,0.1)'
                }}>
                    
                    <div style={{
                        width: '562px', height: '392px', borderRadius: '10px',
                        backgroundImage: auth.user.profile_photo_path 
                            ? `url('/storage/${auth.user.profile_photo_path}')` 
                            : `url('/assets/Group.svg')`, 
                        backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: '50%',
                        backgroundColor: '#E5E7EB', boxShadow: '0 0 100px 0 rgba(0, 0, 0, 0.25)'
                    }}></div>

                    <div style={{ display: 'flex', width: '562px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                        <h4 style={{ color: '#000', ...interFont, fontSize: '32px', fontWeight: '700', margin: 0 }}>{auth.user.name}</h4>
                        <h6 style={{ color: '#000', ...interFont, fontSize: '20px', fontWeight: '600', margin: 0 }}>{auth.user.email}</h6>
                        <p style={{ color: '#808080', ...interFont, fontSize: '16px', fontWeight: '600', margin: 0 }}>{auth.user.occupation || 'Pelajar/Mahasiswa'}</p>
                    </div>

                    <div style={{ display: 'flex', width: '562px', justifyContent: 'space-between', gap: '12px' }}>
                        <button type="button" onClick={() => setShowModal(true)} style={{ display: 'flex', width: '277px', height: '84px', alignItems: 'center', justifyContent: 'center', borderRadius: '18px', background: '#4ADE80', border: 'none', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <img src="/assets/boxicons_edit-filled.svg" style={{ width: '40px', filter: 'brightness(0) invert(1)' }} alt="edit" />
                                <span style={{ color: '#FFF', ...interFont, fontSize: '24px', fontWeight: '700' }}>Edit Profile</span>
                            </div>
                        </button>

                        <Link href={route('logout')} method="post" as="button" style={{ display: 'flex', width: '271px', height: '84px', alignItems: 'center', justifyContent: 'center', borderRadius: '18px', background: '#B91C1C', border: 'none', cursor: 'pointer', textDecoration: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <span style={{ color: '#FFF', ...interFont, fontSize: '24px', fontWeight: '700' }}>Logout</span>
                                <img src="/assets/material-symbols_logout-rounded.svg" style={{ width: '40px' }} alt="logout" />
                            </div>
                        </Link>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => setShowDeleteModal(true)}
                        style={{ width: '562px', height: '84px', borderRadius: '18px', background: 'rgba(220, 38, 38, 0.70)', border: 'none', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
                            <img src="/assets/material-symbols_delete-rounded.svg" style={{ width: '40px' }} alt="delete" />
                            <span style={{ color: '#FFF', ...interFont, fontSize: '24px', fontWeight: '700' }}>Delete Account</span>
                        </div>
                    </button>
                </div>

                {/* --- MODAL EDIT PROFILE --- */}
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50, padding: '20px' }}>
                        <form onSubmit={handleSubmit} style={{ width: '500px', background: '#FFF', borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                            <h2 style={{ ...interFont, fontSize: '24px', fontWeight: '800', textAlign: 'center', borderBottom: '2px solid #F0F9FF', paddingBottom: '10px' }}>Edit Profile</h2>
                            <div className="flex flex-col items-center gap-2">
                                <div onClick={() => fileInputRef.current.click()} style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#E5E7EB', cursor: 'pointer', backgroundImage: previewUrl ? `url(${previewUrl})` : (auth.user.profile_photo_path ? `url('/storage/${auth.user.profile_photo_path}')` : `url('/assets/Group.svg')`), backgroundSize: 'cover', backgroundPosition: 'center', border: '4px solid #4ADE80' }}></div>
                                <span style={{ ...interFont, fontSize: '12px', fontWeight: '700', color: '#2563EB', cursor: 'pointer' }}>Ubah Foto</span>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setData('photo', file); setPreviewUrl(URL.createObjectURL(file)); } }} />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500">NAMA LENGKAP</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-green-400 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500">EMAIL</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-green-400 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-500">PEKERJAAN</label>
                                    <input type="text" value={data.occupation} onChange={e => setData('occupation', e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-green-400 outline-none" />
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-1/2">
                                        <label className="block text-[11px] font-bold text-gray-500">PASSWORD BARU</label>
                                        <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full p-2 border-b-2 border-gray-200 focus:border-green-400 outline-none" placeholder="Min 8 char" />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="block text-[11px] font-bold text-gray-500">KONFIRMASI</label>
                                        <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className={`w-full p-2 border-b-2 outline-none ${localErrors.password_confirmation ? 'border-red-500' : 'border-gray-200 focus:border-green-400'}`} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => { setShowModal(false); setLocalErrors({}); }} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition text-[14px]">Cancel</button>
                                <button type="submit" disabled={processing} className="flex-1 py-3 bg-green-400 rounded-xl font-bold text-white hover:bg-green-500 transition shadow-lg text-[14px]">{processing ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- MODAL KHUSUS HAPUS AKUN --- */}
                {showDeleteModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60, padding: '20px' }}>
                        <form onSubmit={handleDeleteAccount} style={{ width: '400px', background: '#FFF', borderRadius: '20px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <h2 style={{ ...interFont, fontSize: '20px', fontWeight: '800', color: '#B91C1C' }}>Hapus Akun Permanen?</h2>
                            <p style={{ ...interFont, fontSize: '14px', color: '#4B5563' }}>Masukkan password konfirmasi untuk menghapus akun.</p>
                            
                            <div>
                                <input 
                                    type="password" 
                                    placeholder="Masukkan Password Anda" 
                                    value={deleteData.password}
                                    onChange={e => setDeleteData('password', e.target.value)}
                                    className="w-full p-3 border rounded-xl outline-none focus:border-red-500"
                                    required
                                />
                                {deleteErrors.password && <div className="text-red-500 text-[12px] mt-1 font-bold">{deleteErrors.password}</div>}
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => setShowDeleteModal(false)} className="flex-1 py-2 bg-gray-200 rounded-lg font-bold">Batal</button>
                                <button type="submit" disabled={deleting} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">
                                    {deleting ? 'Menghapus...' : 'Ya, Hapus Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}