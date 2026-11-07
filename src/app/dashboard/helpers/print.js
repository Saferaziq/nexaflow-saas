// helpers/print.js
// Kumpulan fungsi cetak: printHTML, laporan harian, bill + QRIS, QR meja, laporan custom, export CSV

export const printHTML = (htmlContent) => {
  // 🔥 CEK MODE PRINTER DARI LOCALSTORAGE
  const mode = typeof window !== 'undefined' ? (localStorage.getItem('nexaflow_printer_mode') || 'browser') : 'browser';

  // 🔥 1. ANDROID (RawBT) & IPAD (BR RawPrinter) - SILENT PRINT
  if (mode === 'rawbt' || mode === 'brraw') {
    try {
      // Konversi HTML ke Base64 (mendukung karakter khusus/emoji)
      const base64Html = window.btoa(unescape(encodeURIComponent(htmlContent)));
      
      // Tentukan skema URL berdasarkan aplikasi
      const scheme = mode === 'rawbt' ? 'rawbt' : 'rawprinter';
      const url = `${scheme}:data:text/html;base64,${base64Html}`;
      
      // Trigger URL menggunakan iframe tersembunyi (tidak merusak halaman)
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
      
      return; // Hentikan eksekusi, jangan tampilkan window.print()
    } catch (err) {
      console.error('Gagal mencetak via RawBT/RawPrinter:', err);
      // Jika gagal, biarkan jatuh ke fallback browser di bawah
    }
  }

  // 🔥 2. BROWSER DEFAULT / QZ TRAY (Fallback Standar)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);
  
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();

  const triggerPrint = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => { 
        if (document.body.contains(iframe)) document.body.removeChild(iframe); 
      }, 10000);
    }, 500);
  };

  const images = iframe.contentWindow.document.images;
  if (images.length === 0) {
    triggerPrint();
    return;
  }

  let loadedCount = 0;
  const totalImages = images.length;

  const checkAllLoaded = () => {
    loadedCount++;
    if (loadedCount >= totalImages) {
      triggerPrint();
    }
  };

  for (let i = 0; i < totalImages; i++) {
    if (images[i].complete) {
      checkAllLoaded();
    } else {
      images[i].addEventListener('load', checkAllLoaded);
      images[i].addEventListener('error', checkAllLoaded);
    }
  }
};

const rp = (num) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

// Helper: hitung QRIS/Cash dari array order
const calcPaymentBreakdown = (ordersList) => {
  let qris = 0, cash = 0, qrisCount = 0, cashCount = 0;
  ordersList.forEach(o => {
    const amount = Number(o.total_price || 0);
    const method = String(o.payment_method || 'CASH').toUpperCase();
    if (method === 'QRIS') {
      qris += amount;
      qrisCount++;
    } else {
      cash += amount;
      cashCount++;
    }
  });
  return { qris, cash, qrisCount, cashCount };
};

