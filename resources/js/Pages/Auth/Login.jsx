import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onError: () => toast.error('Email atau password salah.'),
            onSuccess: () => toast.success('Selamat datang kembali!'),
        });
    };

    const [showRegisteredModal, setShowRegisteredModal] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered')) {
            setShowRegisteredModal(true);
            const em = params.get('email');
            if (em) setData('email', em);
            // remove query params so modal doesn't reappear on refresh
            const url = window.location.pathname;
            window.history.replaceState({}, document.title, url);
        }
    }, []);
    return (<AuthLayout title="Masuk ke MyPerpus" subtitle="Selamat datang kembali! Masukkan detail akun Anda.">
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                    <label className="input-label">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="nama@email.com" className={clsx('input pl-10', errors.email && 'border-perpus-red focus:ring-red-200')} autoComplete="email" autoFocus/>
                    </div>
                    {errors.email && <p className="text-xs text-perpus-red mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="input-label mb-0">Password</label>
                        <Link href="/forgot-password" className="text-xs text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                            Lupa password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" className={clsx('input pl-10 pr-10', errors.password && 'border-perpus-red focus:ring-red-200')} autoComplete="current-password"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-perpus-gray-400 hover:text-perpus-gray-600 transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-perpus-red mt-1">{errors.password}</p>}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-2.5">
                    <input id="remember" type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="w-4 h-4 rounded border-perpus-gray-300 text-perpus-black focus:ring-perpus-black/20"/>
                    <label htmlFor="remember" className="text-sm text-perpus-gray-600 dark:text-perpus-gray-400 cursor-pointer">
                        Ingat saya
                    </label>
                </div>

                {/* Submit */}
                <button type="submit" disabled={processing} className="btn-primary w-full py-3 text-base">
                    {processing ? (<Loader2 className="w-4 h-4 animate-spin"/>) : (<>
                            Masuk
                            <ArrowRight className="w-4 h-4"/>
                        </>)}
                </button>

                {/* Divider */}
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-perpus-gray-200 dark:border-perpus-gray-800"/>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 text-xs text-perpus-gray-400 bg-perpus-white dark:bg-perpus-black">
                            Belum punya akun?
                        </span>
                    </div>
                </div>

                <Link href="/register" className="btn-secondary w-full py-3 text-base justify-center">
                    Daftar Anggota Baru
                </Link>
            </form>

            {showRegisteredModal && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="card p-6 max-w-sm w-full">
                        <div className="mb-4">
                            <h3 className="font-semibold text-perpus-black dark:text-perpus-white">Akun Berhasil Dibuat</h3>
                            <p className="text-sm text-perpus-gray-500 mt-2">Silakan masuk menggunakan akun yang baru Anda daftarkan untuk melanjutkan.</p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowRegisteredModal(false)} className="btn-secondary flex-1">Tutup</button>
                            <button onClick={() => { setShowRegisteredModal(false); }} className="btn-primary flex-1">Lanjut ke Login</button>
                        </div>
                    </div>
                </div>)}

        </AuthLayout>)
}
