import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../features/restaurantsSlice";
import { addItem } from "../features/cartSlice";
import generateAIDishImage from "../utils/aiImage";

function RestaurantDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.restaurants);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (!list || list.length === 0) dispatch(fetchRestaurants());

    // load menus mock
    fetch("/mock/menus.json")
      .then((r) => r.json())
      .then((data) => {
        setMenu(data[id] || []);
      })
      .catch(() => setMenu([]));
  }, [dispatch, list, id]);

  const restaurant = list.find((r) => String(r.info?.id) === String(id));

  if (loading) return <div className="p-6">Loading...</div>;
  if (!restaurant)
    return <div className="p-6">Restaurant not found or still loading.</div>;

  const aiKey = `ai_img_${restaurant.info.id}`;
  let fallbackAi = null;
  try {
    const cached = localStorage.getItem(aiKey);
    if (cached) fallbackAi = cached;
    else {
      const generated = generateAIDishImage({ name: restaurant.info.name, cuisines: restaurant.info.cuisines, id: restaurant.info.id, width: 1200, height: 900 });
      if (generated) {
        fallbackAi = generated;
        try { localStorage.setItem(aiKey, generated); } catch(e) {}
      }
    }
  } catch (err) {
    fallbackAi = generateAIDishImage({ name: restaurant.info.name, cuisines: restaurant.info.cuisines, id: restaurant.info.id });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-6">
        <img src={restaurant.info.imageUrl || fallbackAi} alt={restaurant.info.name} className="w-64 h-44 object-cover rounded" />
        <div>
          <h2 className="text-2xl font-bold">{restaurant.info.name}</h2>
          <p className="text-sm text-gray-600">{restaurant.info.cuisines.join(", ")}</p>
          <p className="mt-2">Rating: {restaurant.info.avgRating} • {restaurant.info.sla?.slaString}</p>
          <p className="mt-2 text-sm text-green-600">{restaurant.info.aggregatedDiscountInfoV3?.header}</p>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Menu</h3>
        {menu.length === 0 && <p className="text-sm text-gray-600">No menu available.</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menu.map((item) => (
            <div key={item.id} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-bold">₹{item.price}</div>
                <button
                  onClick={() => dispatch(addItem({ id: item.id, name: item.name, price: item.price, qty: 1 }))}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RestaurantDetail;
