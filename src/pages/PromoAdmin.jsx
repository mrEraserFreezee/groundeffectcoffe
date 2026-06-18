import { useEffect, useState } from "react";

function PromoAdmin() {
  const [promos, setPromos] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("promos")) || [];
    setPromos(saved);
  }, []);

  const savePromos = (updated) => {
    setPromos(updated);
    localStorage.setItem(
      "promos",
      JSON.stringify(updated)
    );
  };

  const addPromo = () => {
    if (!name || !price) return;

    const newPromo = {
      id: Date.now(),
      name,
      price: Number(price),
      image,
      active: true,
    };

    const updated = [...promos, newPromo];
    savePromos(updated);

    setName("");
    setPrice("");
    setImage("");
  };

  const removePromo = (id) => {
    const updated = promos.filter(
      (p) => p.id !== id
    );
    savePromos(updated);
  };

  const togglePromo = (id) => {
    const updated = promos.map((p) =>
      p.id === id
        ? { ...p, active: !p.active }
        : p
    );

    savePromos(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Promo Admin
      </h1>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <input
          placeholder="Nama Promo"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Harga Promo"
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
              setImage(reader.result);
            };

            reader.readAsDataURL(file);
          }}
        />

        <button
          onClick={addPromo}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Tambah Promo
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded shadow p-4"
          >
            {promo.image && (
              <img
                src={promo.image}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h2 className="font-bold mt-3">
              {promo.name}
            </h2>

            <p>
              Rp {promo.price.toLocaleString()}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  togglePromo(promo.id)
                }
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {promo.active
                  ? "Nonaktifkan"
                  : "Aktifkan"}
              </button>

              <button
                onClick={() =>
                  removePromo(promo.id)
                }
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PromoAdmin;