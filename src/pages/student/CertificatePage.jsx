import { Award, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function CertificatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const score = location.state?.score || 100;
  const { userData } = useAuth();
  
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
      
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }} className="no-print">
        <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: 0 }} onClick={() => navigate('/student')}>
          <ArrowLeft size={20} /> Повернутися до Roadmap
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={18} /> Роздрукувати сертифікат
        </button>
      </div>

      {/* Certificate Frame */}
      <div id="certificate" style={{
        background: '#fff',
        color: '#111',
        width: '100%',
        maxWidth: '900px',
        aspectRatio: '1.414', // A4 Landscape ratio
        padding: '3.5rem',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '15px double var(--primary)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(138, 43, 226, 0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(247, 37, 133, 0.05)', borderRadius: '50%' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Award size={60} color="var(--primary)" style={{ margin: '0' }} />
          <h1 style={{ fontSize: '2.4rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#111', margin: 0, fontFamily: 'serif', fontWeight: 'bold' }}>
            Сертифікат про проходження
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>Цим підтверджується, що</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
          <h2 style={{ fontSize: '2.5rem', borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.2rem', margin: 0, color: '#111', fontWeight: 'bold' }}>
            {studentName}
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#555', margin: 0 }}>успішно завершив(ла) навчальний курс</p>
          <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', margin: 0, fontWeight: '600' }}>
            Основи та просунуті концепції C#
          </h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'inline-block', padding: '0.6rem 1.5rem', background: 'rgba(76, 201, 240, 0.1)', borderRadius: '8px', border: '2px solid var(--success)', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#111' }}>
              Результат тестів: <span style={{ color: 'var(--success)', fontSize: '1.3rem' }}>{score}%</span> / 100%
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #333', width: '150px', marginBottom: '0.5rem' }}></div>
              <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Дата видачі</p>
              <p style={{ fontWeight: 'bold', margin: '0.2rem 0 0 0' }}>{new Date().toLocaleDateString('uk-UA')}</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #333', width: '150px', marginBottom: '0.5rem', fontFamily: 'cursive', fontSize: '1.1rem', lineHeight: '1' }}>Helper C#</div>
              <p style={{ color: '#555', fontSize: '0.85rem', margin: 0 }}>Платформа</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
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
