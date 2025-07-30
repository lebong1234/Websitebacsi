import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../i18n"; // Đảm bảo đã thiết lập i18n ở file này
import { FcGoogle } from "react-icons/fc";

const HealthNews = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");


  // Lấy API Key từ biến môi trường để bảo mật
  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setErrorMsg("");
      setArticles([]);

      try {
        // ✅ GIẢI PHÁP: LUÔN TÌM KIẾM BẰNG TIẾNG ANH
        // Bất kể ngôn ngữ giao diện là gì, ta sẽ tìm kiếm tin tức y tế bằng tiếng Anh
        // để đảm bảo có kết quả chất lượng cao và liên quan từ GNews.
        const englishQuery = `"doctor" OR "health" OR "medical" OR "healthcare" OR "pharma " OR "hospital"`;

        const params = new URLSearchParams({
          q: englishQuery,
          lang: 'en',      // ✅ LUÔN đặt là 'en'
          country: 'us',   // ✅ Thêm 'country' để kết quả tập trung hơn (ví dụ: Mỹ)
          sortby: "publishedAt",
          token: API_KEY,
          max: "30",
        });

        const response = await fetch(`https://gnews.io/api/v4/search?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json();
          const apiErrorMessage = errorData.errors ? errorData.errors.join(", ") : "Unknown API Error";
          throw new Error(apiErrorMessage);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        } else {
          setErrorMsg(t("no_articles"));
        }
      } catch (error) {
        if (error instanceof TypeError) {
          setErrorMsg(t("connection_error"));
        } else {
          setErrorMsg(`${t("api_error")}: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (API_KEY) {
      fetchNews();
    } else {
      setErrorMsg("API Key is missing. Please set VITE_GNEWS_API_KEY in your .env file and restart the server.");
      setLoading(false);
    }
    // Chạy lại khi đổi ngôn ngữ để tiêu đề (t) được cập nhật, dù API call không đổi
  }, [i18n.language, t, API_KEY]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Ngôn ngữ */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => changeLanguage("vi")}
            className={`mr-2 px-3 py-1 rounded transition-colors ${i18n.language === 'vi' ? 'bg-blue-500 text-white' : 'bg-blue-100'}`}
          >
            🇻🇳 Tiếng Việt
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 rounded transition-colors ${i18n.language.startsWith('en') ? 'bg-green-500 text-white' : 'bg-green-100'}`}
          >
            🇺🇸 English
          </button>
        </div>

        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
            <span className="text-2xl">🩺</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            {t("health_news_title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("health_news_description")}</p>
        </div>

        {/* Đang tải */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600 text-lg">{t("loading")}</span>
          </div>
        )}

        {/* Lỗi */}
        {errorMsg && !loading && (
          <div className="text-center text-red-500 font-semibold mb-8 p-4 bg-red-100 rounded-lg">{errorMsg}</div>
        )}

        {/* Danh sách bài viết */}
        {!loading && articles.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <article
                key={article.url + index} // Sử dụng url làm key để ổn định hơn
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              >
                {article.image ? (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}


                <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      📰 {article.source?.name || t("unknown_source")}
                    </span>
                    <time className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString(
                        i18n.language === "vi" ? "vi-VN" : "en-US"
                      )}
                    </time>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-3 group-hover:text-blue-600 transition-colors flex-grow">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {article.title}
                    </a>
                  </h2>

                  <div className="mt-auto">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105"
                    >
                      <span>🔍</span>
                      <span className="ml-2">{t("read_more")}</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthNews;