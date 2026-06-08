import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, Code, Menu, X } from 'lucide-react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userData } = useAuth();
  
  const displayName = userData?.firstName 
    ? `${userData.firstName}` 
    : (isAdmin ? 'Викладач' : 'Студент');
    
  const avatarLetter = userData?.firstName 
    ? userData.firstName.charAt(0).toUpperCase() 
    : (isAdmin ? 'В' : 'С');

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = isAdmin ? [
    { name: 'Дашборд', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Студенти', path: '/admin/students', icon: <Users size={20} /> },
    { name: 'Тести', path: '/admin/tests', icon: <BookOpen size={20} /> },
    { name: 'Налаштування', path: '/admin/settings', icon: <Settings size={20} /> },
  ] : [
    { name: 'Roadmap', path: '/student', icon: <LayoutDashboard size={20} /> },
    { name: 'IDE', path: '/student/ide', icon: <Code size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="sidebar-header" style={{ cursor: 'pointer' }}>
            <Code size={28} />
            <span>Helper C#</span>
          </div>
        </Link>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          <div style={{ flexGrow: 1 }} />
          <div onClick={handleLogout} className="nav-item" style={{ marginTop: 'auto', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Вийти</span>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="glass-panel" style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', borderRadius: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }}
          >
            <Menu size={24} />
          </button>

          <div style={{ flexGrow: 1 }} className="header-spacer" />

          <Link to={isAdmin ? "/admin/settings" : "/student/profile"} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {displayName}
              </span>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>
                {avatarLetter}
              </div>
            </div>
          </Link>
        </header>
        <div className="content-wrapper animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
