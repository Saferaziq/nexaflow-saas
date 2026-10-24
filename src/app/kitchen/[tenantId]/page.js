import { Suspense } from 'react';
import KitchenClient from './KitchenClient';

// Beri tahu Next.js parameter contoh untuk validasi build
export async function generateStaticParams() {
  // Gunakan placeholder tenantId. Saat runtime, nilai sebenarnya akan diteruskan.
  return [{ tenantId: 'placeholder-tenant-id' }];
}

export default async function KitchenPage({ params }) {
  const { tenantId } = await params;

  // Jika yang di-render saat build adalah placeholder, hentikan (tidak perlu render UI)
  if (tenantId === 'placeholder-tenant-id') {
    return null; 
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold">Memuat layar dapur...</p>
          </div>
        </div>
      }
    >
      <KitchenClient tenantId={tenantId} />
    </Suspense>
  );
}