export const printDailyReport = ({ orders, settings, userEmail }) => {
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
  const paidOrders = todayOrders.filter(o => o.payment_status === 'paid' || o.payment_status === 'PAID');
  const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total_price || 0), 0);
  const breakdown = calcPaymentBreakdown(paidOrders);
  
  const menuSales = {};
  paidOrders.forEach(o => {
    (o.items || []).forEach(item => {
      const key = item.name;
      if (!menuSales[key]) menuSales[key] = { qty: 0, revenue: 0 };
      menuSales[key].qty += item.qty;
      menuSales[key].revenue += item.price * item.qty;
    });
  });
  
  const html = `<html><head><title>Laporan Harian - ${settings.name}</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Courier New', monospace; font-size: 11px; padding: 10px; color: #000; max-width: 80mm; margin: 0 auto; line-height: 1.4; } .center { text-align: center; } .bold { font-weight: bold; } h1 { font-size: 14px; margin-bottom: 2px; } .line { border-top: 1px dashed #000; margin: 6px 0; } .line-double { border-top: 2px double #000; margin: 8px 0; } table { width: 100%; border-collapse: collapse; margin: 6px 0; } td { padding: 2px 0; vertical-align: top; font-size: 11px; } .right { text-align: right; } .section-title { font-size: 10px; font-weight: bold; text-transform: uppercase; background: #000; color: #fff; padding: 3px 6px; margin: 8px 0 4px; letter-spacing: 0.5px; } .menu-item { font-size: 10px; padding: 1px 0; } @media print { body { padding: 5px; } @page { margin: 3mm; } }</style></head><body><div class="center"><h1>${settings.name || 'Kafe'}</h1><p style="font-size: 10px;">${settings.address || ''}</p><div class="line-double"></div><h1 style="font-size: 12px;">LAPORAN HARIAN</h1><p style="font-size: 10px;">${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><div class="line-double"></div></div><table><tr><td class="bold">Kasir</td><td class="right">${userEmail}</td></tr><tr><td class="bold">Total Order</td><td class="right">${todayOrders.length} transaksi</td></tr><tr><td class="bold">Order Lunas</td><td class="right">${paidOrders.length} transaksi</td></tr></table><div class="section-title">RINGKASAN UANG</div><table><tr><td class="bold">Total Omset</td><td class="right bold">${rp(totalRevenue)}</td></tr><tr><td>- QRIS (${breakdown.qrisCount}x)</td><td class="right">${rp(breakdown.qris)}</td></tr><tr><td>- Cash (${breakdown.cashCount}x)</td><td class="right">${rp(breakdown.cash)}</td></tr></table>${Object.keys(menuSales).length > 0 ? `<div class="section-title">MENU TERJUAL</div><table>${Object.entries(menuSales).map(([name, data]) => `<tr class="menu-item"><td>${name}</td><td class="right">${data.qty}x</td><td class="right">${rp(data.revenue)}</td></tr>`).join('')}</table>` : ''}<div class="line-double"></div><div class="center" style="font-size: 9px; margin-top: 8px;"><p>Tanda Tangan Kasir:</p><br><br><br><p>_______________________</p><p class="bold" style="margin-top: 4px;">${userEmail}</p></div><div class="line"></div><p class="center" style="font-size: 8px; margin-top: 6px;">NexaFlow SaaS · ${new Date().toLocaleString('id-ID')}</p></body></html>`;
  printHTML(html);
};

export const printBillWithQRIS = ({ order, settings, generateDynamicQRIS, showToast }) => {
  if (!settings.qris_string) { showToast('QRIS belum diatur.', 'error'); return; }
  const dynamicQRIS = generateDynamicQRIS(settings.qris_string, order.total_price);
  if (!dynamicQRIS) { showToast('Gagal generate QRIS.', 'error'); return; }
  const subtotal = order.subtotal || order.total_price;
  const taxAmount = order.tax_amount || 0;
  const taxRate = settings.tax_percentage || 0;
  
  const paymentMethod = String(order.payment_method || 'CASH').toUpperCase();
  const isQRIS = paymentMethod === 'QRIS';
  const isPaid = ['PAID', 'paid'].includes(order.payment_status);
  
  const paymentSection = `
    <div class="line"></div>
    <table>
      <tr><td class="bold">Metode Bayar</td><td class="right bold">${isQRIS ? 'QRIS' : 'CASH'}</td></tr>
      <tr><td class="bold">Status</td><td class="right bold">${isPaid ? 'LUNAS' : 'BELUM BAYAR'}</td></tr>
    </table>
  `;
  
  const qrisBox = isQRIS ? `
    <div class="qris-box">
      <p class="bold" style="margin-bottom:4px;">BAYAR DENGAN QRIS</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(dynamicQRIS)}" alt="QRIS" />
      <p class="qris-text">Scan dengan aplikasi bank / e-wallet.</p>
      <p class="qris-text bold">Merchant: ${settings.name}</p>
    </div>
  ` : `
    <div class="qris-box">
      <p class="bold" style="font-size:12px; padding:8px; border:2px solid #000; display:inline-block;">BAYAR TUNAI DI KASIR</p>
    </div>
  `;
  
  const html = `<html><head><title>Bill - Meja ${order.table_number}</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Courier New', monospace; font-size: 11px; padding: 5px; color: #000; width: 100%; max-width: 72mm; margin: 0 auto; line-height: 1.2; } .center { text-align: center; } .bold { font-weight: bold; } h2 { font-size: 14px; margin-bottom: 2px; } table { width: 100%; border-collapse: collapse; margin: 5px 0; } td { padding: 2px 0; vertical-align: top; } .right { text-align: right; } .line { border-top: 1px dashed #000; margin: 5px 0; } .total { font-size: 13px; font-weight: bold; margin-top: 5px; } .qris-box { text-align: center; margin-top: 10px; } .qris-box img { width: 140px; height: 140px; display: block; margin: 0 auto; } .qris-text { font-size: 9px; color: #000; margin-top: 3px; } @media print { body { padding: 0; max-width: 100%; } @page { margin: 2mm; size: 80mm auto; } }</style></head><body><div class="center"><h2>${settings.name || 'Kafe'}</h2><p>${settings.address || ''}</p><p>WA: ${settings.wa || ''}</p></div><table><tr><td class="bold">Bill:</td><td class="right">#${order.id.slice(0,8).toUpperCase()}</td></tr><tr><td class="bold">Pelanggan:</td><td class="right">${order.customer_name || 'Tamu'}</td></tr><tr><td class="bold">Meja:</td><td class="right">${order.table_number}</td></tr><tr><td class="bold">Waktu:</td><td class="right">${new Date(order.created_at).toLocaleString('id-ID', {hour: '2-digit', minute:'2-digit'})}</td></tr></table><div class="line"></div><table>${order.items.map(i => `<tr><td>${i.qty}x ${i.name}</td><td class="right">${rp(i.price * i.qty)}</td></tr>`).join('')}</table><div class="line"></div><table><tr><td>Subtotal</td><td class="right">${rp(subtotal)}</td></tr>${taxAmount > 0 ? `<tr><td>PPN (${taxRate}%)</td><td class="right">${rp(taxAmount)}</td></tr>` : ''}<tr class="total"><td>TOTAL</td><td class="right">${rp(order.total_price)}</td></tr></table>${paymentSection}${qrisBox}<div class="line" style="margin-top:10px;"></div><p class="center" style="font-size:9px; margin-top:5px;">Terima Kasih</p></body></html>`;
  printHTML(html);
};

