const Food = require("../models/Food");

function calculateDistance(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

exports.getFoods = async (req, res) => {
  try {
    const { country, q, lat, lng } = req.query;

    const query = {
      listing: true,
    };

    if (country) {
      query.country = {
        $regex: country,
        $options: "i",
      };
    }

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { foods: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    let foods = await Food.find(query).lean();

    const hasLocation =
      lat !== undefined &&
      lng !== undefined &&
      !Number.isNaN(Number(lat)) &&
      !Number.isNaN(Number(lng));

    if (hasLocation) {
      const userLat = Number(lat);
      const userLng = Number(lng);

      foods = foods
        .map((food) => {
          const foodLat = Number(food.lat);
          const foodLng = Number(food.lng);

          const validFoodLocation =
            Number.isFinite(foodLat) &&
            Number.isFinite(foodLng) &&
            !(foodLat === 0 && foodLng === 0);

          const distance = validFoodLocation
            ? calculateDistance(userLat, userLng, foodLat, foodLng)
            : null;

          return {
            ...food,
            distance: distance === null ? null : Number(distance.toFixed(2)),
          };
        })
        .sort((a, b) => {
          if (a.distance === null) return 1;
          if (b.distance === null) return -1;
          return a.distance - b.distance;
        });
    }

    return res.status(200).json({
      success: true,
      data: foods,
    });
  } catch (error) {
    console.error("Failed to fetch foods:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch foods",
      error: error.message,
    });
  }
};

exports.list = exports.getFoods;