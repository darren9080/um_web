'use client';

import { useEffect, useRef, useState } from 'react';

interface LocationAutocompleteProps {
  defaultValue?: string;
  onSelect: (value: { address: string; lat: number; lng: number; placeId: string }) => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google?: any;
    initGoogleMaps?: () => void;
  }
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.maps?.places) { resolve(); return; }
    const existing = document.getElementById('google-maps-script');
    if (existing) {
      window.initGoogleMaps = resolve;
      return;
    }
    window.initGoogleMaps = resolve;
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    document.head.appendChild(script);
  });
}

export function LocationAutocomplete({ defaultValue = '', onSelect }: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    loadGoogleMapsScript(apiKey).then(() => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'kr' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location) return;
        const address = place.formatted_address ?? place.name ?? '';
        onSelect({
          address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id ?? '',
        });
        setValue(address);
      });
    });
  }, [apiKey, onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={
        apiKey
          ? '장소명 또는 주소를 입력하세요'
          : '장소를 입력하세요 (Google Maps API 키 필요)'
      }
      className="mt-1.5 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 placeholder-slate-400 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
    />
  );
}
