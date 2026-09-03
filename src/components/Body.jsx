import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { DATA_URL } from "../utils/constant";
import RestaurantCard from "./RestaurantCard";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  X,
} from "lucide-react";

const RESTAURANTS_PER_PAGE = 40;
const MAX_RESTAURANTS = 100;

function Body({ isTopRated, setIsTopRated, sortOrder, toggleSort }) {
  const location = useLocation();
  const [resList, setResList] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const activeCuisine = useSelector((state) => state.restaurants.activeCuisine);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      let response;
      let json;
      try {
        response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`Restaurant API returned ${response.status}`);
        }
        json = await response.json();
        console.debug("fetch response status:", response.status);
        console.debug("raw fetched json:", json);
      } catch (err) {
        console.warn("Primary fetch failed, will try local mock. Error:", err);
        // fallback to local mock file served from public/mock
        try {
          const mockResp = await fetch("/mock/restaurants.json");
          if (!mockResp.ok) {
            throw new Error(`Mock restaurants returned ${mockResp.status}`);
          }
          json = await mockResp.json();
          console.debug("Loaded local mock restaurants, count:", json.length);
        } catch (mockErr) {
          console.error("Failed to load local mock restaurants", mockErr);
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
      console.debug(
        "extracted restaurants count:",
        Array.isArray(data) ? data.length : 0,
      );
      setResList(Array.isArray(data) ? data.slice(0, MAX_RESTAURANTS) : []);
      setFilteredRestaurant(
        Array.isArray(data) ? data.slice(0, MAX_RESTAURANTS) : [],
      );
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
    if (location.hash === "#restaurants") {
      const el = document.getElementById("restaurants");
      if (el) {
        // slight delay for layout to settle
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
      }
    }
  }, [location]);

  // ✅ SINGLE SOURCE OF TRUTH FOR FILTERING
  useEffect(() => {
    let updatedList = resList;

    // Search Filter
    if (search.trim() !== "") {
      const query = search.toLowerCase();
      updatedList = updatedList.filter((item) => {
        const info = item?.info || {};
        return [info.name, info.areaName, ...(info.cuisines || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
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
      updatedList = updatedList.filter((item) => item?.info?.avgRating > 4.0);
    }

    if (sortOrder) {
      updatedList = [...updatedList].sort((a, b) => {
        const ra = parseFloat(a?.info?.avgRating) || 0;
        const rb = parseFloat(b?.info?.avgRating) || 0;
        return sortOrder === "desc" ? rb - ra : ra - rb;
      });
    }
    setFilteredRestaurant(updatedList);
    setCurrentPage(1);
  }, [search, isTopRated, resList, activeCuisine, sortOrder]);

  const totalPages = Math.ceil(
    filteredRestaurant.length / RESTAURANTS_PER_PAGE,
  );
  const visibleRestaurants = filteredRestaurant.slice(
    (currentPage - 1) * RESTAURANTS_PER_PAGE,
    currentPage * RESTAURANTS_PER_PAGE,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Search */}
      <div className="search-shell mb-6">
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          type="text"
          className="search-input w-full rounded-xl border px-4 py-3 pr-36 outline-none text-gray-700 focus:ring-2 focus:ring-orange-400"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setSearch("")}
            aria-label="Clear restaurant search"
          >
            <X size={16} />
          </button>
        )}
        <span className="search-result-count">
          {filteredRestaurant.length} restaurants
        </span>
      </div>

      <div className="mobile-filter-toolbar mb-6">
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
        >
          <ArrowDownUp size={15} />
          {sortOrder === "desc"
            ? "Highest rated"
            : sortOrder === "asc"
              ? "Lowest rated"
              : "Sort"}
        </button>
      </div>

      {/* Top 15 Restaurants section removed as requested */}

      {isLoading ? (
        <div
          className="restaurant-skeleton-grid"
          aria-label="Loading restaurants"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <div className="restaurant-skeleton" key={index} />
          ))}
        </div>
      ) : filteredRestaurant.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No restaurants found</p>
      ) : (
        <div id="restaurants">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {visibleRestaurants.map((e) => (
              <RestaurantCard key={e?.info?.id} res={e} />
            ))}
          </div>
          {totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-center gap-3"
              aria-label="Restaurant pages"
            >
              <button
                type="button"
                className="filter-pill"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Previous restaurant page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                className="filter-pill"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next restaurant page"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}

export default Body;