export const printTableQR = ({ table, baseUrl, tenantId, settings, showToast }) => {
  if (!baseUrl) { showToast('Halaman belum siap', 'error'); return; }
  const orderUrl = `${baseUrl}/order?tenant=${tenantId}&table=${table.table_number}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=H&margin=30&data=${encodeURIComponent(orderUrl)}`;
  const html = `<html><head><title>QR Meja ${table.table_number}</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: -apple-system, system-ui, sans-serif; text-align: center; padding: 30px; } .logo { width: 80px; height: 80px; object-fit: cover; border-radius: 16px; margin: 0 auto 16px; display: block; border: 2px solid #000; } .badge { display: inline-block; background: #000; color: white; font-size: 11px; font-weight: bold; padding: 4px 14px; border-radius: 99px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; } h1 { font-size: 22px; color: #0f172a; margin-bottom: 4px; font-weight: 900; } h2 { font-size: 48px; color: #000; margin: 8px 0 20px; font-weight: 900; letter-spacing: -1px; } .qr-wrapper { display: inline-block; padding: 16px; background: white; border: 3px dashed #000; border-radius: 16px; margin: 10px 0; } .qr-wrapper img { width: 320px; height: 320px; display: block; } .hint { font-size: 14px; color: #475569; font-weight: 600; margin-top: 16px; } .url { font-size: 10px; color: #94a3b8; margin-top: 8px; word-break: break-all; padding: 0 20px; } @media print { body { padding: 10px; } }</style></head><body>${settings.logo_url ? `<img src="${settings.logo_url}" class="logo" alt="Logo" />` : ''}<span class="badge">Scan untuk Pesan</span><h1>${settings.name || 'Kafe'}</h1><h2>Meja ${table.table_number}</h2><div class="qr-wrapper"><img src="${qrUrl}" alt="QR" /></div><p class="hint">Buka kamera HP, arahkan ke QR code</p><p class="url">${orderUrl}</p></body></html>`;
  printHTML(html);
};

