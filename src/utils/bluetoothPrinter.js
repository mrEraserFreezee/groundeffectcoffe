import jsQR from 'jsqr';

const LINE_WIDTH = 32;
const ESC = '\u001b';
const GS = '\u001d';
let qrisPayloadPromise;

const rupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

const wrap = (text, width = LINE_WIDTH) => {
  const words = String(text || '').split(/\s+/);
  const lines = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });

  if (line) lines.push(line);
  return lines.length ? lines : [''];
};

const twoColumns = (left, right) => {
  const available = LINE_WIDTH - right.length;
  return `${left.slice(0, Math.max(0, available)).padEnd(available)}${right}`;
};

const receiptConfig = {
  customer: { title: 'STRUK CUSTOMER', items: (items) => items, showTotal: true },
  bar: { title: 'PESANAN BAR', items: (items) => items.filter((item) => item.category === 'Minuman'), showTotal: false },
  kitchen: { title: 'PESANAN DAPUR', items: (items) => items.filter((item) => item.category === 'Makanan'), showTotal: false },
};

export function getReceiptItems(transaction, receiptType = 'customer') {
  return (receiptConfig[receiptType] || receiptConfig.customer).items(transaction.items || []);
}

export function getQrisPayload() {
  if (qrisPayloadPromise) return qrisPayloadPromise;

  qrisPayloadPromise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      const result = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
      if (result?.data) resolve(result.data);
      else reject(new Error('Kode QRIS pada gambar tidak dapat dibaca'));
    };
    image.onerror = () => reject(new Error('Gambar QRIS tidak dapat dimuat'));
    image.src = `${import.meta.env.BASE_URL}qris.jpeg`;
  });

  return qrisPayloadPromise;
}

// FIX: Konversi perintah QRIS ESC/POS menjadi byte array mentah agar printer membaca perintah barcode
const qrisCommand = (payload) => {
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payload);
  const dataLength = payloadBytes.length + 3;
  const pL = dataLength & 0xff;
  const pH = (dataLength >> 8) & 0xff;

  const header = new Uint8Array([
    0x1d,
    0x28,
    0x6b,
    0x04,
    0x00,
    0x31,
    0x41,
    0x32,
    0x00, // Select Model
    0x1d,
    0x28,
    0x6b,
    0x03,
    0x00,
    0x31,
    0x43,
    0x05, // Size Module
    0x1d,
    0x28,
    0x6b,
    0x03,
    0x00,
    0x31,
    0x45,
    0x30, // Error Correction Level
    0x1d,
    0x28,
    0x6b,
    pL,
    pH,
    0x31,
    0x50,
    0x30, // Store Data Header
  ]);

  const footer = new Uint8Array([
    0x1d,
    0x28,
    0x6b,
    0x03,
    0x00,
    0x31,
    0x51,
    0x30, // Print QR Code
  ]);

  const result = new Uint8Array(header.length + payloadBytes.length + footer.length);
  result.set(header, 0);
  result.set(payloadBytes, header.length);
  result.set(footer, header.length + payloadBytes.length);

  // Return sebagai binary string murni
  return Array.from(result, (byte) => String.fromCharCode(byte)).join('');
};

export function createEscPosReceipt(transaction, receiptType = 'customer', qrisPayload = '') {
  const config = receiptConfig[receiptType] || receiptConfig.customer;
  const items = getReceiptItems(transaction, receiptType);
  const paid = Number(transaction.payment || 0);
  const change = Math.max(0, paid - Number(transaction.total || 0));
  const lines = [
    `${ESC}@`,
    `${ESC}a\u0001`,
    `${GS}!\u0011GROUND EFFECT COFFEE${GS}!\u0000\n`,
    `${config.title}\n`,
    `${ESC}a\u0000`,
    '--------------------------------\n',
    `Invoice: ${transaction.invoice || '-'}\n`,
    `Tanggal: ${new Date(transaction.created_at).toLocaleString('id-ID')}\n`,
    transaction.customer ? `Customer: ${transaction.customer}\n` : '',
    config.showTotal ? `Bayar: ${transaction.paymentMethod || '-'}\n` : '',
    '--------------------------------\n',
  ];

  items.forEach((item) => {
    wrap(item.name).forEach((line) => lines.push(`${line}\n`));
    const detail = config.showTotal ? `${item.qty} x ${rupiah(item.price)}` : 'Jumlah';
    lines.push(`${twoColumns(detail, config.showTotal ? rupiah(item.subtotal || item.price * item.qty) : String(item.qty))}\n`);
    if (item.note) {
      wrap(`CATATAN: ${item.note}`).forEach((line) => lines.push(`> ${line}\n`));
    }
  });

  if (config.showTotal) {
    lines.push('--------------------------------\n');
    lines.push(`${twoColumns('TOTAL', rupiah(transaction.total))}\n`);
    if (transaction.paymentMethod === 'Tunai') {
      lines.push(`${twoColumns('Bayar', rupiah(paid))}\n`);
      lines.push(`${twoColumns('Kembalian', rupiah(change))}\n`);
    }
    if (qrisPayload) {
      lines.push(`${ESC}a\u0001SCAN QRIS UNTUK MEMBAYAR\n`);
      lines.push(qrisCommand(qrisPayload));
      lines.push('\n');
      lines.push(`${ESC}a\u0000`);
    }
  }
  lines.push('\n');
  lines.push(`${ESC}a\u0001${config.showTotal ? 'Terima kasih\nSelamat menikmati!' : 'Segera diproses'}\n\n\n`);
  lines.push(`${ESC}a\u0000`);

  return lines.join('');
}
