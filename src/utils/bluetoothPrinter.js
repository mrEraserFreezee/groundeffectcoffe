import jsQR from 'jsqr';
import QRCode from 'qrcode';

const LINE_WIDTH = 32;
const ESC = '\u001b';
const GS = '\u001d';
let qrisPayloadPromise;
let logoBitmapPromise;

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
  return (receiptConfig[receiptType] || receiptConfig.customer).items(transaction?.items || []);
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

// FUNGSI HELPER: Konversi Gambar menjadi Perintah Raster Bit Image ESC/POS (GS v 0)
async function imageToEscPosRaster(imageSrc, targetWidth = 200) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = targetWidth / img.width;
      canvas.width = targetWidth;
      canvas.height = Math.round(img.height * scale);

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const widthBytes = Math.ceil(canvas.width / 8);

      const xL = widthBytes % 256;
      const xH = Math.floor(widthBytes / 256);
      const yL = canvas.height % 256;
      const yH = Math.floor(canvas.height / 256);

      const header = new Uint8Array([0x1d, 0x76, 0x30, 0x00, xL, xH, yL, yH]);
      const imageBytes = new Uint8Array(widthBytes * canvas.height);

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const offset = (y * canvas.width + x) * 4;
          const r = imgData.data[offset];
          const g = imgData.data[offset + 1];
          const b = imgData.data[offset + 2];
          const isBlack = (r + g + b) / 3 < 180;

          if (isBlack) {
            const byteIndex = y * widthBytes + Math.floor(x / 8);
            const bitIndex = 7 - (x % 8);
            imageBytes[byteIndex] |= 1 << bitIndex;
          }
        }
      }

      const result = new Uint8Array(header.length + imageBytes.length);
      result.set(header, 0);
      result.set(imageBytes, header.length);

      resolve(Array.from(result, (byte) => String.fromCharCode(byte)).join(''));
    };
    img.onerror = () => resolve('');
    img.src = imageSrc;
  });
}

// Generasi Bitmap QR Code
async function generateQrisBitmapCommand(payload) {
  try {
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, payload, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    });
    return await imageToEscPosRaster(canvas.toDataURL(), 200);
  } catch (err) {
    console.error('Gagal generate QR Bitmap:', err);
    return '';
  }
}

// Generasi Logo Toko
async function getLogoCommand() {
  if (logoBitmapPromise) return logoBitmapPromise;
  logoBitmapPromise = imageToEscPosRaster(`${import.meta.env.BASE_URL}logo.png`, 180);
  return logoBitmapPromise;
}

export async function createEscPosReceipt(transaction, receiptType = 'customer', qrisPayload = '') {
  const config = receiptConfig[receiptType] || receiptConfig.customer;
  const items = getReceiptItems(transaction, receiptType);
  const paid = Number(transaction?.payment || 0);
  const total = Number(transaction?.total || 0);
  const change = Math.max(0, paid - total);

  // Ambil perintah logo bitmap
  const logoCommand = await getLogoCommand();

  const lines = [
    `${ESC}@`,
    `${ESC}a\u0001`, // Center Align
  ];

  // Tambahkan Logo jika berhasil dimuat
  if (logoCommand) {
    lines.push(logoCommand);
    lines.push('\n');
  }

  // Teks Header Toko
  lines.push(`${GS}!\u0011GROUND EFFECT${GS}!\u0000\n`);
  lines.push(`${config.title}\n`);
  lines.push(`${ESC}a\u0000`); // Left Align
  lines.push('--------------------------------\n');
  lines.push(`Invoice: ${transaction?.invoice || '-'}\n`);
  lines.push(`Tanggal: ${new Date(transaction?.created_at || Date.now()).toLocaleString('id-ID')}\n`);
  if (transaction?.customer) lines.push(`Customer: ${transaction.customer}\n`);
  if (config.showTotal) lines.push(`Bayar: ${transaction?.paymentMethod || '-'}\n`);
  lines.push('--------------------------------\n');

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
    lines.push(`${twoColumns('TOTAL', rupiah(total))}\n`);
    if (transaction?.paymentMethod === 'Tunai') {
      lines.push(`${twoColumns('Bayar', rupiah(paid))}\n`);
      lines.push(`${twoColumns('Kembalian', rupiah(change))}\n`);
    }
    if (qrisPayload) {
      lines.push(`${ESC}a\u0001SCAN QRIS UNTUK MEMBAYAR\n`);
      const qrImageCommand = await generateQrisBitmapCommand(qrisPayload);
      lines.push(qrImageCommand);
      lines.push('\n');
      lines.push(`${ESC}a\u0000`);
    }
  }
  lines.push('\n');
  lines.push(`${ESC}a\u0001${config.showTotal ? 'Terima kasih\nSelamat menikmati!' : 'Segera diproses'}\n\n\n`);
  lines.push(`${ESC}a\u0000`);

  return lines.join('');
}
