"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

import { Place } from "@/types";
import {
  createCustomMarker,
  userIcon,
  createClusterCustomIcon,
} from "@/components/maps/utils/markerUtils";
import { LocateControl } from "@/components/maps/controls/LocateControl";
import PlaceDetailModal from "@/components/maps/PlaceDetailModal";

function MapController({ places, onPlaceFound }: { places: Place[], onPlaceFound: (place: Place) => void }) {
  const map = useMap();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const highlightId = searchParams.get('highlight');

    if (lat && lng && highlightId && places.length > 0) {
      const targetLat = parseFloat(lat);
      const targetLng = parseFloat(lng);

      map.flyTo([targetLat, targetLng], 18, {
        animate: true,
        duration: 1.5
      });
      const targetPlace = places.find(p => p.id === highlightId);
      if (targetPlace) {
        onPlaceFound(targetPlace);
      }
    }
  }, [searchParams, places, map, onPlaceFound]);

  return null;
}

// --- KOMPONEN UTAMA ---
export default function Map() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("/api/places");
        const data = await res.json();
        const validData = Array.isArray(data) ? data : [];
        setPlaces(validData);
        const allCats = new Set(validData.map((p: Place) => p.category));
        setVisibleCategories(allCats as Set<string>);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(places.map((p) => p.category))),
    [places],
  );

  const toggleCategory = (cat: string, isVisible: boolean) => {
    setVisibleCategories((prev) => {
      const newSet = new Set(prev);
      if (isVisible) newSet.add(cat);
      else newSet.delete(cat);
      return newSet;
    });
  };

  if (loading) return <div>Loading map...</div>;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[-8.098064989795585, 112.16514038306394]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <MapController 
          places={places} 
          onPlaceFound={(place) => setSelectedPlace(place)} 
        />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Peta Jalan">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OSM"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelit">
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
              attribution="&copy; OSM"
            />
          </LayersControl.BaseLayer>
          {categories.map((category) => (
            <LayersControl.Overlay checked name={category} key={category}>
              <LayerGroup
                eventHandlers={{
                  add: () => toggleCategory(category, true),
                  remove: () => toggleCategory(category, false),
                }}
              />
            </LayersControl.Overlay>
          ))}
        </LayersControl>

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>Lokasi Anda</Popup>
          </Marker>
        )}
        <LocateControl
          onLocationFound={(lat, lng) => setUserLocation({ lat, lng })}
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={80}
        >
          {places
            .filter((place) => visibleCategories.has(place.category))
            .map((place) => (
              <Marker
                key={place.id}
                position={[Number(place.lat), Number(place.lon)]}
                icon={createCustomMarker(place.category)}
                eventHandlers={{
                  click: () => {
                     setSelectedPlace(place);
                  },
                }}
              >
                <Popup>
                  <div className="w-60">
                    {/* POPUP: Menampilkan Gambar Pertama (Index 0) */}
                    {place.placeImages && place.placeImages.length > 0 ? (
                      <div className="relative w-full h-32 mb-2 rounded-lg overflow-hidden">
                        <Image
                          src={place.placeImages[0].url}
                          alt={place.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-slate-100 rounded-lg mb-2 flex items-center justify-center text-xs text-slate-400">
                        No Image
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {place.address}
                    </p>
                    <button
                      onClick={() => setSelectedPlace(place)}
                      className="w-full bg-lime-600 text-white py-1.5 px-4 rounded-md text-sm hover:bg-lime-700"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* --- MODAL DETAIL (DENGAN CAROUSEL) --- */}
      {selectedPlace && (
        <PlaceDetailModal
          key={selectedPlace.id || selectedPlace.name}
          place={selectedPlace}
          onClose={() => {
            // Hapus query params saat modal ditutup supaya URL bersih (Opsional tapi bagus buat UX)
            // window.history.replaceState(null, '', window.location.pathname);
            setSelectedPlace(null);
          }}
        />
      )}
    </div>
  );
}