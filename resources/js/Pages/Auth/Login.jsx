import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
// Import logo cok, sesuaikan path foldernya kalau beda
import LogoUangku from '/public/assets/logo_uangku.png'; 

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        // Warna background disamakan dengan hhboard (Cokelat Gelap)
        <div className="min-h-screen bg-[#413123] flex flex-col items-center justify-center p-6 font-inter overflow-hidden">
            <Head title="Log in" />

            {/* Header Branding - Sekarang pakai Flex buat nambahin logo */}
            <div className="mb-10 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    {/* Ini Logo Cok, ukurannya h-16 (64px) biar pas */}
                    <img 
                        src={LogoUangku} 
                        alt="Logo Uangku" 
                        className="h-16 w-auto object-contain"
                    />
                    <h1 className="text-6xl font-black text-white tracking-tight leading-none">Uangku.</h1>
                </div>
                <p className="text-gray-300 font-medium mt-1 text-lg opacity-80 max-w-sm">Kelola cuan lebih rapi, hidup lebih tenang.</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-white/10 relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Selamat Datang Kembali! 👋</h2>

                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="mb-2 font-bold text-gray-700" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Masukkan email lo..."
                            value={data.email}
                            className="mt-1 block w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#365314] focus:border-[#365314] transition-all shadow-none"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <InputLabel htmlFor="password" value="Password" className="font-bold text-gray-700" />
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-[#365314] font-bold hover:underline"
                                >
                                </Link>
                            )}
                        </div>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={data.password}
                            className="mt-1 block w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#365314] focus:border-[#365314] transition-all shadow-none"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer group">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                className="rounded border-gray-300 text-[#365314] focus:ring-[#365314] w-5 h-5"
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ms-3 text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                                Ingat saya di perangkat ini
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <PrimaryButton 
                            className="w-full flex justify-center py-4 bg-[#365314] hover:bg-[#2d4511] active:bg-[#24380e] rounded-2xl font-black text-lg shadow-lg shadow-[#365314]/20 transition-all transform active:scale-[0.98] border-none disabled:opacity-50" 
                            disabled={processing}
                        >
                            {processing ? 'TUNGGU BENTAR...' : 'MASUK SEKARANG'}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-[#365314] font-black hover:underline">
                            Daftar Gratis
                        </Link>
                    </p>
                </div>
            </div>

            {/* Version Tag */}
            <p className="mt-12 text-gray-300/50 text-[10px] font-bold uppercase tracking-[0.2em] italic">
                Uangku Financial Assistant v1.0.0
            </p>
        </div>
    );
}