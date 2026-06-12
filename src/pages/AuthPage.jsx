import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Code } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getFriendlyErrorMessage = (error) => {
  const code = error.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Ця електронна адреса вже зареєстрована. Будь ласка, перейдіть на вкладку "Увійти" або скористайтеся іншою адресою.';
    case 'auth/invalid-email':
      return 'Некоректний формат електронної адреси.';
    case 'auth/weak-password':
      return 'Пароль занадто короткий. Він має містити щонайменше 6 символів.';
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'Неправильна електронна адреса або пароль.';
    case 'auth/popup-closed-by-user':
      return 'Вхід скасовано (вікно авторизації закрилося).';
    case 'auth/operation-not-allowed':
      return 'Цей метод входу наразі вимкнено на сервері.';
    default:
      if (error.message && error.message.includes('auth/email-already-in-use')) {
        return 'Ця електронна адреса вже зареєстрована. Будь ласка, перейдіть на вкладку "Увійти" або скористайтеся іншою адресою.';
      }
      return error.message || 'Сталася помилка при авторизації. Спробуйте ще раз.';
  }
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupParam = searchParams.get('group');

  const [role, setRole] = useState('student');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // States for registration
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [university, setUniversity] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');
  const [group, setGroup] = useState('');
  const [teacherAccessCode, setTeacherAccessCode] = useState('');
  
  const { login, register, userData } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (userData) {
      if (userData.role === 'teacher') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/student', { replace: true });
      }
    }
  }, [userData, navigate]);

  useEffect(() => {
    if (groupParam) {
      setRole('student');
      setIsLogin(false);
      setGroup(groupParam);
    }
  }, [groupParam]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLogin) {
        const data = await login(email, password);
        if (data.user.role === 'teacher') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        await register(
          email,
          password,
          firstName,
          lastName,
          middleName,
          university,
          admissionYear,
          group,
          role === 'admin' ? 'teacher' : 'student',
          teacherAccessCode
        );
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      }
    } catch (error) {
      setErrorMsg(error.message || 'Сталася помилка при авторизації. Спробуйте ще раз.');
    }
  };


  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, var(--bg-elevated), var(--bg-primary))' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
          <Code size={48} />
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{isLogin ? 'З поверненням' : 'Створення акаунту'}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {isLogin ? 'Увійдіть до свого облікового запису' : 'Заповніть дані для реєстрації'}
        </p>

        {groupParam && !isLogin && (
          <div style={{
            background: 'rgba(138, 43, 226, 0.15)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
            color: 'var(--primary)',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            🎓 Реєстрація у групу: {groupParam}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }} onSubmit={handleLogin}>
          {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.5rem', textAlign: 'center' }}>{errorMsg}</div>}
          
          {!isLogin && (
            <>
              <div className="auth-form-row" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Прізвище</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Шевченко" 
                    required 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-label">Ім'я</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Тарас" 
                    required 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">По батькові</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Григорович" 
                  required 
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>

              {role === 'student' ? (
                <>
                  <div>
                    <label className="input-label">Навчальний заклад</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="НТУУ КПІ ім. І. Сікорського" 
                      required 
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                  </div>
                  <div className="auth-form-row" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label className="input-label">Рік вступу</label>
                      <input 
                        type="number" 
                        className="input-field" 
                        placeholder="2023" 
                        min="2000" 
                        max="2100" 
                        required 
                        value={admissionYear}
                        onChange={(e) => setAdmissionYear(e.target.value)}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="input-label">Група</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="ІП-31" 
                        required 
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        disabled={!!groupParam}
                        style={groupParam ? { opacity: 0.7, cursor: 'not-allowed', backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="input-label" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Код доступу викладача</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Введіть секретний код викладача" 
                    required 
                    value={teacherAccessCode}
                    onChange={(e) => setTeacherAccessCode(e.target.value)}
                    style={{ border: '1px solid var(--accent)' }}
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="input-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder={role === 'admin' ? 'admin@helper.com' : 'student@helper.com'} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="input-label">Пароль</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <label htmlFor="remember" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer', userSelect: 'none' }}>
              Запам'ятати мене (не виходити з акаунту)
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.8rem' }}>
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>



        {!groupParam && (
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <button 
              type="button" 
              className={`btn ${role === 'student' ? 'btn-secondary' : ''}`} 
              style={{ background: role === 'student' ? 'rgba(138,43,226,0.1)' : 'transparent', color: role === 'student' ? 'var(--primary)' : 'var(--text-muted)' }}
              onClick={() => setRole('student')}
            >
              Студент
            </button>
            <button 
              type="button" 
              className={`btn ${role === 'admin' ? 'btn-secondary' : ''}`} 
              style={{ background: role === 'admin' ? 'rgba(138,43,226,0.1)' : 'transparent', color: role === 'admin' ? 'var(--primary)' : 'var(--text-muted)' }}
              onClick={() => setRole('admin')}
            >
              Викладач
            </button>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          {isLogin ? 'Ще не маєте акаунту?' : 'Вже маєте акаунт?'}
          <button 
            className="btn" 
            style={{ background: 'transparent', padding: '0 0.5rem', color: 'var(--primary)' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Зареєструватися' : 'Увійти'}
          </button>
        </p>
      </div>
    </div>
  );
}
