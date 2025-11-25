import React, { useState, useEffect, useRef } from 'react';
import { Label } from './label';
import { Button } from './button';
import { X, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildInputClasses } from './input-helpers';

interface AddressData {
  address: string;
  lat: number;
  lng: number;
  postcode: string;
  countryCode: string;
  country: string;
  city: string;
}

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

interface AddressAutocompleteProps {
  placeholder?: string;
  onAddressSelect?: (address: AddressData) => void;
  onClear?: () => void;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  containerClassName?: string;
  listClassName?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  required,
  placeholder = 'Enter your address',
  onAddressSelect,
  onClear,
  value = '',
  onChange,
  className,
  containerClassName,
  listClassName,
  error,
}) => {
  const [searchText, setSearchText] = useState(value || '');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const searchAddress = async (query: string) => {
    if (!query || query.length === 0) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=7&addressdetails=1`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      searchAddress(searchText);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchText]);

  // Update searchText when value prop changes
  useEffect(() => {
    const newValue = value || '';
    if (newValue !== searchText) {
      setSearchText(newValue);
    }
  }, [value, searchText]);

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAddress = (item: AddressSuggestion) => {
    const addressData: AddressData = {
      address: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      postcode: item.address?.postcode || '',
      countryCode: item.address?.country_code || '',
      country: item.address?.country || '',
      city: item.address?.city || item.address?.town || '',
    };

    onAddressSelect?.(addressData);
    setSearchText(item.display_name);
    onChange?.(item.display_name);
    setShowSuggestions(false);
  };

  const handleClearText = () => {
    setSearchText('');
    onChange?.('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClear?.();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchText(newValue);
    onChange?.(newValue);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const searchTextIsSuggestion = suggestions.some(
    suggestion => suggestion.display_name === searchText
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', containerClassName)}
    >
      <div className="flex flex-col w-full gap-2">
        {label && (
          <Label>
            {required && <span className="text-[#F5222D] mr-1">*</span>}
            {label}{' '}
          </Label>
        )}
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchText || ''}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className={buildInputClasses(error, cn('pr-10', className))}
          />

          {searchText.length > 0 && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              onClick={handleClearText}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {loading && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {error && <p className="text-[14px] text-[#F5222D]">{error}</p>}
      </div>

      {showSuggestions &&
        searchText.length > 0 &&
        !loading &&
        !searchTextIsSuggestion && (
          <div
            className={cn(
              'absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg',
              listClassName
            )}
          >
            {suggestions.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {suggestions.map(item => (
                  <button
                    key={item.place_id}
                    className="w-full px-3 py-2 text-left hover:bg-muted focus:bg-muted focus:outline-none border-b border-border last:border-b-0"
                    onClick={() => handleSelectAddress(item)}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground line-clamp-2">
                        {item.display_name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No address found
              </div>
            )}
          </div>
        )}
    </div>
  );
};
