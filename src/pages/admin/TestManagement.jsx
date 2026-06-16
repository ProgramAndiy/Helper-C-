import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, BookOpen, HelpCircle, Code, Save, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseModules } from '../../data/courseData';

export default function TestManagement() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [originalModule, setOriginalModule] = useState(null);
  
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'topics' | 'quizzes' | 'tasks'
  const [activeSubItemIndex, setActiveSubItemIndex] = useState(0);
  
  const [isSaving, setIsSaving] = useState(false);

  const { userData, currentUser } = useAuth();
  const teacherName = userData 
    ? `${userData.lastName || ''} ${userData.firstName || ''}`.trim() || userData.email || 'Викладач'
    : currentUser?.email || 'Викладач';

  // Load modules from C# API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/modules', { headers });
        if (res.ok) {
          const list = await res.json();
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setModules(list);
          
          if (list.length > 0) {
            setSelectedModule(list[0]);
            setOriginalModule(JSON.parse(JSON.stringify(list[0])));
          }
        }
      } catch (error) {
        console.error("Error fetching modules in editor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const hasChanges = JSON.stringify(selectedModule) !== JSON.stringify(originalModule);

  const handleSelectModule = (mod) => {
    if (hasChanges && !window.confirm("У вас є незбережені зміни! Ви дійсно хочете перейти до іншого модуля без збереження?")) {
      return;
    }
    setSelectedModule(mod);
    setOriginalModule(JSON.parse(JSON.stringify(mod)));
    setActiveTab('general');
    setActiveSubItemIndex(0);
  };

  const handleAddModule = async () => {
    if (hasChanges && !window.confirm("У вас є незбережені зміни! Збережіть їх перед створенням нового модуля.")) {
      return;
    }

    const maxId = modules.reduce((max, m) => m.id > max ? m.id : max, 0);
    const newId = maxId + 1;
    
    const newModule = {
      id: newId,
      title: `Новий модуль ${newId}`,
      description: 'Опис нового модуля...',
      order: newId,
      topics: [],
      quizzes: [],
      tasks: []
    };
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/modules/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newModule)
      });
      if (!res.ok) throw new Error("Server error creating module");
      const savedModule = await res.json();

      const updatedList = [...modules, savedModule].sort((a, b) => a.order - b.order);
      setModules(updatedList);
      setSelectedModule(savedModule);
      setOriginalModule(JSON.parse(JSON.stringify(savedModule)));
      setActiveTab('general');
      setActiveSubItemIndex(0);
    } catch (err) {
      console.error("Error creating module:", err);
      alert("Не вдалося створити новий модуль на сервері.");
    }
  };

  const handleDeleteModule = async (modId) => {
    if (!window.confirm("Ви дійсно хочете видалити цей модуль разом із усією теорією, тестами та завданнями?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/modules/${modId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Server error deleting module");

      const updatedList = modules.filter(m => m.id !== modId);
      setModules(updatedList);
      if (selectedModule?.id === modId) {
        if (updatedList.length > 0) {
          setSelectedModule(updatedList[0]);
          setOriginalModule(JSON.parse(JSON.stringify(updatedList[0])));
        } else {
          setSelectedModule(null);
          setOriginalModule(null);
        }
      }
    } catch (err) {
      console.error("Error deleting module:", err);
      alert("Не вдалося видалити модуль на сервері.");
    }
  };

  const handleSaveModule = async () => {
    if (!selectedModule) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/modules/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(selectedModule)
      });
      if (!res.ok) throw new Error("Server error saving module");

      const savedModule = await res.json();
      
      setModules(prev => prev.map(m => m.id === savedModule.id ? savedModule : m).sort((a, b) => a.order - b.order));
      setSelectedModule(savedModule);
      setOriginalModule(JSON.parse(JSON.stringify(savedModule)));
    } catch (err) {
      console.error("Error saving module:", err);
      alert("Не вдалося зберегти зміни на сервері.");
    } finally {
      setIsSaving(false);
    }
  };

  // Field update helpers
  const updateGeneralField = (field, value) => {
    setSelectedModule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Topics helpers
  const handleAddTopic = () => {
    const newTopic = {
      id: `topic_${Date.now()}`,
      title: 'Нова лекція теорії',
      content: '<h3>Заголовок лекції</h3><p>Текст лекції...</p><pre><code>// приклад коду тут</code></pre>'
    };
    setSelectedModule(prev => {
      const topics = [...(prev.topics || []), newTopic];
      return { ...prev, topics };
    });
    setActiveSubItemIndex(selectedModule.topics?.length || 0);
  };
  
  const handleUpdateTopic = (index, field, value) => {
    setSelectedModule(prev => {
      const topics = [...(prev.topics || [])];
      topics[index] = { ...topics[index], [field]: value };
      return { ...prev, topics };
    });
  };

  const handleDeleteTopic = (index) => {
    setSelectedModule(prev => {
      const topics = (prev.topics || []).filter((_, i) => i !== index);
      return { ...prev, topics };
    });
    setActiveSubItemIndex(0);
  };

  // Quizzes helpers
  const handleAddQuiz = () => {
    const newQuiz = {
      id: `q_${Date.now()}`,
      question: 'Нове тестове питання?',
      options: ['Варіант А', 'Варіант Б', 'Варіант В', 'Варіант Г'],
      correctAnswerIndex: 0
    };
    setSelectedModule(prev => {
      const quizzes = [...(prev.quizzes || []), newQuiz];
      return { ...prev, quizzes };
    });
    setActiveSubItemIndex(selectedModule.quizzes?.length || 0);
  };

  const handleUpdateQuiz = (index, field, value) => {
    setSelectedModule(prev => {
      const quizzes = [...(prev.quizzes || [])];
      quizzes[index] = { ...quizzes[index], [field]: value };
      return { ...prev, quizzes };
    });
  };

  const handleDeleteQuiz = (index) => {
    setSelectedModule(prev => {
      const quizzes = (prev.quizzes || []).filter((_, i) => i !== index);
      return { ...prev, quizzes };
    });
    setActiveSubItemIndex(0);
  };

  // Tasks helpers
  const handleAddTask = () => {
    const maxTaskId = (selectedModule.tasks || []).reduce((max, t) => t.id > max ? t.id : max, 0);
    const newTask = {
      id: maxTaskId + 1,
      title: 'Нове практичне завдання C#',
      description: 'Опис практичного завдання...',
      instructions: ['Оголосіть змінну...', 'Виведіть результат...'],
      initialCode: `using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Напишіть ваш код тут\n        }\n    }\n}`,
      referenceCode: `using System;\n\nnamespace HelperPlatform\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // Правильне вирішення тут\n        }\n    }\n}`,
      expectedOutput: ''
    };
    setSelectedModule(prev => {
      const tasks = [...(prev.tasks || []), newTask];
      return { ...prev, tasks };
    });
    setActiveSubItemIndex(selectedModule.tasks?.length || 0);
  };

  const handleUpdateTask = (index, field, value) => {
    setSelectedModule(prev => {
      const tasks = [...(prev.tasks || [])];
      tasks[index] = { ...tasks[index], [field]: value };
      return { ...prev, tasks };
    });
  };

  const handleDeleteTask = (index) => {
    setSelectedModule(prev => {
      const tasks = (prev.tasks || []).filter((_, i) => i !== index);
      return { ...prev, tasks };
    });
    setActiveSubItemIndex(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: 'calc(100vh - 120px)' }}>
      
      {/* Header section with Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Конструктор курсів (Course Builder)</h2>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Керування лекціями, вхідними тестами та завданнями компілятора.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {selectedModule && hasChanges && (
            <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem' }} className="animate-pulse">
              ⚠️ Має незбережені зміни!
            </span>
          )}
          <button 
            className="btn btn-primary" 
            onClick={handleSaveModule} 
            disabled={!selectedModule || !hasChanges || isSaving}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: hasChanges ? 'var(--success)' : 'var(--bg-elevated)' }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Збереження...' : 'Зберегти зміни модуля'}</span>
          </button>
        </div>
      </div>

      <div className="flex-row-mobile-col" style={{ flex: 1, alignItems: 'stretch' }}>
        
        {/* Left column: Modules list */}
        <div className="glass-panel admin-sidebar" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.8rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Модулі курсу</span>
            <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }} onClick={handleAddModule}>
              <Plus size={16} /> Додати
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Завантаження модулів...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
              {modules.map((mod) => {
                const isSelected = selectedModule?.id === mod.id;
                return (
                  <div 
                    key={mod.id} 
                    onClick={() => handleSelectModule(mod)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.8rem 1rem', 
                      borderRadius: '8px', 
                      background: isSelected ? 'rgba(138,43,226,0.15)' : 'rgba(255,255,255,0.01)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', overflow: 'hidden' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: isSelected ? 'var(--primary)' : 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {mod.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Порядок: {mod.order}
                      </span>
                    </div>
                    
                    <button 
                      className="btn" 
                      style={{ padding: '0.3rem', background: 'transparent', color: 'var(--danger)', opacity: isSelected ? 1 : 0.3 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteModule(mod.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Selected Module Editor */}
        {selectedModule ? (
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.5rem', overflowY: 'auto' }}>
            
            {/* Tabs selector */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              {[
                { id: 'general', name: 'Основні налаштування', icon: <FileText size={16} /> },
                { id: 'topics', name: 'Теорія (Лекції)', icon: <BookOpen size={16} /> },
                { id: 'quizzes', name: 'Тести (Quiz)', icon: <HelpCircle size={16} /> },
                { id: 'tasks', name: 'Практика (IDE)', icon: <Code size={16} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  className="btn"
                  style={{
                    background: activeTab === tab.id ? 'var(--bg-elevated)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                    padding: '0.6rem 1.2rem',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0
                  }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setActiveSubItemIndex(0);
                  }}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: General */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label className="input-label">Назва модуля</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={selectedModule.title || ''} 
                    onChange={e => updateGeneralField('title', e.target.value)} 
                    placeholder="Наприклад: Модуль 1: Вступ до C#" 
                  />
                </div>
                <div>
                  <label className="input-label">Опис модуля</label>
                  <textarea 
                    className="input-field" 
                    rows={4}
                    value={selectedModule.description || ''} 
                    onChange={e => updateGeneralField('description', e.target.value)} 
                    placeholder="Короткий опис навичок, які вивчить студент..."
                  />
                </div>
                <div style={{ width: '200px' }}>
                  <label className="input-label">Порядок сортування в Roadmap</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={selectedModule.order || 0} 
                    onChange={e => updateGeneralField('order', parseInt(e.target.value, 10) || 0)} 
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: Topics */}
            {activeTab === 'topics' && (
              <div className="flex-row-mobile-col" style={{ flex: 1, minHeight: '350px' }}>
                
                {/* Topics Sidebar */}
                <div className="admin-sidebar-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }} onClick={handleAddTopic}>
                    <Plus size={14} /> Додати лекцію
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto', flex: 1 }}>
                    {(selectedModule.topics || []).map((topic, idx) => (
                      <button
                        key={topic.id}
                        className="btn"
                        style={{
                          background: activeSubItemIndex === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
                          color: activeSubItemIndex === idx ? 'var(--primary)' : 'var(--text-secondary)',
                          justifyContent: 'flex-start',
                          padding: '0.6rem 0.8rem',
                          border: 'none',
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                        onClick={() => setActiveSubItemIndex(idx)}
                      >
                        {idx + 1}. {topic.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Editor */}
                {(selectedModule.topics || []).length > 0 && selectedModule.topics[activeSubItemIndex] ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Редагування лекції {activeSubItemIndex + 1}</span>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={() => handleDeleteTopic(activeSubItemIndex)}>
                        <Trash2 size={16} /> Видалити тему
                      </button>
                    </div>

                    <div>
                      <label className="input-label">Заголовок лекції</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={selectedModule.topics[activeSubItemIndex].title || ''} 
                        onChange={e => handleUpdateTopic(activeSubItemIndex, 'title', e.target.value)} 
                      />
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <label className="input-label">HTML-контент лекції (з прикладами коду)</label>
                      <textarea 
                        className="input-field" 
                        style={{ flex: 1, minHeight: '200px', fontFamily: 'Consolas, monospace', fontSize: '14px', resize: 'vertical' }} 
                        value={selectedModule.topics[activeSubItemIndex].content || ''} 
                        onChange={e => handleUpdateTopic(activeSubItemIndex, 'content', e.target.value)} 
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Лекцій не створено. Натисніть «Додати лекцію» ліворуч.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Quizzes */}
            {activeTab === 'quizzes' && (
              <div className="flex-row-mobile-col" style={{ flex: 1, minHeight: '350px' }}>
                
                {/* Quizzes Sidebar */}
                <div className="admin-sidebar-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }} onClick={handleAddQuiz}>
                    <Plus size={14} /> Додати питання
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto', flex: 1 }}>
                    {(selectedModule.quizzes || []).map((quiz, idx) => (
                      <button
                        key={quiz.id}
                        className="btn"
                        style={{
                          background: activeSubItemIndex === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
                          color: activeSubItemIndex === idx ? 'var(--primary)' : 'var(--text-secondary)',
                          justifyContent: 'flex-start',
                          padding: '0.6rem 0.8rem',
                          border: 'none',
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                        onClick={() => setActiveSubItemIndex(idx)}
                      >
                        {idx + 1}. {quiz.question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quiz Editor */}
                {(selectedModule.quizzes || []).length > 0 && selectedModule.quizzes[activeSubItemIndex] ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Редагування запитання {activeSubItemIndex + 1}</span>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={() => handleDeleteQuiz(activeSubItemIndex)}>
                        <Trash2 size={16} /> Видалити питання
                      </button>
                    </div>

                    <div>
                      <label className="input-label">Текст запитання</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={selectedModule.quizzes[activeSubItemIndex].question || ''} 
                        onChange={e => handleUpdateQuiz(activeSubItemIndex, 'question', e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="input-label">URL-посилання на зображення з кодом (необов'язково)</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="https://imgur.com/example.png"
                        value={selectedModule.quizzes[activeSubItemIndex].image || ''} 
                        onChange={e => handleUpdateQuiz(activeSubItemIndex, 'image', e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="input-label">Варіанти відповідей та правильний варіант</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {(selectedModule.quizzes[activeSubItemIndex].options || []).map((opt, optIdx) => (
                          <div key={optIdx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            {/* Correct answer indicator */}
                            <input 
                              type="radio" 
                              name={`correct_${activeSubItemIndex}`} 
                              checked={selectedModule.quizzes[activeSubItemIndex].correctAnswerIndex === optIdx}
                              onChange={() => handleUpdateQuiz(activeSubItemIndex, 'correctAnswerIndex', optIdx)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            
                            <input 
                              type="text" 
                              className="input-field" 
                              value={opt} 
                              onChange={e => {
                                const newOpts = [...selectedModule.quizzes[activeSubItemIndex].options];
                                newOpts[optIdx] = e.target.value;
                                handleUpdateQuiz(activeSubItemIndex, 'options', newOpts);
                              }}
                              placeholder={`Варіант ${String.fromCharCode(65 + optIdx)}`}
                            />

                            <button 
                              className="btn" 
                              style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }}
                              onClick={() => {
                                const newOpts = selectedModule.quizzes[activeSubItemIndex].options.filter((_, oIdx) => oIdx !== optIdx);
                                let correctIdx = selectedModule.quizzes[activeSubItemIndex].correctAnswerIndex;
                                if (correctIdx >= newOpts.length) correctIdx = 0;
                                setSelectedModule(prev => {
                                  const quizzes = [...(prev.quizzes || [])];
                                  quizzes[activeSubItemIndex] = { ...quizzes[activeSubItemIndex], options: newOpts, correctAnswerIndex: correctIdx };
                                  return { ...prev, quizzes };
                                });
                              }}
                              disabled={selectedModule.quizzes[activeSubItemIndex].options.length <= 2}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}

                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.5rem', fontSize: '0.85rem', width: '200px', alignSelf: 'flex-start' }}
                          onClick={() => {
                            const newOpts = [...selectedModule.quizzes[activeSubItemIndex].options, `Новий варіант`];
                            handleUpdateQuiz(activeSubItemIndex, 'options', newOpts);
                          }}
                        >
                          <Plus size={14} /> Додати варіант
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Тестових питань немає. Натисніть «Додати питання» ліворуч.
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Tasks */}
            {activeTab === 'tasks' && (
              <div className="flex-row-mobile-col" style={{ flex: 1, minHeight: '350px' }}>
                
                {/* Tasks Sidebar */}
                <div className="admin-sidebar-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1rem' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }} onClick={handleAddTask}>
                    <Plus size={14} /> Додати завдання
                  </button>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', overflowY: 'auto', flex: 1 }}>
                    {(selectedModule.tasks || []).map((task, idx) => (
                      <button
                        key={task.id}
                        className="btn"
                        style={{
                          background: activeSubItemIndex === idx ? 'rgba(255,255,255,0.05)' : 'transparent',
                          color: activeSubItemIndex === idx ? 'var(--primary)' : 'var(--text-secondary)',
                          justifyContent: 'flex-start',
                          padding: '0.6rem 0.8rem',
                          border: 'none',
                          fontSize: '0.85rem',
                          textAlign: 'left',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden'
                        }}
                        onClick={() => setActiveSubItemIndex(idx)}
                      >
                        {idx + 1}. {task.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Editor */}
                {(selectedModule.tasks || []).length > 0 && selectedModule.tasks[activeSubItemIndex] ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Редагування завдання {activeSubItemIndex + 1}</span>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', color: 'var(--danger)', border: '1px solid var(--danger)' }} onClick={() => handleDeleteTask(activeSubItemIndex)}>
                        <Trash2 size={16} /> Видалити завдання
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <label className="input-label">Заголовок завдання</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={selectedModule.tasks[activeSubItemIndex].title || ''} 
                          onChange={e => handleUpdateTask(activeSubItemIndex, 'title', e.target.value)} 
                        />
                      </div>
                      <div style={{ width: '120px' }}>
                        <label className="input-label">ID завдання (число)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={selectedModule.tasks[activeSubItemIndex].id || 0} 
                          onChange={e => handleUpdateTask(activeSubItemIndex, 'id', parseInt(e.target.value, 10) || 0)} 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="input-label">Опис практичного завдання</label>
                      <textarea 
                        className="input-field" 
                        rows={2}
                        value={selectedModule.tasks[activeSubItemIndex].description || ''} 
                        onChange={e => handleUpdateTask(activeSubItemIndex, 'description', e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="input-label">Інструкції (кожна інструкція з нового рядка)</label>
                      <textarea 
                        className="input-field" 
                        rows={3}
                        value={selectedModule.tasks[activeSubItemIndex].instructions?.join('\n') || ''} 
                        onChange={e => {
                          const lines = e.target.value.split('\n');
                          handleUpdateTask(activeSubItemIndex, 'instructions', lines);
                        }} 
                        placeholder="Крок 1: Оголосіть...\nКрок 2: Напишіть..."
                      />
                    </div>

                    <div className="code-editor-grid">
                      <div>
                        <label className="input-label">Початковий шаблон коду (для редактора)</label>
                        <textarea 
                          className="input-field" 
                          rows={8}
                          style={{ fontFamily: 'Consolas, monospace', fontSize: '13px' }}
                          value={selectedModule.tasks[activeSubItemIndex].initialCode || ''} 
                          onChange={e => handleUpdateTask(activeSubItemIndex, 'initialCode', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="input-label">Зразок правильного рішення (підказка)</label>
                        <textarea 
                          className="input-field" 
                          rows={8}
                          style={{ fontFamily: 'Consolas, monospace', fontSize: '13px' }}
                          value={selectedModule.tasks[activeSubItemIndex].referenceCode || ''} 
                          onChange={e => handleUpdateTask(activeSubItemIndex, 'referenceCode', e.target.value)} 
                        />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label className="input-label">Очікуваний вивід у консолі (обов'язково для автоматичної перевірки)</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          value={selectedModule.tasks[activeSubItemIndex].expectedOutput || ''} 
                          onChange={e => handleUpdateTask(activeSubItemIndex, 'expectedOutput', e.target.value)} 
                          placeholder="Наприклад: Привіт Світ"
                        />
                      </div>
                    </div>

                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    Завдань компілятора немає. Натисніть «Додати завдання» ліворуч.
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Немає доступних модулів. Створіть новий модуль у лівій колонці.
          </div>
        )}

      </div>

    </div>
  );
}
