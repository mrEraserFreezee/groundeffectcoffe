const LINE_WIDTH = 32;
const ESC = "\u001b";
const GS = "\u001d";

const rupiah = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const wrap = (text, width = LINE_WIDTH) => {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let line = "";

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
  return lines.length ? lines : [""];
};

const twoColumns = (left, right) => {
  const available = LINE_WIDTH - right.length;
  return `${left.slice(0, Math.max(0, available)).padEnd(available)}${right}`;
};

export function createEscPosReceipt(transaction) {
  const items = transaction.items || [];
  const paid = Number(transaction.payment || 0);
  const change = Math.max(0, paid - Number(transaction.total || 0));
  const lines = [
    `${ESC}@`,
    `${ESC}a\u0001`,
    `${GS}!\u0011GROUND EFFECT COFFEE${GS}!\u0000\n`,
    "Fresh Coffee & Good Vibes\n",
    `${ESC}a\u0000`,
    "--------------------------------\n",
    `Invoice: ${transaction.invoice || "-"}\n`,
    `Tanggal: ${new Date(transaction.created_at).toLocaleString("id-ID")}\n`,
    transaction.customer ? `Customer: ${transaction.customer}\n` : "",
    `Bayar: ${transaction.paymentMethod || "-"}\n`,
    "--------------------------------\n",
  ];

  items.forEach((item) => {
    wrap(item.name).forEach((line) => lines.push(`${line}\n`));
    const detail = `${item.qty} x ${rupiah(item.price)}`;
    lines.push(`${twoColumns(detail, rupiah(item.subtotal || item.price * item.qty))}\n`);
  });

  lines.push("--------------------------------\n");
  lines.push(`${twoColumns("TOTAL", rupiah(transaction.total))}\n`);
  if (transaction.paymentMethod === "Tunai") {
    lines.push(`${twoColumns("Bayar", rupiah(paid))}\n`);
    lines.push(`${twoColumns("Kembalian", rupiah(change))}\n`);
  }
  lines.push("\n");
  lines.push(`${ESC}a\u0001Terima kasih\nSelamat menikmati!\n\n\n`);
  lines.push(`${ESC}a\u0000`);

  return lines.join("");
}
