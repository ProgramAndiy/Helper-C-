import { Code, BookOpen, Cpu, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header (Fixed) */}
      <header className="landing-header">
        <div className="landing-logo" onClick={() => navigate('/')}>
          <Code size={32} />
          <h1>Helper C#</h1>
        </div>
        <nav className="landing-nav">
          <button className="btn nav-link" onClick={() => navigate('/about')}>Про нас</button>
          <button className="btn nav-link" onClick={() => navigate('/theory')}>Бібліотека C#</button>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Увійти</button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <div className="animate-fade-in hero-container">
          <h1 className="hero-title">
            Сучасна платформа для вивчення C#
          </h1>
          <p className="hero-subtitle">
            Пройдіть шлях від основ синтаксису до просунутої розробки веб-сервісів та ігор. Пишіть код безпосередньо в браузері за допомогою нашого інтелектуального IDE та отримуйте зворотний зв'язок від викладачів.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary hero-btn" onClick={() => navigate('/login')}>
              Почати навчання
              <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary hero-btn" onClick={() => navigate('/theory')}>
              Дізнатися більше про C#
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px', marginTop: '5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
            <BookOpen size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>Веб-розробка</h3>
            <p style={{ color: 'var(--text-muted)' }}>C# є лідером у вебі завдяки ASP.NET Core. Від блискавичних мікросервісів та REST API до інтерактивних клієнтів на Blazor WebAssembly.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
            <Cpu size={32} color="var(--accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>Розробка Ігор</h3>
            <p style={{ color: 'var(--text-muted)' }}>Мова номер один для Unity. Понад 50% мобільних інді-ігор та ААА-проєктів написані саме на C#, керуючи фізикою та ШІ.</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'left' }}>
            <Award size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '1rem' }}>Потужний Бекенд</h3>
            <p style={{ color: 'var(--text-muted)' }}>Enterprise-системи, фінансові процесинги та хмарні функції (Azure Functions). C# створений для надійних, високонавантажених архітектур.</p>
          </div>
        </div>
        
        {/* Info Section */}
        <div style={{ marginTop: '5rem', maxWidth: '800px', textAlign: 'left', background: 'rgba(255,255,255,0.03)', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Що таке Helper C#?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
            Helper C# — це комплексна платформа для студентів та викладачів. Замість сухої теорії ви отримуєте інтерактивний Roadmap, розбитий на логічні модулі. Ви читаєте лекції від реальних викладачів, а потім одразу переходите до практики у вбудованому компіляторі, який працює прямо в браузері.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            Пройшовши всі модулі на 100 балів, ви отримуєте офіційний сертифікат платформи, який підтверджує ваші навички. 
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        padding: '2.5rem 2rem', 
        textAlign: 'center', 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
        background: 'rgba(15, 12, 22, 0.6)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <p style={{ margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          <span>© {new Date().getFullYear()} Helper C#.</span>
          <span>Розроблено</span>
          <strong style={{ color: 'var(--primary)' }}>TUZ</strong>.
          <span>Всі права захищені.</span>
        </p>
      </footer>
    </div>
  );
}
