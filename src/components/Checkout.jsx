import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", address: "", phone: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // mock order success
    alert(`Order placed! Total: ₹${total}`);
    dispatch(clearCart());
    navigate('/home');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Address</label>
          <textarea required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Phone</label>
          <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full p-2 border rounded" />
        </div>

        <div className="flex justify-between items-center">
          <div className="font-semibold">Total: ₹{total}</div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Place Order</button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
