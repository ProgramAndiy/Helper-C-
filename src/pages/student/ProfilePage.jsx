import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, School, Users, Save, Award, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { courseModules } from '../../data/courseData';

export default function ProfilePage() {
  const navigate = useNavigate();
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
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'certificates'
  const [dbModules, setDbModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(true);

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

  // Load modules from Firestore for certificate matching
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchPromise = getDocs(collection(db, 'modules'));
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Firestore fetch timed out")), 2000)
        );

        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]);
        let list = [];
        querySnapshot.forEach(docSnap => {
          list.push({ id: docSnap.data().id, ...docSnap.data() });
        });

        if (list.length === 0) {
          list = courseModules.map((mod, idx) => ({ ...mod, id: mod.id, order: idx + 1 }));
        }
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setDbModules(list);
      } catch (err) {
        console.error("Error fetching modules from Firestore:", err);
        setDbModules(courseModules);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

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

      // Fire and forget to prevent UI freeze
      setDoc(userDocRef, updatedData, { merge: true }).catch(error => {
        console.error("Error updating profile:", error);
        setErrorMsg("Не вдалося зберегти зміни. Перевірте з'єднання з базою даних.");
      });
      
      setUserData(updatedData); // Update context state immediately
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Error setting profile data:", error);
    }
  };

  const completedModules = userData?.completedModules || [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>Профіль Студента</h2>

      {/* Tabs navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          type="button"
          className="btn" 
          style={{ 
            background: activeTab === 'info' ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
            color: activeTab === 'info' ? 'white' : 'var(--text-secondary)',
            border: activeTab === 'info' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={() => setActiveTab('info')}
        >
          <User size={16} />
          <span>Особиста інформація</span>
        </button>
        <button 
          type="button"
          className="btn" 
          style={{ 
            background: activeTab === 'certificates' ? 'var(--primary)' : 'rgba(255,255,255,0.02)', 
            color: activeTab === 'certificates' ? 'white' : 'var(--text-secondary)',
            border: activeTab === 'certificates' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '0.6rem 1.2rem',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={() => setActiveTab('certificates')}
        >
          <Award size={16} />
          <span>Мої сертифікати ({completedModules.length})</span>
        </button>
      </div>
      
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        {activeTab === 'info' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
            
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
                  <input type="text" className="input-field" value={profile.middleName} onChange={e => setProfile({...profile, middleName: e.target.value})} />
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0' }} />

            {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center' }}>{errorMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="input-label"><Mail size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Email</label>
                <input type="email" className="input-field" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} disabled />
              </div>
              <div>
                <label className="input-label"><School size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Навчальний заклад</label>
                <input type="text" className="input-field" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} />
              </div>
              <div>
                <label className="input-label"><Users size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Рік вступу</label>
                <input type="number" className="input-field" value={profile.year} onChange={e => setProfile({...profile, year: e.target.value})} min="2000" max="2100" />
              </div>
              <div>
                <label className="input-label"><Users size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} /> Група</label>
                <input type="text" className="input-field" value={profile.group} onChange={e => setProfile({...profile, group: e.target.value})} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center', gap: '1rem' }}>
              {isSaved && <span style={{ color: 'var(--success)' }}>Зміни збережено!</span>}
              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <Save size={18} /> Зберегти зміни
              </button>
            </div>

          </form>
        )}

        {activeTab === 'certificates' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
              Отримані сертифікати
            </h3>
            
            {loadingModules ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Завантаження інформації про модулі...
              </div>
            ) : completedModules.length === 0 ? (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Award size={48} style={{ display: 'block', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                Ви ще не завершили жодного модуля.
                <br />
                <span style={{ fontSize: '0.9rem', display: 'inline-block', marginTop: '0.5rem' }}>
                  Складайте тести та виконуйте завдання в IDE, щоб отримати сертифікат!
                </span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {completedModules.map((modId) => {
                  const mod = dbModules.find(m => m.id === modId);
                  const modTitle = mod ? mod.title : `Модуль ${modId}`;
                  const attempt = userData?.quizAttempts?.[`module_${modId}`];
                  const score = attempt ? attempt.score : 100;
                  const dateStr = attempt?.takenAt 
                    ? new Date(attempt.takenAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'Невідома дата';

                  return (
                    <div 
                      key={modId} 
                      className="glass-panel" 
                      style={{ 
                        padding: '1.5rem', 
                        background: 'rgba(255,255,255,0.01)', 
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Decorative watermark */}
                      <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.03, pointerEvents: 'none', color: 'var(--primary)' }}>
                        <Award size={100} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                          <Award size={18} />
                          <span style={{ fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase' }}>Сертифікат</span>
                        </div>
                        
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                          {modTitle}
                        </h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={12} /> {dateStr}
                          </span>
                          <span>
                            Результат: <strong style={{ color: 'var(--success)' }}>{score}%</strong>
                          </span>
                        </div>
                      </div>

                      <button 
                        type="button"
                        className="btn btn-primary"
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem', 
                          fontSize: '0.85rem', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.4rem',
                          marginTop: '0.5rem'
                        }}
                        onClick={() => navigate('/student/certificate', { state: { score, moduleTitle: modTitle } })}
                      >
                        <span>Переглянути</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

