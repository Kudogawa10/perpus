import React, { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Camera, Save, BookOpen, Calendar, Mail, Phone, TrendingUp, Star, Download, Share2, Edit2, X, Loader2 } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { Link } from '@inertiajs/react';
// ---- Digital Membership Card ----
function MemberCard({ user, stats }) {
    const [flipped, setFlipped] = useState(false);
    const cardRef = useRef(null);

    const handlePrint = () => {
        if (!cardRef.current) return;
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Kartu Anggota</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;padding:20px;background:#f7f7f7} .card{width:520px;padding:18px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12);background:#111;color:#fff} .small{font-size:12px;color:rgba(255,255,255,0.8)}</style></head><body><div class="card">${cardRef.current.innerHTML}</div></body></html>`;
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 250);
    };

    return (<div ref={cardRef} className="perspective-1000 cursor-pointer" onClick={() => setFlipped(!flipped)} style={{ perspective: '1000px' }}>
            <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} style={{ transformStyle: 'preserve-3d' }} className="relative w-full max-w-sm">
                {/* FRONT */}
                <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} className="relative overflow-hidden rounded-2xl bg-perpus-black text-white p-6 aspect-[1.6/1] shadow-perpus-xl">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 400 250" className="w-full h-full">
                            <circle cx="350" cy="-20" r="180" fill="white"/>
                            <circle cx="380" cy="200" r="120" fill="white"/>
                        </svg>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                                    <BookOpen className="w-3.5 h-3.5 text-white"/>
                                </div>
                                <span className="font-display font-bold text-base">My<span className="text-perpus-gold">Perpus</span></span>
                            </div>
                            <span className="text-xs text-white/60 font-medium uppercase tracking-wider">
                                Kartu Anggota
                            </span>
                        </div>

                        <div>
                            <p className="font-mono text-lg tracking-[0.15em] text-white/80 mb-1">
                                {user.no_anggota}
                            </p>
                            <p className="font-display font-bold text-2xl">{user.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-white/60">Berlaku s.d.</span>
                                <span className="text-xs font-medium">
                                    {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </span>
                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/20 text-perpus-gold font-semibold">
                                    {stats.level}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            rotateY: '180deg',
            position: 'absolute',
            inset: 0,
        }} className="overflow-hidden rounded-2xl bg-perpus-gray-900 text-white p-6 shadow-perpus-xl">
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Mail className="w-3.5 h-3.5"/> {user.email}
                        </div>
                        {user.phone && (<div className="flex items-center gap-2 text-sm text-white/60">
                                <Phone className="w-3.5 h-3.5"/> {user.phone}
                            </div>)}
                        <div className="border-t border-white/10 pt-3 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="font-bold text-lg text-white">{stats.total_dipinjam}</p>
                                <p className="text-[10px] text-white/40">Dipinjam</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-perpus-gold">{stats.poin}</p>
                                <p className="text-[10px] text-white/40">Poin</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-white">{stats.tahun_bergabung}</p>
                                <p className="text-[10px] text-white/40">Tahun Gabung</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-white/30 text-center mt-4">Klik untuk balik kartu</p>
                </div>
            </motion.div>
            <p className="text-center text-xs text-perpus-gray-400 mt-2">Klik kartu untuk melihat detail</p>
        </div>);
}
function StaffCard({ user, stats }) {
    const [flipped, setFlipped] = useState(false);
    const cardRef = useRef(null);

    const handlePrint = () => {
        if (!cardRef.current) return;
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Kartu Petugas</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;padding:20px;background:#f7f7f7} .card{width:520px;padding:18px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12);background:#fff;color:#0b3a66} .role{font-size:12px;color:#0b3a66;font-weight:700}</style></head><body><div class="card">${cardRef.current.innerHTML}</div></body></html>`;
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 250);
    };

    return (<div ref={cardRef} className="perspective-1000 cursor-pointer" onClick={() => setFlipped(!flipped)} style={{ perspective: '1000px' }}>
            <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} style={{ transformStyle: 'preserve-3d' }} className="relative w-full max-w-sm">
                <div style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }} className="relative overflow-hidden rounded-2xl bg-white text-perpus-blue p-6 aspect-[1.6/1] shadow-perpus-xl border">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-perpus-blue/10 flex items-center justify-center">
                                    <BookOpen className="w-3.5 h-3.5 text-perpus-blue"/>
                                </div>
                                <span className="font-display font-bold text-base">Perpus<span className="text-perpus-blue">Petugas</span></span>
                            </div>
                            <span className="text-xs text-perpus-blue/70 font-medium uppercase tracking-wider">
                                Kartu Petugas
                            </span>
                        </div>

                        <div>
                            <p className="font-mono text-lg tracking-[0.15em] text-perpus-blue/80 mb-1">
                                {user.petugas?.nip || user.no_anggota || '-'}
                            </p>
                            <p className="font-display font-bold text-2xl text-perpus-blue">{user.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-perpus-blue/60">Jabatan</span>
                                <span className="text-xs font-medium">
                                    {user.petugas?.jabatan || 'Petugas Perpustakaan'}
                                </span>
                                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-perpus-blue/10 text-perpus-blue font-semibold">
                                    {stats.level}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            rotateY: '180deg',
            position: 'absolute',
            inset: 0,
        }} className="overflow-hidden rounded-2xl bg-perpus-gray-900 text-white p-6 shadow-perpus-xl">
                    <div className="mt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Mail className="w-3.5 h-3.5"/> {user.email}
                        </div>
                        {user.phone && (<div className="flex items-center gap-2 text-sm text-white/60">
                                <Phone className="w-3.5 h-3.5"/> {user.phone}
                            </div>)}
                        <div className="border-t border-white/10 pt-3 grid grid-cols-2 gap-2 text-center">
                            <div>
                                <p className="font-bold text-lg text-white">{stats.total_dipinjam}</p>
                                <p className="text-[10px] text-white/40">Dipinjam</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-perpus-gold">{stats.poin}</p>
                                <p className="text-[10px] text-white/40">Poin</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-white/30 text-center mt-4">Klik untuk balik kartu</p>
                </div>
            </motion.div>
            <p className="text-center text-xs text-perpus-gray-400 mt-2">Klik kartu untuk melihat detail</p>
        </div>);
}
export default function Profile({ stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [editMode, setEditMode] = useState(false);
    const fileInputRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        tanggal_lahir: user.tanggal_lahir || '',
        jenis_kelamin: user.jenis_kelamin || '',
        avatar: null,
        _method: 'PUT',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/profile', {
            forceFormData: true,
            onSuccess: () => { toast.success('Profil berhasil diperbarui!'); setEditMode(false); },
            onError: () => toast.error('Gagal memperbarui profil.'),
        });
    };
    const isStaff = (user.roles_list || []).includes('petugas') || (user.roles_list || []).includes('admin');
    const isAdmin = (user.roles_list || []).includes('admin');

    const printPrimaryCard = () => {
        const el = document.querySelector('.perspective-1000');
        if (!el) return;
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>Kartu Perpustakaan</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;padding:20px;background:#f7f7f7} .wrap{max-width:520px;margin:0 auto}</style></head><body><div class="wrap">${el.innerHTML}</div></body></html>`;
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(html);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); w.close(); }, 300);
    };
    return (<AppLayout title="Profil Saya">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="page-header">
                    <h1 className="page-title">Profil Anggota</h1>
                    <p className="page-subtitle">Kelola informasi dan kartu keanggotaan Anda</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* LEFT: Card + Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {isStaff ? <StaffCard user={user} stats={stats}/> : <MemberCard user={user} stats={stats}/>} 

                        {/* Download Card Button */}
                        <div className="flex gap-2">
                            <a href={`/kartu/${user.id}`} target="_blank" rel="noreferrer" className="btn-secondary flex-1 text-sm inline-flex items-center gap-2">
                                <Download className="w-4 h-4"/>
                                Unduh KTA
                            </a>
                            <button onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: 'Kartu Perpustakaan', text: user.name, url: window.location.href }).catch(() => {});
                                } else {
                                    navigator.clipboard?.writeText(window.location.href);
                                    toast.success('Link disalin ke clipboard');
                                }
                            }} className="btn-secondary flex-1 text-sm">
                                <Share2 className="w-4 h-4"/>
                                Bagikan
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
            { icon: BookOpen, value: stats.total_dipinjam, label: 'Total Dipinjam', color: 'text-perpus-black dark:text-perpus-white' },
            { icon: Star, value: `${stats.poin} pts`, label: 'Poin Reward', color: 'text-yellow-500' },
            { icon: TrendingUp, value: stats.level, label: 'Level Anggota', color: 'text-perpus-green' },
            { icon: Calendar, value: stats.tahun_bergabung, label: 'Tahun Bergabung', color: 'text-perpus-blue' },
        ].map(s => (<div key={s.label} className="card p-4">
                                    <s.icon className={clsx('w-5 h-5 mb-2', s.color)}/>
                                    <p className={clsx('font-display font-bold text-lg', s.color)}>{s.value}</p>
                                    <p className="text-xs text-perpus-gray-400 mt-0.5">{s.label}</p>
                                </div>))}
                        </div>
                    </div>

                    {/* RIGHT: Edit Form */}
                    <div className="lg:col-span-3">
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display font-semibold text-lg">Informasi Pribadi</h2>
                                {!editMode ? (<button onClick={() => setEditMode(true)} className="btn-ghost gap-2 text-sm">
                                        <Edit2 className="w-4 h-4"/>
                                        Edit
                                    </button>) : (<button onClick={() => { setEditMode(false); reset(); }} className="btn-ghost gap-2 text-sm text-perpus-red">
                                        <X className="w-4 h-4"/>
                                        Batal
                                    </button>)}
                            </div>
                            {/* Avatar */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-perpus-gray-200 dark:bg-perpus-gray-700">
                                        {user.avatar ? (<img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-2xl font-bold text-perpus-gray-400">
                                                {user.name.charAt(0)}
                                            </div>)}
                                    </div>
                                    {editMode && (<button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-perpus-black dark:bg-perpus-white rounded-full flex items-center justify-center shadow-perpus">
                                            <Camera className="w-3.5 h-3.5 text-white dark:text-perpus-black"/>
                                        </button>)}
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setData('avatar', e.target.files[0])}/>
                                </div>
                                <div>
                                    <p className="font-semibold text-perpus-black dark:text-perpus-white">{user.name}</p>
                                    <p className="text-sm text-perpus-gray-400">{user.email}</p>
                                    <span className="badge badge-black mt-1 text-[10px]">{stats.level}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="input-label">Nama Lengkap</label>
                                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="input" disabled={!editMode}/>
                                        {errors.name && <p className="text-xs text-perpus-red mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="input-label">Email</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="input" disabled={!editMode}/>
                                    </div>
                                    <div>
                                        <label className="input-label">No. Telepon</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} className="input" placeholder="+62..." disabled={!editMode}/>
                                    </div>
                                    <div>
                                        <label className="input-label">Tanggal Lahir</label>
                                        <input type="date" value={data.tanggal_lahir} onChange={e => setData('tanggal_lahir', e.target.value)} className="input" disabled={!editMode}/>
                                    </div>
                                    <div>
                                        <label className="input-label">Jenis Kelamin</label>
                                        <select value={data.jenis_kelamin} onChange={e => setData('jenis_kelamin', e.target.value)} className="input" disabled={!editMode}>
                                            <option value="">Pilih...</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">No. Anggota</label>
                                        <input type="text" value={user.no_anggota} className="input" disabled/>
                                    </div>
                                </div>

                                <div>
                                    <label className="input-label">Alamat</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="input resize-none" rows={3} placeholder="Alamat lengkap" disabled={!editMode}/>
                                </div>

                                {editMode && (<div className="flex justify-end gap-3 pt-2">
                                        <button type="button" onClick={() => { setEditMode(false); reset(); }} className="btn-secondary">
                                            Batal
                                        </button>
                                        <button type="submit" disabled={processing} className="btn-primary">
                                            {processing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                                            Simpan Perubahan
                                        </button>
                                    </div>)}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>);
}
