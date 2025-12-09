import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Fix for marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

type Destination = {
  id: string;
  name: string;
  country: string;
  description: string;
  lat?: number;
  lng?: number;
}

type MapViewProps = {
  destinations: Destination[];
}

// Internal component to control the map and zoom when a popup is opened
function MapController({ selectedPosition }: { selectedPosition: LatLngExpression | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPosition) {
      map.setView(selectedPosition, 10, {
        animate: true,
        duration: 0.5
      });
    }
  }, [map, selectedPosition]);
  
  return null;
}

function FitBounds({ destinations }: { destinations: Array<{ lat: number; lng: number }> }) {
	const map = useMap();
	
	useEffect(() => {
	  if (destinations.length > 0) {
		const bounds = new LatLngBounds(
		  destinations.map(d => [d.lat, d.lng] as [number, number])
		);
		
		map.fitBounds(bounds, {
		  padding: [50, 50],
		  animate: true,
		  duration: 0.5
		});
	  }
	}, [map, destinations]);
	
	return null;
  }

export default function MapView({ destinations }: MapViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setSelectedMarker(null);
  }, [destinations]);

  const destinationsWithCoords = destinations.filter(d => d.lat && d.lng);
 
  if (destinationsWithCoords.length === 0) {
    return (
      <div className="h-64 rounded-md border border-slate-700 bg-slate-51730 flex items-center justify-center text-sm text-slate-400">
        No coordinates available to display on the map
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="h-64 rounded-md border border-slate-700 bg-slate-51730 flex items-center justify-center text-sm text-slate-400">
        Loading map...
      </div>
    );
  }

  return (
    <div className="h-64 w-full rounded-md border border-slate-700 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
      <MapContainer
        key={`map-${destinationsWithCoords.length}-${destinationsWithCoords.map(d => d.id).join('-')}`}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
		<FitBounds destinations={destinationsWithCoords.map(d => ({ lat: d.lat!, lng: d.lng! }))} />
		<MapController selectedPosition={selectedMarker} />
        {destinationsWithCoords.map((dest) => (
          <Marker
            key={dest.id}
            position={[dest.lat!, dest.lng!]}
            eventHandlers={{
              click: () => {
                setSelectedMarker([dest.lat!, dest.lng!]);
              }
            }}
          >
            <Popup
              eventHandlers={{
                remove: () => {
                  setSelectedMarker(null);
                }
              }}
            >
              <div className="text-sm">
                <strong>{dest.name}</strong>
                <br />
                <span className="text-gray-600">{dest.country}</span>
                {/* <br /> */}
                {/* <span className="text-xs text-gray-500">{dest.description}</span> */}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
