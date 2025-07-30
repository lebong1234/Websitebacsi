// src/pages/User/Login.jsx (Hoặc đường dẫn file Login của bạn)
import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars, FaFacebookF, FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { registerUser, loginUser } from '../../services/UserService'; // Service cho đăng nhập/đăng ký thường
import { GoogleAuthService } from '../../services/GoogleAuthService';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // Đảm bảo đã cài đặt: npm install jwt-decode

// THAY THẾ BẰNG GOOGLE CLIENT ID THỰC TẾ CỦA BẠN
// Đảm bảo đã thêm http://localhost:5173 vào Authorized JavaScript origins trong Google Console
// Nếu gặp lỗi 403, hãy kiểm tra cấu hình OAuth trong Google Cloud Console
const GOOGLE_CLIENT_ID = "1036533988820-ii0k3nhfc17j7i797auih5v0k8u7es85.apps.googleusercontent.com";

const LoginContent = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Cho đăng nhập/đăng ký thường
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Riêng cho Google login
  const [formKey, setFormKey] = useState(0); // Để reset hiệu ứng form

  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');

  // State cho form đăng ký
  const [firstname, setFirstname] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Được tạo từ firstname và lastName
  const [confirmPassword, setConfirmPassword] = useState('');

  // State cho form đăng nhập
  const [loginemail, setLoginEmail] = useState('');
  const [loginpassword, setLoginPassword] = useState('');

  useEffect(() => {
    if (birthday) {
      const birthYear = new Date(birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      setAge(currentYear - birthYear);
    } else {
      setAge(null);
    }
  }, [birthday]);

  useEffect(() => {
    setName(`${firstname} ${lastName}`.trim());
  }, [firstname, lastName]);

  useEffect(() => {
    // Xóa thông báo lỗi khi chuyển tab
    setLoginError('');
    setSignupError('');
  }, [isSignIn]);

  const handleLogin = async () => {
    setLoginError('');
    if (!loginemail || !loginpassword) {
      setLoginError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    setIsLoading(true);
    const loginDto = { Email: loginemail, Password: loginpassword };
    try {
      const response = await loginUser(loginDto);
      console.log('Phản hồi đăng nhập thường:', response);
      // Giả sử backend thiết lập HttpOnly cookie cho session và client không cần làm gì thêm với token
      alert('Đăng nhập thành công!'); // Hoặc thông báo từ response.message
      window.location.href = '/'; // Chuyển hướng đến trang chủ
    } catch (error) {
      console.error('Lỗi khi đăng nhập thường:', error);
      setLoginError("Đăng nhập thất bại: " + (error.message || "Vui lòng kiểm tra lại thông tin."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setSignupError('');
    const currentName = `${firstname} ${lastName}`.trim();
    if (!currentName || !email || !password) {
      setSignupError("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }
    if (password !== confirmPassword) {
      setSignupError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setIsLoading(true);
    const genderMap = { male: 0, female: 1, other: 2 };
    const genderNumber = genderMap[gender.toLowerCase()] ?? null;
    let dateOfBirth = birthday ? new Date(birthday) : null;
    const registerDto = {
      Name: currentName,
      Email: email,
      Phone: phone,
      Age: age,
      Gender: genderNumber,
      Password: password,
      Address: "",
      DateOfBirth: dateOfBirth,
    };
    try {
      const response = await registerUser(registerDto);
      console.log('Phản hồi đăng ký:', response);
      if (response && (response.message?.toLowerCase().includes("thành công") || response.user)) {
        setIsSignIn(true);
        setLoginEmail(email);
        setLoginError('Đăng ký thành công! Vui lòng đăng nhập.');
        setFirstname(''); setLastName(''); setEmail(''); setPhone(''); setBirthday(''); setGender(''); setPassword(''); setConfirmPassword('');
      } else {
        setSignupError("Đăng ký thất bại: " + (response?.message || "Vui lòng thử lại sau."));
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      setSignupError("Có lỗi xảy ra khi đăng ký: " + (error.message || "Không xác định"));
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi đăng nhập Google thành công (nhận ID Token)
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setIsGoogleLoading(true);
    setLoginError(''); // Xóa lỗi cũ (nếu có)
    console.log('Google credentialResponse (ID Token JWT):', credentialResponse);

    if (!credentialResponse.credential) {
      console.error('Không nhận được credential (ID Token) từ Google.');
      setLoginError('Đăng nhập Google thất bại: Không có thông tin xác thực từ Google.');
      setIsGoogleLoading(false);
      return;
    }

    try {
      const idToken = credentialResponse.credential;
      const decodedToken = jwtDecode(idToken); // Giải mã ID Token
      console.log('Thông tin người dùng đã giải mã từ ID Token:', decodedToken);

      // Chuẩn bị dữ liệu gửi lên backend
      const googleUserData = {
        GoogleId: decodedToken.sub,    // 'sub' (subject) là Google User ID
        Email: decodedToken.email,
        Name: decodedToken.name,
        // Picture: decodedToken.picture, // Gửi ảnh nếu backend của bạn xử lý
      };

      // Gọi service để gửi thông tin đến backend
      const backendResponse = await GoogleAuthService.processGoogleSignIn(googleUserData);
      console.log('Phản hồi từ backend sau khi xử lý Google Sign-In:', backendResponse);

      // Backend của bạn trả về: { message: "...", id: "...", name: "...", email: "..." }
      if (backendResponse && backendResponse.id) { // Kiểm tra có ID người dùng trả về không
        alert(backendResponse.message || 'Đăng nhập bằng Google thành công!');

        // Lưu thông tin người dùng vào localStorage
        const userToStore = {
          id: backendResponse.id,
          name: backendResponse.name,
          email: backendResponse.email,
          loginMethod: 'google', // Để biết đã đăng nhập bằng Google
          // role: backendResponse.role, // Nếu backend trả về vai trò
        };
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        console.log('Đã lưu thông tin người dùng vào localStorage:', userToStore);

        // Chuyển hướng người dùng (ví dụ: đến trang chủ)
        window.location.href = '/';
      } else {
        // Xử lý trường hợp backend không trả về thông tin user như mong đợi
        setLoginError(backendResponse.message || 'Đăng nhập Google không thành công từ phía server. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi trong quá trình xử lý đăng nhập Google:', error);
      // error có thể là từ GoogleAuthService (đã được xử lý) hoặc lỗi khác
      const errorMessage = error.message || 'Đăng nhập Google thất bại. Đã có lỗi xảy ra.';
      setLoginError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Xử lý khi đăng nhập Google thất bại từ phía Google
  const handleGoogleLoginError = (errorResponse) => {
    console.error('Lỗi đăng nhập Google từ phía Google:', errorResponse);
    let message = 'Đăng nhập với Google thất bại. Vui lòng thử lại.';

    // Kiểm tra lỗi origin không được phép
    if (errorResponse && errorResponse.error === 'origin_mismatch') {
      message = 'Lỗi cấu hình Google OAuth: Origin không được phép. Vui lòng liên hệ admin để cấu hình.';
    } else if (errorResponse && errorResponse.type === 'popup_closed') {
      message = 'Bạn đã đóng cửa sổ đăng nhập Google.';
    } else if (errorResponse && errorResponse.error) {
      // Các lỗi chuẩn từ Google OAuth
      message = `Lỗi từ Google: ${errorResponse.error_description || errorResponse.error}`;
    }
    setLoginError(message);
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2">
      <div className={`w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 transform ${isLoading || isGoogleLoading ? 'opacity-70' : 'opacity-100'}`}>
        {/* Phần Form Bên Trái */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Docmed</h1>
          </div>

          <div className="flex mb-8">
            <button
              onClick={() => { setIsSignIn(true); setFormKey(prev => prev + 1); }}
              disabled={isLoading || isGoogleLoading}
              className={`flex-1 py-3 font-medium transition-all duration-200 ${isSignIn ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => { setIsSignIn(false); setFormKey(prev => prev + 1); }}
              disabled={isLoading || isGoogleLoading}
              className={`flex-1 py-3 font-medium transition-all duration-200 ${!isSignIn ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đăng Ký
            </button>
          </div>

          <div className="relative overflow-hidden min-h-[500px]"> {/* Tăng chiều cao nếu cần */}
            {/* Form Đăng Nhập */}
            <div
              key={`signin-${formKey}`}
              className={`transition-all duration-500 ease-in-out ${isSignIn ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 absolute inset-0 pointer-events-none'}`}
            >
              {isSignIn && (
                <div className="space-y-4">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" value={loginemail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" disabled={isLoading || isGoogleLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="password" value={loginpassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Mật khẩu" disabled={isLoading || isGoogleLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center"><input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" /> <span className="ml-2 text-sm text-gray-600">Ghi nhớ</span></label>
                    <button disabled={isLoading || isGoogleLoading} className="text-sm font-medium text-blue-600 hover:text-blue-800">Quên mật khẩu?</button>
                  </div>
                  <button onClick={handleLogin} disabled={isLoading || isGoogleLoading} className={`w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors ${isLoading && !isGoogleLoading ? 'opacity-50 cursor-wait' : ''}`}>
                    {isLoading && !isGoogleLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
                  </button>

                  {loginError && <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg">{loginError}</div>}

                  <div className="relative flex items-center py-4"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-500 text-sm">hoặc đăng nhập với</span><div className="flex-grow border-t border-gray-300"></div></div>
                  <div className="flex justify-center space-x-4">
                    <button disabled={isLoading || isGoogleLoading} className="p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"><FaFacebookF /></button>
                    {/* Nút Google Login */}
                    {isGoogleLoading ? (
                      <button disabled className="p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center">
                        <FaGoogle className="mr-2" />
                      </button>
                    ) : (
                      <div className="flex flex-col items-center">
                        <GoogleLogin
                          onSuccess={handleGoogleLoginSuccess}
                          onError={handleGoogleLoginError}
                          type="icon"
                          shape="circle"
                          theme="filled_blue"
                          size="medium"
                          className="p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                          disabled={isLoading}
                        />
                      </div>
                    )}
                    <button disabled={isLoading || isGoogleLoading} className="p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"><FaLinkedinIn /></button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Đăng Ký */}
            <div
              key={`signup-${formKey}`}
              className={`transition-all duration-500 ease-in-out ${!isSignIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 absolute inset-0 pointer-events-none'}`}
            >
              {!isSignIn && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative"><FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Họ" value={firstname} onChange={(e) => setFirstname(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                    <div className="relative"><FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Tên" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  </div>
                  <div className="relative"><FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="relative"><FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="tel" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative"><FaBirthdayCake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700" /></div>
                    <div className="relative"><FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><select value={gender} onChange={(e) => setGender(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"><option value="">Giới tính</option><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></select></div>
                  </div>
                  <div className="relative"><FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="relative"><FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                  <button onClick={handleSignUp} disabled={isLoading} className={`w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-wait' : ''}`}>
                    {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                  </button>
                  {signupError && <div className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-lg">{signupError}</div>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phần Ảnh Bên Phải */}
        <div className="hidden md:block md:w-1/2 bg-blue-600 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
            <h2 className="text-4xl font-bold mb-6 text-white">Chào mừng bạn đến với HealthCare</h2>
            <p className="text-lg text-center mb-8 text-white">
              Đăng nhập để đặt lịch khám bệnh và sử dụng các dịch vụ y tế trực tuyến của chúng tôi.
            </p>
            <div className="w-full max-w-md">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Lợi ích khi đăng nhập:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center"><span className="mr-2 text-lg">✓</span> Đặt lịch khám bệnh trực tuyến</li>
                  <li className="flex items-center"><span className="mr-2 text-lg">✓</span> Xem lịch sử khám bệnh</li>
                  <li className="flex items-center"><span className="mr-2 text-lg">✓</span> Nhận thông báo về lịch hẹn</li>
                  <li className="flex items-center"><span className="mr-2 text-lg">✓</span> Tư vấn sức khỏe trực tuyến</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component Login chính, cung cấp GoogleOAuthProvider
const Login = () => {
  // Kiểm tra xem GOOGLE_CLIENT_ID đã được cấu hình chưa
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID_HERE") || GOOGLE_CLIENT_ID.startsWith("YOUR")) {
    const errorMessage = "LỖI CẤU HÌNH: Google Client ID chưa được thiết lập trong Login.jsx. Vui lòng cập nhật biến GOOGLE_CLIENT_ID.";
    console.error(errorMessage);
    return (
      <div className="flex justify-center items-center h-screen text-red-600 bg-red-100 p-5 border border-red-500 rounded">
        <p className="text-lg font-semibold">{errorMessage}</p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
};

export default Login;