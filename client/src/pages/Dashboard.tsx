import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import PlaceCard from "../components/PlaceCard";

type Food = {
  _id?: string;
  id?: string;
  name?: string;
  country?: string;
  address?: string;
  description?: string;
  foods?: string[];
  distance?: number;
};

export default function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("Bangladesh");
  const [foodQuery, setFoodQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const fetchFoods = async () => {
    setLoading(true);

    try {
      const params: any = {
        country,
      };

      if (foodQuery) params.q = foodQuery;

      if (userLocation) {
        params.lat = userLocation.lat;
        params.lng = userLocation.lng;
      }

      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/foods`, {
        params,
      });

      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setFoods(data);
    } catch (error) {
      console.error("Failed to load foods:", error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Location denied. Showing country-based results only.");
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [country, foodQuery, userLocation]);

  return (
    <div>
      <Header />

      <div style={{ padding: 20 }}>
        <label>
          Country:
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ marginLeft: 10, padding: 6 }}
          >
            <option value="Bangladesh">Bangladesh</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
          </select>
        </label>

        <input
          type="text"
          value={foodQuery}
          onChange={(e) => setFoodQuery(e.target.value)}
          placeholder="Search food like biryani, coffee..."
          style={{ marginLeft: 20, padding: 8, width: 220 }}
        />

        <button
          onClick={fetchFoods}
          style={{ marginLeft: 20, padding: "8px 16px" }}
        >
          Search
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        foods.map((item) => (
          <PlaceCard
            key={item._id ?? item.id ?? item.name}
            name={item.name}
            country={item.country}
            address={item.address}
            description={item.description}
            foods={item.foods}
            distance={item.distance}
          />
        ))
      )}
    </div>
  );
}