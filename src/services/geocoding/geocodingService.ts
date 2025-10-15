import ky from 'ky';

export interface GeocodingResult {
  address: string;
  components: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  formatted_address: string;
}

export interface GeocodingError {
  error: string;
  message: string;
}

const geocodingClient = ky.create({
  prefixUrl: 'https://nominatim.openstreetmap.org',
  headers: {
    'User-Agent': 'RewardedApp/1.0',
  },
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
});

const formatAddress = (components: any): string => {
  const parts: string[] = [];

  if (components.house_number && components.road) {
    parts.push(`${components.house_number} ${components.road}`);
  } else if (components.road) {
    parts.push(components.road);
  }

  if (components.city) {
    parts.push(components.city);
  } else if (components.town) {
    parts.push(components.town);
  } else if (components.village) {
    parts.push(components.village);
  }

  if (components.state) {
    parts.push(components.state);
  }

  if (components.country) {
    parts.push(components.country);
  }

  if (components.postcode) {
    parts.push(components.postcode);
  }

  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<GeocodingResult | GeocodingError> => {
  try {
    const searchParams = new URLSearchParams({
      format: 'json',
      lat: latitude.toString(),
      lon: longitude.toString(),
      addressdetails: '1',
      zoom: '18',
    });

    const data = await geocodingClient.get(`reverse?${searchParams}`).json<any>();

    if (data.error) {
      return {
        error: 'GEOCODING_ERROR',
        message: data.error,
      };
    }

    const address = data.display_name || 'Address not available';
    const components = data.address || {};

    const formattedAddress = formatAddress(components);

    return {
      address,
      components,
      formatted_address: formattedAddress,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      error: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const getShortAddress = async (latitude: number, longitude: number): Promise<string> => {
  const result = await reverseGeocode(latitude, longitude);

  if ('error' in result) {
    return 'Address not available';
  }

  const { components } = result;
  const parts: string[] = [];

  if (components.road) {
    if (components.house_number) {
      parts.push(`${components.house_number} ${components.road}`);
    } else {
      parts.push(components.road);
    }
  }

  if (components.city) {
    parts.push(components.city);
  } else if (components.town) {
    parts.push(components.town);
  } else if (components.village) {
    parts.push(components.village);
  }

  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};
