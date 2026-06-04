import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code } from 'lucide-react';
import { auth, db, googleProvider, githubProvider } from '../firebase/config';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // States for student registration
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [university, setUniversity] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');
  const [group, setGroup] = useState('');
  
  const { setUserRole } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // Role is loaded inside AuthContext.jsx onAuthStateChanged automatically.
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user role and details to Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userData = {
          uid: user.uid,
          email: user.email,
          role: role,
          createdAt: new Date().toISOString()
        };

        if (role === 'student') {
          userData.lastName = lastName;
          userData.firstName = firstName;
          userData.middleName = middleName;
          userData.university = university;
          userData.admissionYear = admissionYear;
          userData.group = group;
        }

        await setDoc(userDocRef, userData);
        setUserRole(role);
      }
      
      if (role === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let finalRole = role;

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: role,
          createdAt: new Date().toISOString()
        });
      } else {
        finalRole = userDocSnap.data().role || 'student';
      }

      setUserRole(finalRole);
      if (finalRole === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let finalRole = role;

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: role,
          createdAt: new Date().toISOString()
        });
      } else {
        finalRole = userDocSnap.data().role || 'student';
      }

      setUserRole(finalRole);
      if (finalRole === 'admin') navigate('/admin');
      else navigate('/student');
    } catch (error) {
      setErrorMsg(error.message);
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

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }} onSubmit={handleLogin}>
          {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.5rem', textAlign: 'center' }}>{errorMsg}</div>}
          
          {!isLogin && role === 'student' && (
            <>
              <div style={{ display: 'flex', gap: '1rem' }}>
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
              <div style={{ display: 'flex', gap: '1rem' }}>
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
                  />
                </div>
              </div>
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

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.8rem' }}>
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        {/* Social Auth Separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 1rem', fontSize: '0.9rem' }}>або</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        {/* Social Auth Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', background: 'white', color: 'black' }}
            onClick={handleGoogleLogin}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', background: '#24292e', color: 'white' }}
            onClick={handleGithubLogin}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="white"/>
            </svg>
            GitHub
          </button>
        </div>

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
