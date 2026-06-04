import { useState } from 'react';
import { Save, User, Shield, Bell } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Налаштування платформи</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Settings Sidebar */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'profile' ? 'btn-secondary' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'profile' ? 'rgba(138,43,226,0.1)' : 'transparent', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} /> Профіль викладача
          </button>
          <button 
            className={`btn ${activeTab === 'security' ? 'btn-secondary' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'security' ? 'rgba(138,43,226,0.1)' : 'transparent', color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Безпека
          </button>
          <button 
            className={`btn ${activeTab === 'notifications' ? 'btn-secondary' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'notifications' ? 'rgba(138,43,226,0.1)' : 'transparent', color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--text-secondary)' }}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} /> Сповіщення
          </button>
        </div>

        {/* Settings Content */}
        <div className="glass-panel" style={{ flex: 1, padding: '2.5rem' }}>
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Особисті дані</h3>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                  Д
                </div>
                <button type="button" className="btn btn-secondary">Змінити фото</button>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Ім'я</label>
                  <input type="text" className="input-field" defaultValue="Дмитро" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Прізвище</label>
                  <input type="text" className="input-field" defaultValue="Петров" required />
                </div>
              </div>

              <div>
                <label className="input-label">Посада / Звання</label>
                <input type="text" className="input-field" defaultValue="Старший викладач кафедри ІП" />
              </div>

              <div>
                <label className="input-label">Email для зв'язку зі студентами</label>
                <input type="email" className="input-field" defaultValue="admin@helper.com" required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center', gap: '1rem' }}>
                {isSaved && <span style={{ color: 'var(--success)' }}>Збережено!</span>}
                <button type="submit" className="btn btn-primary">
                  <Save size={18} /> Зберегти зміни
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Зміна пароля</h3>
              
              <div>
                <label className="input-label">Поточний пароль</label>
                <input type="password" className="input-field" />
              </div>
              <div>
                <label className="input-label">Новий пароль</label>
                <input type="password" className="input-field" />
              </div>
              <div>
                <label className="input-label">Підтвердження нового пароля</label>
                <input type="password" className="input-field" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-primary">
                  Оновити пароль
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>Налаштування сповіщень</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Сповіщення на email</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Отримувати звіт про успішність студентів щотижня</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Провалені тести</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Сповіщати, якщо студент провалив тест 3 рази поспіль</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
