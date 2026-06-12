// src/components/ProductCard.jsx

function ProductCard({ product, addToCart }) {
  return (
    <button
      onClick={() => addToCart(product)}
      className="bg-white rounded-xl shadow-md p-4 hover:bg-amber-50 hover:shadow-lg transition"
    >
      <h3 className="font-bold text-lg">
        {product.name}
      </h3>

      <p className="text-sm text-gray-500">
        Stok: {product.stock || 0}
      </p>

      <p className="text-amber-700 font-semibold mt-2">
        Rp {product.price.toLocaleString()}
      </p>
    </button>
  );
}

export default ProductCard;