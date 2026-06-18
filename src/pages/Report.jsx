import { useEffect, useState } from "react";

function Report() {
  const [transactions, setTransactions] =
    useState([]);

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem("transactions")
      ) || [];

    setTransactions(saved);
  }, []);

  let totalFood = 0;
  let totalDrink = 0;
  let hotCount = 0;
  let iceCount = 0;

  let totalOmset = 0;
  let foodRevenue = 0;
  let drinkRevenue = 0;
    transactions.forEach((trx) => {
    totalOmset += trx.total;

    trx.items.forEach((item) => {
      const subtotal =
        item.subtotal ||
        item.price * item.qty;

      if (item.category === "Makanan") {
        totalFood += item.qty;
        foodRevenue += subtotal;
      }

      if (item.category === "Minuman") {
        totalDrink += item.qty;
        drinkRevenue += subtotal;

        if (item.name.includes("(Hot)")) {
          hotCount += item.qty;
        }

        if (item.name.includes("(Ice)")) {
          iceCount += item.qty;
        }
      }
    });
  });
      return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Report Penjualan
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-yellow-100 p-6 rounded-xl">
          <h2 className="font-bold">Total Omset</h2>
          <p className="text-3xl mt-3">
            Rp {totalOmset.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-xl">
          <h2 className="font-bold">
            Omset Makanan
          </h2>
          <p className="text-3xl mt-3">
            Rp {foodRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-blue-100 p-6 rounded-xl">
          <h2 className="font-bold">
            Omset Minuman
          </h2>
          <p className="text-3xl mt-3">
            Rp {drinkRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-200 p-6 rounded-xl">
          <h2 className="font-bold">
            Makanan Terjual
          </h2>
          <p className="text-3xl mt-3">
            {totalFood}
          </p>
        </div>

        <div className="bg-blue-200 p-6 rounded-xl">
          <h2 className="font-bold">
            Minuman Terjual
          </h2>
          <p className="text-3xl mt-3">
            {totalDrink}
          </p>
        </div>

        <div className="bg-red-100 p-6 rounded-xl">
          <h2 className="font-bold">Hot</h2>
          <p className="text-3xl mt-3">
            {hotCount}
          </p>
        </div>

        <div className="bg-cyan-100 p-6 rounded-xl">
          <h2 className="font-bold">Ice</h2>
          <p className="text-3xl mt-3">
            {iceCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Report;