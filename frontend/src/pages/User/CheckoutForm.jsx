// src/components/CheckoutForm.js
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createMockPaymentIntent } from '../../services/mockStripeService';

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': { color: '#aab7c4' },
        },
        invalid: { color: '#9e2146' },
    },
};

const CheckoutForm = ({ amount }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        // 1. Gọi mock service tạo PaymentIntent
        const response = await createMockPaymentIntent({ amount });
        const clientSecret = response.data.clientSecret;

        // 2. Giả lập xác nhận thanh toán
        console.log('[MOCK] Stripe xác nhận thanh toán thành công!');
        await new Promise(resolve => setTimeout(resolve, 2000)); // delay giả

        const mockStripeResult = {
            paymentIntent: {
                id: 'pi_12345',
                status: 'succeeded',
            },
        };

        setPaymentStatus(mockStripeResult.paymentIntent.status);
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h4>Nhập thông tin thanh toán</h4>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <CardElement options={cardElementOptions} />
            </div>
            <button
                disabled={isProcessing || !stripe}
                style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '16px' }}
            >
                {isProcessing ? "Đang xử lý..." : `Thanh toán ${amount.toLocaleString('vi-VN')} VNĐ`}
            </button>

            {paymentStatus === 'succeeded' && (
                <p style={{ color: 'green', textAlign: 'center' }}>✅ Thanh toán thành công!</p>
            )}
            {paymentStatus === 'failed' && (
                <p style={{ color: 'red', textAlign: 'center' }}>❌ Thanh toán thất bại.</p>
            )}
        </form>
    );
};

export default CheckoutForm;
