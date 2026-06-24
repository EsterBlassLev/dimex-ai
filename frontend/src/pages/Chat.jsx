import { useState, useRef, useEffect } from "react"
import axios from "axios"
import ReactMarkdown from 'react-markdown'

import API_URL from "../config"

export default function chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  // גלילה אוטומטית לתחתית
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() && !image) return

    const userMsg = {
      role: "user",
      content: input,
      image: image ? URL.createObjectURL(image) : null
    }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const formData = new FormData()
    formData.append("message", input)
    formData.append("history", JSON.stringify(
      messages.map(m => ({ role: m.role, content: m.content }))
    ))
    if (image) formData.append("image", image)

    try {
      const response = await axios.post(`${API_URL}/chat`, formData)
      setMessages([...newMessages, {
        role: "assistant",
        content: response.data.answer
      }])
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "שגיאה — נסי שוב"
      }])
    }

    setImage(null)
    setLoading(false)
  }

  return (
    <>
      <div className="app">
        {/* כותרת */}
        <div className="header">
          🔧 Dimex — צ'אט טכני
        </div>

        {/* הודעות */}
        <div className="messages">
          {messages.length === 0 && (
            <div style={{
              textAlign: "center",
              color: "#aaa",
              marginTop: "40px",
              direction: "rtl"
            }}>
              👋 שלום! שאלי שאלה טכנית או העלי תמונה של ציוד
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`bubble-wrap ${msg.role}`}>
              <div className={`bubble ${msg.role}`}>
                {msg.image && (
                  <img src={msg.image} alt="תמונה" />
                )}
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="loading">⏳ מנתח...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* תצוגת תמונה שנבחרה */}
        {image && (
          <div className="image-preview">
            <img src={URL.createObjectURL(image)} alt="תמונה" />
            <span>{image.name}</span>
            <button onClick={() => setImage(null)}>✕</button>
          </div>
        )}

        {/* שורת קלט */}
        <div className="input-area">
          <button
            className="btn-icon"
            onClick={() => fileInputRef.current.click()}
            title="העלי תמונה"
          >📷</button>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => setImage(e.target.files[0])}
          />

          <textarea
  className="text-input"
  value={input}
  onChange={e => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = e.target.scrollHeight + "px"
  }}
  onKeyDown={e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }}
  placeholder="שאלי שאלה טכנית..."
  rows={1}
  style={{ resize: "none", overflow: "hidden" }}
/>

          <button
            className="btn-send"
            onClick={sendMessage}
            disabled={loading}
          >➤</button>
        </div>
      </div>
    </>
  )
}