import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, User, Mail, Lock, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import AuthLayout from '@/Layouts/AuthLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
export default function Register({ domisiliOptions = [] }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', password: '', password_confirmation: '', phone: '', kabupaten: '', kecamatan: '', address: '', accepted_terms: false,
    });
    const [kabupatenOptions, setKabupatenOptions] = useState([]);
    const [kecamatanOptions, setKecamatanOptions] = useState([]);
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onError: () => toast.error('Periksa kembali data Anda.'),
            onSuccess: () => toast.success('Akun berhasil dibuat!'),
        });
    };

    useEffect(() => {
        // load kabupaten list
        fetch('/api/indonesia/kabupaten')
            .then(res => res.json())
            .then(json => setKabupatenOptions(json || []))
            .catch(() => setKabupatenOptions([]));
    }, []);

    useEffect(() => {
        if (!data.kabupaten) {
            setKecamatanOptions([]);
            setData('kecamatan', '');
            return;
        }
        fetch(`/api/indonesia/kecamatan?kabupaten=${encodeURIComponent(data.kabupaten)}`)
            .then(res => res.json())
            .then(json => setKecamatanOptions(json || []))
            .catch(() => setKecamatanOptions([]));
    }, [data.kabupaten]);
    const strength = (() => {
        const p = data.password;
        if (!p)
            return 0;
        let s = 0;
        if (p.length >= 8)
            s++;
        if (/[A-Z]/.test(p))
            s++;
        if (/[0-9]/.test(p))
            s++;
        if (/[^A-Za-z0-9]/.test(p))
            s++;
        return s;
    })();
    const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
    const strengthLabels = ['Lemah', 'Cukup', 'Baik', 'Kuat'];
    return (<AuthLayout title="Daftar Anggota Baru" subtitle="Buat akun gratis dan mulai pinjam buku favoritmu.">
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="input-label">Nama Lengkap</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nama lengkap Anda" className={clsx('input pl-10', errors.name && 'border-red-400')} autoFocus/>
                    </div>
                    {errors.name && <p className="text-xs text-perpus-red mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="input-label">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="nama@email.com" className={clsx('input pl-10', errors.email && 'border-red-400')}/>
                    </div>
                    {errors.email && <p className="text-xs text-perpus-red mt-1">{errors.email}</p>}
                </div>

                <div>
                    <label className="input-label">No. Telepon (Wajib)</label>
                    <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+62 812 xxxx xxxx" className={clsx('input pl-10', errors.phone && 'border-red-400')}/>
                    </div>
                    {errors.phone && <p className="text-xs text-perpus-red mt-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className="input-label">Kabupaten / Kota (Wajib)</label>
                    <div className="relative">
                        <select value={data.kabupaten} onChange={e => setData('kabupaten', e.target.value)} className={clsx('input pl-3', errors.kabupaten && 'border-red-400')}>
                            <option value="">Pilih kabupaten / kota</option>
                            {kabupatenOptions.map((k) => (<option key={k.id} value={k.name}>{k.name}</option>))}
                        </select>
                    </div>
                    {errors.kabupaten && <p className="text-xs text-perpus-red mt-1">{errors.kabupaten}</p>}
                </div>

                <div>
                    <label className="input-label">Kecamatan (Wajib)</label>
                    <div className="relative">
                        <select value={data.kecamatan} onChange={e => setData('kecamatan', e.target.value)} className={clsx('input pl-3', errors.kecamatan && 'border-red-400')}>
                            <option value="">Pilih kecamatan</option>
                            {kecamatanOptions.map((k) => (<option key={k.id} value={k.name}>{k.name}</option>))}
                        </select>
                    </div>
                    {errors.kecamatan && <p className="text-xs text-perpus-red mt-1">{errors.kecamatan}</p>}
                </div>

                <div>
                    <label className="input-label">Alamat Lengkap (Wajib)</label>
                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan" className={clsx('input h-24 resize-none', errors.address && 'border-red-400')}></textarea>
                    {errors.address && <p className="text-xs text-perpus-red mt-1">{errors.address}</p>}
                </div>

                <div>
                    <label className="input-label">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type={showPassword ? 'text' : 'password'} value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Min. 8 karakter" className={clsx('input pl-10 pr-10', errors.password && 'border-red-400')}/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-perpus-gray-400 hover:text-perpus-gray-600">
                            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                        </button>
                    </div>
                    {data.password && (<div className="mt-2 flex items-center gap-2">
                            <div className="flex gap-1 flex-1">
                                {[0, 1, 2, 3].map(i => (<div key={i} className={clsx('h-1 flex-1 rounded-full transition-colors', i < strength ? strengthColors[strength - 1] : 'bg-perpus-gray-200 dark:bg-perpus-gray-700')}/>))}
                            </div>
                            <span className="text-xs text-perpus-gray-400">{strengthLabels[strength - 1] || 'Lemah'}</span>
                        </div>)}
                    {errors.password && <p className="text-xs text-perpus-red mt-1">{errors.password}</p>}
                </div>

                <div>
                    <label className="input-label">Konfirmasi Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                        <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} placeholder="Ulangi password" className="input pl-10 pr-10"/>
                        {data.password_confirmation && data.password === data.password_confirmation && (<CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500"/>)}
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <input id="accepted_terms" type="checkbox" checked={data.accepted_terms} onChange={e => setData('accepted_terms', e.target.checked)} className="w-4 h-4 rounded border-perpus-gray-300 text-perpus-black focus:ring-perpus-black/20 mt-1" />
                    <label htmlFor="accepted_terms" className="text-sm text-perpus-gray-600 dark:text-perpus-gray-400">
                        Saya menyetujui <a href="/syarat" className="underline">Syarat & Ketentuan</a> dan <a href="/" target="_blank" rel="noopener noreferrer" className="underline">Kebijakan Privasi</a> MyPerpus.
                    </label>
                </div>
                {errors.accepted_terms && <p className="text-xs text-perpus-red mt-1">{errors.accepted_terms}</p>}

                <button type="submit" disabled={processing} className="btn-primary w-full py-3 text-base">
                    {processing ? <Loader2 className="w-4 h-4 animate-spin"/> : <>Buat Akun <ArrowRight className="w-4 h-4"/></>}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-perpus-gray-200 dark:border-perpus-gray-800"/>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 text-xs text-perpus-gray-400 bg-perpus-white dark:bg-perpus-black">Sudah punya akun?</span>
                    </div>
                </div>

                <Link href="/login" className="btn-secondary w-full py-3 text-base justify-center">
                    Masuk ke Akun
                </Link>
            </form>
        </AuthLayout>);
}
