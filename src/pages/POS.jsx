import { useState } from "react";
import products from "../data/products";
import CartItem from "../components/CartItem";

function POS() {
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [payment, setPayment] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  // OPEN BILL
  const [openBills, setOpenBills] = useState([]);
  const [currentBillId, setCurrentBillId] =
    useState(null);

  // SPLIT BILL
  const [splitCount, setSplitCount] = useState(1);

  const addToCart = (product, variant = null) => {
    const cartId = variant
      ? `${product.id}-${variant.size}`
      : `${product.id}`;

    const existing = cart.find(
      (item) => item.cartId === cartId
    );

    const itemData = {
      cartId,
      id: product.id,
      name: variant
        ? `${product.name} (${variant.size})`
        : product.name,
      price: variant
        ? variant.price
        : product.price,
    };

    if (existing) {
      setCart(
        cart.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...itemData,
          qty: 1,
        },
      ]);
    }
  };

  const increase = (cartId) => {
    setCart(
      cart.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              qty: item.qty + 1,
            }
          : item
      )
    );
  };

  const decrease = (cartId) => {
    setCart(
      cart
        .map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                qty: item.qty - 1,
              }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const splitTotal = total / splitCount;

  const change =
    Number(payment) > total
      ? Number(payment) - total
      : 0;

  const openBill = () => {
    if (cart.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    const bill = {
      id:
        currentBillId ||
        "BILL-" + Date.now(),
      customer: customer || "Guest",
      items: cart,
      paymentMethod,
    };

    setOpenBills((prev) => {
      const existing = prev.find(
        (b) => b.id === bill.id
      );

      if (existing) {
        return prev.map((b) =>
          b.id === bill.id ? bill : b
        );
      }

      return [...prev, bill];
    });

    setCurrentBillId(bill.id);
    alert("Bill disimpan");
  };

  const resumeBill = (bill) => {
    setCart(bill.items);
    setCustomer(bill.customer);
    setPaymentMethod(bill.paymentMethod);
    setCurrentBillId(bill.id);
  };

  const holdCart = () => {
    openBill();
    setCart([]);
    setCustomer("");
    setPayment("");
    setCurrentBillId(null);
  };

  const closeBill = () => {
    if (!currentBillId) return;

    setOpenBills(
      openBills.filter(
        (bill) =>
          bill.id !== currentBillId
      )
    );

    setCurrentBillId(null);
  };
    const saveTransaction = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    const transaction = {
      invoice: "INV-" + Date.now(),
      customer,
      paymentMethod,
      total,
      items: cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        subtotal: item.price * item.qty,
      })),
      orderDetail: cart
        .map(
          (item) =>
            `${item.name} x${item.qty}`
        )
        .join(", "),
    };

    try {
      const formData = new FormData();

      formData.append(
        "data",
        JSON.stringify(transaction)
      );

      await fetch(
        "https://script.google.com/macros/s/AKfycbw6Fj8P60xbEOoUo-szOkCN76C7dVCdxTjYb1yKpZ3DD7hJmpuNxBGmT7GBYR00Agnw/exec",
        {
          method: "POST",
          body: formData,
        }
      );

      alert("Transaksi berhasil disimpan");

      closeBill();
      setCart([]);
      setCustomer("");
      setPaymentMethod("Tunai");
      setPayment("");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan transaksi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-5xl font-extrabold text-center mb-8 text-amber-700">
        ☕ Ground Effect Coffee POS
      </h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() =>
            setSelectedCategory("Semua")
          }
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === "Semua"
              ? "bg-amber-600 text-white"
              : "bg-white"
          }`}
        >
          Semua
        </button>

        <button
          onClick={() =>
            setSelectedCategory("Minuman")
          }
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === "Minuman"
              ? "bg-amber-600 text-white"
              : "bg-white"
          }`}
        >
          Minuman
        </button>

        <button
          onClick={() =>
            setSelectedCategory("Makanan")
          }
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === "Makanan"
              ? "bg-amber-600 text-white"
              : "bg-white"
          }`}
        >
          Makanan
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-8">
            {(selectedCategory === "Semua" ||
              selectedCategory ===
                "Minuman") && (
              <>
                <h2 className="text-2xl font-bold text-amber-700 border-b pb-2">
                  ☕ Coffee
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products
                    .filter(
                      (p) =>
                        p.category ===
                          "Minuman" &&
                        p.type === "Coffee"
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow p-4"
                      >
                        <h3 className="font-bold text-lg">
                          {product.name}
                        </h3>

                        <div className="flex gap-2 mt-3">
                          {product.variants.map(
                            (variant) => (
                              <button
                                key={
                                  variant.size
                                }
                                onClick={() =>
                                  addToCart(
                                    product,
                                    variant
                                  )
                                }
                                className="flex-1 bg-amber-600 text-white py-2 rounded-lg text-sm"
                              >
                                {variant.size ||
                                  "Regular"}
                                <br />
                                Rp{" "}
                                {variant.price.toLocaleString()}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

                          {(selectedCategory === "Semua" ||
              selectedCategory ===
                "Minuman") && (
              <>
                <h2 className="text-2xl font-bold text-blue-700 border-b pb-2">
                  🥛 Non Coffee
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products
                    .filter(
                      (p) =>
                        p.category ===
                          "Minuman" &&
                        p.type ===
                          "Non Coffee"
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow p-4"
                      >
                        <h3 className="font-bold text-lg">
                          {product.name}
                        </h3>

                        <div className="flex gap-2 mt-3">
                          {product.variants.map(
                            (variant, idx) => (
                              <button
                                key={idx}
                                onClick={() =>
                                  addToCart(
                                    product,
                                    variant
                                  )
                                }
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm"
                              >
                                {variant.size ||
                                  "Regular"}
                                <br />
                                Rp{" "}
                                {variant.price.toLocaleString()}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}

            {(selectedCategory === "Semua" ||
              selectedCategory ===
                "Makanan") && (
              <>
                <h2 className="text-2xl font-bold text-green-700 border-b pb-2">
                  🍟 Makanan & Snack
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products
                    .filter(
                      (p) =>
                        p.category ===
                        "Makanan"
                    )
                    .map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow p-4"
                      >
                        <h3 className="font-bold text-lg">
                          {product.name}
                        </h3>

                        <button
                          onClick={() =>
                            addToCart(product)
                          }
                          className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg"
                        >
                          Rp{" "}
                          {product.price.toLocaleString()}
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-bold mb-4">
            Keranjang
          </h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Belum ada produk dipilih
            </p>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.cartId}
                item={item}
                increase={increase}
                decrease={decrease}
              />
            ))
          )}

          <div className="mt-5 space-y-3">
            <input
              type="text"
              placeholder="Nama Customer"
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-3"
            >
              <option>Tunai</option>
              <option>QRIS</option>
              <option>Debit</option>
              <option>Transfer</option>
            </select>

            <input
              type="number"
              placeholder="Nominal Bayar"
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />

            <div>
              <label>Split Bill</label>
              <input
                type="number"
                min="1"
                value={splitCount}
                onChange={(e) =>
                  setSplitCount(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-2 mt-1"
              />
              <p className="text-sm mt-1">
                Per Orang: Rp{" "}
                {splitTotal.toLocaleString()}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-lg">
                Total :
                <span className="font-bold ml-2">
                  Rp{" "}
                  {total.toLocaleString()}
                </span>
              </p>

              <p className="text-lg mt-2">
                Kembalian :
                <span className="font-bold text-green-600 ml-2">
                  Rp{" "}
                  {change.toLocaleString()}
                </span>
              </p>
            </div>

            <button
              onClick={saveTransaction}
              className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg"
            >
              Simpan Transaksi
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={openBill}
                className="bg-blue-600 text-white py-2 rounded"
              >
                Open Bill
              </button>

              <button
                onClick={holdCart}
                className="bg-purple-600 text-white py-2 rounded"
              >
                Hold Cart
              </button>
            </div>

            <div className="mt-5">
              <h3 className="font-bold">
                Open Bills
              </h3>

              {openBills.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Tidak ada bill aktif
                </p>
              ) : (
                openBills.map((bill) => (
                  <div
                    key={bill.id}
                    className="border rounded p-2 mt-2"
                  >
                    <p>{bill.customer}</p>
                    <button
                      onClick={() =>
                        resumeBill(bill)
                      }
                      className="bg-green-600 text-white px-2 py-1 rounded mt-1"
                    >
                      Resume
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default POS;