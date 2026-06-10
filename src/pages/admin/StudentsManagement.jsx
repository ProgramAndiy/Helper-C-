import { useState, useEffect } from 'react';
import { Search, BarChart2, MoreVertical, Plus, Download, ChevronLeft, ChevronRight, X, Check, HelpCircle } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function StudentsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    const fetchStudentsAndModules = async () => {
      try {
        // Fetch Students
        const q = query(collection(db, 'users'), where('role', '==', 'student'));
        const querySnapshot = await getDocs(q);
        const list = [];
        
        querySnapshot.forEach(docSnap => {
          const data = docSnap.data();
          const fullName = `${data.lastName || ''} ${data.firstName || ''} ${data.middleName || ''}`.trim();
          
          list.push({
            id: docSnap.id,
            name: fullName || data.email || 'Студент',
            group: data.group || 'Не вказано',
            progress: data.progress || 0,
            status: data.status || 'active',
            lastActive: data.lastActive || 'Нещодавно',
            quizAttempts: data.quizAttempts || {}
          });
        });
        
        setStudents(list);

        // Fetch Modules
        const modulesSnapshot = await getDocs(collection(db, 'modules'));
        const mods = [];
        modulesSnapshot.forEach(docSnap => {
          mods.push({ id: docSnap.id, ...docSnap.data() });
        });
        setModules(mods);

      } catch (error) {
        console.error("Error fetching students/modules data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndModules();
  }, []);

  const handleViewStats = (student) => {
    setSelectedStudent(student);
    const studentAttempts = student.quizAttempts || {};
    const keys = Object.keys(studentAttempts);
    if (keys.length > 0) {
      setSelectedModuleId(keys[0]);
    } else {
      setSelectedModuleId(null);
    }
  };

  const getModuleTitle = (modKey) => {
    const idStr = modKey.replace('module_', '');
    const numId = parseInt(idStr, 10);
    const mod = modules.find(m => m.id === numId);
    return mod?.title || modKey;
  };

  const filteredStudents = students.filter(s => {
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
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Завантаження списку студентів...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? filteredStudents.map(student => (
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
                  <button 
                    className="btn" 
                    style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-secondary)' }} 
                    title="Детальна статистика"
                    onClick={() => handleViewStats(student)}
                  >
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

      {/* Stats Modal */}
      {selectedStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '700px', maxWidth: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Детальна статистика успішності</h3>
                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Студент: <strong>{selectedStudent.name}</strong> ({selectedStudent.group})</p>
              </div>
              <button className="btn" style={{ padding: 0, background: 'transparent', color: 'var(--text-muted)' }} onClick={() => setSelectedStudent(null)}>
                <X size={20} />
              </button>
            </div>

            {attemptedModuleIds.length === 0 ? (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <HelpCircle size={48} style={{ display: 'block', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                Студент ще не проходив жодного тесту.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Module Selector tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {attemptedModuleIds.map((modKey) => {
                    const isActive = selectedModuleId === modKey;
                    const score = attempts[modKey]?.score || 0;
                    return (
                      <button
                        key={modKey}
                        className="btn"
                        style={{
                          background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                          color: isActive ? 'white' : 'var(--text-secondary)',
                          border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.9rem',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onClick={() => setSelectedModuleId(modKey)}
                      >
                        <span>{getModuleTitle(modKey)}</span>
                        <span style={{ 
                          background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(138,43,226,0.1)', 
                          color: isActive ? 'white' : 'var(--primary)',
                          padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' 
                        }}>
                          {score}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Attempt Details */}
                {selectedModuleId && attempts[selectedModuleId] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Дата проходження:</span>
                        <div style={{ fontWeight: 'bold', fontSize: '1rem', marginTop: '0.2rem' }}>
                          {attempts[selectedModuleId].takenAt ? new Date(attempts[selectedModuleId].takenAt).toLocaleString('uk-UA') : 'Невідомо'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Отриманий бал:</span>
                        <div style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'var(--success)', marginTop: '0.1rem' }}>
                          {attempts[selectedModuleId].score}%
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Деталі відповідей:</span>
                      {attempts[selectedModuleId].answers?.map((ans, idx) => (
                        <div key={idx} style={{ 
                          padding: '1.2rem', borderRadius: '8px', 
                          background: ans.isCorrect ? 'rgba(76, 201, 240, 0.03)' : 'rgba(247, 37, 133, 0.03)',
                          border: ans.isCorrect ? '1px solid rgba(76, 201, 240, 0.1)' : '1px solid rgba(247, 37, 133, 0.1)',
                          display: 'flex', gap: '1rem', alignItems: 'flex-start'
                        }}>
                          <div style={{ 
                            color: ans.isCorrect ? 'var(--success)' : 'var(--danger)', 
                            marginTop: '0.2rem', flexShrink: 0
                          }}>
                            {ans.isCorrect ? <Check size={20} /> : <X size={20} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{ans.questionText}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              <span>Відповідь студента: </span>
                              <strong style={{ color: ans.isCorrect ? 'var(--success)' : 'var(--danger)' }}>{ans.selectedOption || 'Не вказано'}</strong>
                              {!ans.isCorrect && (
                                <>
                                  <span> | Правильна: </span>
                                  <strong style={{ color: 'var(--success)' }}>{ans.correctOption}</strong>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <button className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem' }} onClick={() => setSelectedStudent(null)}>
                Закрити
              </button>
            </div>

          </div>
        </div>
      )}

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
