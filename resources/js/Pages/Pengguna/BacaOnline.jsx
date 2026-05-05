import React, { useState, useCallback } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Menu, X, Bookmark, BookMarked } from 'lucide-react';
import clsx from 'clsx';
export default function BacaOnline({ buku, halaman_terakhir }) {
    const [currentPage, setCurrentPage] = useState(halaman_terakhir || 1);
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showToc, setShowToc] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const totalPages = buku.halaman;
    const goToPage = (page) => {
        const p = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(p);
        // Save progress to server
        fetch(`/api/baca-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
            body: JSON.stringify({ buku_id: buku.id, halaman: p })
        });
    };
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
            goToPage(currentPage + 1);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
            goToPage(currentPage - 1);
    }, [currentPage]);
    const progressPercent = Math.round((currentPage / totalPages) * 100);
    return (<div className={clsx('flex flex-col bg-perpus-gray-100 dark:bg-perpus-gray-950', isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen')} onKeyDown={handleKeyDown} tabIndex={0}>

            {/* TOP BAR */}
            <div className="flex items-center gap-3 px-4 py-3 bg-perpus-white dark:bg-perpus-gray-900 border-b border-perpus-gray-200 dark:border-perpus-gray-800 z-20">
                <Link href="/baca-online" className="btn-ghost p-2">
                    <ArrowLeft className="w-4 h-4"/>
                </Link>

                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-perpus-black dark:text-perpus-white truncate">{buku.judul}</p>
                    <p className="text-xs text-perpus-gray-400 truncate">{buku.penulis}</p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsBookmarked(!isBookmarked)} className={clsx('btn-ghost p-2', isBookmarked && 'text-perpus-gold')} title="Tandai halaman">
                        {isBookmarked ? <BookMarked className="w-4 h-4"/> : <Bookmark className="w-4 h-4"/>}
                    </button>
                    <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="btn-ghost p-2" title="Perkecil">
                        <ZoomOut className="w-4 h-4"/>
                    </button>
                    <span className="text-xs text-perpus-gray-500 w-10 text-center font-mono">{zoom}%</span>
                    <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="btn-ghost p-2" title="Perbesar">
                        <ZoomIn className="w-4 h-4"/>
                    </button>
                    <button onClick={() => setShowToc(!showToc)} className="btn-ghost p-2 hidden md:flex" title="Daftar isi">
                        <Menu className="w-4 h-4"/>
                    </button>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn-ghost p-2" title="Layar penuh">
                        <Maximize2 className="w-4 h-4"/>
                    </button>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-0.5 bg-perpus-gray-200 dark:bg-perpus-gray-800">
                <motion.div className="h-full bg-perpus-black dark:bg-perpus-white" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.3 }}/>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* TABLE OF CONTENTS */}
                {showToc && (<motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 260, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-perpus-white dark:bg-perpus-gray-900 border-r border-perpus-gray-200 dark:border-perpus-gray-800 overflow-y-auto flex-shrink-0">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-semibold text-sm">Daftar Isi</p>
                                <button onClick={() => setShowToc(false)} className="btn-ghost p-1">
                                    <X className="w-4 h-4"/>
                                </button>
                            </div>
                            {/* Mock TOC */}
                            <div className="space-y-1">
                                {[
                { title: 'Pendahuluan', page: 1 },
                { title: 'Bab 1: Pengantar', page: 5 },
                { title: 'Bab 2: Pembahasan', page: 25 },
                { title: 'Bab 3: Analisis', page: 60 },
                { title: 'Bab 4: Kesimpulan', page: 95 },
                { title: 'Daftar Pustaka', page: 110 },
            ].map(item => (<button key={item.title} onClick={() => goToPage(item.page)} className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', currentPage >= item.page
                    ? 'bg-perpus-gray-100 dark:bg-perpus-gray-800 text-perpus-black dark:text-perpus-white'
                    : 'text-perpus-gray-500 hover:bg-perpus-gray-50 dark:hover:bg-perpus-gray-800')}>
                                        <span className="block font-medium">{item.title}</span>
                                        <span className="text-xs text-perpus-gray-400">Halaman {item.page}</span>
                                    </button>))}
                            </div>
                        </div>
                    </motion.aside>)}

                {/* MAIN PDF VIEWER */}
                <div className="flex-1 flex flex-col items-center overflow-auto py-8 px-4">
                    <motion.div key={currentPage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} style={{ width: `${zoom}%`, maxWidth: '800px' }} className="relative shadow-perpus-xl rounded-lg overflow-hidden">
                        {buku.file_pdf ? (<iframe src={`/baca-online/${buku.id}/pdf#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0`} className="w-full" style={{ height: `${(zoom / 100) * 1100}px`, border: 'none' }} title={`${buku.judul} - Halaman ${currentPage}`}/>) : (
        /* Fallback: Mock page display */
        <div className="bg-white flex flex-col" style={{ minHeight: '800px', aspectRatio: '210/297', padding: '60px 70px' }}>
                                <div className="text-center mb-12">
                                    <p className="text-4xl font-serif text-perpus-black">{buku.judul}</p>
                                    <p className="text-perpus-gray-400 mt-3">{buku.penulis}</p>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {Array.from({ length: 12 }).map((_, i) => (<div key={i} className="h-4 rounded" style={{
                    background: '#e5e7eb',
                    width: i === 0 ? '100%' : i % 7 === 0 ? '60%' : `${85 + Math.sin(i) * 10}%`
                }}/>))}
                                </div>
                                <div className="text-center text-xs text-gray-300 mt-8">{currentPage}</div>
                            </div>)}
                    </motion.div>
                </div>
            </div>

            {/* BOTTOM NAVIGATION BAR */}
            <div className="bg-perpus-white dark:bg-perpus-gray-900 border-t border-perpus-gray-200 dark:border-perpus-gray-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1} className="btn-secondary disabled:opacity-30 px-4 py-2">
                        <ChevronLeft className="w-4 h-4"/>
                        <span className="hidden sm:block">Sebelumnya</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <input type="number" value={currentPage} onChange={e => goToPage(Number(e.target.value))} min={1} max={totalPages} className="w-16 text-center input py-1.5 text-sm"/>
                        <span className="text-sm text-perpus-gray-400">dari {totalPages}</span>
                    </div>

                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="btn-secondary disabled:opacity-30 px-4 py-2">
                        <span className="hidden sm:block">Berikutnya</span>
                        <ChevronRight className="w-4 h-4"/>
                    </button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">
                    <div className="h-1 flex-1 max-w-xs bg-perpus-gray-200 dark:bg-perpus-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-perpus-black dark:bg-perpus-white rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}/>
                    </div>
                    <span className="text-xs text-perpus-gray-400">{progressPercent}%</span>
                </div>
            </div>
        </div>);
}
