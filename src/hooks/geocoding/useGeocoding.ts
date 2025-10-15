import { useState, useEffect } from 'react';
import { reverseGeocode, getShortAddress } from '@/services/geocoding/geocodingService';

export interface UseGeocodingResult {
  address: string | null;
  isLoading: boolean;
  error: string | null;
  formattedAddress: string | null;
}

export const useGeocoding = (
  latitude: number | undefined,
  longitude: number | undefined,
  enabled: boolean = true
): UseGeocodingResult => {
  const [address, setAddress] = useState<string | null>(null);
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || latitude === undefined || longitude === undefined) {
      setAddress(null);
      setFormattedAddress(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchAddress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await reverseGeocode(latitude, longitude);

        if ('error' in result) {
          setError(result.message);
          setAddress(null);
          setFormattedAddress(null);
        } else {
          setAddress(result.address);
          setFormattedAddress(result.formatted_address);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setAddress(null);
        setFormattedAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddress();
  }, [latitude, longitude, enabled]);

  return {
    address,
    formattedAddress,
    isLoading,
    error,
  };
};

export const useShortAddress = (
  latitude: number | undefined,
  longitude: number | undefined,
  enabled: boolean = true
): { shortAddress: string | null; isLoading: boolean; error: string | null } => {
  const [shortAddress, setShortAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || latitude === undefined || longitude === undefined) {
      setShortAddress(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchShortAddress = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getShortAddress(latitude, longitude);
        setShortAddress(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setShortAddress(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShortAddress();
  }, [latitude, longitude, enabled]);

  return {
    shortAddress,
    isLoading,
    error,
  };
};
