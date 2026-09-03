import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCuisineFilter } from "../features/restaurantsSlice";

function Section1() {
  const [resList, setResList] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const displayName = (user?.email?.split("@")[0] || "Food lover")
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  useEffect(() => {
    fetch("/mock/restaurants.json")
      .then((response) => response.json())
      .then((data) => setResList((data || []).slice(0, 50)))
      .catch(() => setResList([]));
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-yellow-300 to-yellow-200">
      <img
        className="food-tree"
        src="/assets/food-tree.svg"
        alt="Food tree with pizza, burger, taco and donut"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-10">
          {/* Left: food discovery hero */}
          <div className="space-y-6">
            <span className="hero-kicker">Chef-curated, delivered fresh</span>
            <h1 className="hero-title text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Your next favourite meal is closer than you think.
            </h1>
            <p className="text-sm text-gray-700 sm:text-base">
              Discover hand-picked restaurants and delicious dishes in your
              neighborhood.
            </p>

            <div className="cuisine-strip rounded-xl p-4">
              {resList.length > 0 && (
                <div className="flex gap-3 overflow-x-auto no-scrollbar">
                  {(() => {
                    const cuisineMap = new Map();
                    for (const restaurant of resList) {
                      const cuisines = restaurant?.info?.cuisines || [];
                      const image = restaurant?.info?.imageUrl;
                      for (const cuisine of cuisines) {
                        const key = String(cuisine).trim();
                        if (!cuisineMap.has(key)) cuisineMap.set(key, image);
                      }
                      if (cuisineMap.size >= 12) break;
                    }
                    return Array.from(cuisineMap.entries()).map(
                      ([cuisine, image]) => (
                        <button
                          key={cuisine}
                          type="button"
                          onClick={() => dispatch(setCuisineFilter(cuisine))}
                          className="cuisine-tile relative h-14 w-20 shrink-0 overflow-hidden rounded"
                        >
                          <img
                            src={image || "/mock/placeholder.jpg"}
                            alt={cuisine}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-end bg-black/30 p-2 text-xs font-semibold text-white">
                            {cuisine}
                          </span>
                        </button>
                      ),
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Right: welcome card with friendly character */}
          <div className="hero-visual flex justify-center lg:justify-end">
            <div
              className="w-full max-w-md bg-white rounded-2xl ring-1 ring-yellow-50 overflow-hidden flex items-center gap-4 p-6"
              style={{
                boxShadow:
                  "0 30px 60px rgba(194,65,12,0.28), 0 20px 40px rgba(249,115,22,0.18), 0 6px 12px rgba(249,115,22,0.06)",
              }}
            >
              <div className="chef-avatar-frame flex-shrink-0 w-36 h-36 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner">
                {/* Replaced inline SVG with a creative avatar image (darker shadow) */}
                <img
                  src="/assets/professional-chef.svg"
                  alt="Professional Savora chef cooking"
                  className="w-28 h-28 object-contain"
                  style={{ boxShadow: "0 14px 36px rgba(194,65,12,0.36)" }}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  Welcome, {displayName}!
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {displayName}. Your personal table is ready with
                  flavours picked for your kind of day.
                </p>

                <div className="user-note mt-4">
                  <span>✦</span>
                  Made for your cravings, served with a little joy.
                </div>

                {/* partner restaurants count removed per request */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="delivery-route" aria-hidden="true">
        <img src="/assets/delivery-route.svg" alt="" />
      </div>
    </header>
  );
}

export default Section1;
