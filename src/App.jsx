import { useEffect, useState } from "react";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import productsData from "./data/products";
import Promo from "./pages/Promo";
import PromoAdmin from "./pages/PromoAdmin";
import Report from "./pages/Report";

function App() {
  const addPromoToCart = (promo) => {
  const existing =
    JSON.parse(
      localStorage.getItem("promoCart")
    ) || [];

  existing.push({
    cartId: promo.id,
    id: promo.id,
    name: promo.name,
    price: promo.price,
    category: "Promo",
    qty: 1,
  });

  localStorage.setItem(
    "promoCart",
    JSON.stringify(existing)
  );

  alert("Promo masuk ke cart POS");
};
  const [page, setPage] = useState("pos");

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");

    return saved
      ? JSON.parse(saved)
      : productsData;
  });

  useEffect(() => {
    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );
  }, [products]);

  return (
    <div>
      <div className="bg-amber-700 text-white p-4 flex gap-4">
        <button
          onClick={() => setPage("pos")}
          className="bg-white text-amber-700 px-4 py-2 rounded"
        >
          POS
        </button>

        <button
          onClick={() => setPage("inventory")}
          className="bg-white text-amber-700 px-4 py-2 rounded"
        >
          Inventory
        </button>

        <button
          onClick={() => setPage("report")}
          className="bg-white text-amber-700 px-4 py-2 rounded">
          Report
        </button>
        <button
  onClick={() => setPage("promo")}
  className="bg-white text-amber-700 px-4 py-2 rounded"
>
  Promo
</button>

<button
  onClick={() => setPage("promo-admin")}
  className="bg-white text-amber-700 px-4 py-2 rounded"
>
  Promo Admin
</button>
      </div>

      {page === "pos" && <POS />}

      {page === "inventory" && (
        <Inventory
          products={products}
          setProducts={setProducts}
        />
      )}

      {page === "report" && <Report />}
      {page === "promo" && (
  <Promo
    addPromoToCart={addPromoToCart}
  />
)}

{page === "promo-admin" && (
  <PromoAdmin />
)}
    </div>
  );
}

export default App;