const products = [
  // =========================
  // MINUMAN - COFFEE
  // =========================
  {
    id: 1,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Hover Espresso',
    variants: [{ size: 'Hot', price: 16000 }],
  },
  {
    id: 2,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Emergency Americano',
    variants: [
      { size: 'Hot', price: 18000 },
      { size: 'Ice', price: 18000 },
    ],
  },
  {
    id: 3,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Robinson Latte',
    variants: [
      { size: 'Hot', price: 23000 },
      { size: 'Ice', price: 23000 },
    ],
  },
  {
    id: 4,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Cappuccino',
    variants: [
      { size: 'Hot', price: 23000 },
      { size: 'Ice', price: 23000 },
    ],
  },
  {
    id: 5,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Affogato',
    variants: [{ size: 'Ice', price: 36000 }],
  },
  {
    id: 6,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Vortex Butterscotch Latte',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 7,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Engine Vanilla Latte',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 8,
    category: 'Minuman',
    type: 'Coffee',
    name: 'Rotor Aren',
    variants: [
      { size: 'Hot', price: 23000 },
      { size: 'Ice', price: 23000 },
    ],
  },

  // =========================
  // MINUMAN - NON COFFEE
  // =========================
  {
    id: 9,
    category: 'Minuman',
    type: 'Non Coffee',
    name: 'Chocolate',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 10,
    category: 'Minuman',
    type: 'Non Coffee',
    name: 'Vanilla',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 11,
    category: 'Minuman',
    type: 'Non Coffee',
    name: 'Matcha',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 12,
    category: 'Minuman',
    type: 'Non Coffee',
    name: 'Taro',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 13,
    category: 'Minuman',
    type: 'Non Coffee',
    name: 'Hazelnut',
    variants: [
      { size: 'Hot', price: 25000 },
      { size: 'Ice', price: 25000 },
    ],
  },
  {
    id: 14,
    category: 'Minuman',
    type: 'Non Coffee',
    name: 'Mineral',
    variants: [{ price: 5000 }],
  },

  // =========================
  // MINUMAN - MOCKTAIL
  // =========================
  {
    id: 15,
    category: 'Minuman',
    type: 'Mocktail',
    name: 'Blue Sky',
    variants: [{ size: 'Ice', price: 25000 }],
  },
  {
    id: 16,
    category: 'Minuman',
    type: 'Mocktail',
    name: 'Red Sky',
    variants: [{ size: 'Ice', price: 25000 }],
  },
  {
    id: 17,
    category: 'Minuman',
    type: 'Mocktail',
    name: 'Mojito (Non-Alcohol)',
    variants: [{ size: 'Ice', price: 25000 }],
  },

  // =========================
  // MINUMAN - COCKTAIL
  // =========================
  {
    id: 18,
    category: 'Minuman',
    type: 'Cocktail',
    name: 'Blue Sky Cocktail',
    variants: [{ size: 'Ice', price: 40000 }],
  },
  {
    id: 19,
    category: 'Minuman',
    type: 'Cocktail',
    name: 'Red Sky Cocktail',
    variants: [{ size: 'Ice', price: 40000 }],
  },
  {
    id: 20,
    category: 'Minuman',
    type: 'Cocktail',
    name: 'Mojito Cocktail',
    variants: [{ size: 'Ice', price: 40000 }],
  },

  // =========================
  // MAKANAN
  // =========================
  {
    id: 21,
    category: 'Makanan',
    name: 'French Fries',
    price: 20000,
  },
  {
    id: 22,
    category: 'Makanan',
    name: 'Mix Platter',
    price: 40000,
  },
  {
    id: 23,
    category: 'Makanan',
    name: 'Tofu Meatballs',
    price: 20000,
  },
  {
    id: 24,
    category: 'Makanan',
    name: 'Fried Sausage',
    price: 15000,
  },
  {
    id: 25,
    category: 'Makanan',
    name: 'Fried Nuggets',
    price: 20000,
  },
  {
    id: 26,
    category: 'Makanan',
    name: 'Indomie',
    variants: [
      { size: 'Goreng', price: 15000 },
      { size: 'Rebus', price: 15000 },
    ],
  },
  {
    id: 27,
    category: 'Makanan',
    name: 'Indomie Telor',
    variants: [
      { size: 'Goreng', price: 20000 },
      { size: 'Rebus', price: 20000 },
    ],
  },
  {
    id: 28,
    category: 'Makanan',
    name: 'Indomie Double',
    variants: [
      { size: 'Goreng', price: 22000 },
      { size: 'Rebus', price: 22000 },
    ],
  },
  {
    id: 29,
    category: 'Makanan',
    name: 'Indomie Double Telor',
    variants: [
      { size: 'Goreng', price: 25000 },
      { size: 'Rebus', price: 25000 },
    ],
  },
  {
    id: 30,
    category: 'Makanan',
    name: 'Es Krim',
    price: 10000,
  },
  {
    id: 31,
    category: 'Makanan',
    name: 'Telur',
    price: 5000,
  },
];

export default products;
