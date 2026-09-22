import { getReceiptItems } from '../utils/bluetoothPrinter';

export default function Receipt({ transaction, items = [], receiptType = 'customer' }) {
  if (!transaction) return null;

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatDate = (date) =>
    new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const total = Number(transaction.total || 0);
  const paid = Number(transaction.payment || 0);
  const change = Math.max(0, paid - total);
  const isCustomerReceipt = receiptType === 'customer';
  const receiptTitle = receiptType === 'kitchen' ? 'PESANAN DAPUR' : receiptType === 'bar' ? 'PESANAN BAR' : 'STRUK CUSTOMER';
  const receiptItems = getReceiptItems({ ...transaction, items }, receiptType);

  return (
    <section
      id="printable-receipt"
      className="receipt">
      <header className="receipt-header text-center">
        {/* Logo Ground Effect */}
        <img
          src="/logo.png"
          alt="Ground Effect Logo"
          className="receipt-logo mx-auto h-16 w-16 object-contain mb-2"
        />
        <h1>GROUND EFFECT</h1>
        <p>{receiptTitle}</p>
      </header>

      <div className="receipt-divider">--------------------------------</div>

      <div className="receipt-info">
        <div>
          <span>Invoice</span>
          <strong>{transaction.invoice || '-'}</strong>
        </div>
        <div>
          <span>Tanggal</span>
          <span>{formatDate(transaction.created_at)}</span>
        </div>
        {transaction.customer && (
          <div>
            <span>Customer</span>
            <span>{transaction.customer}</span>
          </div>
        )}
        {isCustomerReceipt && (
          <div>
            <span>Pembayaran</span>
            <span>{transaction.paymentMethod || '-'}</span>
          </div>
        )}
      </div>

      <div className="receipt-divider">--------------------------------</div>

      <div className="receipt-items">
        {receiptItems.map((item, index) => {
          const qty = Number(item.qty || 0);
          const price = Number(item.price || 0);
          const subtotal = Number(item.subtotal) || price * qty;
          return (
            <div
              className="receipt-item"
              key={item.cartId || item.id || index}>
              <div>{item.name || item.product_name}</div>
              <div className="item-detail">
                <span>{isCustomerReceipt ? `${qty} x ${formatRupiah(price)}` : 'Jumlah'}</span>
                <strong>{isCustomerReceipt ? formatRupiah(subtotal) : qty}</strong>
              </div>
              {item.note && <div className="text-xs">Catatan: {item.note}</div>}
            </div>
          );
        })}
      </div>

      {isCustomerReceipt && (
        <>
          <div className="receipt-divider">--------------------------------</div>
          <div className="receipt-total">
            <div>
              <span>Total</span>
              <strong>{formatRupiah(total)}</strong>
            </div>
            {transaction.paymentMethod === 'Tunai' && (
              <>
                <div>
                  <span>Bayar</span>
                  <span>{formatRupiah(paid)}</span>
                </div>
                <div>
                  <span>Kembalian</span>
                  <span>{formatRupiah(change)}</span>
                </div>
              </>
            )}
          </div>

          {/* Tampilkan QRIS hanya jika metode pembayaran QRIS */}
          {transaction.paymentMethod === 'QRIS' && (
            <div className="receipt-qris text-center my-3">
              <p className="text-xs mb-1">Scan QRIS untuk membayar</p>
              <img
                src="/qris.jpeg"
                alt="QRIS Ground Effect"
                className="mx-auto w-32 h-32 object-contain"
              />
            </div>
          )}
        </>
      )}

      <div className="receipt-footer text-center mt-3">{isCustomerReceipt ? 'Terima kasih. Selamat menikmati!' : 'Segera diproses'}</div>
    </section>
  );
}
