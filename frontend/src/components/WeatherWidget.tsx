// frontend/src/components/WeatherWidget.tsx
import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

// מיפוי קואורדינטות לפי ערים
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  'תל אביב': { lat: 32.0853, lon: 34.7818 },
  'ירושלים': { lat: 31.7683, lon: 35.2137 },
  'חיפה': { lat: 32.7940, lon: 34.9896 },
  'באר שבע': { lat: 31.2518, lon: 34.7913 },
  'אשדוד': { lat: 31.8014, lon: 34.6435 },
  'ראשון לציון': { lat: 31.9730, lon: 34.7925 },
  'פתח תקווה': { lat: 32.0840, lon: 34.8878 },
  'נתניה': { lat: 32.3215, lon: 34.8532 },
  'אשקלון': { lat: 31.6693, lon: 34.5715 },
  'רחובות': { lat: 31.8928, lon: 34.8113 },
  'נתיבות': { lat: 31.4167, lon: 34.5833 }
};

interface WeatherWidgetProps {
  city: string;
}

export default function WeatherWidget({ city }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // אם העיר לא קיימת במילון, נשתמש בתל אביב כברירת מחדל
      const coords = CITY_COORDS[city] || CITY_COORDS['תל אביב'];
      
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    if (city) {
      fetchWeather();
      const interval = setInterval(fetchWeather, 3600000);
      return () => clearInterval(interval);
    }
  }, [city]);

  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="text-yellow-400" size={48} />;
    if (code >= 1 && code <= 3) return <Cloud className="text-gray-300" size={48} />;
    if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={48} />;
    return <Wind className="text-teal-400" size={48} />;
  };

  return (
    <div className="bg-slate-800/80 rounded-3xl p-6 shadow-lg border border-slate-700 flex items-center gap-6">
      {getWeatherIcon(weather.weathercode)}
      <div className="flex flex-col">
        <span className="text-4xl font-black text-white" style={{ direction: 'ltr' }}>
          {weather.temperature}°C
        </span>
        <span className="text-slate-400 text-lg">{city}</span>
      </div>
    </div>
  );
}