// frontend/src/components/NewAnnouncementModal.tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../api/client';

// הגדרת הפרופס (התכונות) שהמודל מקבל מהדאשבורד
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // פונקציה שתרוץ אחרי שההודעה נוצרה בהצלחה כדי לרענן את הרשימה
}

export default function NewAnnouncementModal({ isOpen, onClose, onSuccess }: ModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // אם המודל סגור, אל תרנדר אותו בכלל
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // שליחת הנתונים לשרת (בדיוק כמו שעשינו ב-Postman)
      await apiClient.post('/announcements/', {
        title,
        content,
        priority
      });
      
      // איפוס הטופס
      setTitle('');
      setContent('');
      setPriority('NORMAL');
      
      // קריאה לפונקציית ההצלחה (תרענן את המסך) ותסגור את המודל
      onSuccess();
      onClose();
    } catch (err) {
      setError('אירעה שגיאה ביצירת ההודעה. נסה שוב.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // הרקע הכהה מאחורי המודל
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      {/* הקופסה הלבנה של המודל */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        
        {/* כותרת המודל + כפתור סגירה */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">הודעה חדשה למסך</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* הטופס עצמו */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">כותרת ההודעה</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="למשל: הפסקת חשמל יזומה"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תוכן ההודעה</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="כתוב כאן את פרטי ההודעה לדיירים..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">רמת דחיפות</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="NORMAL">רגילה (יוצג רגיל)</option>
              <option value="HIGH">גבוהה (יוצג עם תגית 'דחוף')</option>
              <option value="EMERGENCY">חירום (המסך יהפוך לאדום - פיצ'ר עתידי)</option>
            </select>
          </div>

          {/* כפתורי פעולה בטופס */}
          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-white rounded-lg transition-colors ${
                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'מפרסם...' : 'פרסם הודעה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}