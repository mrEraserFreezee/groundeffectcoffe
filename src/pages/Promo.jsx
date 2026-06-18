import { useEffect, useState } from "react";

function Promo({ addPromoToCart }) {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(localStorage.getItem("promos")) || [];

    setPromos(saved.filter((p) => p.active));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-red-600">
        Promo Hari Ini
      </h1>

      {promos.length === 0 ? (
        <p className="text-center text-gray-500">
          Belum ada promo aktif
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              {promo.image && (
                <img
                  src={promo.image}
                  alt={promo.name}
                  className="w-full h-52 object-cover rounded-lg"
                />
              )}

              <h2 className="text-xl font-bold mt-4">
                {promo.name}
              </h2>

              <p className="text-lg mt-2">
                Rp{" "}
                {promo.price.toLocaleString()}
              </p>

              <button
                onClick={() =>
                  addPromoToCart(promo)
                }
                className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg font-bold"
              >
                Pesan Promo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Promo;