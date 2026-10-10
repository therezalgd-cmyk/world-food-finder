type PlaceCardProps = {
  name?: string;
  country?: string;
  address?: string;
  description?: string;
  foods?: string[];
  distance?: number;
};

export default function PlaceCard({
  name,
  country,
  address,
  description,
  foods,
  distance,
}: PlaceCardProps) {
  return (
    <div
      style={{
        margin: 10,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h3>{name}</h3>
      <p>
        <strong>Country:</strong> {country || "Unknown country"}
      </p>
      <p>
        <strong>Address:</strong> {address || "Address not available"}
      </p>
      <p>
        <strong>About:</strong> {description || "No description"}
      </p>
      <p>
        <strong>Foods:</strong> {foods?.join(", ") || "No food list"}
      </p>
      <p>
        <strong>Distance:</strong>{" "}
        {distance ? `${distance} km away` : "Not available"}
      </p>
    </div>
  );
}