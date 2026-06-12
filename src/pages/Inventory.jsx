import { useEffect, useState } from "react";

function Inventory({ products, setProducts }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");
  const [supplier, setSupplier] = useState("");
  const [costPrice, setCostPrice] = useState("");

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("inventoryHistory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "inventoryHistory",
      JSON.stringify(history)
    );
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || !qty) {
      alert("Lengkapi data terlebih dahulu");
      return;
    }

    const quantity = parseInt(qty);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === Number(selectedProduct)
          ? {
              ...item,
              stock: (item.stock || 0) + quantity,
            }
          : item
      )
    );

    const product = products.find(
      (p) => p.id === Number(selectedProduct)
    );

    const newRecord = {
      id: Date.now(),
      date: new Date().toLocaleString("id-ID"),
      product: product.name,
      qty: quantity,
      supplier,
      costPrice,
    };

    setHistory([newRecord, ...history]);

    setSelectedProduct("");
    setQty("");
    setSupplier("");
    setCostPrice("");
  };

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Barang Masuk
        </h1>

        <p className="text-gray-500">
          Kelola stok produk dan penerimaan barang
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Input Barang Masuk
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <select
            className="border rounded-lg p-3"
            value={selectedProduct}
            onChange={(e) =>
              setSelectedProduct(e.target.value)
            }
          >
            <option value="">
              Pilih Produk
            </option>

            {(products || []).map((product) => (
              <option 
                key={product.id}
                value={product.id}
              >
                {product.name}
              </option>
              ))}
          </select>

          <input
            type="number"
            placeholder="Jumlah Masuk"
            className="border rounded-lg p-3"
            value={qty}
            onChange={(e) =>
              setQty(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Harga Modal"
            className="border rounded-lg p-3"
            value={costPrice}
            onChange={(e) =>
              setCostPrice(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Supplier"
            className="border rounded-lg p-3"
            value={supplier}
            onChange={(e) =>
              setSupplier(e.target.value)
            }
          />

          <button
            type="submit"
            className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Simpan Barang Masuk
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Riwayat Barang Masuk
          </h2>

          <span className="text-sm text-gray-500">
            Total Data : {history.length}
          </span>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">
                  Tanggal
                </th>
                <th className="p-3 text-left">
                  Produk
                </th>
                <th className="p-3 text-center">
                  Qty
                </th>
                <th className="p-3 text-right">
                  Harga Modal
                </th>
                <th className="p-3 text-left">
                  Supplier
                </th>
              </tr>
            </thead>

            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-6 text-gray-500"
                  >
                    Belum ada data
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b"
                  >
                    <td className="p-3">
                      {item.date}
                    </td>

                    <td className="p-3">
                      {item.product}
                    </td>

                    <td className="p-3 text-center font-semibold">
                      +{item.qty}
                    </td>

                    <td className="p-3 text-right">
                      Rp{" "}
                      {Number(
                        item.costPrice
                      ).toLocaleString("id-ID")}
                    </td>

                    <td className="p-3">
                      {item.supplier}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Inventory;