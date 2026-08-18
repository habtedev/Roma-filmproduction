"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Compass,
  ExternalLink,
  Car,
  Building,
  Key,
} from "lucide-react";

// API Key configuration
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (typeof window !== "undefined" && (window as unknown as { GOOGLE_MAPS_PLATFORM_KEY?: string }).GOOGLE_MAPS_PLATFORM_KEY) ||
  "";

const hasValidKey = Boolean(API_KEY) && API_KEY !== "YOUR_API_KEY" && API_KEY.trim().length > 5;

// Studio & Premier Filming Hubs
export interface StudioLocation {
  id: string;
  name: string;
  tagline: string;
  city: string;
  country: string;
  position: google.maps.LatLngLiteral;
  address: string;
  phone: string;
  hours: string;
  type: "HQ" | "Regional Hub" | "Destination Suite";
  description: string;
  zoom: number;
}

export const STUDIO_HUBS: StudioLocation[] = [
  {
    id: "dallas-hq",
    name: "Dallas Main Studio & Cinema HQ",
    tagline: "Primary Production & Editing Suites",
    city: "Dallas, TX",
    country: "USA",
    position: { lat: 32.7876, lng: -96.8197 }, // Dallas Design District
    address: "1400 Dragon St, Dallas, TX 75207",
    phone: "+1 214 940 8492",
    hours: "Mon – Sat, 9:00 AM – 6:00 PM CT",
    type: "HQ",
    description: "Flagship 4,000 sq ft production loft featuring high-speed RED & ARRI workflow suites, cyclorama infinity wall, and client screening lounge.",
    zoom: 15,
  },
  {
    id: "austin-hub",
    name: "Austin & Hill Country Pavilion",
    tagline: "Central Texas Wedding Base",
    city: "Austin, TX",
    country: "USA",
    position: { lat: 30.2672, lng: -97.7431 },
    address: "200 Congress Ave, Austin, TX 78701",
    phone: "+1 214 940 8492",
    hours: "By Appointment",
    type: "Regional Hub",
    description: "Specialized mobile cinematic drone and natural-light editorial team serving Austin, Dripping Springs, and Fredericksburg luxury ranches.",
    zoom: 14,
  },
  {
    id: "lake-como",
    name: "Lake Como Villa & European Suite",
    tagline: "International Destination HQ",
    city: "Lake Como",
    country: "Italy",
    position: { lat: 45.9658, lng: 9.2023 },
    address: "Via Balbianello 1, Lenno, Lake Como, Italy",
    phone: "+1 214 940 8492",
    hours: "Seasonal / Bespoke Bookings",
    type: "Destination Suite",
    description: "Dedicated European cinematography base for multi-day Italian villa celebrations, boat elopements, and alpine fashion editorials.",
    zoom: 13,
  },
  {
    id: "nyc-suite",
    name: "New York City SoHo Suite",
    tagline: "East Coast Editorial Office",
    city: "New York, NY",
    country: "USA",
    position: { lat: 40.7223, lng: -73.9987 },
    address: "Broome St & Mercer St, SoHo, NY 10013",
    phone: "+1 214 940 8492",
    hours: "By Private Consultation",
    type: "Destination Suite",
    description: "High-fashion pre-wedding portraiture and runway-style bridal sessions across Manhattan, Brooklyn, and the Hamptons.",
    zoom: 14,
  },
];

// Dark Luxury Map Styling
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#121216" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#121216" }, { weight: 2 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#a1a1aa" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e4d3b8" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#71717a" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#18181f" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#22222b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#181820" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#322d25" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f1c16" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c19b6c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1d1d24" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0c0d12" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#52525b" }],
  },
];