export const exportCSV = ({ reportOrders, reportLabelForFile, showToast }) => {
  if (reportOrders.length === 0) { showToast('Tidak ada data', 'warning'); return; }
  const headers = ['Tanggal', 'Jam', 'Pelanggan', 'Meja', 'Order ID', 'Status', 'Metode Bayar', 'Status Bayar', 'Menu', 'Qty', 'Harga', 'Subtotal', 'PPN', 'Total Order'];
  const rows = [];
  reportOrders.forEach(o => {
    const dt = new Date(o.created_at);
    const dateStr = dt.toLocaleDateString('id-ID');
    const timeStr = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    (o.items || []).forEach(item => {
      rows.push([dateStr, timeStr, o.customer_name || 'Tamu', o.table_number, o.id.slice(0, 8), o.status, String(o.payment_method || 'CASH').toUpperCase(), o.payment_status, item.name, item.qty, item.price, item.price * item.qty, o.tax_amount || 0, o.total_price]);
    });
  });
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `laporan-${String(reportLabelForFile).replace(/[^a-zA-Z0-9-]/g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('CSV diunduh', 'success');
};

export const printReport = ({ reportStats, topMenus, reportLabel, settings, userEmail, reportNow }) => {
  const breakdown = {
    qris: reportStats.revenueQRIS || 0,
    cash: reportStats.revenueCash || 0,
    qrisCount: reportStats.countQRIS || 0,
    cashCount: reportStats.countCash || 0,
  };
  const statusCount = reportStats.statusCount || { pending: 0, cooking: 0, ready: 0, completed: 0, cancelled: 0 };
  
  const html = `<html><head><title>Laporan ${reportLabel}</title><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: -apple-system, system-ui, sans-serif; padding: 30px; color: #0f172a; } h1 { font-size: 22px; margin-bottom: 4px; font-weight: 900; } h2 { font-size: 13px; color: #64748b; margin-bottom: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; } .card { border: 1px solid #e2e8f0; padding: 14px; border-radius: 10px; } .card p:first-child { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 6px; } .card p:last-child { font-size: 22px; font-weight: 900; } .card-qris { border: 2px solid #06b6d4; background: #ecfeff; } .card-qris p:first-child { color: #0e7490; } .card-qris p:last-child { color: #0e7490; } .card-cash { border: 2px solid #10b981; background: #ecfdf5; } .card-cash p:first-child { color: #047857; } .card-cash p:last-child { color: #047857; } table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; } th, td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: left; } th { background: #f8fafc; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; } .text-right { text-align: right; } .section-title { font-size: 13px; font-weight: 900; margin: 24px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #0f172a; } .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; } @media print { body { padding: 10mm; } }</style></head><body><h1>${settings.name || 'Kafe'}</h1><h2>Laporan · ${reportLabel}</h2><div class="grid"><div class="card"><p>Total Pesanan</p><p>${reportStats.totalOrders}</p></div><div class="card"><p>Total Omset</p><p>${rp(reportStats.revenue)}</p></div><div class="card"><p>Rata-rata / Order</p><p>${rp(reportStats.avgOrder)}</p></div><div class="card"><p>Item Terjual</p><p>${reportStats.totalItems}</p></div></div><p class="section-title">RINCIAN PEMBAYARAN</p><div class="grid"><div class="card card-qris"><p>QRIS (${breakdown.qrisCount} trx)</p><p>${rp(breakdown.qris)}</p></div><div class="card card-cash"><p>CASH (${breakdown.cashCount} trx)</p><p>${rp(breakdown.cash)}</p></div></div><p class="section-title">STATUS PESANAN</p><table><thead><tr><th>Status</th><th class="text-right">Jumlah</th></tr></thead><tbody><tr><td>Baru</td><td class="text-right">${statusCount.pending}</td></tr><tr><td>Dimasak</td><td class="text-right">${statusCount.cooking}</td></tr><tr><td>Siap</td><td class="text-right">${statusCount.ready}</td></tr><tr><td>Selesai</td><td class="text-right">${statusCount.completed}</td></tr><tr><td>Batal</td><td class="text-right">${statusCount.cancelled}</td></tr></tbody></table>${topMenus.length > 0 ? `<p class="section-title">MENU TERLARIS</p><table><thead><tr><th>#</th><th>Menu</th><th class="text-right">Qty</th><th class="text-right">Omset</th></tr></thead><tbody>${topMenus.map(([name, data], idx) => `<tr><td>${idx + 1}</td><td>${name}</td><td class="text-right">${data.qty}x</td><td class="text-right">${rp(data.revenue)}</td></tr>`).join('')}</tbody></table>` : ''}<div class="footer">Dicetak oleh ${userEmail || 'Kasir'} · ${reportNow ? reportNow.toLocaleString('id-ID') : ''} · NexaFlow SaaS</div></body></html>`;
  printHTML(html);
};