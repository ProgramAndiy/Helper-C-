import { useState, useEffect } from 'react';
import { User, Mail, School, Users, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { currentUser, userData, setUserData } = useAuth();

  const [profile, setProfile] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    university: '',
    year: '',
    group: ''
  });

  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load current user profile data when context is loaded
  useEffect(() => {
    if (userData) {
      setProfile({
        lastName: userData.lastName || '',
        firstName: userData.firstName || '',
        middleName: userData.middleName || '',
        email: userData.email || currentUser?.email || '',
        university: userData.university || '',
        year: userData.year || userData.admissionYear || '',
        group: userData.group || ''
      });
    } else if (currentUser) {
      setProfile(prev => ({
        ...prev,
        email: currentUser.email || ''
      }));
    }
  }, [userData, currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaved(false);
    setErrorMsg('');

    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const updatedData = {
        ...userData,
        uid: currentUser.uid,
        email: profile.email,
        lastName: profile.lastName,
        firstName: profile.firstName,
        middleName: profile.middleName,
        university: profile.university,
        year: profile.year,
        admissionYear: profile.year, // keep both names for safety
        group: profile.group,
        role: userData?.role || 'student' // preserve role
      };

      await setDoc(userDocRef, updatedData);
      setUserData(updatedData); // Update context state
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMsg("Не вдалося зберегти зміни. Перевірте з'єднання з базою даних.");
    }
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

          {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{errorMsg}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="input-label"><Mail size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Email</label>
              <input type="email" className="input-field" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} required disabled />
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
