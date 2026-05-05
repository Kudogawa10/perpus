import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Mail, ArrowLeft, Loader2, ArrowRight } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';
import toast from 'react-hot-toast';
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password', {
            onSuccess: () => toast.success('Link reset password telah dikirim ke email Anda.'),
        });
    };
    return (<AuthLayout title="Lupa Password" subtitle="Masukkan email Anda dan kami akan mengirim link untuk reset password.">
            {status && (<div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400">
                    {status}
                </div>)}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="input-label">Alamat Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="nama@email.com" className="input pl-10" autoFocus/>
                    </div>
                    {errors.email && <p className="text-xs text-perpus-red mt-1">{errors.email}</p>}
                </div>
                <button type="submit" disabled={processing} className="btn-primary w-full py-3">
                    {processing ? <Loader2 className="w-4 h-4 animate-spin"/> : <><ArrowRight className="w-4 h-4"/> Kirim Link Reset</>}
                </button>
                <Link href="/login" className="flex items-center justify-center gap-2 text-sm text-perpus-gray-500 hover:text-perpus-black dark:hover:text-perpus-white transition-colors">
                    <ArrowLeft className="w-4 h-4"/> Kembali ke halaman masuk
                </Link>
            </form>
        </AuthLayout>);
}
