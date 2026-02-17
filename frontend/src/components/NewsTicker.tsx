// frontend/src/components/NewsTicker.tsx
import { useEffect, useState } from 'react';

const FEEDS = {
  ynet: 'https://api.rss2json.com/v1/api.json?rss_url=http://www.ynet.co.il/Integration/StoryRss1854.xml',
  n12: 'https://api.rss2json.com/v1/api.json?rss_url=https://rcs.mako.co.il/rss/news-israel.xml',
  arutz7: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.inn.co.il/Rss.aspx',
  rotter: 'https://api.rss2json.com/v1/api.json?rss_url=https://rotter.net/rss/rotternews.xml', 
  kikar: 'https://api.rss2json.com/v1/api.json?rss_url=https://a.kikar.co.il/v1/rss/scoop-news/latest/rss2', 
  bhol: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.bhol.co.il/rss.xml', 
  jdn: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.jdn.co.il/feed/' 
};

interface NewsTickerProps {
  feedKey: string;
}

export default function NewsTicker({ feedKey }: NewsTickerProps) {
  const [news, setNews] = useState<string>('טוען מבזקי חדשות...');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const targetUrl = FEEDS[feedKey as keyof typeof FEEDS] || FEEDS.rotter;
        const response = await fetch(targetUrl);
        const data = await response.json();
        
        if (data.status === 'ok') {
          // מביאים 15 מבזקים כדי לייצר שורה ארוכה ויפה
          const headlines = data.items.slice(0, 15).map((item: any) => {
            return item.title.replace(/<[^>]*>?/gm, ''); // ניקוי HTML
          });
          setNews(headlines.join('   ♦   '));
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews('המערכת פועלת כסדרה ♦ ברוכים הבאים לבניין ♦ Vaad-Screens');
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 900000);
    return () => clearInterval(interval);
  }, [feedKey]); 

  return (
    <div className="bg-blue-700 text-white text-2xl py-3 overflow-hidden border-t-4 border-blue-900" dir="rtl">
      <style>{`
        @keyframes ticker-seamless {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); } 
        }
        .ticker-track {
          display: flex;
          width: max-content; /* מכריח את הדיב להיות ברוחב של כל הטקסט האמיתי ביחד */
          animation: ticker-seamless 120s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-track">
        {/* בלוק 1 */}
        <div className="flex items-center whitespace-nowrap shrink-0 pl-16">
          <span className="font-bold ml-4 px-4 py-1 bg-blue-900 rounded-full text-blue-200 text-xl shadow-inner">
            מבזקים:
          </span>
          <span className="tracking-wide font-light">{news}   ♦   </span>
        </div>
        
        {/* בלוק 2 (כפיל ללולאה חלקה) */}
        <div className="flex items-center whitespace-nowrap shrink-0 pl-16">
          <span className="font-bold ml-4 px-4 py-1 bg-blue-900 rounded-full text-blue-200 text-xl shadow-inner">
            מבזקים:
          </span>
          <span className="tracking-wide font-light">{news}   ♦   </span>
        </div>
      </div>
    </div>
  );
}