// frontend/src/components/SettingsModal.tsx
import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { apiClient } from '../api/client';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// רשימת ערים לדוגמה (אפשר להרחיב בהמשך)
export const ISRAEL_CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'אשדוד', 
  'ראשון לציון', 'פתח תקווה', 'נתניה', 'אשקלון', 'רחובות', 'נתיבות'
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // משיכת ההגדרות הקיימות כשפותחים את המודל
  useEffect(() => {
    if (isOpen) {
      apiClient.get('/buildings/settings')
        .then(res => setCity(res.data.city))
        .catch(err => console.error("Error fetching settings", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await apiClient.put('/buildings/settings', { city });
      setMessage({ text: 'ההגדרות נשמרו בהצלחה!', type: 'success' });
      setTimeout(onClose, 1500); // סגירה אוטומטית אחרי שנייה וחצי
    } catch (err) {
      setMessage({ text: 'שגיאה בשמירת ההגדרות', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">הגדרות הבניין</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">עיר (עבור שעון שבת ומזג אוויר)</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="" disabled>בחר עיר...</option>
              {ISRAEL_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              ביטול
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-white flex items-center gap-2 rounded-lg transition-colors ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Save size={18} />
              <span>{isLoading ? 'שומר...' : 'שמור שינויים'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}