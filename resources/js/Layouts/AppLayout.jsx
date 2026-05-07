import React, { useState, useEffect, useCallback } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Home, Library, Users, UserCheck, Settings, Bell, Search, Menu, X, Sun, Moon, LogOut, ChevronDown, BookMarked, ClipboardList, BarChart2, Layers, User, MessageSquare } from 'lucide-react';
import clsx from 'clsx';
import debounce from 'lodash/debounce';
// ============================================
// Sidebar Nav Items per Role
// ============================================
const navPengguna = [
    { href: '/dashboard', label: 'Beranda', icon: Home },
    { href: '/katalog', label: 'Katalog Buku', icon: Library },
    { href: '/baca-online', label: 'Baca Online', icon: BookOpen },
    { href: '/peminjaman', label: 'Peminjaman Saya', icon: BookMarked },
    { href: '/riwayat', label: 'Riwayat', icon: ClipboardList },
    { href: '/ulasan-saya', label: 'Ulasan Saya', icon: MessageSquare },
    { href: '/profile', label: 'Profil', icon: User },
];
const navPetugas = [
    { href: '/petugas/dashboard', label: 'Dashboard', icon: Home },
    { href: '/petugas/peminjaman', label: 'Peminjaman', icon: ClipboardList },
    // { href: '/petugas/buku', label: 'Kelola Buku', icon: Library },
    { href: '/petugas/laporan', label: 'Laporan', icon: BarChart2 },
    { href: '/profile', label: 'Profil', icon: User },
];
const navAdmin = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/buku', label: 'Manajemen Buku', icon: Library },
    { href: '/admin/kategori', label: 'Kategori', icon: Layers },
    { href: '/admin/anggota', label: 'Anggota', icon: Users },
    { href: '/admin/petugas', label: 'Petugas', icon: UserCheck },
    { href: '/admin/peminjaman', label: 'Peminjaman', icon: ClipboardList },
    { href: '/admin/ulasan', label: 'Ulasan', icon: MessageSquare },
    { href: '/admin/laporan-buku', label: 'Laporan Buku', icon: BookMarked },
    { href: '/admin/statistik', label: 'Statistik', icon: BarChart2 },
    { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings },
];
export default function AppLayout({ children, title }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [topbarSearch, setTopbarSearch] = useState('');
    const user = auth.user;
    const isAdmin = user?.roles?.includes('admin');
    const isPetugas = user?.roles?.includes('petugas');
    const navItems = isAdmin ? navAdmin : isPetugas ? navPetugas : navPengguna;
    const roleLabel = isAdmin ? 'Admin' : isPetugas ? 'Petugas' : 'Anggota';
    const roleColor = isAdmin
        ? 'bg-perpus-gold text-yellow-900'
        : isPetugas
            ? 'bg-perpus-green text-white'
            : 'bg-perpus-black dark:bg-perpus-white text-white dark:text-perpus-black';
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);
    const handleLogout = async (e) => {
        if (e && typeof e.preventDefault === 'function')
            e.preventDefault();
        const confirmFn = (typeof window !== 'undefined' && window.confirmAction)
            ? window.confirmAction
            : (msg) => Promise.resolve(typeof window !== 'undefined' ? confirm(msg) : true);
        const ok = await confirmFn('Keluar dari akun Anda?');
        if (!ok)
            return;
        router.post('/logout');
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('/notifications');
            setNotifications(res.data || []);
        } catch (e) {
            // ignore
        }
    };
    const debouncedRedirectToKatalog = useCallback(debounce((val) => {
        try {
            router.get('/katalog', { search: val }, { replace: true });
        } finally {
            setShowMobileSearch(false);
        }
    }, 250), []);

    useEffect(() => {
        return () => debouncedRedirectToKatalog.cancel();
    }, [debouncedRedirectToKatalog]);
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    return (<div className="flex h-screen overflow-hidden bg-perpus-gray-50 dark:bg-perpus-black">

            {/* ---- MOBILE OVERLAY ---- */}
            <AnimatePresence>
                {sidebarOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}
            </AnimatePresence>

            {/* ---- SIDEBAR ---- */}
            <motion.aside className={clsx('fixed inset-y-0 left-0 z-50 w-64 flex flex-col', 'bg-perpus-white dark:bg-perpus-gray-900', 'border-r border-perpus-gray-100 dark:border-perpus-gray-800', 'lg:static lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', 'transition-transform duration-300 ease-in-out')}>
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-perpus-gray-100 dark:border-perpus-gray-800">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        {/* <div className="w-8 h-8 rounded-lg bg-perpus-black dark:bg-perpus-white flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white dark:text-perpus-black"/>
                        </div> */}
                        <span className="font-display font-bold text-lg tracking-tight text-perpus-black dark:text-perpus-white">
                            My<span className="text-perpus-gold">Perpus</span>
                        </span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost p-1.5">
                        <X className="w-4 h-4"/>
                    </button>
                </div>

                {/* User Card */}
                <div className="px-4 py-4 border-b border-perpus-gray-100 dark:border-perpus-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-perpus-gray-200 dark:bg-perpus-gray-700">
                                {user?.avatar ? (<img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-perpus-gray-500 font-semibold text-sm">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>)}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-perpus-white dark:border-perpus-gray-900"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-perpus-black dark:text-perpus-white truncate">{user?.name}</p>
                            <span className={clsx('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', roleColor)}>
                                {roleLabel}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
            return (<Link key={item.href} href={item.href} className={isActive ? 'nav-item-active' : 'nav-item'} onClick={() => setSidebarOpen(false)}>
                                <Icon className="w-4 h-4 flex-shrink-0"/>
                                <span>{item.label}</span>
                            </Link>);
        })}
                </nav>

                {/* Bottom logout */}
                <div className="px-3 py-4 border-t border-perpus-gray-100 dark:border-perpus-gray-800">
                    <button type="button" onClick={handleLogout} className="nav-item w-full text-perpus-red hover:text-perpus-red">
                        <LogOut className="w-4 h-4"/>
                        <span>Keluar</span>
                    </button>
                </div>
            </motion.aside>

            {/* ---- MAIN CONTENT ---- */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* TOP BAR */}
                <header className="h-16 flex items-center gap-4 px-4 sm:px-6
                                   bg-perpus-white/80 dark:bg-perpus-gray-900/80
                                   backdrop-blur-xl border-b border-perpus-gray-100 dark:border-perpus-gray-800
                                   sticky top-0 z-30">

                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-2">
                        <Menu className="w-5 h-5"/>
                    </button>

                    {/* Mobile search button */}
                    <button onClick={() => setShowMobileSearch(true)} className="sm:hidden btn-ghost p-2">
                        <Search className="w-5 h-5"/>
                    </button>

                    {/* Search */}
                    <div className="hidden sm:flex flex-1 max-w-md">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                            <input
                                type="search"
                                value={topbarSearch}
                                onChange={e => setTopbarSearch(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        router.get('/katalog', { search: e.target.value }, { replace: true });
                                    }
                                }}
                                placeholder="Cari buku, penulis..."
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl
                                           bg-perpus-gray-50 dark:bg-perpus-gray-800
                                           border border-perpus-gray-200 dark:border-perpus-gray-700
                                           text-perpus-black dark:text-perpus-white
                                           placeholder:text-perpus-gray-400
                                           focus:outline-none focus:ring-2 focus:ring-perpus-black/10 dark:focus:ring-perpus-white/10"
                            />
                        </div>
                    </div>

                    {/* Mobile search overlay */}
                    <AnimatePresence>
                        {showMobileSearch && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="topbar-search-overlay" onClick={() => setShowMobileSearch(false)}>
                                <div className="topbar-search-panel" onClick={e => e.stopPropagation()}>
                                    <div className="relative w-full max-w-xl mx-auto">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-perpus-gray-400"/>
                                        <input
                                            autoFocus
                                            type="search"
                                            value={topbarSearch}
                                            onChange={e => {
                                                setTopbarSearch(e.target.value);
                                                debouncedRedirectToKatalog(e.target.value);
                                            }}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    router.get('/katalog', { search: e.target.value }, { replace: true });
                                                    setShowMobileSearch(false);
                                                }
                                            }}
                                            placeholder="Cari buku, penulis..."
                                            className="w-full pl-9 pr-10 py-2 text-sm rounded-xl bg-perpus-gray-50 dark:bg-perpus-gray-800 border border-perpus-gray-200 dark:border-perpus-gray-700 text-perpus-black dark:text-perpus-white placeholder:text-perpus-gray-400 focus:outline-none focus:ring-2 focus:ring-perpus-black/10 dark:focus:ring-perpus-white/10"
                                        />
                                        <button onClick={() => setShowMobileSearch(false)} className="absolute right-2 top-1/2 -translate-y-1/2 btn-ghost p-1">
                                            <X className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-2 ml-auto">
                        {/* Dark Mode Toggle */}
                        <button onClick={() => setDarkMode(!darkMode)} className="btn-ghost p-2 rounded-xl" title="Toggle tema">
                            {darkMode
            ? <Sun className="w-4 h-4 text-yellow-400"/>
            : <Moon className="w-4 h-4"/>}
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button onClick={async () => { setNotifOpen(!notifOpen); if (!notifOpen) await fetchNotifications(); }} className="btn-ghost p-2 rounded-xl relative">
                                <Bell className="w-4 h-4"/>
                                {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-perpus-red rounded-full"/>}
                            </button>

                            {notifOpen && (
                                <div className="absolute right-0 top-full mt-2 w-80 card shadow-perpus-lg py-2 z-50">
                                    <div className="px-3 py-2 text-sm font-semibold">Notifikasi</div>
                                    <div className="max-h-64 overflow-auto">
                                        {notifications.length === 0 && <div className="px-3 py-2 text-sm text-perpus-gray-500">Tidak ada notifikasi baru.</div>}
                                        {notifications.map(n => (
                                            <div key={n.id} className="px-3 py-2 hover:bg-perpus-gray-50 cursor-pointer" onClick={async () => { await axios.post(`/notifications/${n.id}/mark-read`); if (n.peminjaman_id) window.location.href = `/peminjaman/${n.peminjaman_id}`; else window.location.reload(); }}>
                                                <div className="text-sm">{n.message}</div>
                                                <div className="text-xs text-perpus-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative">
                            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 btn-ghost px-2 py-1.5 rounded-xl">
                                <div className="w-7 h-7 rounded-lg bg-perpus-gray-200 dark:bg-perpus-gray-700 overflow-hidden">
                                    {user?.avatar ? (<img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center text-[11px] font-bold">
                                            {user?.name?.charAt(0)}
                                        </div>)}
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-perpus-gray-400"/>
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-full mt-2 w-48 card shadow-perpus-lg py-1 z-50">
                                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800 transition-colors">
                                            <User className="w-4 h-4"/> Profil Saya
                                        </Link>
                                        <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800 transition-colors">
                                            <Settings className="w-4 h-4"/> Pengaturan
                                        </Link>
                                        <div className="my-1 border-t border-perpus-gray-100 dark:border-perpus-gray-800"/>
                                        <button type="button" onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-perpus-red hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">
                                            <LogOut className="w-4 h-4"/> Keluar
                                        </button>
                                    </motion.div>)}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto">
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </motion.div>
                </main>

                {/* Mobile bottom nav */}
                <nav className="mobile-bottom-nav lg:hidden">
                    {navItems.slice(0,5).map(item => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                        return (
                            <Link key={item.href} href={item.href} className={clsx('flex-1', isActive ? 'text-perpus-black dark:text-perpus-white' : 'text-perpus-gray-500 dark:text-perpus-gray-400')}>
                                <div className="flex flex-col items-center justify-center">
                                    <Icon className="nav-icon" />
                                    <span className="text-[11px] leading-none">{item.label.split(' ')[0]}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>);
}
