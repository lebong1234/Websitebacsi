// src/components/StripePaymentPage.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutPage from './CheckoutPage';

const stripePromise = loadStripe('pk_test_1234567890abcdef'); // Thay bằng key test thật của bạn

const StripePaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    );
};

export default StripePaymentPage;
