import "dotenv/config";

export interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temperature: number;
    feelslike: number;
    weather_descriptions: string[];
    wind_speed: number;
    humidity: number;
  };
}

export const fetchWeather = async (location: string) => {
  try {
    const url = `${process.env.WEATHERSTACK_BASE_URL}?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${encodeURIComponent(location)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.error || !data.current) {
      console.error("Weatherstack error:", data.error);
      return null;
    }

    return data as WeatherData;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
};
