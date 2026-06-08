import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';

export default function TestManagement() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);

  // Fetch tests from Firestore
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tests'));
        const list = [];
        querySnapshot.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });

        // Initialize with default tests if Firestore is empty
        if (list.length === 0) {
          const defaults = [
            { title: 'Завдання: Value vs Reference типи', module: 'Модуль 3', author: 'Дмитро Петров', isTheory: false, content: 'Опис практичного завдання...' },
            { title: 'Теорія: Основи LINQ', module: 'Модуль 4', author: 'Дмитро Петров', isTheory: true, content: 'Теоретичний опис LINQ...' }
          ];

          for (const d of defaults) {
            const newDocRef = doc(collection(db, 'tests'));
            await setDoc(newDocRef, d);
            list.push({ id: newDocRef.id, ...d });
          }
        }

        setTests(list);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleEdit = (test) => {
    setCurrentTest(test);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей матеріал?')) return;

    try {
      await deleteDoc(doc(db, 'tests', id));
      setTests(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
      alert('Не вдалося видалити матеріал з бази даних.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentTest.title.trim()) return;

    try {
      if (currentTest.id) {
        // Edit existing test
        const testRef = doc(db, 'tests', currentTest.id);
        const updatedData = {
          title: currentTest.title,
          module: currentTest.module,
          author: currentTest.author,
          isTheory: currentTest.isTheory,
          content: currentTest.content || ''
        };
        await setDoc(testRef, updatedData);
        setTests(prev => prev.map(t => t.id === currentTest.id ? currentTest : t));
      } else {
        // Create new test
        const newRef = doc(collection(db, 'tests'));
        const newTestData = {
          title: currentTest.title,
          module: currentTest.module,
          author: currentTest.author,
          isTheory: currentTest.isTheory,
          content: currentTest.content || ''
        };
        await setDoc(newRef, newTestData);
        setTests(prev => [...prev, { ...newTestData, id: newRef.id }]);
      }

      setIsEditing(false);
      setCurrentTest(null);
    } catch (error) {
      console.error("Error saving test:", error);
      alert('Не вдалося зберегти матеріал у базу даних.');
    }
  };

  const handleAdd = () => {
    setCurrentTest({ title: '', module: 'Модуль 1', author: 'Дмитро Петров', isTheory: false, content: '' });
    setIsEditing(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Управління тестами та теорією</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} /> Створити новий матеріал
        </button>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Назва</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Модуль</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Тип</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Автор (Викладач)</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Завантаження списку матеріалів...
                </td>
              </tr>
            ) : tests.length > 0 ? tests.map(test => (
              <tr key={test.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{test.title}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.3rem 0.6rem', background: 'rgba(138,43,226,0.1)', color: 'var(--primary)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {test.module}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{test.isTheory ? 'Теорія' : 'Практика (IDE)'}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{test.author}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--text-muted)' }} onClick={() => handleEdit(test)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="btn" style={{ padding: '0.4rem', background: 'transparent', color: 'var(--danger)' }} onClick={() => handleDelete(test.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Матеріалів не знайдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal Overlay */}
      {isEditing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSave} className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>{currentTest.id ? 'Редагувати матеріал' : 'Створити матеріал'}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="input-label">Назва завдання / лекції</label>
                <input type="text" className="input-field" value={currentTest.title} onChange={e => setCurrentTest({...currentTest, title: e.target.value})} required />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Модуль</label>
                  <select className="input-field" value={currentTest.module} onChange={e => setCurrentTest({...currentTest, module: e.target.value})} style={{ background: '#201732' }}>
                    <option>Модуль 1</option>
                    <option>Модуль 2</option>
                    <option>Модуль 3</option>
                    <option>Модуль 4</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Тип матеріалу</label>
                  <select className="input-field" value={currentTest.isTheory} onChange={e => setCurrentTest({...currentTest, isTheory: e.target.value === 'true'})} style={{ background: '#201732' }}>
                    <option value={true}>Теорія</option>
                    <option value={false}>Практичне завдання</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Текст завдання або теорії</label>
                <textarea className="input-field" rows="6" value={currentTest.content || ''} onChange={e => setCurrentTest({...currentTest, content: e.target.value})} style={{ resize: 'vertical' }}></textarea>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  <X size={18} /> Скасувати
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={18} /> Зберегти
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
