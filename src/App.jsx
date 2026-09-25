import { useEffect, useState } from 'react';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import productsData from './data/products';
import Promo from './pages/Promo';
import PromoAdmin from './pages/PromoAdmin';
import Report from './pages/Report';

const DATA_VERSION = 'v3_menu_indomie_variants'; // Versi data untuk auto-sync localStorage

function App() {
  const addPromoToCart = (promo) => {
    const existing = JSON.parse(localStorage.getItem('promoCart')) || [];

    existing.push({
      cartId: promo.id,
      id: promo.id,
      name: promo.name,
      price: promo.price,
      category: 'Promo',
      qty: 1,
    });

    localStorage.setItem('promoCart', JSON.stringify(existing));
    alert('Promo masuk ke cart POS');
  };

  const [page, setPage] = useState('pos');

  // AKAN OTOMATIS MEMPERBARUI DARI PRODUCTS.JS JIKA DATA_VERSION BERBEDA
  const [products, setProducts] = useState(() => {
    const savedVersion = localStorage.getItem('products_version');
    const saved = localStorage.getItem('products');

    if (savedVersion !== DATA_VERSION || !saved) {
      localStorage.setItem('products_version', DATA_VERSION);
      localStorage.setItem('products', JSON.stringify(productsData));
      return productsData;
    }

    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // FUNGSI UNTUK MERESET MANUAL DATA HARGA
  const resetProductsToDefault = () => {
    if (window.confirm('Perbarui daftar produk & harga ke versi terbaru?')) {
      setProducts(productsData);
      localStorage.setItem('products_version', DATA_VERSION);
      localStorage.setItem('products', JSON.stringify(productsData));
      alert('Data produk & harga berhasil diperbarui!');
    }
  };

  return (
    <div>
      <div className="bg-amber-700 text-white p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setPage('pos')}
            className="bg-white text-amber-700 px-4 py-2 rounded font-medium">
            POS
          </button>

          <button
            onClick={() => setPage('inventory')}
            className="bg-white text-amber-700 px-4 py-2 rounded font-medium">
            Inventory
          </button>

          <button
            onClick={() => setPage('report')}
            className="bg-white text-amber-700 px-4 py-2 rounded font-medium">
            Report
          </button>

          <button
            onClick={() => setPage('promo')}
            className="bg-white text-amber-700 px-4 py-2 rounded font-medium">
            Promo
          </button>

          <button
            onClick={() => setPage('promo-admin')}
            className="bg-white text-amber-700 px-4 py-2 rounded font-medium">
            Promo Admin
          </button>
        </div>

        <button
          onClick={resetProductsToDefault}
          className="bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 transition">
          🔄 Sync/Reset Harga Terbaru
        </button>
      </div>

      {page === 'pos' && (
        <POS
          products={products}
          setProducts={setProducts}
        />
      )}

      {page === 'inventory' && (
        <Inventory
          products={products}
          setProducts={setProducts}
        />
      )}

      {page === 'report' && <Report />}
      {page === 'promo' && <Promo addPromoToCart={addPromoToCart} />}
      {page === 'promo-admin' && <PromoAdmin />}
    </div>
  );
}

export default App;