// Custom Marker Sub-component
function StudioMarker({
  hub,
  isSelected,
  onClick,
}: {
  hub: StudioLocation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={hub.position}
        title={hub.name}
        onClick={onClick}
      >
        <div className="relative group cursor-pointer">
          {/* Animated pulse ring */}
          <div
            className={`absolute -inset-2 rounded-full transition-all duration-500 ${
              isSelected
                ? "bg-[#C19B6C]/40 animate-ping"
                : "bg-transparent group-hover:bg-[#C19B6C]/20"
            }`}
          />
          {/* Outer Gold Badge */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xl backdrop-blur-md ${
              isSelected
                ? "bg-[#C19B6C] border-white scale-110 text-zinc-950 shadow-[#C19B6C]/50"
                : "bg-zinc-900/90 border-[#C19B6C] text-[#C19B6C] hover:scale-105 group-hover:bg-[#C19B6C] group-hover:text-zinc-950"
            }`}
          >
            <Compass size={16} className="animate-spin-slow" />
          </div>
          {/* Floating Pill Label */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full bg-black/85 border border-[#C19B6C]/40 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg pointer-events-none transition-transform duration-200 group-hover:scale-105">
            {hub.city}
          </div>
        </div>
      </AdvancedMarker>

      {isSelected && (
        <InfoWindow
          anchor={marker}
          onCloseClick={onClick}
          headerContent={
            <div className="flex items-center gap-2 pb-1 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#C19B6C]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C19B6C]">
                {hub.type}
              </span>
            </div>
          }
        >
          <div className="p-1 max-w-[260px] text-zinc-900 dark:text-zinc-100 font-sans">
            <h4 className="font-semibold text-sm leading-snug mb-1 text-[#111115] dark:text-[#F5F1E8]">
              {hub.name}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
              {hub.address}
            </p>
            <div className="space-y-1 text-[11px] border-t border-zinc-200 dark:border-zinc-800 pt-2 mb-3">
              <p className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Phone size={12} className="text-[#C19B6C]" />
                <span>{hub.phone}</span>
              </p>
              <p className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Clock size={12} className="text-[#C19B6C]" />
                <span>{hub.hours}</span>
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${hub.position.lat},${hub.position.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C19B6C] text-zinc-950 text-[10px] font-bold uppercase tracking-wider hover:bg-[#d4b488] transition-colors"
            >
              <Navigation size={10} />
              <span>Get Directions</span>
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

// Controller component for Map panning
function MapPanController({ target }: { target: StudioLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(target.position);
    map.setZoom(target.zoom);
  }, [map, target]);

  return null;
}

// Real-Time Nearby Venue & Hotel Explorer using Places API (New)
function PlacesVenueExplorer({
  activeHub,
}: {
  activeHub: StudioLocation;
}) {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    let isMounted = true;
    placesLib.Place.searchByText({
      textQuery: `luxury wedding venues in ${activeHub.city}`,
      fields: ["displayName", "location", "formattedAddress", "rating", "userRatingCount", "id"],
      locationBias: activeHub.position,
      maxResultCount: 6,
    })
      .then((res) => {
        if (isMounted && res && res.places) {
          setPlaces(res.places);
        }
      })
      .catch((err) => {
        console.warn("Place search notice:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [placesLib, map, activeHub]);

  return (
    <>
      {places.map((place) => {
        if (!place.location) return null;
        return (
          <AdvancedMarker
            key={place.id || place.displayName}
            position={place.location}
            title={place.displayName}
          >
            <div className="group relative cursor-pointer">
              <div className="w-6 h-6 rounded-full bg-zinc-900/90 border border-emerald-400 text-emerald-400 flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
                <Building size={11} />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-black/90 text-[9px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {place.displayName}
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

// Drive Route Visualizer to Dallas HQ using Routes API
function StudioRouteCalculator({
  hub,
  onRouteCalculated,
}: {
  hub: StudioLocation;
  onRouteCalculated?: (info: { distance: string; duration: string }) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary("routes");
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || hub.id !== "dallas-hq") {
      polylinesRef.current.forEach((p) => p.setMap(null));
      return;
    }

    // Default route from Dallas/Fort Worth International Airport (DFW) to Studio HQ
    const dfwAirport: google.maps.LatLngLiteral = { lat: 32.8998, lng: -97.0403 };

    routesLib.Route.computeRoutes({
      origin: dfwAirport,
      destination: hub.position,
      travelMode: "DRIVING",
      fields: ["path", "distanceMeters", "durationMillis", "viewport"],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          polylinesRef.current.forEach((p) => p.setMap(null));
          const newPolylines = routes[0].createPolylines();
          newPolylines.forEach((p) => {
            p.setOptions({
              strokeColor: "#C19B6C",
              strokeOpacity: 0.9,
              strokeWeight: 4,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          const distanceMiles = (routes[0].distanceMeters ? routes[0].distanceMeters / 1609.34 : 0).toFixed(1);
          const durationMins = Math.round(routes[0].durationMillis ? routes[0].durationMillis / 60000 : 0);

          if (onRouteCalculated) {
            onRouteCalculated({
              distance: `${distanceMiles} miles`,
              duration: `${durationMins} mins`,
            });
          }
        }
      })
      .catch((e) => console.warn("Route computation notice:", e));

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
    };
  }, [routesLib, map, hub, onRouteCalculated]);

  return null;
}

export default function GoogleStudioMap() {
  const [selectedHub, setSelectedHub] = useState<StudioLocation>(STUDIO_HUBS[0]);
  const [routeStats, setRouteStats] = useState<{ distance: string; duration: string } | null>(null);

  // If no API key is provided, render a beautiful static location card for Dallas HQ instead of an error
  if (!hasValidKey) {
    return (
      <div className="w-full my-12 rounded-3xl border border-[#C19B6C]/30 bg-[#0E0E12] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Background Image / Map placeholder */}
        <div className="relative w-full h-[520px] sm:h-[580px] bg-[#121216]">
           <Image
             src="/image/video_thumb_2.webp"
             alt="Dallas HQ Location"
             fill
             className="object-cover opacity-20 mix-blend-luminosity grayscale"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-[#0E0E12]/80 to-[#0E0E12]/40" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full px-4 text-center">
             <div className="w-16 h-16 rounded-full bg-[#C19B6C]/20 border border-[#C19B6C]/50 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_40px_rgba(193,155,108,0.3)]">
               <MapPin size={28} className="text-[#C19B6C]" />
             </div>
             <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-light tracking-wide mb-3">
               Roma Film Production
             </h3>
             <p className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-[#C19B6C]">
               Dallas, Texas HQ
             </p>
           </div>
        </div>

        {/* Floating Info Card */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20">
          <div className="rounded-2xl border border-[#C19B6C]/35 bg-[#121216]/95 backdrop-blur-xl p-5 shadow-2xl text-[#F5F1E8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C19B6C]/20 border border-[#C19B6C]/40 text-[#E5C599] text-[9px] font-bold uppercase tracking-widest">
                HQ
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">USA</span>
            </div>

            <div>
              <h4 className="font-display text-lg text-white font-medium leading-snug">
                Dallas Main Studio & Cinema HQ
              </h4>
              <p className="text-xs text-[#C19B6C] font-mono tracking-wider mt-0.5">
                1400 Dragon St, Dallas, TX 75207
              </p>
            </div>

            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              Flagship 4,000 sq ft production loft featuring high-speed RED & ARRI workflow suites, cyclorama infinity wall, and client screening lounge.
            </p>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <a
                href="tel:+12149408492"
                className="flex-1 py-2 text-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white transition-colors"
              >
                Call Concierge
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=32.7876,-96.8197"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Navigate</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-12 rounded-3xl border border-[#C19B6C]/30 bg-[#0E0E12] shadow-2xl overflow-hidden flex flex-col">
      {/* Top Controller Bar */}
      <div className="border-b border-white/10 bg-[#14141A] px-5 sm:px-8 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C19B6C] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C19B6C] font-semibold">
              Global Filming Hubs &amp; Venues
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-[#F5F1E8] font-light">
            Interactive Studio Radar
          </h3>
        </div>

        {/* Hub Quick Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {STUDIO_HUBS.map((hub) => {
            const active = selectedHub.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => setSelectedHub(hub)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? "bg-[#C19B6C] text-zinc-950 font-bold shadow-md shadow-[#C19B6C]/30 scale-105"
                    : "bg-white/5 text-[#F5F1E8]/60 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                <MapPin size={11} className={active ? "text-zinc-950" : "text-[#C19B6C]"} />
                <span>{hub.city}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Canvas with Floating HUD */}
      <div className="relative w-full h-[520px] sm:h-[580px] bg-[#121216]">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            defaultCenter={selectedHub.position}
            defaultZoom={selectedHub.zoom}
            mapId="ROMA_FILM_STUDIO_MAP"
            styles={MAP_STYLES}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            style={{ width: "100%", height: "100%" }}
            gestureHandling="cooperative"
            disableDefaultUI={false}
          >
            <MapPanController target={selectedHub} />

            {/* Studio Markers */}
            {STUDIO_HUBS.map((hub) => (
              <StudioMarker
                key={hub.id}
                hub={hub}
                isSelected={selectedHub.id === hub.id}
                onClick={() => setSelectedHub(hub)}
              />
            ))}

            {/* Real-time Nearby Places Explorer */}
            <PlacesVenueExplorer activeHub={selectedHub} />

            {/* Airport to Studio Route Polyline */}
            <StudioRouteCalculator hub={selectedHub} onRouteCalculated={setRouteStats} />
          </Map>
        </APIProvider>

        {/* Floating Interactive Studio Details Card (Bottom-Left HUD) */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 pointer-events-auto">
          <motion.div
            key={selectedHub.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#C19B6C]/35 bg-[#121216]/95 backdrop-blur-xl p-5 shadow-2xl text-[#F5F1E8] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C19B6C]/20 border border-[#C19B6C]/40 text-[#E5C599] text-[9px] font-bold uppercase tracking-widest">
                {selectedHub.type}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">{selectedHub.country}</span>
            </div>

            <div>
              <h4 className="font-display text-lg text-white font-medium leading-snug">
                {selectedHub.name}
              </h4>
              <p className="text-xs text-[#C19B6C] font-mono tracking-wider mt-0.5">
                {selectedHub.address}
              </p>
            </div>

            <p className="text-xs text-[#F5F1E8]/70 leading-relaxed font-light">
              {selectedHub.description}
            </p>

            {selectedHub.id === "dallas-hq" && routeStats && (
              <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-zinc-300">
                <Car size={14} className="text-[#C19B6C] shrink-0" />
                <span className="text-zinc-400">DFW Int&apos;l Airport:</span>
                <span className="text-[#C19B6C] font-bold">{routeStats.duration}</span>
                <span className="text-zinc-500">({routeStats.distance})</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <a
                href={`tel:${selectedHub.phone.replace(/\s+/g, "")}`}
                className="flex-1 py-2 text-center rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold uppercase tracking-wider text-white transition-colors"
              >
                Call Concierge
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHub.position.lat},${selectedHub.position.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-[#C19B6C] hover:bg-[#d4b488] text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Navigate</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Legend Overlay (Top-Right) */}
        <div className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md rounded-xl border border-white/15 px-3 py-2 text-[10px] text-zinc-300 hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C19B6C]" />
            <span>Studio HQ / Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Nearby Luxury Venues</span>
          </div>
        </div>
      </div>
    </div>
  );
}
