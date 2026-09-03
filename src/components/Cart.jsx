import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateQty, removeItem, clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

function Cart() {
  const { items, total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!items || items.length === 0)
    return (
      <div className="empty-state mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="empty-icon">
          <ShoppingBag size={30} />
        </div>
        <p className="eyebrow mt-5">Your table is waiting</p>
        <h2 className="mt-2 text-3xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">
          Add a dish from one of our neighbourhood favourites and make it a
          feast.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="accent-button mt-6 flex items-center gap-2 rounded-xl px-5 py-3 font-bold text-white"
        >
          Explore restaurants <ArrowRight size={18} />
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-7">
        <p className="eyebrow">Almost ready</p>
        <h2 className="mt-1 text-3xl font-bold">Your cart</h2>
        <p className="mt-1 text-gray-600">
          {items.length} delicious {items.length === 1 ? "item" : "items"}{" "}
          selected for delivery.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((it) => (
          <div
            key={it.id}
            className="cart-item surface-panel flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="font-semibold">{it.name}</div>
              <div className="mt-1 text-sm text-gray-600">₹{it.price} each</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Decrease quantity"
                onClick={() =>
                  dispatch(
                    updateQty({ id: it.id, qty: Math.max(1, it.qty - 1) }),
                  )
                }
                className="quantity-button"
              >
                <Minus size={15} />
              </button>
              <span className="w-7 text-center font-semibold">{it.qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() =>
                  dispatch(updateQty({ id: it.id, qty: it.qty + 1 }))
                }
                className="quantity-button"
              >
                <Plus size={15} />
              </button>
              <div className="font-bold">₹{it.price * it.qty}</div>
              <button
                aria-label={`Remove ${it.name}`}
                onClick={() => dispatch(removeItem(it.id))}
                className="remove-button ml-2"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-panel mt-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-600">Grand total</p>
          <div className="text-2xl font-bold">₹{total}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              dispatch(clearCart());
              navigate("/home");
            }}
            className="secondary-button rounded-xl px-4 py-2 font-semibold"
          >
            Clear cart
          </button>
          <button
            onClick={() => navigate("/checkout")}
            className="accent-button flex items-center gap-2 rounded-xl px-5 py-2 font-bold text-white"
          >
            Checkout <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
