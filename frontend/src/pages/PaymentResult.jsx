import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const orderCode = searchParams.get('orderCode');
  const [status, setStatus] = useState('loading');
  const [paymentUrl, setPaymentUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderCode) return;
    // Kiểm tra trạng thái thanh toán từ backend
    axios.get(`http://localhost:2000/api/payment/check-payos-status/${orderCode}`)
      .then(res => {
        if (res.data.payOsStatus === 'PAID') {
          setStatus('success');
        } else {
          setStatus('pending');
          // Nếu backend trả về link thanh toán thì lưu lại
          setPaymentUrl(res.data.paymentUrl || '');
        }
      })
      .catch(() => setStatus('error'));
  }, [orderCode]);

  if (status === 'loading') return <div>Đang kiểm tra trạng thái thanh toán...</div>;
  if (status === 'error') return <div>Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại.</div>;
  if (status === 'success') return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h2 style={{color: 'green'}}>Thanh toán thành công!</h2>
      <p>Bạn đã đặt lịch và thanh toán phí khám thành công. Vui lòng kiểm tra email để nhận xác nhận.</p>
      <button onClick={() => navigate('/')}>Quay về trang chủ</button>
    </div>
  );
  // status === 'pending'
  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h2 style={{color: 'orange'}}>Chưa thanh toán</h2>
      <p>Bạn chưa hoàn tất thanh toán phí khám. Vui lòng nhấn nút bên dưới để thanh toán.</p>
      <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
        <button style={{padding: '10px 24px', fontSize: 18, background: '#007bff', color: '#fff', border: 'none', borderRadius: 6}}>Thanh toán ngay</button>
      </a>
    </div>
  );
};

export default PaymentResult; 