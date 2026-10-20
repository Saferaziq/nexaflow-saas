'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [cafeName, setCafeName] = useState('Memuat...');
  const [userEmail, setUserEmail] = useState('');
  const [tenantId, setTenantId] = useState(null);
  const [activeTab, setActiveTab] = useState('queue');
  
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  
  const [queueFilter, setQueueFilter] = useState('active');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' });
  const [settings, setSettings] = useState({ name: '', wa: '', address: '', logo_url: '' });
  const [newTableNum, setNewTableNum] = useState('');
  
  const [todayStr, setTodayStr] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const router = useRouter();

  const rp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

  useEffect(() => {
    setTodayStr(new Date().toDateString());
    setBaseUrl(window.location.origin);
    
    let channel, isMounted = true;

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      if (!isMounted) return;
      setUserEmail(session.user.email);

      const { data: userData } = await supabase.from('users').select('tenant_id, tenants(*)').eq('id', session.user.id).single();
      if (userData && userData.tenants && isMounted) {
        const tId = userData.tenant_id;
        setTenantId(tId);
        setCafeName(userData.tenants.name);
        setSettings({ 
          name: userData.tenants.name, 
          wa: userData.tenants.wa_number || '', 
          address: userData.tenants.address || '',
          logo_url: userData.tenants.logo_url || ''
        });
        fetchMenus(tId); fetchTables(tId); fetchOrders(tId);
        
        channel = supabase.channel('realtime-orders-' + Date.now())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `tenant_id=eq.${tId}` }, () => fetchOrders(tId))
          .subscribe();
      }
    };
    fetchData();
    return () => { isMounted = false; if (channel) supabase.removeChannel(channel); };
  }, [router]);

  const fetchMenus = async (tId) => { const { data } = await supabase.from('menus').select('*').eq('tenant_id', tId).order('created_at', { ascending: false }); if (data) setMenus(data); };
  const fetchTables = async (tId) => { const { data } = await supabase.from('tables').select('*').eq('tenant_id', tId).order('table_number', { ascending: true }); if (data) setTables(data); };
  const fetchOrders = async (tId) => { const { data } = await supabase.from('orders').select('*').eq('tenant_id', tId).order('created_at', { ascending: false }); if (data) setOrders(data); };
  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login'); };

  const handleImageUpload = async (e, isLogo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isLogo) setUploadingLogo(true);
    else setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}-${Date.now()}.${fileExt}`;
      const bucket = isLogo ? 'cafe-logos' : 'menu-images';

      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      
      if (isLogo) {
        setSettings(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      } else {
        setCurrentMenu(prev => ({ ...prev, image_url: urlData.publicUrl }));
      }
    } catch (err) {
      alert('Gagal upload foto: ' + err.message);
    }
    
    if (isLogo) setUploadingLogo(false);
    else setUploading(false);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    const payload = { tenant_id: tenantId, name: currentMenu.name, category: currentMenu.category, price: parseFloat(currentMenu.price), description: currentMenu.desc, status: currentMenu.status, image_url: currentMenu.image_url };
    if (currentMenu.id) await supabase.from('menus').update(payload).eq('id', currentMenu.id);
    else await supabase.from('menus').insert([payload]);
    setIsMenuModalOpen(false); fetchMenus(tenantId);
  };

  const handleDeleteMenu = async (id) => { if (confirm('Hapus menu ini?')) { await supabase.from('menus').delete().eq('id', id); fetchMenus(tenantId); } };
  
  const handleUpdateOrderStatus = async (id, status) => { 
    const updates = { status }; 
    if (status === 'completed') updates.payment_status = 'paid'; 
    await supabase.from('orders').update(updates).eq('id', id); 
    fetchOrders(tenantId); 
  };

  const handleAddTable = async (e) => { e.preventDefault(); if (!newTableNum) return; await supabase.from('tables').insert([{ tenant_id: tenantId, table_number: newTableNum }]); setNewTableNum(''); fetchTables(tenantId); };
  const handleDeleteTable = async (id) => { if (confirm('Hapus meja ini?')) { await supabase.from('tables').delete().eq('id', id); fetchTables(tenantId); } };
  
  const handleSaveSettings = async (e) => { 
    e.preventDefault(); 
    await supabase.from('tenants').update({ name: settings.name, wa_number: settings.wa, address: settings.address, logo_url: settings.logo_url }).eq('id', tenantId); 
    setCafeName(settings.name); 
    alert('Pengaturan disimpan!'); 
  };

  const printBill = (order) => {
    const win = window.open('', '', 'width=400,height=600');
    win.document.write(`
      <html><head><title>Struk</title>
      <style>body{font-family:monospace;font-size:12px;padding:10px;} .center{text-align:center;} table{width:100%;} td{padding:2px 0;}</style>
      </head><body>
      <div class="center"><h3>${settings.name}</h3><p>${settings.address}</p><p>WA: ${settings.wa}</p></div>
      <hr><p>Meja: ${order.table_number}<br>Order: ${order.id.slice(0,8)}<br>Tanggal: ${new Date(order.created_at).toLocaleString('id-ID')}</p><hr>
      <table>${order.items.map(i => `<tr><td>${i.name} x${i.qty}</td><td style="text-align:right">${rp(i.price*i.qty)}</td></tr>`).join('')}</table>
      <hr><table><tr><td><b>TOTAL</b></td><td style="text-align:right"><b>${rp(order.total_price)}</b></td></tr></table>
      <hr><div class="center"><p>${order.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}</p><p>Terima Kasih!</p></div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const activeOrders = orders.filter(o => ['pending', 'cooking', 'ready'].includes(o.status));
  const filteredOrders = queueFilter === 'active' ? activeOrders : queueFilter === 'done' ? orders.filter(o => ['completed', 'cancelled'].includes(o.status)) : orders;
  const todayOrders = orders.filter(o => todayStr && new Date(o.created_at).toDateString() === todayStr);
  const stats = { total: todayOrders.length, cooking: todayOrders.filter(o => o.status === 'cooking').length, ready: todayOrders.filter(o => o.status === 'ready').length, revenue: todayOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total_price), 0) };

  return (
    <div className="min-h-screen bg-slate-100/70 flex font-sans text-slate-800">
      
      {/* SIDEBAR (Akan disembunyikan saat print) */}
      <div className="w-64 bg-white border-r border-slate-200 p-5 flex-col justify-between hidden md:flex h-screen sticky top-0 print:hidden">
        <div>
          <div className="flex items-center gap-3 mb-8">
            {settings.logo_url ? (
              <img src={settings.logo_url} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="Logo" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold">N</div>
            )}
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">NexaFlow</h1>
              <p className="text-[10px] font-bold text-emerald-500">SaaS Resto</p>
            </div>
          </div>
          <nav className="space-y-1.5">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 mt-4">Menu Utama</p>
            <button onClick={() => setActiveTab('queue')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex justify-between items-center ${activeTab === 'queue' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}><span>📋 Antrian</span>{activeOrders.length > 0 && <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{activeOrders.length}</span>}</button>
            <button onClick={() => setActiveTab('menu')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'menu' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}>🍽️ Kelola Menu</button>
            <button onClick={() => setActiveTab('tables')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'tables' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}>🪑 Meja & QR</button>
            <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'}`}>⚙️ Pengaturan</button>
          </nav>
        </div>
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs font-black text-slate-800 truncate mb-0.5">{cafeName}</p>
          <p className="text-[10px] text-slate-500 truncate mb-4">{userEmail}</p>
          <button onClick={handleLogout} className="w-full bg-rose-50 text-rose-600 font-bold py-2.5 rounded-xl text-xs hover:bg-rose-100 transition-all">Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:overflow-visible print:h-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 z-10 print:hidden">
          <h2 className="text-xl font-black text-slate-900">{cafeName}</h2>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span className="text-xs font-bold text-slate-500">Sistem Online</span></div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 print:p-0 print:bg-white print:overflow-visible">
          <div className="max-w-6xl mx-auto space-y-6 print:max-w-none print:space-y-0">
            
            {/* STATS (Disembunyikan saat print) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
              <div className="card-3d p-5 rounded-3xl"><p className="text-[11px] text-slate-400 font-extrabold uppercase">Total Pesanan</p><h3 className="text-3xl font-black text-slate-900 mt-1">{stats.total}</h3></div>
              <div className="card-3d p-5 rounded-3xl"><p className="text-[11px] text-orange-600 font-extrabold uppercase">Sedang Dimasak</p><h3 className="text-3xl font-black text-orange-600 mt-1">{stats.cooking}</h3></div>
              <div className="card-3d p-5 rounded-3xl"><p className="text-[11px] text-emerald-600 font-extrabold uppercase">Siap Disajikan</p><h3 className="text-3xl font-black text-emerald-600 mt-1">{stats.ready}</h3></div>
              <div className="card-3d p-5 rounded-3xl"><p className="text-[11px] text-indigo-600 font-extrabold uppercase">Omset Hari Ini</p><h3 className="text-2xl font-black text-indigo-600 mt-1">{rp(stats.revenue)}</h3></div>
            </div>

            {/* TAB ANTRIAN */}
            {activeTab === 'queue' && (
              <div className="space-y-4 print:hidden">
                <div className="flex gap-2">
                  <button onClick={() => setQueueFilter('active')} className={`px-4 py-2 rounded-xl text-xs font-bold ${queueFilter === 'active' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-600 border'}`}>Aktif</button>
                  <button onClick={() => setQueueFilter('done')} className={`px-4 py-2 rounded-xl text-xs font-bold ${queueFilter === 'done' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-600 border'}`}>Selesai</button>
                  <button onClick={() => setQueueFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold ${queueFilter === 'all' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-600 border'}`}>Semua</button>
                </div>
                {filteredOrders.length === 0 ? <div className="card-3d p-12 text-center rounded-3xl"><p className="text-slate-400 font-bold">Tidak ada antrian pesanan.</p></div> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map(order => (
                      <div key={order.id} className="card-3d p-5 rounded-3xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center border-b pb-3 mb-3">
                            <span className="font-black text-lg">Meja {order.table_number}</span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : order.status === 'cooking' ? 'bg-blue-100 text-blue-700' : order.status === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{order.status}</span>
                          </div>
                          <div className="space-y-1.5 mb-4">
                            {order.items.map((item, idx) => <div key={idx} className="flex justify-between text-xs font-semibold"><span>{item.qty}x {item.name}</span><span>{rp(item.price * item.qty)}</span></div>)}
                          </div>
                        </div>
                        <div>
                          <p className="font-black text-right border-t pt-2 mb-4 text-sm">Total: {rp(order.total_price)}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {order.status !== 'completed' && order.status !== 'cancelled' && (
                              <>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'cooking')} className="bg-blue-50 text-blue-700 font-bold py-2 rounded-xl text-xs hover:bg-blue-100">Masak</button>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'ready')} className="bg-emerald-50 text-emerald-700 font-bold py-2 rounded-xl text-xs hover:bg-emerald-100">Sajikan</button>
                                <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="col-span-2 bg-slate-900 text-white font-bold py-2 rounded-xl text-xs">Selesai / Lunas</button>
                              </>
                            )}
                            <button onClick={() => printBill(order)} className="col-span-2 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs">🖨️ Cetak Struk</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB MENU */}
            {activeTab === 'menu' && (
              <div className="space-y-4 print:hidden">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-lg text-slate-800">Daftar Menu</h3>
                  <button onClick={() => { setCurrentMenu({ id: null, name: '', category: 'makanan', price: '', desc: '', status: 'available', image_url: '' }); setIsMenuModalOpen(true); }} className="btn-3d-orange text-white font-bold py-2 px-4 rounded-xl text-xs">+ Tambah Menu</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menus.map(menu => (
                    <div key={menu.id} className="card-3d rounded-3xl overflow-hidden flex flex-col justify-between">
                      <div className="h-40 bg-slate-100 relative">
                        {menu.image_url ? <img src={menu.image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>}
                        <span className="absolute top-2 right-2 text-[10px] font-bold bg-white/90 px-2 py-1 rounded-full uppercase">{menu.category}</span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div><h4 className="font-black text-slate-800">{menu.name}</h4><p className="text-xs text-slate-500 mb-2 line-clamp-2">{menu.description || 'Tidak ada deskripsi'}</p><p className="font-black text-orange-600">{rp(menu.price)}</p></div>
                        <div className="flex gap-2 mt-4">
                          <button onClick={() => { setCurrentMenu({ ...menu, desc: menu.description || '' }); setIsMenuModalOpen(true); }} className="flex-1 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs hover:bg-slate-200">Edit</button>
                          <button onClick={() => handleDeleteMenu(menu.id)} className="flex-1 bg-rose-50 text-rose-600 font-bold py-2 rounded-xl text-xs hover:bg-rose-100">Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB MEJA & QR (Di sinilah fitur Print berada) */}
            {activeTab === 'tables' && (
              <div className="card-3d p-6 rounded-3xl print:border-none print:shadow-none print:p-0">
                
                {/* Header & Tombol Print (Disembunyikan saat print) */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 print:hidden">
                  <h3 className="font-black text-lg">Generator QR Meja</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <form onSubmit={handleAddTable} className="flex gap-2 flex-1">
                      <input type="number" required value={newTableNum} onChange={e => setNewTableNum(e.target.value)} placeholder="No Meja" className="border rounded-xl px-3 py-2 text-sm w-24" />
                      <button type="submit" className="btn-3d-orange text-white font-bold px-4 py-2 rounded-xl text-xs">Tambah</button>
                    </form>
                    <button onClick={() => window.print()} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap">
                      🖨️ Cetak Semua QR
                    </button>
                  </div>
                </div>

                {/* Grid QR Code */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4 print:w-full">
                  {tables.map(t => (
                    <div key={t.id} className="bg-slate-50 border p-4 rounded-2xl text-center print:border-dashed print:border-gray-400 print:bg-white print:p-2 print:rounded-none">
                      <p className="font-black text-sm mb-2 print:text-base print:mb-1">Meja {t.table_number}</p>
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${baseUrl}/order?tenant=${tenantId}&table=${t.table_number}`)}`} className="w-full rounded-xl mb-3 print:rounded-none print:mb-1" alt="QR" />
                      <button onClick={() => handleDeleteTable(t.id)} className="text-[10px] text-rose-500 font-bold hover:underline print:hidden">Hapus Meja</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB PENGATURAN */}
            {activeTab === 'settings' && (
              <div className="card-3d p-6 md:p-8 rounded-3xl max-w-xl mx-auto print:hidden">
                <h3 className="font-black text-lg border-b pb-4 mb-6">Pengaturan Profil Toko</h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-bold mb-1">Logo Kafe</label>
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border">
                      {settings.logo_url ? (
                        <img src={settings.logo_url} className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white" />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-2xl">🏪</div>
                      )}
                      <div className="flex-1">
                        <input type="file" accept="image/*" ref={logoInputRef} onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                        <button type="button" onClick={() => logoInputRef.current?.click()} className="bg-white border text-slate-700 font-bold py-2 px-4 rounded-xl text-xs w-full shadow-sm hover:bg-slate-50">
                          {uploadingLogo ? 'Mengupload...' : '📷 Ganti Logo'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div><label className="block text-xs font-bold mb-1">Nama Kafe</label><input type="text" value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-orange-500" /></div>
                  <div><label className="block text-xs font-bold mb-1">No. WhatsApp</label><input type="text" value={settings.wa} onChange={e => setSettings({...settings, wa: e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-orange-500" /></div>
                  <div><label className="block text-xs font-bold mb-1">Alamat</label><input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-orange-500" /></div>
                  
                  <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm mt-4 hover:bg-slate-800">Simpan Pengaturan</button>
                </form>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* MODAL TAMBAH/EDIT MENU */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-lg mb-4">{currentMenu.id ? 'Edit Menu' : 'Tambah Menu Baru'}</h3>
            <form onSubmit={handleSaveMenu} className="space-y-3">
              
              <div>
                <label className="block text-xs font-bold mb-1">Foto Menu</label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-3xl">
                    {currentMenu.image_url ? <img src={currentMenu.image_url} className="w-full h-full object-cover" /> : '🍽️'}
                  </div>
                  <div className="flex-1">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs w-full hover:bg-slate-200">
                      {uploading ? 'Mengupload...' : '📷 Pilih Foto'}
                    </button>
                  </div>
                </div>
              </div>

              <div><label className="block text-xs font-bold mb-1">Nama Menu</label><input required type="text" value={currentMenu.name} onChange={e => setCurrentMenu({...currentMenu, name: e.target.value})} className="w-full border p-3 rounded-xl text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Harga (Rp)</label><input required type="number" value={currentMenu.price} onChange={e => setCurrentMenu({...currentMenu, price: e.target.value})} className="w-full border p-3 rounded-xl text-sm" /></div>
              <div><label className="block text-xs font-bold mb-1">Kategori</label><select value={currentMenu.category} onChange={e => setCurrentMenu({...currentMenu, category: e.target.value})} className="w-full border p-3 rounded-xl text-sm bg-white"><option value="makanan">Makanan</option><option value="minuman">Minuman</option><option value="cemilan">Cemilan</option></select></div>
              <div><label className="block text-xs font-bold mb-1">Deskripsi</label><textarea value={currentMenu.desc} onChange={e => setCurrentMenu({...currentMenu, desc: e.target.value})} className="w-full border p-3 rounded-xl text-sm" rows="2"></textarea></div>
              
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 btn-3d-orange text-white font-bold py-3 rounded-xl text-sm">Simpan</button>
                <button type="button" onClick={() => setIsMenuModalOpen(false)} className="bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}