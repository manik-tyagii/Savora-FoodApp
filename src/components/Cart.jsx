import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQty, removeItem, clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!items || items.length === 0)
    return <div className="p-6">Your cart is empty.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between border p-3 rounded">
            <div>
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-gray-600">Price: ₹{it.price}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={it.qty}
                onChange={(e) => dispatch(updateQty({ id: it.id, qty: Number(e.target.value) }))}
                className="w-16 p-1 border rounded"
              />
              <div className="font-bold">₹{it.price * it.qty}</div>
              <button onClick={() => dispatch(removeItem(it.id))} className="ml-2 text-red-600">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-semibold">Total: ₹{total}</div>
        <div>
          <button onClick={() => { dispatch(clearCart()); navigate('/home'); }} className="mr-2 bg-gray-200 px-4 py-2 rounded">Clear</button>
          <button onClick={() => navigate('/checkout')} className="bg-blue-600 text-white px-4 py-2 rounded">Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
