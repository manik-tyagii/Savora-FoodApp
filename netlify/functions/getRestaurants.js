export default async (req, context) => {
    try {
        const swiggyUrl =
            "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9358325&lng=77.6328499&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

        const response = await fetch(swiggyUrl, {
            headers: {
                // Use common browser headers to avoid automated request blocking
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "application/json, text/plain, */*",
                Referer: "https://www.swiggy.com/",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
};
