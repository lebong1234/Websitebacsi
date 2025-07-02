// src/services/aiService.js
import axios from 'axios';

const API_KEY = "AIzaSyAFjiDchLUGIDe6jvEyxkUhDOgWfJnIm54";

// THÊM DÒNG NÀY ĐỂ KIỂM TRA
console.log("My API Key is:", API_KEY);
// THÊM DÒNG NÀY ĐỂ KIỂM TRA
console.log("Null");
// Lưu ý: Gemini 2.0 chưa public, chúng ta sẽ dùng model 1.5 Flash hoặc 1.5 Pro
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Hàm này sẽ nhận triệu chứng từ người dùng và yêu cầu AI trả về tên chuyên khoa
export const getSpecialtyFromAI = async (symptoms, availableSpecialties) => {
  // availableSpecialties là một mảng các tên chuyên khoa, ví dụ: ["Nội tiêu hóa", "Tim mạch", ...]
  const specialtyListString = availableSpecialties.join(', ');

  // Đây là "Prompt" - câu lệnh chúng ta gửi cho AI. Rất quan trọng!
  const prompt = `Dựa trên triệu chứng của người dùng: "${symptoms}", hãy chọn một chuyên khoa y tế phù hợp nhất từ danh sách sau: [${specialtyListString}]. Chỉ trả về DUY NHẤT tên của chuyên khoa đó, không giải thích gì thêm. Ví dụ: Nội tiêu hóa`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    // Cấu hình để AI trả lời chính xác hơn, ít sáng tạo
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 50,
    }
  };

  try {
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Bóc tách dữ liệu từ response của Gemini
    const aiResponseText = response.data.candidates[0].content.parts[0].text;
    return aiResponseText.trim(); // Trả về tên chuyên khoa, ví dụ: "Nội tiêu hóa"

  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    throw new Error("Không thể kết nối đến dịch vụ AI.");
  }
};