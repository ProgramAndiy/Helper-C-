import { useState, useEffect } from 'react';
import { Activity, Users, AlertCircle, CheckCircle, Bell } from 'lucide-react';
import { courseModules } from '../../data/courseData';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        // Fetch students
        const studentsRes = await fetch('/api/auth/students', { headers });
        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
        }

        // Fetch modules
        const modulesRes = await fetch('/api/modules', { headers });
        if (modulesRes.ok) {
          const modulesData = await modulesRes.json();
          setModules(modulesData);
        }
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute stats
  const activeStudentsCount = students.length;

  const totalCompletedQuizzes = students.reduce((sum, student) => {
    const attempts = student.quizAttempts || {};
    return sum + Object.keys(attempts).length;
  }, 0);

  const needAttentionCount = students.filter(student => {
    const attempts = student.quizAttempts || {};
    const hasFail = Object.values(attempts).some(attempt => attempt.score < 60);
    const hasZeroProgress = (student.completedModules || []).length === 0;
    return hasFail || (hasZeroProgress && activeStudentsCount > 0);
  }).length;

  // Generate priority alerts from recent quiz attempts
  const getModuleTitle = (modKey) => {
    const idStr = modKey.replace('module_', '');
    const numId = parseInt(idStr, 10);
    const mod = modules.find(m => m.id === numId);
    return mod?.title || modKey;
  };

  const priorityAlerts = [];
  students.forEach(student => {
    const fullName = `${student.lastName || ''} ${student.firstName || ''}`.trim() || student.email || 'Студент';
    const attempts = student.quizAttempts || {};
    
    Object.entries(attempts).forEach(([modKey, attempt]) => {
      const isFailed = attempt.score < 60;
      priorityAlerts.push({
        studentName: fullName,
        moduleTitle: getModuleTitle(modKey),
        score: attempt.score,
        isFailed: isFailed,
        takenAt: attempt.takenAt ? new Date(attempt.takenAt) : new Date(0),
        takenAtStr: attempt.takenAt ? new Date(attempt.takenAt).toLocaleString('uk-UA') : '',
        message: isFailed 
          ? `провалив(ла) тест "${getModuleTitle(modKey)}" з результатом ${attempt.score}%.`
          : `успішно склав(ла) тест "${getModuleTitle(modKey)}" на ${attempt.score}%.`
      });
    });
  });

  // Sort alerts: most recent first
  priorityAlerts.sort((a, b) => b.takenAt - a.takenAt);
  const displayAlerts = priorityAlerts.slice(0, 5); // top 5 recent events

  // Generate module progress chart data
  const chartData = modules.map(mod => {
    const completedCount = students.filter(s => (s.completedModules || []).includes(mod.id)).length;
    const percent = activeStudentsCount > 0 ? Math.round((completedCount / activeStudentsCount) * 100) : 0;
    
    // Shorten title for chart labels
    let label = mod.title || `Модуль ${mod.id}`;
    if (label.includes(':')) {
      label = label.split(':')[0].trim();
    }
    if (label.length > 12) {
      label = label.substring(0, 12) + '...';
    }

    return {
      label: label,
      fullTitle: mod.title,
      value: percent
    };
  });

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Панель викладача</h2>
      
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(138, 43, 226, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Активні студенти</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{loading ? '...' : activeStudentsCount}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(76, 201, 240, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Пройдено тестів</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{loading ? '...' : totalCompletedQuizzes}</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(247, 37, 133, 0.2)', borderRadius: '12px', color: 'var(--accent)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Потребують уваги</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>{loading ? '...' : needAttentionCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="admin-grid">
        
        {/* Progress monitoring (Chart) */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <Activity size={24} />
            <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Моніторинг прогресу</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Відсоток студентів, які успішно завершили кожен модуль курсу.
          </p>
          
          {/* Dynamic Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '250px', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {chartData.map((stat, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }} title={stat.fullTitle}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.value}%</span>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '40px', 
                  height: `${Math.max((stat.value / 100) * 180, 5)}px`, 
                  background: 'linear-gradient(to top, rgba(138,43,226,0.3), var(--primary))',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.8s ease-out'
                }}></div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority alerts (Feed) */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem' }}>
            <Bell size={20} color="var(--accent)" />
            Останні події студентів
          </h3>
          
          {loading ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Завантаження сповіщень...
            </div>
          ) : displayAlerts.length > 0 ? (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, margin: 0 }}>
              {displayAlerts.map((alert, i) => (
                <li 
                  key={i} 
                  style={{ 
                    padding: '1rem', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '8px', 
                    borderLeft: `3px solid ${alert.isFailed ? 'var(--accent)' : 'var(--success)'}`,
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}
                >
                  <p style={{ margin: '0 0 0.25rem 0' }}>
                    <strong>{alert.studentName}</strong> {alert.message}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {alert.takenAtStr}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Активностей студентів поки немає.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
