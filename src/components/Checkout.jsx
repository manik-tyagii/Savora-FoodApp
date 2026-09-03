import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

function Checkout() {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearCart());
    navigate("/home", { state: { orderPlaced: true } });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <button
        type="button"
        onClick={() => navigate("/cart")}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600"
      >
        <ArrowLeft size={16} /> Back to cart
      </button>
      <div className="mb-7">
        <p className="eyebrow">Final step</p>
        <h2 className="mt-1 text-3xl font-bold">Deliver happiness</h2>
        <p className="mt-1 text-gray-600">Tell us where to send your order.</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="checkout-grid grid gap-6 lg:grid-cols-[1fr_0.7fr]"
      >
        <div className="surface-panel rounded-2xl border p-5 sm:p-7">
          <h3 className="mb-5 text-lg font-bold">Delivery details</h3>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <UserRound size={16} /> Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border p-3"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <MapPin size={16} /> Address
            </label>
            <textarea
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="min-h-28 w-full rounded-xl border p-3"
              placeholder="House number, street and area"
            />
          </div>
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Phone size={16} /> Phone
            </label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border p-3"
              placeholder="10-digit mobile number"
            />
          </div>
        </div>
        <div className="summary-panel surface-panel h-fit rounded-2xl border p-5 sm:p-7">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-gray-600">Food total</span>
            <span className="font-semibold">₹{total}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="font-semibold text-green-600">FREE</span>
          </div>
          <div className="my-5 border-t border-[var(--savora-border)]" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>To pay</span>
            <span>₹{total}</span>
          </div>
          <button
            type="submit"
            className="accent-button mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white"
          >
            Place order <CheckCircle2 size={18} />
          </button>
          <p className="mt-3 text-center text-xs text-gray-600">
            Freshly prepared. Carefully delivered.
          </p>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
