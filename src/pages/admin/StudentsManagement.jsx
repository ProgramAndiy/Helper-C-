import { useState } from 'react';
import { Search, UserCheck, UserX, BarChart2, MoreVertical, Plus, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function StudentsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const initialStudents = [
    { id: 1, name: 'Іван Франко', group: 'ІП-31', progress: 45, status: 'active', lastActive: '10 хвилин тому' },
    { id: 2, name: 'Леся Українка', group: 'ІП-31', progress: 92, status: 'active', lastActive: '2 години тому' },
    { id: 3, name: 'Тарас Шевченко', group: 'ІП-32', progress: 15, status: 'inactive', lastActive: '5 днів тому' },
    { id: 4, name: 'Григорій Сковорода', group: 'ІП-33', progress: 100, status: 'completed', lastActive: 'Вчора' },
    { id: 5, name: 'Михайло Коцюбинський', group: 'ІП-32', progress: 68, status: 'active', lastActive: 'Сьогодні' },
    { id: 6, name: 'Ліна Костенко', group: 'ІП-33', progress: 85, status: 'active', lastActive: '1 годину тому' },
    { id: 7, name: 'Василь Стус', group: 'ІП-31', progress: 5, status: 'inactive', lastActive: '2 тижні тому' },
  ];

  const filteredStudents = initialStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === '' || s.group.toLowerCase().includes(selectedGroup.toLowerCase());
    return matchesSearch && matchesGroup;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Управління студентами</h2>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Пошук студента..." 
              style={{ paddingLeft: '2.5rem', width: '220px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <input 
            type="text"
            className="input-field" 
            style={{ width: '130px' }}
            placeholder="Введіть групу"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          />
          <button className="btn btn-secondary" style={{ padding: '0.6rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => alert('Вивантаження статистики у CSV...')}>
            <Download size={18} />
            <span>Експорт</span>
          </button>
          <button className="btn btn-primary" style={{ padding: '0.6rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={() => setIsInviteModalOpen(true)}>
            <Plus size={18} />
            <span>Запросити</span>
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Студент</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Група</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Прогрес курсу</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Остання активність</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? filteredStudents.map(student => (
              <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover-highlight">
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(138,43,226,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{student.name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {student.status === 'active' && <span style={{ color: 'var(--success)' }}>Активний</span>}
                        {student.status === 'inactive' && <span style={{ color: 'var(--danger)' }}>Неактивний</span>}
                        {student.status === 'completed' && <span style={{ color: 'var(--primary)' }}>Завершив</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{student.group}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${student.progress}%`, 
                        height: '100%', 
                        background: student.progress === 100 ? 'var(--success)' : 'var(--primary)',
                        borderRadius: '3px'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', width: '35px' }}>{student.progress}%</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{student.lastActive}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-secondary)' }} title="Детальна статистика">
                    <BarChart2 size={18} />
                  </button>
                  <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-secondary)' }} title="Додаткові дії">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Студентів не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Показано {filteredStudents.length} записів</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} disabled><ChevronLeft size={18} /></button>
            <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>1</button>
            <button className="btn btn-secondary" style={{ padding: '0.4rem' }}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {/* Invite Modal Overlay */}
      {isInviteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Запросити студента</h3>
              <button className="btn" style={{ padding: 0, background: 'transparent', color: 'var(--text-muted)' }} onClick={() => setIsInviteModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Email студента</label>
                <input type="email" className="input-field" placeholder="student@university.edu" />
              </div>
              <div>
                <label className="input-label">Група</label>
                <input type="text" className="input-field" placeholder="Наприклад, ІП-31" />
              </div>
              
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '1rem', width: '100%' }}
                onClick={() => {
                  alert('Запрошення успішно надіслано!');
                  setIsInviteModalOpen(false);
                }}
              >
                Надіслати запрошення
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .hover-highlight:hover {
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
}
