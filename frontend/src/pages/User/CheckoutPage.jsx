// src/components/CheckoutPage.js
import React from 'react';
import CheckoutForm from './CheckoutForm';

const mockAppointment = {
    id: "appt_123",
    patientName: "Trần Văn C",
    doctorName: "BS. Lê Thị D",
    specialty: "Khoa Da liễu",
    fee: 100,
};

const CheckoutPage = () => {
    return (
        <div className="checkout-container">
            <h2>Thanh toán phí khám bệnh</h2>
            <div className="appointment-summary">
                <p><strong>Bệnh nhân:</strong> {mockAppointment.patientName}</p>
                <p><strong>Bác sĩ:</strong> {mockAppointment.doctorName}</p>
                <p><strong>Chuyên khoa:</strong> {mockAppointment.specialty}</p>
                <hr />
                <p className="total-fee">
                    <strong>Tổng cộng:</strong> <span>{mockAppointment.fee.toLocaleString('vi-VN')} VNĐ</span>
                </p>
            </div>
            <CheckoutForm amount={mockAppointment.fee} />
        </div>
    );
};

export default CheckoutPage;
