// src/components/SymptomAnalyzer.js
import React, { useEffect, useState } from "react";
import { mockSuggestions } from '../../mockData';
import { getSpecialtyFromAI } from '../../services/aiService';

function SymptomAnalyzer() {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: 'Xin chào! Tôi là AI y tế của bạn. Hãy mô tả các triệu chứng bạn đang gặp phải, tôi sẽ gợi ý chuyên khoa phù hợp nhé! 😊',
            timestamp: new Date()
        }
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!symptoms.trim()) {
            setError('Vui lòng nhập triệu chứng của bạn.');
            return;
        }

        // Thêm tin nhắn của user
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: symptoms,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);

        setIsLoading(true);
        setError('');
        setResult(null);
        setSymptoms(''); // Clear input

        try {
            const availableSpecialties = mockSuggestions.map(s => s.specialtyName);
            const suggestedSpecialtyName = await getSpecialtyFromAI(symptoms, availableSpecialties);
            
            const foundSuggestion = mockSuggestions.find(
                s => s.specialtyName.toLowerCase() === suggestedSpecialtyName.toLowerCase()
            );

            if (foundSuggestion) {
                // Thêm tin nhắn bot với kết quả
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: foundSuggestion,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setResult(foundSuggestion);
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    content: `Xin lỗi, tôi không tìm thấy thông tin chi tiết cho chuyên khoa "${suggestedSpecialtyName}". Bạn có thể mô tả thêm triệu chứng không?`,
                    timestamp: new Date(),
                    isError: true
                };
                setMessages(prev => [...prev, errorMessage]);
            }

        } catch (err) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                content: `Có lỗi xảy ra: ${err.message}. Vui lòng thử lại sau nhé!`,
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const TypingIndicator = () => (
        <div style={styles.typingContainer}>
            <div style={styles.typingAvatar}>🤖</div>
            <div style={styles.typingBubble}>
                <div style={styles.typingDots}>
                    <span style={styles.dot}></span>
                    <span style={styles.dot}></span>
                    <span style={styles.dot}></span>
                </div>
                <span style={styles.typingText}>AI đang suy nghĩ...</span>
            </div>
        </div>
    );

    const styles = {
        container: {
            minHeight: '100vh',
            padding: '20px',
            fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif'
        },
        chatContainer: {
            maxWidth: '800px',
            margin: '0 auto',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
        },
        chatHeader: {
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            padding: '20px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        headerAvatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
        },
        headerInfo: {
            flex: 1
        },
        headerTitle: {
            margin: '0',
            fontSize: '18px',
            fontWeight: '600'
        },
        headerStatus: {
            margin: '0',
            fontSize: '14px',
            opacity: '0.9'
        },
        messagesContainer: {
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            backgroundColor: '#fafafa'
        },
        message: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            maxWidth: '80%'
        },
        userMessage: {
            alignSelf: 'flex-end',
            flexDirection: 'row-reverse'
        },
        botMessage: {
            alignSelf: 'flex-start'
        },
        avatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0
        },
        userAvatar: {
            backgroundColor: '#2196F3',
            color: 'white'
        },
        botAvatar: {
            backgroundColor: '#f0f0f0',
            color: '#666'
        },
        messageBubble: {
            padding: '12px 16px',
            borderRadius: '18px',
            maxWidth: '100%',
            wordWrap: 'break-word'
        },
        userBubble: {
            backgroundColor: '#2196F3',
            color: 'white',
            borderBottomRightRadius: '6px'
        },
        botBubble: {
            backgroundColor: 'white',
            color: '#333',
            border: '1px solid #e0e0e0',
            borderBottomLeftRadius: '6px'
        },
        errorBubble: {
            backgroundColor: '#ffebee',
            color: '#c62828',
            border: '1px solid #ffcdd2'
        },
        resultCard: {
            marginTop: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #e9ecef'
        },
        specialtyTitle: {
            fontSize: '16px',
            fontWeight: '600',
            color: '#2196F3',
            margin: '0 0 12px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        branchItem: {
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '8px',
            border: '1px solid #e0e0e0',
            fontSize: '14px'
        },
        branchName: {
            fontWeight: '600',
            color: '#333',
            marginBottom: '4px'
        },
        branchInfo: {
            color: '#666',
            fontSize: '13px',
            margin: '2px 0'
        },
        inputContainer: {
            padding: '20px',
            backgroundColor: 'white',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-end'
        },
        inputWrapper: {
            flex: 1,
            position: 'relative'
        },
        textarea: {
            width: '100%',
            minHeight: '20px',
            maxHeight: '120px',
            padding: '12px 16px',
            border: '1px solid #e0e0e0',
            borderRadius: '20px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            lineHeight: '1.4',
            transition: 'border-color 0.2s ease'
        },
        sendButton: {
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            transition: 'all 0.2s ease',
            flexShrink: 0
        },
        sendButtonDisabled: {
            opacity: '0.5',
            cursor: 'not-allowed'
        },
        typingContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            maxWidth: '80%',
            alignSelf: 'flex-start'
        },
        typingAvatar: {
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0
        },
        typingBubble: {
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '18px',
            borderBottomLeftRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        typingDots: {
            display: 'flex',
            gap: '4px'
        },
        dot: {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#999',
            animation: 'typing 1.4s infinite ease-in-out'
        },
        typingText: {
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic'
        }
    };

    const cssAnimations = `
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.4;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }
        
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
    `;

    // Auto scroll to bottom
    useEffect(() => {
        const container = document.querySelector('.messages-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <>
            <style>{cssAnimations}</style>
            <div style={styles.container}>
                <div style={styles.chatContainer}>
                    {/* Chat Header */}
                    <div style={styles.chatHeader}>
                        <div style={styles.headerAvatar}>🤖</div>
                        <div style={styles.headerInfo}>
                            <h3 style={styles.headerTitle}>AI Y Tế</h3>
                            <p style={styles.headerStatus}>
                                {isLoading ? 'Đang phân tích...' : 'Trực tuyến'}
                            </p>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div style={styles.messagesContainer} className="messages-container">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                style={{
                                    ...styles.message,
                                    ...(message.type === 'user' ? styles.userMessage : styles.botMessage)
                                }}
                            >
                                <div style={{
                                    ...styles.avatar,
                                    ...(message.type === 'user' ? styles.userAvatar : styles.botAvatar)
                                }}>
                                    {message.type === 'user' ? '👤' : '🤖'}
                                </div>
                                <div>
                                    <div style={{
                                        ...styles.messageBubble,
                                        ...(message.type === 'user' ? styles.userBubble : 
                                            message.isError ? styles.errorBubble : styles.botBubble)
                                    }}>
                                        {typeof message.content === 'string' ? (
                                            message.content
                                        ) : (
                                            // Render result object
                                            <div>
                                                <div>Dựa trên triệu chứng của bạn, tôi gợi ý bạn nên khám:</div>
                                                <div style={styles.resultCard}>
                                                    <div style={styles.specialtyTitle}>
                                                        🏥 {message.content.specialtyName}
                                                    </div>
                                                    <div style={{fontSize: '14px', marginBottom: '12px', color: '#666'}}>
                                                        📍 Các địa chỉ gợi ý:
                                                    </div>
                                                    {message.content.branches.map((branch, index) => (
                                                        <div key={index} style={styles.branchItem}>
                                                            <div style={styles.branchName}>{branch.branchName}</div>
                                                            <div style={styles.branchInfo}>📍 {branch.address}</div>
                                                            <div style={styles.branchInfo}>📞 {branch.phoneNumber}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{fontSize: '11px', color: '#999', marginTop: '4px', textAlign: message.type === 'user' ? 'right' : 'left'}}>
                                        {message.timestamp.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isLoading && <TypingIndicator />}
                    </div>

                    {/* Input Container */}
                    <div style={styles.inputContainer}>
                        <form onSubmit={handleSubmit} style={{display: 'flex', gap: '12px', width: '100%', alignItems: 'flex-end'}}>
                            <div style={styles.inputWrapper}>
                                <textarea
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder="Nhập triệu chứng của bạn..."
                                    style={styles.textarea}
                                    disabled={isLoading}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#2196F3'}
                                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !symptoms.trim()}
                                style={{
                                    ...styles.sendButton,
                                    ...(isLoading || !symptoms.trim() ? styles.sendButtonDisabled : {})
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading && symptoms.trim()) {
                                        e.target.style.transform = 'scale(1.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'scale(1)';
                                }}
                            >
                                ➤
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SymptomAnalyzer;