// src/services/mockStripeService.js
export const createMockPaymentIntent = async (paymentInfo) => {
  console.log("[MOCK API] Gửi yêu cầu tạo Payment Intent:", paymentInfo);

  await new Promise(resolve => setTimeout(resolve, 1000)); // giả lập delay

  const mockResponse = {
    success: true,
    data: {
      clientSecret: "pi_mock_123456789_secret_abcdef", // mock clientSecret
    },
    message: "Tạo Payment Intent thành công (giả lập)",
  };

  console.log("[MOCK API] Nhận được phản hồi:", mockResponse);
  return mockResponse;
};
