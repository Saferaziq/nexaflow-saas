  const handleUpdateOrderStatus = async (id, status) => {
    const u = { status };
    if (status === 'completed') u.payment_status = 'paid';
    
    // LOGIKA POTONG STOK: Saat pesanan mulai dimasak
    if (status === 'cooking') {
      const order = orders.find(o => o.id === id);
      if (order && order.items) {
        for (const item of order.items) {
          const menu = menus.find(m => m.id === item.id);
          if (menu) {
            const newStock = (menu.stock || 0) - item.qty;
            await supabase.from('menus').update({ 
              stock: newStock,
              status: newStock <= 0 ? 'soldout' : 'available' // Otomatis habis jika stok <= 0
            }).eq('id', menu.id);
          }
        }
      }
    }

    await supabase.from('orders').update(u).eq('id', id);
    fetchOrders(tenantId);
    fetchMenus(tenantId); // Refresh menu agar stok di layar langsung berubah
  };