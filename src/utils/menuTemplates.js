const menuTemplates = {
  asian: [
    [
      "Crispy Vegetable Spring Rolls",
      "Golden rolls with seasonal vegetables and sweet chili dip.",
      159,
    ],
    [
      "Sesame Garlic Noodles",
      "Wok-tossed noodles with sesame, garlic, and fresh vegetables.",
      219,
    ],
    [
      "Asian Rice Bowl",
      "Steamed rice with vegetables, herbs, and house sauce.",
      249,
    ],
  ],
  bakery: [
    [
      "Fresh Baked Croissant",
      "Buttery, flaky pastry baked fresh for the day.",
      99,
    ],
    [
      "Chocolate Muffin",
      "Soft chocolate muffin with a rich cocoa center.",
      119,
    ],
    ["Creamy Coffee", "Smooth coffee finished with steamed milk.", 89],
  ],
  bbq: [
    [
      "Smoky BBQ Platter",
      "Grilled specialties glazed with smoky house barbecue sauce.",
      329,
    ],
    ["BBQ Chicken Wings", "Tender wings with a charred barbecue glaze.", 269],
    ["Grilled Corn", "Charred corn with herb butter and seasoning.", 129],
  ],
  biryani: [
    [
      "Hyderabadi Biryani",
      "Fragrant basmati rice layered with aromatic spices and curry.",
      279,
    ],
    ["Paneer Biryani", "Spiced rice with tender paneer and saffron.", 249],
    [
      "Biryani with Raita",
      "Aromatic biryani served with cool, seasoned yogurt.",
      299,
    ],
  ],
  burgers: [
    [
      "Classic Smash Burger",
      "Crispy-edged patty with cheese, lettuce, and house sauce.",
      229,
    ],
    [
      "Spicy Veg Burger",
      "Crispy vegetable patty with jalapeno sauce and fresh salad.",
      199,
    ],
    [
      "Loaded Fries",
      "Golden fries topped with cheese, herbs, and signature sauce.",
      149,
    ],
  ],
  cafe: [
    [
      "Grilled Cheese Sandwich",
      "Toasted bread filled with melted cheese and vegetables.",
      169,
    ],
    ["Cappuccino", "Smooth espresso with foamy steamed milk.", 99],
    ["Cafe Brownie", "Warm chocolate brownie with a fudgy center.", 129],
  ],
  chinese: [
    [
      "Vegetable Hakka Noodles",
      "Wok-tossed noodles with crisp vegetables and soy seasoning.",
      199,
    ],
    [
      "Chilli Paneer",
      "Crisp paneer tossed with peppers in a spicy sauce.",
      239,
    ],
    [
      "Steamed Dumplings",
      "Soft dumplings filled with seasoned vegetables.",
      189,
    ],
  ],
  continental: [
    [
      "Creamy Mushroom Pasta",
      "Pasta in a creamy herb and mushroom sauce.",
      269,
    ],
    [
      "Grilled Veg Platter",
      "Seasonal vegetables grilled with herbs and olive oil.",
      249,
    ],
    ["Garlic Bread", "Toasted bread with garlic butter and herbs.", 129],
  ],
  desserts: [
    [
      "Classic Cheesecake",
      "Creamy cheesecake with a buttery biscuit base.",
      189,
    ],
    ["Chocolate Brownie", "Rich, fudgy brownie served warm.", 149],
    ["Seasonal Ice Cream", "Two scoops of creamy seasonal ice cream.", 129],
  ],
  indian: [
    [
      "Chole Bhature",
      "Spiced chickpeas served with fluffy fried bhature.",
      199,
    ],
    [
      "Paneer Tikka",
      "Char-grilled paneer with peppers and Indian spices.",
      249,
    ],
    ["Jeera Rice", "Basmati rice tempered with cumin and herbs.", 159],
  ],
  italian: [
    [
      "Penne Arrabbiata",
      "Penne pasta in a spicy tomato and garlic sauce.",
      229,
    ],
    [
      "Margherita Pizza",
      "Classic pizza with tomato, mozzarella, and basil.",
      249,
    ],
    ["Garlic Bread", "Toasted bread with garlic butter and herbs.", 129],
  ],
  japanese: [
    [
      "Vegetable Sushi Roll",
      "Fresh sushi roll with seasoned rice and vegetables.",
      249,
    ],
    ["Miso Ramen", "Noodles in a savory miso broth with fresh toppings.", 299],
    [
      "Teriyaki Rice Bowl",
      "Steamed rice with vegetables and sweet teriyaki glaze.",
      269,
    ],
  ],
  mexican: [
    [
      "Loaded Veg Tacos",
      "Soft tacos filled with beans, salsa, vegetables, and cheese.",
      219,
    ],
    [
      "Mexican Rice Bowl",
      "Seasoned rice with beans, corn, salsa, and guacamole.",
      249,
    ],
    [
      "Cheese Quesadilla",
      "Grilled tortilla filled with melted cheese and peppers.",
      199,
    ],
  ],
  noodles: [
    [
      "Wok Noodles",
      "Noodles tossed with vegetables and savory house sauce.",
      199,
    ],
    [
      "Chilli Garlic Noodles",
      "Spicy noodles with garlic, peppers, and spring onion.",
      219,
    ],
    [
      "Crispy Manchurian",
      "Crispy vegetable bites in a tangy Manchurian sauce.",
      229,
    ],
  ],
  pizza: [
    [
      "Margherita Pizza",
      "Classic pizza with tomato, mozzarella, and basil.",
      249,
    ],
    [
      "Farmhouse Pizza",
      "Loaded pizza with peppers, onions, corn, and olives.",
      299,
    ],
    ["Garlic Bread", "Toasted bread with garlic butter and herbs.", 129],
  ],
  salads: [
    [
      "Garden Fresh Salad",
      "Crisp greens with fresh vegetables and herb dressing.",
      189,
    ],
    [
      "Greek Salad",
      "Cucumber, tomato, olives, and feta with lemon dressing.",
      219,
    ],
    [
      "Protein Grain Bowl",
      "Whole grains, vegetables, and a nourishing house dressing.",
      249,
    ],
  ],
  seafood: [
    ["Grilled Fish Plate", "Fresh fish grilled with herbs and lemon.", 349],
    [
      "Coastal Fish Curry",
      "Tender fish cooked in a fragrant coastal curry.",
      329,
    ],
    [
      "Garlic Prawns",
      "Juicy prawns sauteed with garlic, herbs, and butter.",
      379,
    ],
  ],
  south: [
    [
      "Masala Dosa",
      "Crisp dosa filled with spiced potato and served with chutneys.",
      159,
    ],
    ["Idli Sambar", "Steamed rice cakes served with sambar and chutney.", 129],
    [
      "South Indian Meals",
      "Rice, sambar, vegetables, and traditional sides.",
      229,
    ],
  ],
  thai: [
    [
      "Thai Green Curry",
      "Creamy coconut curry with vegetables and Thai herbs.",
      279,
    ],
    [
      "Pad Thai",
      "Rice noodles tossed with vegetables, peanuts, and tangy sauce.",
      249,
    ],
    ["Thai Basil Rice", "Fragrant rice with vegetables and Thai basil.", 229],
  ],
  wraps: [
    [
      "Paneer Tikka Wrap",
      "Soft flatbread filled with paneer tikka and fresh salad.",
      189,
    ],
    ["Falafel Wrap", "Crispy falafel with hummus, salad, and tahini.", 179],
    [
      "Loaded Veg Wrap",
      "Seasoned vegetables, cheese, and house sauce in a warm wrap.",
      169,
    ],
  ],
};

const findTemplate = (cuisines = []) => {
  const normalized = cuisines.join(" ").toLowerCase();
  const key = Object.keys(menuTemplates).find((item) =>
    normalized.includes(item),
  );
  return menuTemplates[key] || menuTemplates.indian;
};

export const createMenuForRestaurant = (restaurantId, cuisines) =>
  findTemplate(cuisines).map(([name, description, price], index) => ({
    id: `${restaurantId}-${index + 1}`,
    name,
    description,
    price,
  }));
