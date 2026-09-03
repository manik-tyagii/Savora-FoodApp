export const SWIGGY_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png";
export const isLocalDev =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
export const DATA_URL = isLocalDev
  ? "/mock/restaurants.json"
  : "/.netlify/functions/getRestaurants";
export const BASE_URL =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_288,h_360/";
