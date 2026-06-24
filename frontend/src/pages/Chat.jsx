import { useState, useRef, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from 'react-markdown'
import API_URL from "../config"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() && !image) return

    const userMsg = { role: "user", content: input, image: image ? URL.createObjectURL(image) : null }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const formData = new FormData()
    formData.append("message", input)
    formData.append("history", JSON.stringify(messages.map(m => ({ role: m.role, content: m.content }))))
    if (image) formData.append("image", image)

    try {
      const response = await axios.post(`${API_URL}/chat`, formData)
      setMessages([...newMessages, { role: "assistant", content: response.data.answer }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "שגיאה — נסי שוב" }])
    }

    setImage(null)
    setLoading(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", direction: "rtl" }}>
      {/* כותרת */}
      <div style={{
        background: "#1a73e8",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        direction: "rtl",
        flexShrink: 0
      }}>
        <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>💬 צ'אט טכני</span>
        <button
          onClick={() => setMessages([])}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: "8px",
            color: "white",
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.8rem"
          }}
        >🗑️ נקה</button>
      </div>

      {/* הודעות */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#f5f5f5", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
            👋 שלום! שאלי שאלה טכנית או העלי תמונה של ציוד
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              background: msg.role === "user" ? "white" : "#d4e8ff",
              padding: "10px 14px",
              borderRadius: "16px",
              maxWidth: "85%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
            }}>
              {msg.image && <img src={msg.image} alt="תמונה" style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "8px", display: "block" }} />}
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div style={{ textAlign: "center", color: "#888" }}>⏳ מנתח...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* תצוגת תמונה */}
      {image && (
        <div style={{ padding: "8px 16px", background: "#e8f0fe", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <img src={URL.createObjectURL(image)} alt="תמונה" style={{ height: "40px", borderRadius: "6px" }} />
          <span style={{ fontSize: "0.85rem", flex: 1 }}>{image.name}</span>
          <button onClick={() => setImage(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* שורת קלט */}
      <div style={{ display: "flex", padding: "10px 12px", gap: "8px", background: "white", borderTop: "1px solid #eee", alignItems: "center", direction: "rtl", flexShrink: 0 }}>
        <button onClick={() => fileInputRef.current.click()} style={{ background: "none", border: "1px solid #ddd", borderRadius: "50%", width: "42px", height: "42px", cursor: "pointer", fontSize: "1.1rem", flexShrink: 0 }}>📷</button>
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={e => setImage(e.target.files[0])} />
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px" }}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="שאלי שאלה טכנית..."
          rows={1}
          style={{ flex: 1, padding: "10px 16px", borderRadius: "24px", border: "1px solid #ddd", fontSize: "0.95rem", outline: "none", direction: "rtl", resize: "none", overflow: "hidden", fontFamily: "Arial" }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ background: "#1a73e8", color: "white", border: "none", borderRadius: "50%", width: "42px", height: "42px", cursor: "pointer", fontSize: "1.1rem", flexShrink: 0 }}>➤</button>
      </div>
    </div>
  )
}