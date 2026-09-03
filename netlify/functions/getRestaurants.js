import mockRestaurants from "../../public/mock/restaurants.json" with { type: "json" };

const PAGE_SIZE = 20;
const MAX_RESTAURANTS = 100;

const extractRestaurants = (root) => {
  const queue = [root];
  const restaurants = [];

  while (queue.length && restaurants.length < PAGE_SIZE) {
    const node = queue.shift();
    if (!node || typeof node !== "object") continue;

    if (Array.isArray(node)) {
      if (node.length && node[0]?.info) return node;
      queue.push(...node);
      continue;
    }

    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        if (value.length && value[0]?.info) return value;
        queue.push(...value);
      } else if (value && typeof value === "object") {
        queue.push(value);
      }
    }
  }

  return restaurants;
};

export default async () => {
  try {
    const restaurants = [];
    const seenIds = new Set();

    for (
      let offset = 0;
      restaurants.length < MAX_RESTAURANTS && offset < MAX_RESTAURANTS;
      offset += PAGE_SIZE
    ) {
      const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9358325&lng=77.6328499&offset=${offset}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
      const response = await fetch(swiggyUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          Referer: "https://www.swiggy.com/",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) throw new Error(`Swiggy returned ${response.status}`);
      const page = extractRestaurants(await response.json());
      if (!page.length) break;

      const countBeforePage = restaurants.length;
      for (const restaurant of page) {
        const id = restaurant?.info?.id;
        if (id && !seenIds.has(id)) {
          seenIds.add(id);
          restaurants.push(restaurant);
        }
      }

      if (restaurants.length === countBeforePage || page.length < PAGE_SIZE)
        break;
    }

    for (const restaurant of mockRestaurants) {
      if (restaurants.length >= MAX_RESTAURANTS) break;
      const id = restaurant?.info?.id;
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        restaurants.push(restaurant);
      }
    }

    return new Response(JSON.stringify(restaurants.slice(0, MAX_RESTAURANTS)), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
