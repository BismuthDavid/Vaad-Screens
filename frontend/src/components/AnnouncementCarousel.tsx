// frontend/src/components/AnnouncementCarousel.tsx
import { useState, useEffect } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
}

interface CarouselProps {
  announcements: Announcement[];
}

export default function AnnouncementCarousel({ announcements }: CarouselProps) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 3; // מציגים 3 הודעות במקביל (כי זה טור אנכי)
  const totalPages = Math.ceil(announcements.length / itemsPerPage);

  useEffect(() => {
    // אם יש עמוד אחד או פחות, אין טעם להריץ טיימר של קרוסלה
    if (totalPages <= 1) return; 
    
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 15000); // מחליף עמוד כל 15 שניות
    
    return () => clearInterval(interval);
  }, [totalPages]);

  if (announcements.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
        <Info size={60} className="mb-4" />
        <h2 className="text-2xl font-light text-center">אין הודעות<br/>פעילות כרגע</h2>
      </div>
    );
  }

  // חיתוך המערך כדי להציג רק את ההודעות של העמוד הנוכחי
  const visibleAnnouncements = announcements.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="h-full flex flex-col gap-4 relative">
      <div className="flex justify-between items-end mb-2 px-2 border-b border-slate-700/50 pb-2">
        <h2 className="text-xl font-bold text-blue-400">הודעות הוועד</h2>
        {totalPages > 1 && (
           <span className="text-sm text-slate-500">עמוד {page + 1} מתוך {totalPages}</span>
        )}
      </div>
      
      {/* השימוש ב-key גורם לריאקט לרנדר מחדש את ה-div ולהפעיל את האנימציה בכל החלפת עמוד */}
      <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000" key={page}>
        {visibleAnnouncements.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex-1 rounded-3xl p-5 shadow-xl border-r-4 flex flex-col bg-slate-800/60 backdrop-blur-sm transition-colors ${
              msg.priority === 'HIGH' 
                ? 'border-red-500' 
                : 'border-blue-500'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              {msg.priority === 'HIGH' ? (
                <AlertTriangle className="text-red-500 shrink-0" size={24} />
              ) : (
                <Info className="text-blue-400 shrink-0" size={24} />
              )}
              <h3 className={`text-xl font-bold truncate ${msg.priority === 'HIGH' ? 'text-red-400' : 'text-slate-100'}`}>
                {msg.title}
              </h3>
            </div>
            {/* line-clamp-4 חותך טקסט ארוך מדי ב-3 נקודות כדי לשמור על גובה אחיד */}
            <p className="text-lg leading-snug text-slate-300 whitespace-pre-wrap font-light line-clamp-4">
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      
      {/* נקודות הניווט (Dots) בתחתית הקרוסלה */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-500 ${page === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}