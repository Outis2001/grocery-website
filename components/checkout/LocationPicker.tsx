'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default marker icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  shopLat: number;
  shopLng: number;
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function LocationPicker({
  onLocationSelect,
  shopLat,
  shopLng,
}: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const maxRadius = parseFloat(process.env.NEXT_PUBLIC_MAX_DELIVERY_RADIUS_KM || '5');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocationSelect = async (lat: number, lng: number) => {
    // Use reverse geocoding to get address (optional)
    // For now, we'll use a simple lat/lng format
    const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    // Try to get actual address using Nominatim (free)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        onLocationSelect(lat, lng, data.display_name);
        return;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    onLocationSelect(lat, lng, address);
  };

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[shopLat, shopLng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Shop Location Marker */}
      <Marker
        position={[shopLat, shopLng]}
        icon={
          new L.Icon({
            iconUrl:
              'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          })
        }
      />

      {/* Delivery Radius Circle */}
      <Circle
        center={[shopLat, shopLng]}
        radius={maxRadius * 1000} // Convert km to meters
        pathOptions={{
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.1,
        }}
      />

      {/* Customer Location Marker (clickable) */}
      <LocationMarker onLocationSelect={handleLocationSelect} />
    </MapContainer>
  );
}
