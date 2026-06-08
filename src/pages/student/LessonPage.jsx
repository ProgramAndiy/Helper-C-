import { useState, useEffect } from 'react';
import { ArrowLeft, UserCircle, Code, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { courseModules } from '../../data/courseData';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

export default function LessonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const moduleInfo = location.state?.module || { title: 'Модуль', desc: 'Теорія', id: 1 };

  // Load the full module details from courseData
  const moduleData = courseModules.find(m => m.id === moduleInfo.id) || courseModules[0];
  const topics = moduleData.topics || [];
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id || '');

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  const [teacherName, setTeacherName] = useState('Дмитро Петров');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'admin'), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const teacherData = querySnapshot.docs[0].data();
          const fullName = `${teacherData.lastName || ''} ${teacherData.firstName || ''}`.trim();
          if (fullName) {
            setTeacherName(fullName);
          } else if (teacherData.email) {
            setTeacherName(teacherData.email);
          }
        }
      } catch (err) {
        console.error("Error fetching teacher:", err);
      }
    };
    fetchTeacher();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
      <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '1.5rem', padding: 0 }} onClick={() => navigate('/student')}>
        <ArrowLeft size={20} /> Повернутися до Roadmap
      </button>

      {/* Header Info */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {moduleData.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem 1rem', borderRadius: '8px', display: 'inline-flex' }}>
          <UserCircle size={24} color="var(--primary)" />
          <span style={{ color: 'var(--text-secondary)' }}>
            Теорію та тести надано викладачем: <strong style={{ color: 'var(--text-primary)' }}>{teacherName}</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left column: Topic list */}
        <div className="glass-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="var(--primary)" />
            Теоретичні теми
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className="btn"
                style={{
                  background: activeTopicId === topic.id ? 'rgba(138,43,226,0.15)' : 'transparent',
                  color: activeTopicId === topic.id ? 'var(--primary)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 0,
                  padding: '1.2rem 1.5rem',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  borderLeft: activeTopicId === topic.id ? '4px solid var(--primary)' : '4px solid transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: Content */}
        <div style={{ flex: 1 }}>
          {activeTopic ? (
            <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', marginBottom: '2rem', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: activeTopic.content }} 
              />
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Теорія відсутня.
            </div>
          )}

          {/* Action to Practice */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={() => navigate('/student/ide', { state: { module: moduleData } })}>
              <Code size={20} />
              Перейти до практичного тесту (IDE)
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .article-content h3 {
          color: var(--text-primary);
          margin-bottom: 1.2rem;
          font-size: 1.6rem;
        }
        .article-content p {
          margin-bottom: 1.2rem;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content code {
          background: rgba(0, 0, 0, 0.3);
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          color: var(--accent);
          font-family: monospace;
        }
        .article-content .info-card {
          background: rgba(138, 43, 226, 0.08);
          border-left: 4px solid var(--primary);
          padding: 1.2rem;
          border-radius: 4px;
          margin: 1.5rem 0;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
