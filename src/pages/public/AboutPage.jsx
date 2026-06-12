import { ArrowLeft, Users, Target, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '2rem', padding: 0 }} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Назад
      </button>

      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Про Helper C#</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '4rem' }}>
        Дізнайтеся більше про нашу місію та філософію створення платформи.
      </p>

      <div className="grid-2-col">
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <Target size={40} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Навіщо створено сайт?</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            Helper C# був розроблений як інноваційна екосистема для студентів та викладачів. Ми помітили, що класичне вивчення програмування часто зводиться до нудних лекцій та відірваних від реальності задач. Наша мета — об'єднати структуровану теоретичну базу (з перевіркою авторства викладачів) із зручним практичним середовищем, де код можна писати та запускати в один клік, не покидаючи платформу.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <Heart size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem' }}>Чому саме C#?</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8' }}>
            C# — це неймовірно елегантна, потужна та сучасна мова програмування. Вона поєднує в собі строгу типізацію, багату стандартну бібліотеку та гігантську екосистему .NET. C# дозволяє розробляти все: від блискавичних веб-API та складних корпоративних систем до сучасних 3D-ігор на рушії Unity. Вивчення C# формує правильне інженерне мислення, закладаючи ідеальний фундамент об'єктно-орієнтованого та асинхронного програмування.
          </p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginTop: '3rem', padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(138,43,226,0.1) 0%, rgba(32,23,50,0.8) 100%)' }}>
        <Users size={48} color="var(--success)" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ marginBottom: '1.5rem' }}>Для кого ця платформа?</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
          Для <strong>студентів</strong>, які шукають чіткий, зрозумілий Roadmap без "води" та хочуть практикуватися в інтерактивному середовищі. <br/><br/>
          Для <strong>викладачів</strong>, яким потрібен потужний інструмент моніторингу прогресу, автоматизованої перевірки знань та зручного створення авторських тестів.
        </p>
      </div>
    </div>
  );
}
