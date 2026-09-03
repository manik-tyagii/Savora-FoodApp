import { Clock3, MapPin, ShoppingBag, Sparkles, Utensils } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCuisineFilter } from "../features/restaurantsSlice";

const quickCuisines = ["Indian", "Pizza", "Burgers", "Healthy", "Desserts"];

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart.items.length || 0);
  const activeCuisine = useSelector((state) => state.restaurants.activeCuisine);

  const chooseCuisine = (cuisine) => {
    dispatch(setCuisineFilter(cuisine));
    document
      .getElementById("restaurants")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside className="savora-sidebar hidden w-56 shrink-0 xl:block">
      <div className="sidebar-panel sticky top-5 rounded-3xl p-4">
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="sidebar-icon">
            <Utensils size={16} />
          </span>
          Explore Savora
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Your shortcut to the good stuff.
        </p>

        <div className="craving-callout mt-4 rounded-2xl p-3">
          <span className="craving-star">✦</span>
          <strong>Crave it. Find it. Love it.</strong>
          <small>Pick a mood, we&apos;ll bring the flavour.</small>
        </div>

        <div className="mt-5 space-y-1">
          <p className="sidebar-label">Quick cravings</p>
          {quickCuisines.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => chooseCuisine(cuisine)}
              className={`sidebar-link ${activeCuisine === cuisine ? "is-active" : ""}`}
            >
              <Sparkles size={15} /> {cuisine}
            </button>
          ))}
        </div>

        <div className="sidebar-perk mt-5 rounded-2xl p-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Clock3 size={16} /> 30 min promise
          </div>
          <p className="mt-1 text-xs">Hot food, happy table, zero fuss.</p>
        </div>

        <div className="mt-4 space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={14} /> Delivering in Bengaluru
          </div>
          <div className="flex items-center gap-2">
            <ShoppingBag size={14} /> {cartCount} items in your bag
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="sidebar-cart mt-5 w-full rounded-xl px-3 py-2 text-sm font-bold"
        >
          Open my bag
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
