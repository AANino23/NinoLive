export type ChinaBoxMenuFlag = "popular" | "vegetarian";

export type ChinaBoxMenuItem = {
  id: string;
  name: string;
  pence: number;
  description?: string;
  flags?: ChinaBoxMenuFlag[];
};

export type ChinaBoxMenuCategory = {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  items: ChinaBoxMenuItem[];
};

type MenuItemSeed = {
  name: string;
  pence: number;
  description?: string;
  popular?: boolean;
  vegetarian?: boolean;
};

function item(
  name: string,
  pence: number,
  description?: string,
  flags: { popular?: boolean; vegetarian?: boolean } = {},
): MenuItemSeed {
  return { name, pence, description, ...flags };
}

function fourWay(createName: (base: string) => string): MenuItemSeed[] {
  return [
    item(createName("Chicken"), 870),
    item(createName("Beef"), 870),
    item(createName("King Prawn"), 900),
    item(createName("Special"), 900, "Chicken, beef and king prawn"),
  ];
}

const seedCategories: Array<{
  id: string;
  emoji: string;
  title: string;
  description?: string;
  items: MenuItemSeed[];
}> = [
  {
    id: "box",
    emoji: "🥡",
    title: "Box Meal Deals",
    items: [
      item(
        "China Box 1",
        1200,
        "Salt and pepper chips, salt and pepper chicken, vegetable mini spring rolls, salt and pepper chicken wings, and curry sauce",
        { popular: true },
      ),
      item(
        "China Box 2",
        1600,
        "Salt and pepper chips, salt and pepper chicken, salt and pepper lamb ribs, mini vegetable spring rolls, curry samosas, egg fried rice, and curry sauce",
        { popular: true },
      ),
      item(
        "China Box 3",
        3000,
        "Salt and pepper chips, salt and pepper chicken, meat spring rolls, prawn toast, satay skewered chicken, crispy chilli chicken, egg fried rice, soft noodles, and curry sauce",
      ),
      item(
        "China Box Kids Meal",
        495,
        "Chicken pieces with chips and a carton of drink",
      ),
    ],
  },
  {
    id: "starter",
    emoji: "🥟",
    title: "Starters",
    items: [
      item("Prawn Crackers", 270),
      item("Crispy Seaweed", 390),
      item("Curry Samosas (8)", 470),
      item("Mini Vegetable Spring Rolls (8)", 470, undefined, {
        vegetarian: true,
      }),
      item("Meat Spring Rolls (Chicken) (4)", 560),
      item("Prawn Toast (4)", 660, undefined, { popular: true }),
      item("Salt and Pepper King Prawns", 810),
      item("Satay Chicken Skewers (4)", 710),
      item("Salt and Pepper Chicken (Starter)", 720),
      item("Salt and Pepper Lamb Ribs", 920),
      item("Sweet and Sour Lamb Ribs", 920),
      item("Cantonese Lamb Ribs", 920),
      item("Salt and Pepper Chicken Wings", 680, undefined, {
        popular: true,
      }),
      item("Bangkok Fire Cracker Chicken Wings", 680),
      item("Honey and Chilli Chicken Wings", 680),
      item("Cantonese Chicken Wings", 680),
    ],
  },
  {
    id: "soup",
    emoji: "🍲",
    title: "Soup",
    items: [
      item("Chicken and Sweet Corn Soup", 390),
      item("Crab Meat and Sweetcorn Soup", 390),
      item("Hot and Sour Soup", 390),
      item("Vegetable Hot and Sour Soup", 390, undefined, {
        vegetarian: true,
      }),
      item("Sweet Corn Soup", 390, undefined, { vegetarian: true }),
    ],
  },
  {
    id: "duck",
    emoji: "🦆",
    title: "Aromatic Crispy Duck",
    description:
      "Served with pancakes, hoisin sauce, cucumber and spring onions",
    items: [
      item(
        "Quarter Crispy Duck",
        1500,
        "With 6 pancakes, cucumber, spring onion and hoisin sauce",
      ),
      item(
        "Half Crispy Duck",
        2200,
        "With 12 pancakes, cucumber, spring onion and hoisin sauce",
      ),
    ],
  },
  {
    id: "ss",
    emoji: "🍍",
    title: "Sweet and Sour",
    items: [
      item("Sweet and Sour Chicken (Hong Kong Style)", 870, undefined, {
        popular: true,
      }),
      item("Sweet and Sour King Prawn", 900),
      item("Special Sweet and Sour", 900, "Chicken and king prawn"),
    ],
  },
  {
    id: "curry",
    emoji: "🍛",
    title: "Curry Dishes",
    items: [
      item("Chicken Curry", 870),
      item("Beef Curry", 870),
      item("King Prawn Curry", 900),
      item("Special Curry", 900, "Chicken, beef and king prawn"),
    ],
  },
  {
    id: "satay",
    emoji: "🥜",
    title: "Satay Dishes",
    items: fourWay((base) => `${base} Satay`),
  },
  {
    id: "gpbb",
    emoji: "🫑",
    title: "Green Pepper & Black Bean",
    items: fourWay((base) => `${base} Green Pepper and Black Bean`),
  },
  {
    id: "bp",
    emoji: "🧂",
    title: "Black Pepper Dishes",
    items: fourWay((base) => `${base} Black Pepper Sauce`),
  },
  {
    id: "cant",
    emoji: "🥢",
    title: "Cantonese Sauce",
    items: fourWay((base) => `${base} Cantonese Sauce`),
  },
  {
    id: "szech",
    emoji: "🌶️",
    title: "Szechuan Sauce",
    items: fourWay((base) => `${base} Szechuan`),
  },
  {
    id: "kungpo",
    emoji: "🔥",
    title: "Kung Po Dishes",
    items: fourWay((base) => `${base} Kung Po`),
  },
  {
    id: "gc",
    emoji: "🧄",
    title: "Garlic & Chilli Sauce",
    items: fourWay((base) => `${base} Garlic and Chilli Sauce`),
  },
  {
    id: "mush",
    emoji: "🍄",
    title: "Mushroom Sauce",
    items: fourWay((base) => `${base} Mushroom Sauce`),
  },
  {
    id: "oyster",
    emoji: "🦪",
    title: "Oyster Sauce",
    items: fourWay((base) => `${base} Oyster Sauce`),
  },
  {
    id: "cashew",
    emoji: "🌰",
    title: "Cashew Nut Dishes",
    items: fourWay((base) => `${base} Cashew Nut`),
  },
  {
    id: "gso",
    emoji: "🌱",
    title: "Ginger & Spring Onion",
    items: fourWay((base) => `${base} Ginger and Spring Onion`),
  },
  {
    id: "chef",
    emoji: "⭐",
    title: "Chef Specialties",
    items: [
      item("Crispy Chicken in Lemon Sauce", 870),
      item("Crispy Chilli Chicken", 870),
      item("Crispy Chilli Beef", 870, undefined, { popular: true }),
      item("Salt and Pepper Chicken", 870, undefined, { popular: true }),
    ],
  },
  {
    id: "rice",
    emoji: "🍚",
    title: "Fried Rice Dishes",
    items: [
      item("Chicken Fried Rice", 870, undefined, { popular: true }),
      item("Beef Fried Rice", 870),
      item("King Prawn Fried Rice", 900),
      item("Singapore Fried Rice", 870),
      item("Young Chow Fried Rice", 900),
      item("Special Fried Rice", 900, "Chicken, beef and king prawn"),
    ],
  },
  {
    id: "malay",
    emoji: "🍳",
    title: "Malaysian Fried Rice",
    items: fourWay((base) => `${base} Malaysian Fried Rice`),
  },
  {
    id: "chop",
    emoji: "🥬",
    title: "Chop Suey Dishes",
    items: fourWay((base) => `${base} Chop Suey`),
  },
  {
    id: "cms",
    emoji: "🍜",
    title: "Chow Mein · with Sauce",
    items: [
      item("Chicken Chow Mein with Sauce", 870, undefined, {
        popular: true,
      }),
      item("Beef Chow Mein with Sauce", 870),
      item("King Prawn Chow Mein with Sauce", 900),
      item("Special Chow Mein", 900, "Chicken, beef and king prawn"),
    ],
  },
  {
    id: "cmd",
    emoji: "🍝",
    title: "Chow Mein · Dry",
    items: [
      item("Chicken Chow Mein Dry", 870, undefined, { popular: true }),
      item("Beef Chow Mein Dry", 870),
      item("King Prawn Chow Mein Dry", 900),
      item("Special Chow Mein Dry", 900, "Chicken, beef and king prawn"),
      item("Singapore Vermicelli", 870, "Chicken and prawn"),
    ],
  },
  {
    id: "crispy",
    emoji: "🥠",
    title: "Crispy Noodle Chow Mein",
    items: [
      item("Crispy Chicken Chow Mein", 870),
      item("Crispy Beef Chow Mein", 870),
      item("Crispy King Prawn Chow Mein", 900),
      item("Crispy Special Chow Mein", 900, "Chicken, beef and king prawn"),
    ],
  },
  {
    id: "veg",
    emoji: "🥦",
    title: "Vegetarian Dishes",
    items: [
      item("Mix Veg Curry Sauce", 780, undefined, { vegetarian: true }),
      item("Mix Veg Sweet and Sour", 780, undefined, { vegetarian: true }),
      item("Mix Veg in Satay Sauce", 780, undefined, { vegetarian: true }),
      item("Mix Veg in Green Pepper", 780, undefined, { vegetarian: true }),
      item("Mix Veg Cantonese Sauce", 780, undefined, { vegetarian: true }),
      item("Mix Veg Vermicelli", 780, undefined, { vegetarian: true }),
      item("Mix Veg Szechuan Sauce", 780, undefined, { vegetarian: true }),
      item("Mix Veg Chow Mein", 780, undefined, { vegetarian: true }),
    ],
  },
  {
    id: "sides",
    emoji: "🍟",
    title: "Side Dishes",
    items: [
      item("Boiled Rice", 340),
      item("Large Boiled Rice", 460),
      item("Egg Fried Rice", 360),
      item("Large Egg Fried Rice", 540),
      item("Chips", 270),
      item("Salt and Pepper Chips", 380),
      item("Large Salt and Pepper Chips", 540),
      item("Soft Noodles", 480),
      item("Crispy Noodles", 540),
      item("Pancakes (6)", 120),
    ],
  },
  {
    id: "sauces",
    emoji: "🥣",
    title: "Sauces",
    items: [
      item("Curry Sauce", 180),
      item("Large Curry Sauce", 220),
      item("Cantonese Sauce (tub)", 180),
      item("Large Cantonese Sauce (tub)", 220),
      item("Sweet and Sour Sauce (tub)", 180),
      item("Large Sweet and Sour Sauce (tub)", 220),
      item("Hoisin Sauce", 120),
    ],
  },
  {
    id: "drinks",
    emoji: "🥤",
    title: "Drinks",
    items: [
      item("Pepsi 330ml Can", 130),
      item("Diet Coke 330ml Can", 130),
      item("Vimto 330ml Can", 130),
      item("Fanta Orange 330ml Can", 130),
      item("7up 330ml Can", 130),
      item("Rubicon Mango 330ml Can", 130),
      item("Rubicon Passion 330ml Can", 130),
      item("Carton Drink", 100),
      item("Bottle of Water", 100),
    ],
  },
];

export const chinaBoxMenuVersion = "2026-07-15";

export const chinaBoxMenu: ChinaBoxMenuCategory[] = seedCategories.map(
  (category) => ({
    ...category,
    items: category.items.map((menuItem, index) => {
      const flags: ChinaBoxMenuFlag[] = [];

      if (menuItem.popular) {
        flags.push("popular");
      }

      if (menuItem.vegetarian) {
        flags.push("vegetarian");
      }

      return {
        id: `${category.id}-${index}`,
        name: menuItem.name,
        pence: menuItem.pence,
        description: menuItem.description,
        flags,
      };
    }),
  }),
);

export const chinaBoxMenuItems = Object.fromEntries(
  chinaBoxMenu.flatMap((category) =>
    category.items.map((menuItem, index) => [
      menuItem.id,
      { ...menuItem, categoryId: category.id, orderIndex: index },
    ]),
  ),
);

export function formatPence(pence: number) {
  return `£${(pence / 100).toFixed(2)}`;
}
