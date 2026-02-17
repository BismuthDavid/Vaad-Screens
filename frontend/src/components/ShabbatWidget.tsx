// frontend/src/components/ShabbatWidget.tsx
import { useEffect, useState } from 'react';
import { BookOpen, Star } from 'lucide-react';

// מילון המרת עיר ל-ID של Hebcal
const HEBCAL_CITIES: Record<string, string> = {
  'תל אביב': '293397',
  'ירושלים': '281184',
  'חיפה': '294801',
  'באר שבע': '295530',
  'אשדוד': '295629',
  'ראשון לציון': '293703',
  'פתח תקווה': '293977',
  'נתניה': '294071',
  'אשקלון': '295620',
  'רחובות': '293807',
  'נתיבות': '294066'
};

interface ShabbatData {
  candles: string;
  havdalah: string;
  parasha: string;
}

interface ShabbatWidgetProps {
  city: string;
}

export default function ShabbatWidget({ city }: ShabbatWidgetProps) {
  const [shabbatData, setShabbatData] = useState<ShabbatData | null>(null);

  useEffect(() => {
    const fetchShabbatTimes = async () => {
      // ברירת מחדל לתל אביב אם לא נמצאה עיר
      const geonameId = HEBCAL_CITIES[city] || HEBCAL_CITIES['תל אביב'];
      
      try {
        const response = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${geonameId}&M=on`);
        const data = await response.json();

        // חיפוש הפריטים הרלוונטיים בתוך התשובה של ה-API
        const candlesItem = data.items.find((i: any) => i.category === 'candles');
        const havdalahItem = data.items.find((i: any) => i.category === 'havdalah');
        const parashaItem = data.items.find((i: any) => i.category === 'parashat');

        // פונקציית עזר לחילוץ השעה בלבד מתוך מחרוזת התאריך
        const extractTime = (dateStr: string) => {
          if (!dateStr) return '--:--';
          const d = new Date(dateStr);
          return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        };

        setShabbatData({
          candles: extractTime(candlesItem?.date),
          havdalah: extractTime(havdalahItem?.date),
          // אם מצאנו פרשת שבוע, ניקח את השם שלה (בלי המילה 'Parashat')
          parasha: parashaItem?.hebrew || 'שבת קודש'
        });
      } catch (error) {
        console.error('Failed to fetch Shabbat times:', error);
      }
    };

    fetchShabbatTimes();
    // רענון פעם ביום זה מספיק לזמני שבת
    const interval = setInterval(fetchShabbatTimes, 86400000); 
    return () => clearInterval(interval);
  }, [city]);

  if (!shabbatData) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-1000">
      <div className="bg-slate-800/60 backdrop-blur-md rounded-[3rem] p-16 shadow-2xl border border-slate-700/50 flex flex-col items-center text-center max-w-4xl w-full">
        
        <div className="flex items-center gap-4 text-blue-400 mb-8">
          <BookOpen size={48} />
          <h2 className="text-6xl font-black">{shabbatData.parasha}</h2>
          <Star size={48} />
        </div>

        <div className="flex justify-center gap-24 w-full mt-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl text-slate-400 mb-4">כניסת שבת</span>
            <span className="text-8xl font-light tabular-nums text-white tracking-tight">
              {shabbatData.candles}
            </span>
          </div>

          <div className="w-px bg-slate-700/50"></div>

          <div className="flex flex-col items-center">
            <span className="text-3xl text-slate-400 mb-4">יציאת שבת</span>
            <span className="text-8xl font-light tabular-nums text-white tracking-tight">
              {shabbatData.havdalah}
            </span>
          </div>
        </div>
        
        <div className="mt-12 text-2xl text-slate-500 font-light">
          שבת שלום ומבורך 
        </div>
      </div>
    </div>
  );
}