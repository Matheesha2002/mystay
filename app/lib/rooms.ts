export type Room = {
  name: string;
  price: number;
  description: string;
  capacity: number;
  image: string;
  slug: string;
  breakfastIncluded: boolean;
  amenities: string[];
};

export const room: Room = {
  name: "Garden Deluxe",
  price: 18000,
  description: "A comfortable room with a peaceful garden view.",
  capacity: 2,
  image: "/images/garden-deluxe.jpg",
  slug: "garden-deluxe",
  breakfastIncluded: true,
  amenities: ["Free Wi-Fi", "Air conditioning", "Garden view"],
};


export const mountainSuite: Room = {
  name: "Mountain Suite",
  price: 25000,
  description: "A spacious room with a beautiful mountain view.",
  capacity: 3,
  image: "/images/mountain-suite.jpg",
  slug: "mountain-suite",
  breakfastIncluded: true,
  amenities: ["Free Wi-Fi", "Air conditioning", "Private balcony"],
};

export const rooms: Room[] = [room, mountainSuite];