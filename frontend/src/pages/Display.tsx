// frontend/src/pages/Display.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { AlertTriangle, Info } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
}

export default function Display() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // פונקציה לשליפת ההודעות (אותה פונקציה כמו בדאשבורד)
  const fetchAnnouncements = async () => {
    try {
      const response = await apiClient.get('/announcements/');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // אפקט 1: שליפת נתונים בעליית המסך ורענון כל דקה
  useEffect(() => {
    fetchAnnouncements();
    const dataInterval = setInterval(fetchAnnouncements, 60000); // מתעדכן לבד כל 60 שניות!
    return () => clearInterval(dataInterval);
  }, []);

  // אפקט 2: עדכון השעון כל שנייה
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // עיצוב תאריך בעברית
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentTime);

  return (
    // רקע כהה מותאם למסכי טלוויזיה (Dark Mode)
    <div className="min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden" dir="rtl">
      
      {/* פאנל עליון - שעון ומידע */}
      <header className="bg-slate-800 border-b border-slate-700 px-10 py-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-4xl font-black text-blue-400 tracking-tight">לוח הודעות הבניין</h1>
          <p className="text-xl text-slate-400 mt-2">{formattedDate}</p>
        </div>
        <div className="text-6xl font-light tabular-nums tracking-tight">
          {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      {/* אזור ההודעות */}
      <main className="flex-1 p-10 overflow-hidden flex flex-col gap-8">
        {announcements.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
            <Info size={100} className="mb-6" />
            <h2 className="text-4xl font-light">אין הודעות פעילות כרגע</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-max h-full">
            {announcements.map((msg) => (
              <div 
                key={msg.id} 
                className={`rounded-3xl p-8 shadow-2xl border-l-8 flex flex-col transition-all transform hover:scale-[1.02] ${
                  msg.priority === 'HIGH' 
                    ? 'bg-red-950/40 border-red-500' 
                    : 'bg-slate-800/50 border-blue-500'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  {msg.priority === 'HIGH' ? (
                    <AlertTriangle className="text-red-500" size={40} />
                  ) : (
                    <Info className="text-blue-400" size={40} />
                  )}
                  <h2 className={`text-4xl font-bold ${msg.priority === 'HIGH' ? 'text-red-400' : 'text-slate-100'}`}>
                    {msg.title}
                  </h2>
                </div>
                <p className="text-3xl leading-relaxed text-slate-300 whitespace-pre-wrap mt-4 font-light">
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* פס גלילה תחתון (Ticker) - הכנה לפיצ'רים עתידיים כמו מבזקי חדשות או מזג אוויר */}
      <footer className="bg-blue-600 text-white text-xl py-3 px-6 whitespace-nowrap overflow-hidden">
        <div className="animate-pulse">
          המערכת פועלת כסדרה • נעים לראות אתכם! • Vaad-Screens
        </div>
      </footer>
    </div>
  );
}