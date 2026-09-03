import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../features/restaurantsSlice";
import { addItem } from "../features/cartSlice";
import generateAIDishImage from "../utils/aiImage";
import { createMenuForRestaurant } from "../utils/menuTemplates";
import { storage } from "../utils/storage";

function RestaurantDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.restaurants);
  const [menu, setMenu] = useState([]);
  const [addedItem, setAddedItem] = useState("");

  useEffect(() => {
    if (!list || list.length === 0) dispatch(fetchRestaurants());

    // load menus mock
    fetch("/mock/menus.json")
      .then((r) => r.json())
      .then((data) => {
        setMenu(
          data[id] ||
            createMenuForRestaurant(
              id,
              list.find(
                (restaurant) => String(restaurant.info?.id) === String(id),
              )?.info?.cuisines || [],
            ),
        );
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
    const cached = storage.get(aiKey);
    if (cached) fallbackAi = cached;
    else {
      const generated = generateAIDishImage({
        name: restaurant.info.name,
        cuisines: restaurant.info.cuisines,
        id: restaurant.info.id,
        width: 1200,
        height: 900,
      });
      if (generated) {
        fallbackAi = generated;
        storage.set(aiKey, generated);
      }
    }
  } catch {
    fallbackAi = generateAIDishImage({
      name: restaurant.info.name,
      cuisines: restaurant.info.cuisines,
      id: restaurant.info.id,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
      <div className="detail-hero surface-panel flex flex-col gap-6 p-4 sm:flex-row sm:p-6">
        <img
          src={restaurant.info.imageUrl || fallbackAi}
          alt={restaurant.info.name}
          className="h-56 w-full rounded-2xl object-cover sm:h-64 sm:w-2/5"
        />
        <div className="flex flex-1 flex-col justify-center">
          <p className="eyebrow">Curated for your table</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            {restaurant.info.name}
          </h2>
          <p className="text-sm text-gray-600">
            {restaurant.info.cuisines.join(", ")}
          </p>
          <p className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="status-pill">★ {restaurant.info.avgRating}</span>
            <span className="info-pill">
              ⌁ {restaurant.info.sla?.slaString || "30 MINS"}
            </span>
            <span className="info-pill">
              ⌖ {restaurant.info.areaName || "Bengaluru"}
            </span>
          </p>
          <p className="mt-2 text-sm text-green-600">
            {restaurant.info.aggregatedDiscountInfoV3?.header}
          </p>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Made to order</p>
            <h3 className="mt-1 text-2xl font-bold">Today&apos;s menu</h3>
          </div>
          <span className="text-sm text-gray-600">{menu.length} picks</span>
        </div>
        {menu.length === 0 && (
          <p className="text-sm text-gray-600">No menu available.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menu.map((item) => (
            <div
              key={item.id}
              className="menu-item surface-panel flex items-center justify-between gap-4 rounded-2xl border p-4"
            >
              <div className="min-w-0">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-bold">₹{item.price}</div>
                <button
                  onClick={() => {
                    dispatch(
                      addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        qty: 1,
                        restaurantId: id,
                      }),
                    );
                    setAddedItem(item.id);
                    setTimeout(() => setAddedItem(""), 1400);
                  }}
                  className="accent-button mt-2 rounded-xl px-4 py-2 text-sm font-bold text-white"
                >
                  {addedItem === item.id ? "Added ✓" : "Add +"}
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
