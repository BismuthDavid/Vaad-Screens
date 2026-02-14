// frontend/src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { LogOut, Bell, PlusCircle, Trash2, MonitorPlay} from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import NewAnnouncementModal from '../components/NewAnnouncementModal';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const response = await apiClient.get('/announcements/');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // הפונקציה החדשה למחיקת הודעה
  const handleDelete = async (id: string) => {
    // בקשת אישור מהמשתמש לפני המחיקה
    if (!window.confirm('האם אתה בטוח שברצונך למחוק הודעה זו? היא תוסר מהמסכים בבניין.')) {
      return;
    }

    try {
      // שליחת בקשת מחיקה לשרת
      await apiClient.delete(`/announcements/${id}`);
      
      // במקום לעשות קריאה חדשה לשרת, פשוט נסנן את ההודעה מהרשימה הקיימת (מהיר יותר למשתמש)
      setAnnouncements(prev => prev.filter(msg => msg.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('אירעה שגיאה במחיקת ההודעה.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <Bell size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">ניהול ועד הבית</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/display" 
            target="_blank" // פותח בלשונית חדשה!
            className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors font-medium"
          >
            <MonitorPlay size={20} />
            <span>מסך תצוגה</span>
          </Link>
          <div className="h-6 w-px bg-gray-200"></div> {/* קו מפריד נחמד */}
          <span className="text-gray-600">שלום, {user?.full_name}</span>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>התנתקות</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">הודעות פעילות למסך</h2>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            <span>הודעה חדשה</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">טוען נתונים...</div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100 flex flex-col items-center gap-4">
             <Bell size={48} className="text-gray-300" />
            <p className="text-gray-500 text-lg">אין הודעות פעילות כרגע.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((msg) => (
              <div key={msg.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow relative group">
                
                {/* כפתור המחיקה שמופיע באזור השמאלי העליון */}
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="absolute top-4 left-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="מחק הודעה"
                >
                  <Trash2 size={20} />
                </button>

                <div className="flex justify-between items-start pl-10">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800">{msg.title}</h3>
                    {msg.priority === 'HIGH' && (
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full border border-red-200">
                        דחוף
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap text-lg">{msg.content}</p>
                <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-3">
                   <div className="text-sm text-gray-400">
                     פורסם ב: {new Date(msg.created_at).toLocaleDateString('he-IL')} בשעה {new Date(msg.created_at).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'})}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <NewAnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAnnouncements} 
      />
    </div>
  );
}