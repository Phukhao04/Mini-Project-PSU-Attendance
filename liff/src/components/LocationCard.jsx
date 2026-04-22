function LocationCard({ location }) {
  if (!location) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm text-gray-600">
      <p className="font-medium mb-1">พิกัดปัจจุบัน</p>
      <p>Lat: {location.latitude}</p>
      <p>Lng: {location.longitude}</p>
    </div>
  );
}

export default LocationCard;