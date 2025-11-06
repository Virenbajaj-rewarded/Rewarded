import { useState, useEffect, useRef, useCallback } from 'react';

interface AddressSuggestion {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    postcode?: string;
    country_code?: string;
    country?: string;
    city?: string;
    town?: string;
  };
}

interface AddressData {
  address: string;
  lat: number;
  lng: number;
  postcode: string;
  countryCode: string;
  country: string;
  city: string;
}

interface UseAddressAutocompleteProps {
  initialValue?: string;
  debounceMs?: number;
  limit?: number;
}

export const useAddressAutocomplete = ({
  initialValue = '',
  debounceMs = 500,
  limit = 7,
}: UseAddressAutocompleteProps = {}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const searchAddress = useCallback(
    async (query: string) => {
      if (!query || query.length === 0) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`;
        const response = await fetch(endpoint);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(searchText);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchText, debounceMs, limit, searchAddress]);

  // Update searchText when initialValue changes
  useEffect(() => {
    if (initialValue !== searchText) {
      setSearchText(initialValue);
    }
  }, [initialValue, searchText]);

  const handleSelectAddress = (item: AddressSuggestion): AddressData => {
    const addressData: AddressData = {
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      postcode: item.address?.postcode || '',
      countryCode: item.address?.country_code || '',
      country: item.address?.country || '',
      city: item.address?.city || item.address?.town || '',
    };

    setSearchText(item.display_name);
    setSuggestions([]);
    return addressData;
  };

  const clearSearch = () => {
    setSearchText('');
    setSuggestions([]);
  };

  const isSearchTextSuggestion = suggestions.some(
    suggestion => suggestion.display_name === searchText
  );

  return {
    searchText,
    setSearchText,
    suggestions,
    loading,
    handleSelectAddress,
    clearSearch,
    isSearchTextSuggestion,
  };
};
