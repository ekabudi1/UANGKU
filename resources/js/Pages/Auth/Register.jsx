import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
// Import logo, sesuaikan path foldernya
import LogoUangku from '/public/assets/logo_uangku.png'; 

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        // Warna background cokelat gelap biar sinkron sama dashboard
        <div className="min-h-screen bg-[#413123] flex flex-col items-center justify-center p-6 font-inter">
            <Head title="Register" />

            {/* Header Branding dengan Logo */}
            <div className="mb-10 text-center flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                    <img 
                        src={LogoUangku} 
                        alt="Logo Uangku" 
                        className="h-16 w-auto object-contain"
                    />
                    <h1 className="text-6xl font-black text-white tracking-tight leading-none">Uangku.</h1>
                </div>
                <p className="text-gray-300 font-medium mt-1 text-lg opacity-80">Mulai langkah baru kelola cuan lo!</p>
            </div>

            {/* Register Card */}
            <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-white/10">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Buat Akun Baru 🚀</h2>

                <form onSubmit={submit} className="space-y-5">
                    {/* Input Nama */}
                    <div>
                        <InputLabel htmlFor="name" value="Nama Lengkap" className="mb-2 font-bold text-gray-700" />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            placeholder="Siapa nama lo?"
                            className="mt-1 block w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#365314] focus:border-[#365314] transition-all shadow-none"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="m-2" />
                    </div>

                    {/* Input Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className="mb-2 font-bold text-gray-700" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            placeholder="email@contoh.com"
                            className="mt-1 block w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#365314] focus:border-[#365314] transition-all shadow-none"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Input Password */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" className="mb-2 font-bold text-gray-700" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            placeholder="Minimal 8 karakter"
                            className="mt-1 block w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#365314] focus:border-[#365314] transition-all shadow-none"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" className="mb-2 font-bold text-gray-700" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            placeholder="Ulangi password tadi"
                            className="mt-1 block w-full px-5 py-4 bg-gray-50 border-gray-100 rounded-2xl focus:ring-[#365314] focus:border-[#365314] transition-all shadow-none"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>

                    {/* Button Register */}
                    <div className="pt-4">
                        <PrimaryButton 
                            className="w-full flex justify-center py-4 bg-[#365314] hover:bg-[#2d4511] active:bg-[#24380e] rounded-2xl font-black text-lg shadow-lg shadow-[#365314]/20 transition-all transform active:scale-[0.98] border-none" 
                            disabled={processing}
                        >
                            {processing ? 'PROSES DAFTAR...' : 'DAFTAR SEKARANG'}
                        </PrimaryButton>
                    </div>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-[#365314] font-black hover:underline">
                            Login Sini
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