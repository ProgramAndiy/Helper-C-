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
      
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }} className="no-print">
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
        maxWidth: '800px',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        border: '15px solid var(--primary)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'rgba(138, 43, 226, 0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(247, 37, 133, 0.1)', borderRadius: '50%' }}></div>

        <Award size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
        
        <h1 style={{ fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--bg-primary)', marginBottom: '1rem', fontFamily: 'serif' }}>
          Сертифікат про проходження
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>Цим підтверджується, що</p>
        
        <h2 style={{ fontSize: '2.5rem', borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
          {studentName}
        </h2>
        
        <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '1rem' }}>успішно завершив(ла) навчальний курс</p>
        
        <h3 style={{ fontSize: '1.8rem', color: 'var(--bg-primary)', marginBottom: '2rem' }}>
          Основи та просунуті концепції C#
        </h3>
        
        <div style={{ display: 'inline-block', padding: '1rem 2rem', background: 'rgba(76, 201, 240, 0.1)', borderRadius: '8px', border: '2px solid var(--success)' }}>
          <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--bg-primary)' }}>
            Результат тестів: <span style={{ color: 'var(--success)', fontSize: '1.5rem' }}>{score}%</span> / 100%
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem', padding: '0 2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #333', width: '150px', marginBottom: '0.5rem' }}></div>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Дата видачі</p>
            <p style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString('uk-UA')}</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '1px solid #333', width: '150px', marginBottom: '0.5rem', fontFamily: 'cursive', fontSize: '1.2rem', lineHeight: '1' }}>Helper C#</div>
            <p style={{ color: '#555', fontSize: '0.9rem' }}>Платформа</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #certificate, #certificate * { visibility: visible; }
          #certificate { position: absolute; left: 0; top: 0; border: none; box-shadow: none; width: 100%; height: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
