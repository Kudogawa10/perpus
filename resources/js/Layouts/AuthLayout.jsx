import React from 'react';
import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
export default function AuthLayout({ children, title, subtitle }) {
    return (<div className="min-h-screen flex">

            {/* LEFT PANEL - Decorative */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12
                           bg-perpus-black dark:bg-perpus-gray-900 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="grid grid-cols-8 gap-4 p-8 h-full">
                        {Array.from({ length: 64 }).map((_, i) => (<div key={i} className="border border-white rounded-sm aspect-square"/>))}
                    </div>
                </div>

                {/* Decorative book spines */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-20">
                    {['Sastra', 'Sains', 'Sejarah', 'Filsafat', 'Teknologi', 'Ekonomi', 'Budaya'].map((cat, i) => (<div key={cat} className="h-16 flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] text-white" style={{ width: `${24 + i * 4}px`, background: `rgba(255,255,255,${0.1 + i * 0.02})` }}>
                            <span className="rotate-90 whitespace-nowrap">{cat}</span>
                        </div>))}
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        {/* <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white"/>
                        </div> */}
                        <span className="font-display font-bold text-2xl text-white tracking-tight">
                            My<span className="text-perpus-gold">Perpus</span>
                        </span>
                    </Link>
                </div>

                {/* Tagline */}
                <div className="relative z-10">
                    <blockquote className="mb-8">
                        <p className="font-serif text-3xl text-white leading-snug mb-4">
                            "Sebuah buku yang baik adalah<br />
                            teman terbaik yang bisa kamu miliki."
                        </p>
                        <footer className="text-perpus-gray-400 text-sm">— Perpustakaan Digital Indonesia</footer>
                    </blockquote>

                    {/* Stats */}
                    <div className="flex gap-8">
                        {[
            { num: '10.000+', label: 'Koleksi Buku' },
            { num: '5.000+', label: 'Anggota Aktif' },
            { num: '500+', label: 'Buku Online' },
        ].map(stat => (<div key={stat.label}>
                                <p className="font-display font-bold text-xl text-white">{stat.num}</p>
                                <p className="text-perpus-gray-400 text-xs mt-0.5">{stat.label}</p>
                            </div>))}
                    </div>
                </div>
            </motion.div>

            {/* RIGHT PANEL - Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-perpus-white dark:bg-perpus-black">

                {/* Mobile Logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                            {/* <div className="w-8 h-8 rounded-lg bg-perpus-black dark:bg-perpus-white flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white dark:text-perpus-black"/>
                            </div> */}
                        <span className="font-display font-bold text-xl text-perpus-black dark:text-perpus-white">
                            My<span className="text-perpus-gold">Perpus</span>
                        </span>
                    </Link>
                </div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="font-display font-bold text-2xl text-perpus-black dark:text-perpus-white mb-2">
                            {title}
                        </h1>
                        {subtitle && (<p className="text-perpus-gray-500 dark:text-perpus-gray-400 text-sm">{subtitle}</p>)}
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>);
}
