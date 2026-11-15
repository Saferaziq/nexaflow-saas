      {/* MODAL TAMBAH CABANG BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/10 dark:bg-[#2563EB]/20 rounded-full blur-[60px] pointer-events-none"></div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-2 relative z-10">Tambah Cabang Baru</h3>
            <p className="text-xs text-slate-500 mb-6 relative z-10">Buat data kafe baru dan akun login kasir secara otomatis.</p>
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold rounded-xl relative z-10">{errorMsg}</div>
            )}

            <form onSubmit={handleLinkBranch} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Nama Kafe / Cabang Baru</label>
                <input type="text" value={linkBranchName} onChange={(e) => setLinkBranchName(e.target.value)} required placeholder="Contoh: Kopi Senja Bandung" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Email Login Kasir Baru</label>
                <input type="email" value={linkBranchEmail} onChange={(e) => setLinkBranchEmail(e.target.value)} required placeholder="kasir.bandung@gmail.com" className="w-full bg-slate-50 dark:bg-[#04060B] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-xl">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-[#1E4E8C] to-[#2563EB] text-white font-black py-3.5 rounded-xl">{isSubmitting ? '...' : 'Buat Cabang'}</button>
              </div>
            </form>
          </div>
        </div>
      )}