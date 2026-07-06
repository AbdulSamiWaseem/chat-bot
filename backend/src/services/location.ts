import "dotenv/config";

export interface LocationData {
  name: string;
  display_name: string;
  address?: any;
  lat: string;
  lon: string;
}

export const fetchLocation = async (query: string) => {
  try {
    const key = process.env.GEOCODE_API_KEY;
    const base = process.env.GEOCODE_BASE_URL;
    const res = await fetch(`${base}?q=${encodeURIComponent(query)}&api_key=${key}&accept-language=en`);
    const data = await res.json();

    if (data.error) {
      return null;
    }

    return data[0] as LocationData;
  } catch (error) {
    console.error("Failed to fetch location:", error);
    return null;
  }
};
