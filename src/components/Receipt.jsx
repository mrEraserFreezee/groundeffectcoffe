export default function Receipt({ transaction, items = [] }) {
  if (!transaction) return null;

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDate = (date) =>
    new Date(date).toLocaleString("id-ID", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

  const total = Number(transaction.total || 0);
  const paid = Number(transaction.payment || 0);
  const change = Math.max(0, paid - total);

  return (
    <section id="printable-receipt" className="receipt">
      <header className="receipt-header">
        <h1>GROUND EFFECT COFFEE</h1>
        <p>Fresh Coffee &amp; Good Vibes</p>
      </header>
      <div className="receipt-divider">--------------------------------</div>
      <div className="receipt-info">
        <div><span>Invoice</span><strong>{transaction.invoice || "-"}</strong></div>
        <div><span>Tanggal</span><span>{formatDate(transaction.created_at)}</span></div>
        {transaction.customer && <div><span>Customer</span><span>{transaction.customer}</span></div>}
        <div><span>Pembayaran</span><span>{transaction.paymentMethod || "-"}</span></div>
      </div>
      <div className="receipt-divider">--------------------------------</div>
      <div className="receipt-items">
        {items.map((item, index) => {
          const qty = Number(item.qty || 0);
          const price = Number(item.price || 0);
          const subtotal = Number(item.subtotal) || price * qty;
          return (
            <div className="receipt-item" key={item.cartId || item.id || index}>
              <div>{item.name || item.product_name}</div>
              <div className="item-detail">
                <span>{qty} x {formatRupiah(price)}</span>
                <strong>{formatRupiah(subtotal)}</strong>
              </div>
            </div>
          );
        })}
      </div>
      <div className="receipt-divider">--------------------------------</div>
      <div className="receipt-total">
        <div><span>Total</span><strong>{formatRupiah(total)}</strong></div>
        {transaction.paymentMethod === "Tunai" && <>
          <div><span>Bayar</span><span>{formatRupiah(paid)}</span></div>
          <div><span>Kembalian</span><span>{formatRupiah(change)}</span></div>
        </>}
      </div>
      <div className="receipt-footer">Terima kasih. Selamat menikmati!</div>
    </section>
  );
}
