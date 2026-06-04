import { useState } from 'react';
import { User, Mail, School, Users, Save } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    lastName: 'Шевченко',
    firstName: 'Тарас',
    middleName: 'Григорович',
    email: 'student@helper.com',
    university: 'НТУУ КПІ ім. І. Сікорського',
    year: '2023',
    group: 'ІП-31'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Профіль Студента</h2>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(138,43,226,0.2)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={48} color="var(--primary)" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Прізвище</label>
                  <input type="text" className="input-field" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Ім'я</label>
                  <input type="text" className="input-field" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="input-label">По батькові</label>
                <input type="text" className="input-field" value={profile.middleName} onChange={e => setProfile({...profile, middleName: e.target.value})} required />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="input-label"><Mail size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Email</label>
              <input type="email" className="input-field" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required />
            </div>
            <div>
              <label className="input-label"><School size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Навчальний заклад</label>
              <input type="text" className="input-field" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} required />
            </div>
            <div>
              <label className="input-label"><Users size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Рік вступу</label>
              <input type="number" className="input-field" value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})} min="2000" max="2100" required />
            </div>
            <div>
              <label className="input-label"><Users size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Група</label>
              <input type="text" className="input-field" value={profile.group} onChange={e => setProfile({...profile, group: e.target.value})} required />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center', gap: '1rem' }}>
            {isSaved && <span style={{ color: 'var(--success)' }}>Зміни збережено!</span>}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
              <Save size={18} /> Зберегти зміни
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
