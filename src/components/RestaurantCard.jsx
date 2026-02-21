import { BASE_URL } from "../utils/constant"
import { useNavigate } from "react-router-dom";
import generateAIDishImage from "../utils/aiImage";

function RestaurantCard({ res }) {
    const navigate = useNavigate();
    const {
        cloudinaryImageId,
        imageUrl,
        name,
        cuisines = [],
        avgRating,
        sla = {},
        areaName
    } = res?.info || {}

        // prefer actual image, otherwise use a small AI-generated SVG preview
        const aiKey = `ai_img_${res?.info?.id}`;
        let fallbackAi = null;
        try {
            const cached = localStorage.getItem(aiKey);
            if (cached) fallbackAi = cached;
            else {
                const generated = generateAIDishImage({ name, cuisines, id: res?.info?.id });
                if (generated) {
                    fallbackAi = generated;
                    try { localStorage.setItem(aiKey, generated); } catch(e) { /* ignore */ }
                }
            }
        } catch (err) {
            fallbackAi = generateAIDishImage({ name, cuisines, id: res?.info?.id });
        }

    return (
        <div
            onClick={() => navigate(`/restaurant/${res?.info?.id}`)}
            className="
            rounded-2xl overflow-hidden pb-3 bg-white
            shadow-md hover:-translate-y-2
            hover:shadow-xl hover:shadow-orange-500/30
            transition-all duration-300
        ">
            {/* Image */}
            <div className="relative w-full h-44 sm:h-52 md:h-56 overflow-hidden">
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
            </div>

            {/* Content */}
            <div className="px-3 pt-2">
                <h3
                    className="font-bold text-base sm:text-lg truncate"
                    title={name}
                >
                    {name}
                </h3>

                {/* Rating + Time */}
                <div className="flex items-center text-sm text-gray-700 mt-1">
                    <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                        ⭐ {avgRating || "--"}
                    </span>
                    <span className="ml-2">
                        ({sla?.slaString || "N/A"})
                    </span>
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
    )
}

export default RestaurantCard
