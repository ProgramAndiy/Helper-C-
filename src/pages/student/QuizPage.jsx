import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, X, Award, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { courseModules } from '../../data/courseData';

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userData, setUserData } = useAuth();
  
  const moduleInfo = location.state?.module || { title: 'Модуль', desc: 'Тест', id: 1 };
  
  // Find full module from data (fallback if Firestore hasn't fully loaded the module list)
  const [moduleData, setModuleData] = useState(() => {
    return courseModules.find(m => m.id === moduleInfo.id) || courseModules[0];
  });

  const quizzes = moduleData.quizzes || [];
  
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]); // [{ questionId, selectedOption, isCorrect }]
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittingDb, setIsSubmittingDb] = useState(false);

  const activeQuiz = quizzes[currentQuizIndex] || { question: 'Питання відсутнє', options: [], correctAnswerIndex: 0, id: 'empty' };

  const handleOptionSelect = (optionIndex) => {
    if (isSubmitted) return; // Block changes after submit
    setSelectedOption(optionIndex);
  };

  const handleNext = async () => {
    if (selectedOption === null) return;

    // Record answer
    const isCorrect = selectedOption === activeQuiz.correctAnswerIndex;
    const newAnswer = {
      questionId: activeQuiz.id || `q_${currentQuizIndex}`,
      questionText: activeQuiz.question,
      selectedOption: activeQuiz.options[selectedOption],
      correctOption: activeQuiz.options[activeQuiz.correctAnswerIndex],
      isCorrect
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedOption(null);
    } else {
      // Calculate final score
      const correctCount = updatedAnswers.filter(a => a.isCorrect).length;
      const scorePercent = quizzes.length > 0 
        ? Math.round((correctCount / quizzes.length) * 100) 
        : 100;

      setIsSubmitted(true);
      setIsSubmittingDb(true);

      // Save to database
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const currentAttempts = userData?.quizAttempts || {};
          
          const updatedAttempts = {
            ...currentAttempts,
            [`module_${moduleData.id}`]: {
              score: scorePercent,
              answers: updatedAnswers,
              takenAt: new Date().toISOString()
            }
          };

          const updatedData = {
            ...userData,
            uid: currentUser.uid,
            email: currentUser.email || '',
            quizAttempts: updatedAttempts,
            role: userData?.role || 'student'
          };

          await setDoc(userDocRef, updatedData);
          setUserData(updatedData); // Sync context
        } catch (error) {
          console.error("Error saving quiz score to Firestore:", error);
        } finally {
          setIsSubmittingDb(false);
        }
      } else {
        setIsSubmittingDb(false);
      }
    }
  };

  const handleFinishQuiz = () => {
    // Navigate to C# IDE page to perform the practice task
    navigate('/student/ide', { state: { module: moduleData } });
  };

  const currentProgress = quizzes.length > 0 
    ? Math.round(((currentQuizIndex + (selectedOption !== null ? 1 : 0)) / quizzes.length) * 100)
    : 0;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {/* Header Navigation */}
      <button 
        className="btn" 
        style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '1.5rem', padding: 0 }} 
        onClick={() => navigate('/student')}
        disabled={isSubmittingDb}
      >
        <ArrowLeft size={18} /> Скасувати та повернутися
      </button>

      {/* Module Title info */}
      <div style={{ marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {moduleData.title}
        </span>
        <h2 style={{ fontSize: '2rem', marginTop: '0.3rem', color: 'var(--text-primary)' }}>
          Вхідне тестування модуля
        </h2>
      </div>

      {!isSubmitted ? (
        /* Active Quiz Screen */
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              <span>Запитання {currentQuizIndex + 1} з {quizzes.length}</span>
              <span>{currentProgress}% заповнено</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${currentProgress}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>

          {/* Question Text */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(138,43,226,0.1)', color: 'var(--primary)', padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpCircle size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.35rem', lineHeight: '1.5', color: 'var(--text-primary)', fontWeight: '600' }}>
              {activeQuiz.question}
            </h3>
          </div>

          {/* Options List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className="btn"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '1.2rem 1.5rem',
                    fontSize: '1.05rem',
                    textAlign: 'left',
                    background: isSelected ? 'rgba(138,43,226,0.15)' : 'rgba(255,255,255,0.02)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 15px rgba(138,43,226,0.2)' : 'none'
                  }}
                >
                  <div style={{ 
                    width: '24px', height: '24px', borderRadius: '50%', 
                    border: '2px solid', borderColor: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 'bold', background: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--text-muted)', flexShrink: 0
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Next Button Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={selectedOption === null}
              style={{ padding: '0.9rem 2.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>{currentQuizIndex < quizzes.length - 1 ? 'Наступне питання' : 'Завершити тест'}</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      ) : (
        /* Result Summary Screen */
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center' }}>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(76,201,240,0.15)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Award size={48} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Тестування завершено!</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Ваш результат записано у базу даних профілю.</p>
          </div>

          {/* Score Display Card */}
          <div className="glass-panel" style={{ padding: '1.5rem 3rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Миттєвий бал:</span>
            <h4 style={{ fontSize: '3.2rem', margin: '0.2rem 0 0 0', color: 'var(--success)', fontWeight: 'bold' }}>
              {answers.filter(a => a.isCorrect).length} / {quizzes.length}
            </h4>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({Math.round((answers.filter(a => a.isCorrect).length / quizzes.length) * 100)}% правильних відповідей)
            </span>
          </div>

          {/* Detailed Question Review List */}
          <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Детальний огляд відповідей:</span>
            {answers.map((ans, idx) => (
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
                    <span>Ваша відповідь: </span>
                    <strong style={{ color: ans.isCorrect ? 'var(--success)' : 'var(--danger)' }}>{ans.selectedOption}</strong>
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

          {/* Action button to continue */}
          <button
            className="btn btn-primary"
            onClick={handleFinishQuiz}
            disabled={isSubmittingDb}
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            <span>{isSubmittingDb ? 'Збереження результатів...' : 'Перейти до практичного завдання (IDE)'}</span>
            <ArrowRight size={20} />
          </button>

        </div>
      )}

    </div>
  );
}
