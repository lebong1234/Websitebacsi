import React from 'react';

// SVG hoa sen đơn giản
const LotusSVG = () => (
  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: '0 auto' }}>
    <ellipse cx="30" cy="30" rx="18" ry="8" fill="#F7CAC9" />
    <ellipse cx="30" cy="20" rx="10" ry="5" fill="#F49AC2" />
    <ellipse cx="22" cy="25" rx="4" ry="2" fill="#B5EAD7" />
    <ellipse cx="38" cy="25" rx="4" ry="2" fill="#B5EAD7" />
    <ellipse cx="30" cy="15" rx="3" ry="1.5" fill="#FFF6B7" />
  </svg>
);

const statistics = [
  { value: '19', label: 'Bệnh viện\nvà phòng khám' },
  { value: '2900', label: 'Giường bệnh' },
  { value: '5500', label: 'Nhân viên' },
  { value: '5 triệu', label: 'Lượt thăm khám\nhàng năm' },
];

const careValues = [
  {
    letter: 'C',
    title: 'Cam kết',
    subtitle: 'về chất lượng chăm sóc',
    desc: 'Chúng tôi cam kết cung cấp dịch vụ chăm sóc chất lượng với người bệnh là trung tâm.'
  },
  {
    letter: 'A',
    title: 'Trách nhiệm',
    subtitle: 'vì sức khỏe người bệnh',
    desc: 'Chúng tôi làm chủ kết quả của hành động, xây dựng niềm tin với đồng nghiệp và người bệnh.'
  },
  {
    letter: 'R',
    title: 'Tôn trọng',
    subtitle: 'vì cộng đồng',
    desc: 'Chúng tôi luôn tôn trọng và công bằng với tất cả mọi người.'
  },
  {
    letter: 'E',
    title: 'Đồng cảm',
    subtitle: 'với người bệnh',
    desc: 'Chúng tôi luôn thấu cảm và tận tâm trong tất cả điều mình làm.'
  },
];

const HomeIntro = () => {
  return (
    <div>
      {/* Section 1: Statistics */}
      <section style={{
        background: 'linear-gradient(120deg, #b4dfe5 0%, #3f84f5ff 100%)',
        color: '#fff',
        padding: '60px 0 40px 0',
        textAlign: 'center',
        marginBottom: 40,
      }}>
        <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>
          Tập đoàn Y tế tư nhân lớn nhất Việt Nam
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 80, marginTop: 40, flexWrap: 'wrap' }}>
          {statistics.map((stat, idx) => (
            <div key={idx} style={{ minWidth: 180 }}>
              <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 8 }}>{stat.value}</div>
              <div style={{ height: 2, width: 40, background: '#fff', opacity: 0.3, margin: '0 auto 12px auto' }}></div>
              <div style={{ fontSize: 22, fontWeight: 500, whiteSpace: 'pre-line' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: CARE Values */}
      <section style={{ background: '#fff', color: '#5a88d3ff', padding: '40px 0 30px 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap', marginBottom: 30 }}>
          {careValues.map((val, idx) => (
            <div key={val.letter} style={{ minWidth: 200, maxWidth: 240 }}>
              <div style={{ position: 'relative', height: 120, marginBottom: 10, cursor: 'pointer' }}
              >
                <span
                  style={{
                    fontSize: 110,
                    fontWeight: 700,
                    color: '#3873d2ff',
                    lineHeight: 1,
                    display: 'inline-block',
                    transition: 'transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s',
                    zIndex: 2,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.18) translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(27, 88, 201, 0.25), 0 2px 8px 0 rgba(0,0,0,0.10)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {val.letter}
                </span>
                <div style={{ position: 'absolute', left: '50%', top: '60%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
                  <LotusSVG />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>{val.title}</div>
              <div style={{ fontSize: 20, fontWeight: 400, marginBottom: 10 }}>{val.subtitle}</div>
              <div style={{ color: '#555', fontSize: 17, fontWeight: 400, lineHeight: 1.5 }}>{val.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeIntro; 