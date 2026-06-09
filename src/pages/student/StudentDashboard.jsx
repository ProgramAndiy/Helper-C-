import { CheckCircle, Lock, PlayCircle, Award, Code, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courseModules } from '../../data/courseData';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [dbModules, setDbModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        // Use a 3-second timeout to prevent hanging when offline/blocked
        const fetchPromise = getDocs(collection(db, 'modules'));
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Firestore fetch timed out")), 2000)
        );

        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]);
        let list = [];
        querySnapshot.forEach(docSnap => {
          list.push({ docId: docSnap.id, ...docSnap.data() });
        });

        // Seed with default modules if Firestore modules collection is empty
        if (list.length === 0) {
          const defaults = courseModules.map((mod, index) => ({
            ...mod,
            id: mod.id,
            order: index + 1
          }));

          // Set list immediately to render without freezing
          list = defaults;

          // Seed in background without awaiting the whole loop
          defaults.forEach(d => {
            const dataToSave = { ...d };
            delete dataToSave.status; // Remove static status
            const newDocRef = doc(db, 'modules', `module_${d.id}`);
            setDoc(newDocRef, dataToSave).catch(err => console.warn(`Failed to seed module_${d.id}:`, err));
          });
        }

        // Sort by order
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setDbModules(list);
      } catch (err) {
        console.error("Error fetching modules from Firestore:", err);
        // Fallback to local data immediately on timeout/error
        setDbModules(courseModules);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', color: 'var(--text-secondary)' }}>
        Завантаження Дерева Навичок...
      </div>
    );
  }

  const completedModules = userData?.completedModules || [];
  
  const modules = dbModules.map((mod, index) => {
    let status = 'locked';
    const modId = mod.id;
    const prevModId = index > 0 ? dbModules[index - 1].id : null;
    
    if (completedModules.includes(modId)) {
      status = 'completed';
    } else if (index === 0 || completedModules.includes(prevModId)) {
      status = 'in-progress';
    }
    return { ...mod, status };
  });

  const progressPercent = dbModules.length > 0 
    ? Math.round((completedModules.length / dbModules.length) * 100)
    : 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Дерево Навичок (Skill Tree)</h2>
        <div className="glass-panel" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
          <Award size={20} />
          <span style={{ fontWeight: 'bold' }}>Сертифікат: {progressPercent}% пройдено</span>
        </div>
      </div>
      
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical timeline line */}
        <div style={{ position: 'absolute', left: '39px', top: '20px', bottom: '20px', width: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', zIndex: 0 }}></div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>
          {modules.map((mod, index) => {
            const isCompleted = mod.status === 'completed';
            const isInProgress = mod.status === 'in-progress';
            const isLocked = mod.status === 'locked';
            
            let iconBackground = 'var(--bg-elevated)';
            let iconColor = 'var(--text-muted)';
            let borderColor = 'transparent';

            if (isCompleted) {
              iconBackground = 'rgba(76, 201, 240, 0.2)';
              iconColor = 'var(--success)';
              borderColor = 'var(--success)';
            } else if (isInProgress) {
              iconBackground = 'rgba(138, 43, 226, 0.2)';
              iconColor = 'var(--primary)';
              borderColor = 'var(--primary)';
            }

            const hasTakenQuiz = userData?.quizAttempts?.[`module_${mod.id}`] !== undefined;

            return (
              <div key={mod.id} style={{ display: 'flex', gap: '1.5rem', opacity: isLocked ? 0.6 : 1 }}>
                
                {/* Timeline Icon Node */}
                <div style={{ 
                  minWidth: '40px', height: '40px', borderRadius: '50%', 
                  background: iconBackground, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${borderColor}`, color: iconColor, marginTop: '0.5rem'
                }}>
                  {isCompleted && <CheckCircle size={20} />}
                  {isInProgress && <PlayCircle size={20} />}
                  {isLocked && <Lock size={18} />}
                </div>

                {/* Module Card */}
                <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', borderLeft: isInProgress ? '4px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: isLocked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{mod.title}</h3>
                    {!isLocked && (
                      <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '12px', background: isCompleted ? 'rgba(76, 201, 240, 0.1)' : 'rgba(138, 43, 226, 0.1)', color: isCompleted ? 'var(--success)' : 'var(--primary)', fontWeight: 'bold' }}>
                        {isCompleted ? 'Пройдено' : 'Поточний'}
                      </span>
                    )}
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {mod.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className={`btn ${isLocked ? 'btn-secondary' : 'btn-primary'}`} 
                      disabled={isLocked}
                      onClick={() => {
                        if (isInProgress && !hasTakenQuiz) {
                          navigate('/student/quiz', { state: { module: mod } });
                        } else {
                          navigate('/student/ide', { state: { module: mod } });
                        }
                      }}
                    >
                      <Code size={18} />
                      {isCompleted ? 'Повторити практику' : (isInProgress ? (hasTakenQuiz ? 'Продовжити практику (IDE)' : 'Скласти вхідний тест') : 'Заблоковано')}
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      disabled={isLocked} 
                      onClick={() => navigate('/student/lesson', { state: { module: mod } })}
                    >
                      <BookOpen size={18} />
                      Теорія
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
