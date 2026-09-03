import {
  Clock3,
  ArrowDownUp,
  MapPin,
  Plane,
  ShoppingBag,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCuisineFilter } from "../features/restaurantsSlice";

const quickCuisines = ["Indian", "Pizza", "Burgers", "Healthy", "Desserts"];

function Sidebar({
  isTopRated,
  setIsTopRated,
  sortOrder,
  toggleSort,
  onRefresh,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((state) => state.cart.items.length || 0);
  const user = useSelector((state) => state.auth.user);
  const activeCuisine = useSelector((state) => state.restaurants.activeCuisine);
  const displayName = user?.email?.split("@")[0] || "Food lover";

  const chooseCuisine = (cuisine) => {
    dispatch(setCuisineFilter(cuisine));
    document
      .getElementById("restaurants")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside className="savora-sidebar hidden w-56 shrink-0 self-stretch xl:flex xl:flex-col">
      <div className="sidebar-panel rounded-3xl p-4">
        <div className="sidebar-filter-toolbar">
          <button
            type="button"
            className={`filter-pill ${isTopRated ? "is-active" : ""}`}
            onClick={() => setIsTopRated(!isTopRated)}
            aria-pressed={isTopRated}
          >
            <Star size={15} fill="currentColor" />
            {isTopRated ? "Top rated on" : "Top rated"}
          </button>
          <button
            type="button"
            className={`filter-pill ${sortOrder ? "is-sorted" : ""}`}
            onClick={toggleSort}
            aria-label={`Sort restaurants${sortOrder === "desc" ? " by highest rating" : sortOrder === "asc" ? " by lowest rating" : " by default order"}`}
          >
            <ArrowDownUp size={15} />
            {sortOrder === "desc"
              ? "Highest rated"
              : sortOrder === "asc"
                ? "Lowest rated"
                : "Sort"}
          </button>
        </div>
        <button
          type="button"
          className="explore-trigger flex items-center gap-2 text-sm font-bold"
          onClick={onRefresh}
          title="Refresh restaurants"
        >
          <span className="sidebar-icon">
            <Utensils size={16} />
          </span>
          Explore Savora
        </button>
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

        <div className="sidebar-bottom-animation" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="sidebar-deal-flight" aria-label="Deals on the way">
        <div className="sidebar-deal-copy">
          <span>Deals on the way</span>
          <strong>Fresh picks incoming</strong>
        </div>
        <span className="sidebar-offer sidebar-offer-one">20% OFF</span>
        <span className="sidebar-offer sidebar-offer-two">FREE DELIVERY</span>
        <span className="sidebar-offer sidebar-offer-three">FLAT 100 OFF</span>
        <span className="sidebar-offer sidebar-offer-four">BUY 1 GET 1</span>
        <span className="sidebar-offer sidebar-offer-five">15% OFF</span>
        <span className="sidebar-offer sidebar-offer-six">FREE DESSERT</span>
        <div className="sidebar-personal-station">
          <div className="sidebar-user-image">
            <img
              src="/assets/professional-chef.svg"
              alt={`${displayName} food avatar`}
            />
          </div>
          <div className="sidebar-order-cta">
            <span>
              Hey, <strong className="user-name">{displayName} ji</strong>!
            </span>
            <strong>Good food is calling</strong>
            <small>One bite, instant happiness.</small>
            <button type="button" onClick={() => navigate("/cart")}>
              Order now
            </button>
          </div>
          <div className="sidebar-brand-plane">
            <Plane size={18} />
            <span>
              <strong>Savora</strong>
              <small>The taste you need</small>
            </span>
          </div>
        </div>
        <div className="sidebar-flight-sky" aria-hidden="true">
          <span className="sidebar-cloud sidebar-cloud-one"></span>
          <span className="sidebar-cloud sidebar-cloud-two"></span>
          <Plane className="sidebar-plane" size={20} />
        </div>
        <div className="sidebar-flight-road" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
