import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Award, Clock, MapPin } from 'lucide-react';
import AppLayout from '@/Layouts/AppLayout';
import clsx from 'clsx';
function PetugasCard({ p, i }) {
    const initials = p.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const gradients = [
        'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
        'from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800',
    ];
    return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -4 }} className="card overflow-hidden group">
            {/* Top Banner */}
            <div className={clsx('h-20 bg-gradient-to-br', gradients[i % 2], 'relative')}>
                <div className="absolute inset-0 opacity-30">
                    <svg viewBox="0 0 300 80" className="w-full h-full">
                        <circle cx="240" cy="-10" r="80" fill="currentColor" className="text-perpus-gray-400 dark:text-perpus-gray-600"/>
                        <circle cx="280" cy="70" r="50" fill="currentColor" className="text-perpus-gray-300 dark:text-perpus-gray-700"/>
                    </svg>
                </div>
            </div>

            <div className="px-5 pb-5 -mt-10 relative">
                {/* Avatar */}
                <div className="mb-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-perpus-white dark:border-perpus-gray-900 shadow-perpus bg-perpus-gray-200 dark:bg-perpus-gray-700">
                        {p.foto ? (<img src={`/storage/${p.foto}`} alt={p.user.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-2xl font-display font-bold text-perpus-gray-500 dark:text-perpus-gray-300">
                                {initials}
                            </div>)}
                    </div>
                </div>

                {/* Info */}
                <div className="mb-4">
                    <h3 className="font-display font-bold text-lg text-perpus-black dark:text-perpus-white leading-tight">
                        {p.user.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="badge badge-black text-[10px]">{p.jabatan}</span>
                        <span className="badge badge-gray text-[10px]">{p.bagian}</span>
                    </div>
                    <p className="text-xs font-mono text-perpus-gray-400 mt-1.5">NIP: {p.nip}</p>
                </div>

                {p.tentang && (<p className="text-xs text-perpus-gray-500 dark:text-perpus-gray-400 leading-relaxed mb-4 line-clamp-3">
                        {p.tentang}
                    </p>)}

                {/* Contact */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-perpus-gray-500">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0"/>
                        <span className="truncate">{p.user.email}</span>
                    </div>
                    {p.user.phone && (<div className="flex items-center gap-2 text-xs text-perpus-gray-500">
                            <Phone className="w-3.5 h-3.5 flex-shrink-0"/>
                            <span>{p.user.phone}</span>
                        </div>)}
                </div>
            </div>
        </motion.div>);
}
export default function PetugasPage({ petugas }) {
    // Group by bagian
    const byBagian = petugas.reduce((acc, p) => {
        if (!acc[p.bagian])
            acc[p.bagian] = [];
        acc[p.bagian].push(p);
        return acc;
    }, {});
    return (<AppLayout title="Petugas Perpustakaan">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* HEADER */}
                <div className="text-center py-8">
                    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="font-display font-bold text-3xl text-perpus-black dark:text-perpus-white mb-3">
                            Tim Petugas Kami
                        </h1>
                        <p className="text-perpus-gray-500 max-w-md mx-auto">
                            Kenali para petugas perpustakaan yang siap membantu kebutuhan literasi Anda.
                        </p>
                    </motion.div>

                    {/* Stats bar */}
                    <div className="flex items-center justify-center gap-8 mt-8">
                        {[
            { value: petugas.length, label: 'Total Petugas' },
            { value: Object.keys(byBagian).length, label: 'Divisi' },
            { value: '08:00 – 17:00', label: 'Jam Layanan' },
        ].map(s => (<div key={s.label} className="text-center">
                                <p className="font-display font-bold text-xl text-perpus-black dark:text-perpus-white">{s.value}</p>
                                <p className="text-xs text-perpus-gray-400 mt-0.5">{s.label}</p>
                            </div>))}
                    </div>
                </div>

                {/* GROUPED BY BAGIAN */}
                {Object.entries(byBagian).map(([bagian, list]) => (<section key={bagian}>
                        <div className="flex items-center gap-3 mb-6">
                            <h2 className="font-display font-semibold text-lg text-perpus-black dark:text-perpus-white">{bagian}</h2>
                            <div className="flex-1 h-px bg-perpus-gray-200 dark:bg-perpus-gray-800"/>
                            <span className="text-xs text-perpus-gray-400">{list.length} petugas</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {list.map((p, i) => <PetugasCard key={p.id} p={p} i={i}/>)}
                        </div>
                    </section>))}

                {petugas.length === 0 && (<div className="card p-16 text-center">
                        <Award className="w-12 h-12 text-perpus-gray-300 mx-auto mb-4"/>
                        <p className="text-perpus-gray-500">Belum ada data petugas.</p>
                    </div>)}

                {/* Info Box */}
                <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-perpus-gray-100 dark:bg-perpus-gray-800 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-perpus-gray-600 dark:text-perpus-gray-400"/>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-perpus-black dark:text-perpus-white">Jam Operasional Perpustakaan</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1 mt-2">
                            {[
            { day: 'Senin – Jumat', time: '08:00 – 17:00' },
            { day: 'Sabtu', time: '09:00 – 14:00' },
            { day: 'Minggu & Libur', time: 'Tutup' },
        ].map(h => (<div key={h.day} className="flex items-center justify-between text-sm">
                                    <span className="text-perpus-gray-500">{h.day}</span>
                                    <span className={clsx('font-medium', h.time === 'Tutup' ? 'text-perpus-red' : 'text-perpus-black dark:text-perpus-white')}>
                                        {h.time}
                                    </span>
                                </div>))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-sm text-perpus-gray-500">
                            <Phone className="w-4 h-4"/>
                            <span>(021) 1234-5678</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-perpus-gray-500">
                            <Mail className="w-4 h-4"/>
                            <span>info@myperpus.id</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-perpus-gray-500">
                            <MapPin className="w-4 h-4"/>
                            <span>Jakarta Pusat</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>);
}
