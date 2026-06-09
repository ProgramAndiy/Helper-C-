import { useState } from 'react';
import { Play, Check, AlertTriangle, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { courseModules } from '../../data/courseData';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function IdePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const moduleInfo = location.state?.module || { title: 'Практика', desc: 'Завдання', id: 1 };

  // Load the full module details from courseData
  const moduleData = courseModules.find(m => m.id === moduleInfo.id) || courseModules[0];
  const tasks = moduleData.tasks || [];

  const { currentUser, userData, setUserData } = useAuth();
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const activeTask = tasks[activeTaskIndex] || { title: 'Завдання відсутнє', description: '', instructions: [], initialCode: '', id: 0 };

  // Initialize code state for all tasks
  const [codes, setCodes] = useState(() => {
    const initial = {};
    tasks.forEach(t => {
      initial[t.id] = t.initialCode;
    });
    return initial;
  });

  // Initialize output state for all tasks
  const [outputs, setOutputs] = useState(() => {
    const initial = {};
    tasks.forEach(t => {
      initial[t.id] = "Натисніть 'Запустити', щоб скомпілювати код...";
    });
    return initial;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [showReference, setShowReference] = useState(false);

  const handleCodeChange = (value) => {
    setCodes(prev => ({
      ...prev,
      [activeTask.id]: value
    }));
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputs(prev => ({
      ...prev,
      [activeTask.id]: "Компіляція на сервері...\n"
    }));
    
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    const getCompilerUrl = (path) => {
      const targetUrl = `https://api.paiza.io/${path}`;
      return isLocal 
        ? `/api-compiler/${path}` 
        : `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    };

    try {
      // Create execution runner via Paiza.io
      const createResponse = await fetch(getCompilerUrl('runners/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_code: codes[activeTask.id] || "",
          language: "csharp",
          input: "",
          longpoll: true,
          longpoll_timeout: 10,
          api_key: "guest"
        })
      });
      
      const createData = await createResponse.json();
      const runId = createData.id;
      
      if (!runId) {
        throw new Error("Не вдалося ініціалізувати компілятор.");
      }

      // Poll for compilation and execution details
      let completed = false;
      let attempts = 0;
      let details = null;

      while (!completed && attempts < 10) {
        attempts++;
        const statusResponse = await fetch(getCompilerUrl(`runners/get_details?id=${runId}&api_key=guest`));
        details = await statusResponse.json();
        
        if (details.status === "completed") {
          completed = true;
        } else {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!details || details.status !== "completed") {
        throw new Error("Перевищено час очікування компіляції.");
      }

      let consoleOutput = "";
      if (details.build_result === "failure") {
        consoleOutput = `Помилка компіляції:\n${details.build_stderr}`;
      } else {
        consoleOutput = `Вивід програми:\n${details.stdout}`;
        if (details.stderr) {
          consoleOutput += `\nПомилка виконання:\n${details.stderr}`;
        }
        consoleOutput += `\n\nКод завершення: ${details.exit_code}`;
      }

      setOutputs(prev => ({
        ...prev,
        [activeTask.id]: consoleOutput
      }));
    } catch (err) {
      setOutputs(prev => ({
        ...prev,
        [activeTask.id]: `Помилка: ${err.message || "Не вдалося з'єднатися з сервером компілятора."}`
      }));
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinishTest = async () => {
    let quizScore = 100;
    if (currentUser) {
      const completedModules = userData?.completedModules || [];
      
      // Get the score of the quiz for this module
      const quizAttempts = userData?.quizAttempts || {};
      const moduleAttempt = quizAttempts[`module_${moduleData.id}`];
      if (moduleAttempt) {
        quizScore = moduleAttempt.score;
      }

      if (!completedModules.includes(moduleData.id)) {
        const newCompleted = [...completedModules, moduleData.id];
        const newProgress = Math.round((newCompleted.length / courseModules.length) * 100);
        
        const updatedData = {
          ...userData,
          uid: currentUser.uid,
          email: currentUser.email || '',
          completedModules: newCompleted,
          progress: newProgress,
          role: userData?.role || 'student'
        };
        
        // Fire and forget to avoid hanging
        const userDocRef = doc(db, 'users', currentUser.uid);
        setDoc(userDocRef, updatedData, { merge: true }).catch(error => {
          console.error("Error saving student progress:", error);
        });
        setUserData(updatedData);
      }
    }
    
    navigate('/student/certificate', { state: { score: quizScore, moduleTitle: moduleData?.title || 'Основи C#' } });
  };

  const handleTaskSwitch = (index) => {
    setActiveTaskIndex(index);
    setShowReference(false); // Reset reference display for the new task
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 120px)', minHeight: '550px' }}>
      
      {/* Left panel: Task Description and Navigation */}
      <div className="glass-panel" style={{ width: '380px', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '1rem', padding: 0, alignSelf: 'flex-start' }} onClick={() => navigate('/student')}>
          <ArrowLeft size={18} /> Назад до Roadmap
        </button>
        
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          {moduleData.title}
        </span>

        {/* Task Steps Indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '8px' }}>
          {tasks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => handleTaskSwitch(idx)}
              className="btn"
              style={{
                flex: 1,
                padding: '0.5rem',
                fontSize: '0.85rem',
                background: activeTaskIndex === idx ? 'var(--primary)' : 'transparent',
                color: activeTaskIndex === idx ? 'white' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '6px'
              }}
            >
              Завдання {idx + 1}
            </button>
          ))}
        </div>

        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
          {activeTask.title}
        </h3>

        {/* Instructions Body */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '8px', flex: 1, marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            <strong>Опис:</strong> {activeTask.description}
          </p>
          <p style={{ color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Інструкції до виконання:</p>
          <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.2rem', marginBottom: 0, fontSize: '0.9rem', lineHeight: '1.6' }}>
            {activeTask.instructions?.map((inst, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>{inst}</li>
            ))}
          </ul>
        </div>

        {/* Reference Solution: Shown for every 2nd task (index % 2 === 1) */}
        {activeTaskIndex % 2 === 1 && activeTask.referenceCode && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              className="btn" 
              style={{ 
                width: '100%', 
                background: showReference ? 'var(--bg-elevated)' : 'rgba(76, 201, 240, 0.1)', 
                color: 'var(--success)',
                border: '1px solid var(--success)',
                fontSize: '0.9rem'
              }}
              onClick={() => setShowReference(!showReference)}
            >
              <Eye size={16} />
              {showReference ? 'Приховати підказку' : 'Показати зразок коду 💡'}
            </button>
            
            {showReference && (
              <div className="glass-panel animate-fade-in" style={{ marginTop: '1rem', padding: '1rem', background: '#0a080f', border: '1px solid var(--success)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}><strong>Зразок правильного коду:</strong></p>
                <textarea 
                  readOnly
                  value={activeTask.referenceCode}
                  style={{ 
                    width: '100%', height: '200px', background: '#050407', color: '#a69bb8', 
                    border: 'none', padding: '0.5rem', fontFamily: 'Consolas, monospace', fontSize: '13px',
                    outline: 'none', resize: 'none', lineHeight: '1.4'
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Task Steps Navigation Footer */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
          {activeTaskIndex > 0 ? (
            <button className="btn btn-secondary" style={{ flex: 1, padding: '0.8rem' }} onClick={() => handleTaskSwitch(activeTaskIndex - 1)}>
              <ChevronLeft size={18} /> Назад
            </button>
          ) : (
            <div style={{ flex: 1 }}></div>
          )}

          {activeTaskIndex < tasks.length - 1 ? (
            <button className="btn btn-primary" style={{ flex: 1, padding: '0.8rem' }} onClick={() => handleTaskSwitch(activeTaskIndex + 1)}>
              Далі <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn btn-primary" style={{ flex: 1, padding: '0.8rem', background: 'linear-gradient(135deg, var(--success), var(--primary))', boxShadow: 'none' }} onClick={handleFinishTest}>
              <Check size={18} /> Завершити
            </button>
          )}
        </div>

      </div>

      {/* Right panel: Editor and Console */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Editor Wrapper */}
        <div className="glass-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.8rem 1.5rem', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Program.cs</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleRunCode} disabled={isRunning} style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                <Play size={16} />
                {isRunning ? 'Запуск...' : 'Запустити (F5)'}
              </button>
            </div>
          </div>
          
          <textarea 
            value={codes[activeTask.id] || ""}
            onChange={(e) => handleCodeChange(e.target.value)}
            style={{ 
              flex: 1, width: '100%', background: '#0F0C16', color: '#E0E0E0', 
              border: 'none', padding: '1.2rem', fontFamily: 'Consolas, monospace', fontSize: '15px',
              outline: 'none', resize: 'none', lineHeight: '1.5'
            }}
            spellCheck="false"
          />
        </div>

        {/* Console / Output */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '0.5rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Вивід компілятора
          </div>
          <div style={{ padding: '1rem 1.5rem', flex: 1, background: '#0a080f', fontFamily: 'Consolas, monospace', color: isRunning ? 'var(--text-muted)' : 'var(--success)', whiteSpace: 'pre-wrap', overflowY: 'auto', fontSize: '14px', lineHeight: '1.4' }}>
            {outputs[activeTask.id] || ""}
          </div>
        </div>

      </div>
    </div>
  );
}
