import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import generateAIDishImage from "../utils/aiImage";
import { storage, getStoredBoolean } from "../utils/storage";
import { Heart } from "lucide-react";
import { useState } from "react";

function RestaurantCard({ res }) {
  const navigate = useNavigate();
  const {
    cloudinaryImageId,
    imageUrl,
    name,
    cuisines = [],
    avgRating,
    sla = {},
    areaName,
  } = res?.info || {};
  const [isFavorite, setIsFavorite] = useState(() =>
    getStoredBoolean(`savora-favorite-${res?.info?.id}`),
  );

  const openRestaurant = () => navigate(`/restaurant/${res?.info?.id}`);

  const toggleFavorite = (event) => {
    event.stopPropagation();
    const nextValue = !isFavorite;
    setIsFavorite(nextValue);
    storage.set(`savora-favorite-${res?.info?.id}`, String(nextValue));
  };

  // prefer actual image, otherwise use a small AI-generated SVG preview
  const aiKey = `ai_img_${res?.info?.id}`;
  let fallbackAi = null;
  try {
    const cached = storage.get(aiKey);
    if (cached) fallbackAi = cached;
    else {
      const generated = generateAIDishImage({
        name,
        cuisines,
        id: res?.info?.id,
      });
      if (generated) {
        fallbackAi = generated;
        storage.set(aiKey, generated);
      }
    }
  } catch {
    fallbackAi = generateAIDishImage({ name, cuisines, id: res?.info?.id });
  }

  return (
    <div
      onClick={openRestaurant}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openRestaurant();
      }}
      role="button"
      tabIndex={0}
      className="
            rounded-2xl overflow-hidden pb-3 bg-white
            savora-card
            shadow-md hover:-translate-y-2
            hover:shadow-xl hover:shadow-orange-500/30
            transition-all duration-300
        "
    >
      {/* Image */}
      <div className="relative w-full h-44 sm:h-52 md:h-56 overflow-hidden">
        <span className="card-kicker">Fresh pick</span>
        <img
          className="w-full h-full object-cover"
          src={
            imageUrl
              ? imageUrl
              : cloudinaryImageId
                ? BASE_URL + cloudinaryImageId
                : fallbackAi
          }
          alt={name}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
          {res?.info?.aggregatedDiscountInfoV3?.header && (
            <div className="absolute bottom-3 left-3 text-lg sm:text-xl text-white font-bold">
              {res.info.aggregatedDiscountInfoV3.header}
            </div>
          )}
        </div>
        <button
          type="button"
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
          onClick={toggleFavorite}
          aria-label={
            isFavorite
              ? `Remove ${name} from favorites`
              : `Save ${name} to favorites`
          }
          aria-pressed={isFavorite}
        >
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pt-2">
        <h3 className="font-bold text-base sm:text-lg truncate" title={name}>
          {name}
        </h3>

        {/* Rating + Time */}
        <div className="flex items-center text-sm text-gray-700 mt-1">
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
            ⭐ {avgRating || "--"}
          </span>
          <span className="ml-2">({sla?.slaString || "N/A"})</span>
        </div>

        {/* Cuisines */}
        <p
          className="truncate text-sm text-gray-500 mt-1"
          title={cuisines.join(", ")}
        >
          {cuisines.length ? cuisines.join(", ") : "Various Cuisines"}
        </p>

        {/* Area */}
        <p
          className="truncate text-sm font-medium text-gray-700"
          title={areaName}
        >
          {areaName || "Location"}
        </p>
      </div>
    </div>
  );
}

export default RestaurantCard;
