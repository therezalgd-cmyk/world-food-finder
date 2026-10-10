const mongoose = require("mongoose");
const Food = require("./models/Food");

mongoose.connect("mongodb://localhost:27017/world-food-finder");

const seedData = [
  {
    name: "Savoury Bites",
    country: "Bangladesh",
    address: "Dhaka",
    description: "Local Bangladeshi food restaurant",
    category: "Restaurant",
    foods: ["Biryani", "Beef Curry", "Rice"],
    lat: 23.8103,
    lng: 90.4125,
    listing: true,
  },
  {
    name: "Cafe Aroma",
    country: "Bangladesh",
    address: "Gazipur",
    description: "Coffee and snacks",
    category: "Cafe",
    foods: ["Coffee", "Burger", "Sandwich"],
    lat: 24.0023,
    lng: 90.4264,
    listing: true,
  },
];

async function seed() {
  await Food.deleteMany({});
  await Food.insertMany(seedData);
  console.log("Seed complete");
  process.exit(0);
}

seed();