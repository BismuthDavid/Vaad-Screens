// frontend/src/pages/Display.tsx
import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import WeatherWidget from '../components/WeatherWidget';
import ShabbatWidget from '../components/ShabbatWidget';
import NewsTicker from '../components/NewsTicker';
import AnnouncementCarousel from '../components/AnnouncementCarousel'; // <--- הייבוא החדש
import { Building2 } from 'lucide-react'; // אייקון נחמד למסך הפתיחה

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
}

export default function Display() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [city, setCity] = useState('תל אביב');
  const [newsFeed, setNewsFeed] = useState('rotter');
  const [address, setAddress] = useState('');

  const isShabbatMode = () => {
    const day = currentTime.getDay();
    const hour = currentTime.getHours();
    return (day === 5 && hour >= 12) || (day === 6);
  };

  const fetchData = async () => {
    try {
      const [announcementsRes, settingsRes] = await Promise.all([
        apiClient.get('/announcements/'),
        apiClient.get('/buildings/settings')
      ]);
      setAnnouncements(announcementsRes.data);
      setCity(settingsRes.data.city);
      setNewsFeed(settingsRes.data.news_feed || 'rotter');
      setAddress(settingsRes.data.address || '')
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(fetchData, 60000);
    return () => clearInterval(dataInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentTime);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col overflow-hidden" dir="rtl">
      
      <header className="bg-slate-800 border-b border-slate-700 px-10 py-6 flex justify-between items-center shadow-lg z-10">
        <div>
          <h1 className="text-4xl font-black text-blue-400 tracking-tight">
            {address || 'לוח הודעות הבניין'}
          </h1>
          <p className="text-xl text-slate-400 mt-2">{formattedDate}</p>
        </div>
        
        <div className="flex items-center gap-10">
          <WeatherWidget city={city} />
          <div className="text-7xl font-light tabular-nums tracking-tight text-white border-r-2 border-slate-700 pr-10">
            {currentTime.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>


      <main className="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden bg-slate-950/50">
        
        {/* צד ימין - הודעות הוועד (4 מתוך 12 עמודות = שליש מסך) */}
        <div className="col-span-4 h-full bg-slate-800/40 rounded-[2.5rem] p-6 border border-slate-700/50 shadow-inner overflow-hidden">
          <AnnouncementCarousel announcements={announcements} />
        </div>

        {/* צד שמאל - אזור מדיה / שבת (8 מתוך 12 עמודות = שני שליש מסך) */}
        <div className="col-span-8 h-full bg-slate-800/20 rounded-[2.5rem] border border-slate-700/30 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          {isShabbatMode() ? (
            <ShabbatWidget city={city} />
          ) : (
            // תצוגת יום חול - פלייסבולדר יפהפה שמשאיר מקום לתמונות/וידאו בעתיד
            <div className="text-center animate-in fade-in zoom-in duration-1000">
               <div className="text-blue-500/20 mb-8 flex justify-center drop-shadow-lg">
                 <Building2 size={180} strokeWidth={1} />
               </div>
               <h2 className="text-6xl font-light text-slate-300 mb-6 tracking-tight">ברוכים הבאים</h2>
            </div>
          )}
        </div>

      </main>

      <NewsTicker feedKey={newsFeed} />
    </div>
  );
}