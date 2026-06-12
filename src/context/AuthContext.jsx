import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Генерирує заголовки авторизації для HTTP-запитів до API.
  // Додає JWT токен у форматі 'Bearer <token>' до заголовку Authorization, якщо токен є в сховищі.
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  // При завантаженні застосунку перевіряємо наявність JWT токену в локальному сховищі.
  // Якщо токен знайдено, надсилаємо запит до бекенду (/api/auth/me) для перевірки його валідності та завантаження профілю.
  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser({ email: data.email, uid: data.id });
            setUserData(data);
            setUserRole(data.role);
          } else {
            // Token invalid or expired
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error("Error loading user profile on startup:", error);
        }
      }
      setLoading(false);
    };

    loadCurrentUser();
  }, []);

  // Авторизація користувача на C# бекенд-сервері та збереження отриманого JWT токена в localStorage.
  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Невірний email або пароль');
    }
    
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setCurrentUser({ email: data.user.email, uid: data.user.id });
    setUserData(data.user);
    setUserRole(data.user.role);
    return data;
  };

  const register = async (email, password, firstName, lastName, middleName, university, admissionYear, group, role, teacherAccessCode) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password, 
        firstName, 
        lastName, 
        middleName, 
        university, 
        admissionYear: admissionYear ? parseInt(admissionYear) : null, 
        group,
        role,
        teacherAccessCode
      })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Помилка при реєстрації');
    }
    
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setCurrentUser({ email: data.user.email, uid: data.user.id });
    setUserData(data.user);
    setUserRole(data.user.role);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setUserData(null);
    setUserRole(null);
  };

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/auth/update-profile', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Не вдалося оновити профіль');
    }

    const data = await res.json();
    setUserData(data);
    return data;
  };

  const value = {
    currentUser,
    userRole,
    setUserRole,
    userData,
    setUserData,
    loading,
    login,
    register,
    logout,
    updateProfile,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
