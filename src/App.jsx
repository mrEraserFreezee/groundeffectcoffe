import { useEffect, useState } from "react";
import POS from "./pages/POS";
import Inventory from "./pages/Inventory";
import productsData from "./data/products";

function App() {
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
      </div>

      {page === "pos" && <POS />}

      {page === "inventory" && (
        <Inventory
          products={products}
          setProducts={setProducts}
        />
      )}
    </div>
  );
}

export default App;