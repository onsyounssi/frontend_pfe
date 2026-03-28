import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [streamingText, setStreamingText] = useState("");
    const bottomRef = useRef(null);
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamingText]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setInput("");
        setLoading(true);
        setStreamingText("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text,
                    history: messages.slice(-4),
                }),
            });
            
            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                
                for (const line of chunk.split("\n")) {
                    if (!line.startsWith("data: ")) continue;
                    try {
                        const json = JSON.parse(line.slice(6));
                        if (json.token) {
                            accumulated += json.token;
                            setStreamingText(accumulated);
                        }
                        if (json.done || json.error) {
                            setMessages((prev) => [...prev,
                                { role: "ai", text: json.error ? `${json.error}` : accumulated || "No response" }
                            ]);
                            setStreamingText("");
                            accumulated = "";
                        }
                    } catch (error) {
                        // Ignore parsing errors for incomplete chunks
                    }
                }
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "ia", text: `Error: ${error.message}` }]);
            setStreamingText("");
        } finally {
            setLoading(false);
        }
    };
    
    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { 
            e.preventDefault(); 
            sendMessage(); 
        }
    };
    
    return (
        <>
            {/* Floating chat panel */}
            {open && (
                <div style={{
                    position: "fixed",
                    bottom: 88,
                    right: 24,
                    width: 360,
                    maxHeight: 520,
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 9999,
                    overflow: "hidden",
                    fontFamily: "sans-serif",
                }}>
                    {/* Header */}
                    <div style={{
                        background: "linear-gradient(135deg, #ec489a, #db2777)",
                        color: "#fff",
                        padding: "14px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}>
                        <span style={{ fontSize: 22 }}>👩‍🍼</span>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>SmartBabyCare IA</div>
                            <div style={{ fontSize: 11, opacity: 0.8 }}>Baby-sitter Assistant</div>
                        </div>
                        <button 
                            onClick={() => setOpen(false)}
                            style={{
                                marginLeft: "auto", 
                                background: "none", 
                                border: "none",
                                color: "#fff", 
                                fontSize: 18, 
                                cursor: "pointer", 
                                lineHeight: 1,
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflow: "auto",
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        background: "#fff0f5",
                    }}>
                        {messages.length === 0 && !streamingText && (
                            <p style={{ color: "#db2777", fontSize: 12, textAlign: "center", margin: "auto" }}>
                                👋 Welcome! Ask me anything about baby care, parenting tips, or general assistance.
                            </p>
                        )}
                        
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                style={{
                                    alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                                    background: msg.role === "user" ? "#ec489a" : "#fff",
                                    color: msg.role === "user" ? "#fff" : "#1e293b",
                                    border: msg.role === "user" ? "none" : "1px solid #fbc4d4",
                                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    padding: "8px 12px",
                                    maxWidth: "85%",
                                    fontSize: 13,
                                    lineHeight: 1.6,
                                    whiteSpace: "pre-wrap",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                }}
                            >
                                {msg.text}
                            </div>
                        ))}
                        
                        {streamingText && (
                            <div style={{
                                alignSelf: "flex-start",
                                background: "#fff",
                                border: "1px solid #fbc4d4",
                                borderRadius: "16px 16px 16px 4px",
                                padding: "8px 12px",
                                maxWidth: "85%",
                                fontSize: 13,
                                lineHeight: 1.6,
                                whiteSpace: "pre-wrap",
                            }}>
                                {streamingText}
                                <span style={{
                                    display: "inline-block", 
                                    width: 6, 
                                    height: 13,
                                    background: "#ec489a", 
                                    marginLeft: 2,
                                    verticalAlign: "middle", 
                                    borderRadius: 2,
                                    animation: "blink 1s step-end infinite",
                                }} />
                            </div>
                        )}
                        
                        {loading && !streamingText && (
                            <div style={{
                                alignSelf: "flex-start", 
                                fontSize: 12,
                                color: "#db2777", 
                                fontStyle: "italic", 
                                padding: "4px 8px",
                            }}>
                                Thinking... 🤔
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                    
                    {/* Input */}
                    <div style={{
                        display: "flex", 
                        gap: 8, 
                        padding: "12px",
                        borderTop: "1px solid #fbc4d4", 
                        background: "#fff",
                    }}>
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Ask a question..."
                            disabled={loading}
                            style={{
                                flex: 1, 
                                border: "1px solid #fbc4d4", 
                                borderRadius: 20,
                                padding: "8px 14px", 
                                fontSize: 13, 
                                outline: "none",
                                background: loading ? "#fff0f5" : "#fff",
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            style={{
                                background: loading || !input.trim() ? "#f9a8d4" : "linear-gradient(135deg, #ec489a, #db2777)",
                                color: "#fff", 
                                border: "none", 
                                borderRadius: "50%",
                                width: 36, 
                                height: 36, 
                                fontSize: 16,
                                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all 0.2s",
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
            
            {/* Floating bubble button */}
            <button 
                onClick={() => setOpen((o) => !o)}
                title="SmartBabyCare AI Assistant" 
                style={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    width: 58,
                    height: 58,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ec489a, #db2777)",
                    color: "#fff",
                    border: "none",
                    fontSize: 26,
                    cursor: "pointer",
                    zIndex: 9999,
                    boxShadow: "0 4px 20px rgba(236,72,153,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
                {open ? "✕" : "👩‍🍼"}
            </button>
            
            <style>{`
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </>
    );
}