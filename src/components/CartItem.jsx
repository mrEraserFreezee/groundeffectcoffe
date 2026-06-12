function CartItem({ item, increase, decrease }) {
  return (
    <div className="flex justify-between items-center border-b py-3">
      <div>
        <h4 className="font-medium">
          {item.name}
        </h4>

        <p className="text-sm text-gray-500">
          Rp {item.price.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            decrease(item.cartId)
          }
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          -
        </button>

        <span className="font-semibold">
          {item.qty}
        </span>

        <button
          onClick={() =>
            increase(item.cartId)
          }
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CartItem;