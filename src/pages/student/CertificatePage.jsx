import { Award, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseModules } from '../../data/courseData';

export default function CertificatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAuth();
  
  const completedModules = userData?.completedModules || [];
  const latestModuleId = completedModules.length > 0 ? completedModules[completedModules.length - 1] : null;

  const score = location.state?.score !== undefined 
    ? location.state.score 
    : (latestModuleId && userData?.quizAttempts?.[`module_${latestModuleId}`]?.score !== undefined
        ? userData.quizAttempts[`module_${latestModuleId}`].score
        : 100);

  const fallbackTitle = latestModuleId 
    ? (courseModules.find(m => m.id === latestModuleId)?.title || `Модуль ${latestModuleId}`)
    : 'Основи програмування C#';

  const moduleTitle = location.state?.moduleTitle || fallbackTitle;
  
  const studentName = userData 
    ? (userData.lastName || userData.firstName
      ? `${userData.lastName || ''} ${userData.firstName || ''} ${userData.middleName || ''}`.trim()
      : userData.email)
    : 'Студент';
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'flex-start', marginBottom: '2rem' }} className="no-print">
        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0 }} onClick={() => navigate('/student')}>
          <ArrowLeft size={20} /> Повернутися до Roadmap
        </button>
      </div>

      {/* Certificate Frame */}
      <div id="certificate" className="certificate-card">
        {/* Decorative elements */}
        <div className="cert-deco deco-top-left"></div>
        <div className="cert-deco deco-bottom-right"></div>

        <div className="cert-section gap-lg">
          <Award size={60} color="var(--primary)" style={{ margin: '0' }} className="cert-icon" />
          <h1 className="cert-title">
            Сертифікат про проходження
          </h1>
          <p className="cert-subtitle">Цим підтверджується, що</p>
        </div>
        
        <div className="cert-section gap-md">
          <h2 className="cert-name">
            {studentName}
          </h2>
          <p className="cert-subtitle">успішно завершив(ла) модуль</p>
          <h3 className="cert-module">
            {moduleTitle}
          </h3>
        </div>
        
        <div className="cert-section gap-xl">
          <div className="cert-score-box">
            <p style={{ margin: 0, fontWeight: 'bold', color: '#111' }}>
              Результат тестів: <span className="cert-score-value">{score}%</span> / 100%
            </p>
          </div>

          <div className="cert-footer">
            <div style={{ textAlign: 'center' }}>
              <div className="cert-line"></div>
              <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Дата видачі</p>
              <p style={{ fontWeight: 'bold', margin: '0.2rem 0 0 0' }}>{new Date().toLocaleDateString('uk-UA')}</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div className="cert-line cert-signature">Helper C#</div>
              <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Платформа</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .certificate-card {
          background: #fff;
          color: #111;
          width: 100%;
          max-width: 1050px;
          aspect-ratio: 1.414;
          padding: 4rem;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          border: 20px solid var(--bg-primary);
          outline: 4px solid var(--primary);
          outline-offset: -24px;
          text-align: center;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .cert-deco {
          position: absolute;
          border-radius: 50%;
        }
        .deco-top-left {
          top: -50px; left: -50px; width: 150px; height: 150px; background: rgba(138, 43, 226, 0.05);
        }
        .deco-bottom-right {
          bottom: -50px; right: -50px; width: 200px; height: 200px; background: rgba(247, 37, 133, 0.05);
        }

        .cert-section {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .gap-lg { gap: 1rem; }
        .gap-md { gap: 0.8rem; }
        .gap-xl { gap: 2rem; }

        .cert-title {
          font-size: 2.4rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #111;
          margin: 0;
          font-family: serif;
          font-weight: bold;
        }
        .cert-subtitle {
          font-size: 1.1rem;
          color: #555;
          margin: 0;
        }
        .cert-name {
          font-size: 2.5rem;
          border-bottom: 2px solid var(--primary);
          display: inline-block;
          padding-bottom: 0.2rem;
          margin: 0;
          color: #111;
          font-weight: bold;
        }
        .cert-module {
          font-size: 1.6rem;
          color: var(--primary);
          margin: 0;
          font-weight: 600;
        }
        .cert-score-box {
          display: inline-block;
          padding: 0.6rem 1.5rem;
          background: rgba(76, 201, 240, 0.1);
          border-radius: 8px;
          border: 2px solid var(--success);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .cert-score-value {
          color: var(--success);
          font-size: 1.3rem;
        }
        .cert-footer {
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 0 2rem;
        }
        .cert-line {
          border-bottom: 1px solid #333;
          width: 150px;
          margin-bottom: 0.5rem;
        }
        .cert-signature {
          font-family: cursive;
          font-size: 1.1rem;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .certificate-card {
            padding: 1.5rem;
            border-width: 10px;
            outline-offset: -12px;
            aspect-ratio: auto;
            min-height: 500px;
            border-radius: 8px;
          }
          .cert-icon { width: 40px; height: 40px; }
          .cert-title { font-size: 1.5rem; letter-spacing: 1px; }
          .cert-subtitle { font-size: 0.9rem; }
          .cert-name { font-size: 1.6rem; }
          .cert-module { font-size: 1.2rem; }
          .gap-lg { gap: 0.5rem; }
          .gap-md { gap: 0.5rem; }
          .gap-xl { gap: 1.5rem; }
          .cert-score-box { padding: 0.4rem 1rem; }
          .cert-score-value { font-size: 1.1rem; }
          .cert-footer { padding: 0; flex-direction: column; gap: 1.5rem; align-items: center; }
          .cert-line { width: 120px; }
        }

        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: #fff;
          }
          body * {
            visibility: hidden;
          }
          #certificate, #certificate * {
            visibility: visible;
          }
          #certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            box-sizing: border-box;
            border: 20px double var(--primary) !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 4rem !important;
            border-radius: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            aspect-ratio: auto !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
