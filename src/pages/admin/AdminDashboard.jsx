import { Activity, Users, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
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
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>124</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(76, 201, 240, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Пройдено тестів</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>856</h3>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(247, 37, 133, 0.2)', borderRadius: '12px', color: 'var(--accent)' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Потребують уваги</p>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>12</h3>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ gridColumn: 'span 2', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
            <Activity size={24} />
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Моніторинг прогресу</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Графік успішності студентів та проходження модулів.</p>
          
          {/* Mock Bar Chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '250px', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              { label: 'Мод 1', value: 90 },
              { label: 'Мод 2', value: 75 },
              { label: 'Мод 3', value: 60 },
              { label: 'Мод 4', value: 40 },
              { label: 'Мод 5', value: 20 },
              { label: 'Мод 6', value: 5 },
            ].map((stat, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.value}%</span>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '40px', 
                  height: `${(stat.value / 100) * 200}px`, 
                  background: 'linear-gradient(to top, rgba(138,43,226,0.3), var(--primary))',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 1s ease-out'
                }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} color="var(--accent)" />
            Пріоритетні сповіщення
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <li key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}><strong>Іван Франко</strong> провалив тест "Основи ООП" 3 рази підряд.</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10 хвилин тому</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
