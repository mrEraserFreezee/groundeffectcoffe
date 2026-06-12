function PaymentForm({
  total,
  payment,
  setPayment
}) {
  const change =
    payment > total
      ? payment - total
      : 0

  return (
    <div className="space-y-3">

      <h3 className="font-bold text-lg">
        Pembayaran
      </h3>

      <input
        type="number"
        placeholder="Nominal Bayar"
        value={payment}
        onChange={(e) =>
          setPayment(Number(e.target.value))
        }
        className="w-full border rounded-lg p-2"
      />

      <div>
        <p>Total :</p>

        <p className="font-bold">
          Rp {total.toLocaleString()}
        </p>
      </div>

      <div>
        <p>Kembalian :</p>

        <p className="text-green-600 font-bold">
          Rp {change.toLocaleString()}
        </p>
      </div>

      <button
        className="w-full bg-black text-white py-3 rounded-lg"
      >
        Simpan Transaksi
      </button>

    </div>
  )
}

export default PaymentForm