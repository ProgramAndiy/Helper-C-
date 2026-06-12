import { useState } from 'react';
import { ArrowLeft, Monitor, Gamepad2, Server, History, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const articles = [
  {
    id: 'history',
    icon: <History size={24} />,
    title: 'Історія та Еволюція C#',
    content: (
      <>
        <p className="lead-text">
          C# (вимовляється як "сі-шарп") — це сучасна, об'єктно-орієнтована та типобезпечна мова програмування. Вона була розроблена компанією Microsoft наприкінці 1990-х років і офіційно представлена у 2000 році як ключова частина ініціативи .NET.
        </p>

        <div className="info-card highlight-box">
          <p>
            <strong>Цікавий факт:</strong> Головним архітектором мови став видатний інженер Андерс Гейлсберг (Anders Hejlsberg). До роботи над C#, він створив такі легендарні продукти, як Turbo Pascal та Delphi, а пізніше став творцем TypeScript. 
            Метою створення C# було поєднання обчислювальної потужності C++ з простотою розробки, притаманною Visual Basic.
          </p>
        </div>

        <h3>Еволюція мови за версіями:</h3>
        <ul className="styled-list">
          <li><strong>C# 1.0 (2002):</strong> Перша версія. Вона багато в чому була схожа на ранню Java, представила концепцію керованого коду (Managed Code) та збирача сміття (Garbage Collector).</li>
          <li><strong>C# 2.0 (2005):</strong> Революція типізації — з'явилися Generics (узагальнення), що дозволили створювати типобезпечні колекції.</li>
          <li><strong>C# 3.0 (2007):</strong> Впровадження LINQ (Language-Integrated Query) та лямбда-виразів, що назавжди змінило підхід до роботи з даними.</li>
          <li><strong>C# 5.0 (2012):</strong> Поява ключових слів <code>async/await</code> для зручного асинхронного програмування. Це рішення пізніше скопіювали JavaScript, Python та інші мови.</li>
          <li><strong>Сучасний C# (9.0 - 12.0):</strong> Microsoft щороку додає нові можливості: Records (незмінні типи), Pattern matching (потужніший switch), top-level statements для написання коду без зайвої "води".</li>
        </ul>

        <p>
          Сьогодні C# — це повністю <strong>Open Source</strong> (відкритий код) проект. Завдяки платформі .NET (яка раніше називалась .NET Core), C# є кросплатформним, тобто ваш код однаково добре працюватиме на Windows, Linux та macOS.
        </p>
      </>
    )
  },
  {
    id: 'web',
    icon: <Monitor size={24} />,
    title: 'C# у Веб-розробці (ASP.NET)',
    content: (
      <>
        <p className="lead-text">
          Сьогодні C# є абсолютним лідером у корпоративній веб-розробці завдяки екосистемі <strong>ASP.NET Core</strong>. Це один з найшвидших та найбезпечніших веб-фреймворків у світі за незалежними тестами TechEmpower.
        </p>

        <h3>Основні напрямки у Вебі:</h3>
        
        <div className="content-grid">
          <div className="grid-item">
            <h4>1. RESTful API та Мікросервіси</h4>
            <p>ASP.NET Core ідеально підходить для створення швидких та масштабованих API. Такі системи обробляють мільйони запитів на секунду. Вбудована підтримка Dependency Injection та Swagger робить розробку та тестування неймовірно зручним.</p>
          </div>
          
          <div className="grid-item">
            <h4>2. Класичні веб-сайти (MVC)</h4>
            <p>Підхід Model-View-Controller для створення сайтів із серверним рендерингом (HTML генерується на бекенді за допомогою движка Razor). Це ідеально для SEO та забезпечення максимальної швидкості першого завантаження.</p>
          </div>

          <div className="grid-item">
            <h4>3. SignalR (Реальний час)</h4>
            <p>Бібліотека для Real-time web. Вона дозволяє легко створювати чати, дашборди, що оновлюються в реальному часі, та багатокористувацькі додатки у браузері через протокол WebSockets, автоматично перемикаючись на лонг-пулінг у разі потреби.</p>
          </div>

          <div className="grid-item">
            <h4>4. Blazor WebAssembly</h4>
            <p>Це інноваційна технологія від Microsoft. Вона дозволяє писати клієнтський код (інтерфейс, який зазвичай пишуть на JavaScript) повністю на C#! Код компілюється у WebAssembly і виконується безпосередньо в браузері з нативною швидкістю.</p>
          </div>
        </div>
      </>
    )
  },
  {
    id: 'gamedev',
    icon: <Gamepad2 size={24} />,
    title: 'C# у Розробці Ігор (GameDev)',
    content: (
      <>
        <p className="lead-text">
          У світі розробки ігор C# вважається мовою номер один для інді-розробників, студій середнього розміру та мобільного геймінгу завдяки ігровому рушію <strong>Unity</strong>.
        </p>

        <div className="info-card" style={{ borderLeftColor: 'var(--accent)' }}>
          <p>
            <strong>Більше 50% усіх мобільних ігор у світі</strong> написані на Unity та C#. Серед них такі світові хіти, як <em>Hearthstone, Fall Guys, Hollow Knight, Pokemon GO, Rust, Subnautica</em> та тисячі інших.
          </p>
        </div>

        <h3>Чому Unity обирає C#?</h3>
        <ul className="styled-list">
          <li><strong>Швидкість розробки:</strong> Завдяки C# розробники можуть миттєво прототипувати ігрову логіку без постійної перекомпіляції важкого C++ коду.</li>
          <li><strong>Компонентна система (MonoBehaviour):</strong> Дозволяє гнучко налаштовувати фізику об'єктів, анімації та штучний інтелект.</li>
          <li><strong>Багата екосистема:</strong> Тисячі готових бібліотек .NET дозволяють легко підключати до ігор мережу, бази даних чи алгоритми.</li>
        </ul>

        <h3>Інші рушії на C#:</h3>
        <ul className="styled-list">
          <li><strong>Godot Engine:</strong> Сучасний відкритий ігровий рушій, який швидко набирає популярність як альтернатива Unity. Він має офіційну та першокласну підтримку C#.</li>
          <li><strong>MonoGame:</strong> Фреймворк для справжніх хардкорщиків, що дозволяє писати ігри "з нуля". Саме на ньому були створені легендарні <em>Stardew Valley</em> та <em>Terraria</em>.</li>
        </ul>
      </>
    )
  },
  {
    id: 'backend',
    icon: <Server size={24} />,
    title: 'C# у Бекенд-розробці',
    content: (
      <>
        <p className="lead-text">
          Бекенд (серверна частина, прихована від користувача) — це найсильніше середовище існування для C#. Мова домінує в Enterprise-сегменті.
        </p>

        <h3>Ключові сфери застосування:</h3>
        <ul className="styled-list">
          <li>
            <strong>Фінансові системи та Банкінг:</strong> C# обирають там, де важлива строга типізація та математична точність. Тип <code>decimal</code> у C# створений спеціально для фінансових розрахунків без втрати точності (на відміну від чисел з плаваючою комою у JavaScript).
          </li>
          <li>
            <strong>Хмарні обчислення (Cloud & Serverless):</strong> C# глибоко інтегрований з Microsoft Azure. Сервіси Azure Functions та AWS Lambda дозволяють писати "безсерверний" код, який запускається миттєво і масштабується автоматично залежно від навантаження на систему.
          </li>
          <li>
            <strong>Складні алгоритми (Data Processing):</strong> Завдяки Entity Framework Core (найпотужнішій ORM для роботи з базами даних), розробники можуть взаємодіяти з SQL та NoSQL базами за допомогою зручного об'єктно-орієнтованого підходу.
          </li>
        </ul>

        <div className="info-card">
          <p>
            <strong>Багатопотоковість:</strong> C# пропонує одні з найкращих у світі інструменти для паралелізму. Використання <code>Task Parallel Library</code> та <code>async/await</code> дозволяє одному серверу ефективно обробляти десятки тисяч з'єднань одночасно, не блокуючи ресурси процесора.
          </p>
        </div>
      </>
    )
  },
  {
    id: 'features',
    icon: <Zap size={24} />,
    title: 'Фішки та різновиди застосування',
    content: (
      <>
        <p className="lead-text">
          Сьогодні C# — це універсальна мова (General-purpose language). Знаючи лише її, ви можете написати практично будь-яку програму.
        </p>

        <h3>Незвичні сфери застосування:</h3>
        <ul className="styled-list">
          <li><strong>Мобільна розробка (.NET MAUI):</strong> Напишіть C# код один раз і отримайте нативні додатки одразу для iOS, Android, Windows та macOS.</li>
          <li><strong>Штучний інтелект (ML.NET):</strong> Тренуйте власні моделі машинного навчання для класифікації зображень чи аналізу текстів прямо на C#, без необхідності вивчати Python.</li>
          <li><strong>Інтернет речей (IoT):</strong> C# прекрасно працює на мікроконтролерах типу Raspberry Pi для керування розумним домом чи сенсорами.</li>
        </ul>

        <h3>Унікальні "Кіллер-фічі" мови:</h3>
        
        <div className="content-grid">
          <div className="grid-item">
            <h4>LINQ (Language-Integrated Query)</h4>
            <p>Дозволяє писати SQL-подібні запити прямо в коді до будь-яких колекцій. Замість довгих циклів ви пишете: <br/><code style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', display: 'inline-block', marginTop: '5px' }}>users.Where(u =&#62; u.Age &#62; 18).OrderBy(u =&#62; u.Name)</code></p>
          </div>
          
          <div className="grid-item">
            <h4>Властивості (Properties)</h4>
            <p>Елегантна заміна нескінченним методам <code>get</code> та <code>set</code> (як у Java). У C# це виглядає лаконічно: <br/><code style={{ background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', display: 'inline-block', marginTop: '5px' }}>public int Age &#123; get; set; &#125;</code></p>
          </div>

          <div className="grid-item">
            <h4>Pattern Matching</h4>
            <p>Потужні конструкції <code>switch</code>, які дозволяють легко та елегантно перевіряти типи об'єктів та їхні властивості в одному короткому виразі.</p>
          </div>

          <div className="grid-item">
            <h4>Безпека від Null</h4>
            <p>Увімкнена функція <em>Nullable Reference Types</em> змушує компілятор C# попереджати вас про можливі порожні значення (null), запобігаючи падінню програми.</p>
          </div>
        </div>
      </>
    )
  }
];

export default function TheoryLibrary() {
  const navigate = useNavigate();
  const [activeArticleId, setActiveArticleId] = useState(articles[0].id);

  const activeArticle = articles.find(a => a.id === activeArticleId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      <header className="dashboard-header" style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '2rem', background: 'rgba(15, 12, 22, 0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Назад
        </button>
        <h2 style={{ margin: 0, color: 'var(--primary)' }}>Бібліотека C#</h2>
      </header>

      <div className="theory-container">
        {/* Sidebar */}
        <div className="theory-sidebar">
          {articles.map(article => (
            <div 
              key={article.id}
              onClick={() => setActiveArticleId(article.id)}
              style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: activeArticleId === article.id ? 'rgba(138,43,226,0.15)' : 'transparent',
                color: activeArticleId === article.id ? 'var(--primary)' : 'var(--text-secondary)',
                borderLeft: activeArticleId === article.id ? '4px solid var(--primary)' : '4px solid transparent',
                transition: 'all 0.2s ease-in-out'
              }}
              className="hover-highlight"
            >
              {article.icon}
              <span style={{ fontWeight: activeArticleId === article.id ? 'bold' : 'normal', fontSize: '1.1rem' }}>{article.title}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="theory-content">
          <div className="animate-fade-in article-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', color: 'var(--primary)' }}>
              {activeArticle.icon}
              <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '2.5rem' }}>{activeArticle.title}</h1>
            </div>
            
            <div className="article-content">
              {activeArticle.content}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .article-content {
          color: var(--text-secondary);
          line-height: 1.8;
          font-size: 1.15rem;
        }
        .article-content h3 {
          color: var(--text-primary);
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 0.5rem;
        }
        .article-content p {
          margin-bottom: 1.2rem;
        }
        .lead-text {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 2rem !important;
        }
        .info-card {
          background: rgba(138, 43, 226, 0.08);
          border-left: 4px solid var(--primary);
          padding: 1.5rem;
          border-radius: 4px;
          margin: 2rem 0;
        }
        .info-card p {
          margin: 0;
          color: var(--text-primary);
        }
        .styled-list {
          list-style-type: none;
          padding-left: 0;
        }
        .styled-list li {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          position: relative;
        }
        .styled-list li::before {
          content: '•';
          color: var(--primary);
          font-weight: bold;
          font-size: 1.5rem;
          position: absolute;
          left: 0;
          top: -4px;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .grid-item {
          background: rgba(255,255,255,0.03);
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .grid-item h4 {
          color: var(--primary);
          margin-top: 0;
          margin-bottom: 0.8rem;
          font-size: 1.2rem;
        }
        .grid-item p {
          margin: 0;
          font-size: 1.05rem;
        }
        .hover-highlight:hover {
          background: rgba(138, 43, 226, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
