import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Pengaturan() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const fileRef = useRef(null);
    const [form, setForm] = useState({ brand_name: '', address: '', footer_text: '', card_expiry_years: 1 });

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get('/admin/pengaturan/data');
                setSettings(res.data || {});
                setForm({
                    brand_name: res.data.brand_name || '',
                    address: res.data.address || '',
                    footer_text: res.data.footer_text || '',
                    card_expiry_years: res.data.card_expiry_years || 1,
                });
            } catch (e) {
                toast.error('Gagal memuat pengaturan');
            } finally { setLoading(false); }
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('brand_name', form.brand_name || '');
        data.append('address', form.address || '');
        data.append('footer_text', form.footer_text || '');
        data.append('card_expiry_years', form.card_expiry_years || 1);
        if (fileRef.current?.files?.[0]) data.append('brand_logo', fileRef.current.files[0]);

        try {
            const res = await axios.post('/admin/pengaturan', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSettings(res.data.settings || {});
            toast.success('Pengaturan disimpan');
        } catch (err) {
            toast.error('Gagal menyimpan pengaturan');
        }
    };

    return (
        <AppLayout title="Pengaturan">
            <div className="max-w-4xl mx-auto">
                <div className="page-header">
                    <h1 className="page-title">Pengaturan Aplikasi</h1>
                    <p className="page-subtitle">Atur branding dan preferensi kartu keanggotaan</p>
                </div>

                <div className="card p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="input-label">Nama Perpustakaan</label>
                            <input className="input" value={form.brand_name} onChange={e => setForm({...form, brand_name: e.target.value})} />
                        </div>

                        <div>
                            <label className="input-label">Logo Perpustakaan (opsional)</label>
                            <div className="flex items-center gap-3">
                                <input ref={fileRef} type="file" accept="image/*" />
                                {settings.brand_logo && <img src={`/storage/${settings.brand_logo}`} alt="logo" className="w-12 h-12 object-cover rounded" />}
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Footer / Catatan kecil</label>
                            <input className="input" value={form.footer_text} onChange={e => setForm({...form, footer_text: e.target.value})} />
                        </div>

                        <div>
                            <label className="input-label">Alamat Perpustakaan</label>
                            <textarea className="input" rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                        </div>

                        <div>
                            <label className="input-label">Masa berlaku Kartu (tahun)</label>
                            <input type="number" min={0} max={10} className="input w-28" value={form.card_expiry_years} onChange={e => setForm({...form, card_expiry_years: e.target.value})} />
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" className="btn-primary">Simpan Pengaturan</button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
