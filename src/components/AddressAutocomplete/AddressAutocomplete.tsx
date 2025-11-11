import { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Typography, TextField } from '@/components';
import { AddressSuggestion, searchAddresses } from '@/services/geocoding/geocodingService';
import styles from './AddressAutocomplete.styles';

export interface AddressData {
  address: string;
  lat: number;
  lng: number;
  postcode?: string;
  countryCode?: string;
  country?: string;
  city?: string;
  formattedAddress?: string;
}

interface AddressAutocompleteProps {
  placeholder?: string;
  onAddressSelect: (address: AddressData) => void;
  onClear?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  containerStyle?: any;
  listViewStyle?: any;
  debounceMs?: number;
  label?: string;
  error?: string;
}

export default function AddressAutocomplete({
  placeholder = 'Enter your address',
  onAddressSelect,
  onClear,
  value = '',
  style,
  containerStyle,
  listViewStyle,
  debounceMs = 500,
  label,
  error,
}: AddressAutocompleteProps) {
  const [searchText, setSearchText] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const searchAddress = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchAddresses(query, {
        limit: 10,
      });
      setSuggestions(results);
    } catch (error) {
      console.error('Address search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only search if text is longer than 2 characters and not just whitespace
    if (searchText.trim().length > 1) {
      const timeoutId = setTimeout(() => {
        searchAddress(searchText);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    } else {
      // Clear suggestions if text is too short
      setSuggestions([]);
    }
  }, [searchText, searchAddress, debounceMs]);

  const handleSelectAddress = useCallback(
    (item: AddressSuggestion) => {
      const addressData: AddressData = {
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      };

      onAddressSelect(addressData);
      setSearchText(item.display_name);
    },
    [onAddressSelect]
  );

  const handleClearText = useCallback(() => {
    setSearchText('');
    setSuggestions([]);
    if (onClear) onClear();
  }, [onClear]);

  const handleChangeText = (text: string) => {
    setSearchText(text);
  };

  const searchTextIsSuggestion = suggestions.some(
    suggestion => suggestion.display_name === searchText
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TextField
        label={label || 'Address'}
        style={style}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
        autoCapitalize="words"
        autoCorrect={false}
        editable={true}
        multiline={false}
        error={error}
        rightAction={
          searchText.length > 0 && !loading ? (
            <TouchableOpacity onPress={handleClearText}>
              <Typography fontVariant="regular" fontSize={14} color="#999999">
                ✕
              </Typography>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}

      {searchText.length > 0 && !loading && !searchTextIsSuggestion && (
        <View style={[styles.listView, listViewStyle]}>
          {suggestions.length > 0 ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              {suggestions.map(item => (
                <TouchableOpacity
                  key={item.place_id}
                  style={styles.row}
                  onPress={() => handleSelectAddress(item)}
                >
                  <Typography fontVariant="regular" fontSize={14} color="#fff">
                    {item.display_name}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Typography fontVariant="regular" fontSize={14} color="#666666">
                No address found
              </Typography>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
