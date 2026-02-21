import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'
import { useSelector } from "react-redux";
import { DATA_URL } from "../utils/constant";
import RestaurantCard from "./RestaurantCard";

function Body() {
    const location = useLocation()
    const [resList, setResList] = useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isTopRated, setIsTopRated] = useState(false); // ✅ NEW STATE
    const [sortOrder, setSortOrder] = useState(null) // null | 'asc' | 'desc'
    const activeCuisine = useSelector((state) => state.restaurants.activeCuisine);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            let response;
            let json;
            try {
                response = await fetch(DATA_URL);
                json = await response.json();
                console.debug("fetch response status:", response.status);
                console.debug("raw fetched json:", json);
            } catch (err) {
                console.warn("Primary fetch failed, will try local mock. Error:", err);
                // fallback to local mock file served from public/mock
                try {
                    const mockResp = await fetch('/mock/restaurants.json');
                    json = await mockResp.json();
                    console.debug('Loaded local mock restaurants, count:', json.length);
                } catch (mockErr) {
                    console.error('Failed to load local mock restaurants', mockErr);
                    throw mockErr;
                }
            }

            // Robustly extract restaurants from Swiggy response structure
            const extractRestaurants = (root) => {
                const q = [root];
                while (q.length) {
                    const node = q.shift();
                    if (!node || typeof node !== "object") continue;

                    // If node is an array and looks like restaurant items
                    if (Array.isArray(node)) {
                        if (node.length && node[0]?.info) return node;
                        q.push(...node);
                        continue;
                    }

                    for (const k of Object.keys(node)) {
                        const v = node[k];
                        if (!v) continue;
                        if (Array.isArray(v)) {
                            if (v.length && v[0]?.info) return v;
                            q.push(...v);
                        } else if (typeof v === "object") {
                            q.push(v);
                        }
                    }
                }
                return [];
            };

            const data = extractRestaurants(json) || json || [];
            console.debug("extracted restaurants count:", Array.isArray(data) ? data.length : 0);
            setResList(data);
            setFilteredRestaurant(data); // populate filtered list immediately
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Scroll into view when coming via /home#restaurants
    useEffect(() => {
        if (location.hash === '#restaurants') {
            const el = document.getElementById('restaurants')
            if (el) {
                // slight delay for layout to settle
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
            }
        }
    }, [location])

    // Toggle ascending sort only
    const toggleSort = () => setSortOrder((prev) => (prev === 'asc' ? null : 'asc'))

    // ✅ SINGLE SOURCE OF TRUTH FOR FILTERING
    useEffect(() => {
        let updatedList = resList;

        // Search Filter
        if (search.trim() !== "") {
            updatedList = updatedList.filter((item) =>
                item?.info?.name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Cuisine filter from Section1 (global)
        if (activeCuisine) {
            const ac = String(activeCuisine).toLowerCase();
            updatedList = updatedList.filter((item) => {
                const cuisines = item?.info?.cuisines || [];
                const name = item?.info?.name || "";
                return (
                    cuisines.some((c) => String(c).toLowerCase().includes(ac)) ||
                    String(name).toLowerCase().includes(ac)
                );
            });
        }

        // Top Rated Filter (Toggle)
        if (isTopRated) {
            updatedList = updatedList.filter(
                (item) => item?.info?.avgRating > 4.0
            );
        }

        // Sort ascending by avgRating when sortOrder === 'asc'
        if (sortOrder === 'asc') {
            updatedList = [...updatedList].sort((a, b) => {
                const ra = parseFloat(a?.info?.avgRating) || 0
                const rb = parseFloat(b?.info?.avgRating) || 0
                return ra - rb
            })
        }
        setFilteredRestaurant(updatedList);
    }, [search, isTopRated, resList, activeCuisine, sortOrder]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-orange-600">
                    Hungry? We got you covered
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mt-1">
                    Discover the best food and drinks...
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    className="w-full rounded-xl border px-4 py-3 outline-none text-gray-700 focus:ring-2 focus:ring-orange-400"
                    placeholder="Search restaurants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Top Rated Toggle Button */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        className={`px-6 py-3 text-white rounded-full transition ${isTopRated
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-gray-600 hover:bg-gray-800"
                            }`}
                        onClick={() => setIsTopRated(!isTopRated)} // ✅ TOGGLE
                    >
                        ⚡ {isTopRated ? "Showing Top Rated (Click to Reset)" : "Top Rated"}
                    </button>

                    <button
                        onClick={toggleSort}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            sortOrder === 'asc'
                                ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-md hover:scale-105 focus:ring-orange-300'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200'
                        }`}
                        title="Toggle ascending sort on/off"
                        aria-pressed={sortOrder === 'asc'}
                    >
                        <span className="whitespace-nowrap">Sort</span>
                    </button>
                </div>
                <div>
                    {/* Top 15 preview label */}
                    <span className="text-sm text-gray-600">Top restaurants: 15</span>
                </div>
            </div>

            {/* Top 15 Restaurants section removed as requested */}

            {isLoading ? (
                <p className="text-center text-gray-500 py-10">Loading restaurants...</p>
            ) : filteredRestaurant.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No restaurants found</p>
            ) : (
                <div id="restaurants">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6">
                        {filteredRestaurant.length} Restaurants to explore...
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredRestaurant.map((e) => (
                            <RestaurantCard key={e?.info?.id} res={e} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Body;
