import { useState } from "react"
import axios from "axios"

import API_URL from "../config"

import ReactMarkdown from 'react-markdown'



export default function DocSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const search = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("query", query)

      const response = await axios.post(`${API_URL}/search`, formData)
      setResult(response.data)
    } catch {
      setResult({ answer: "שגיאה — נסי שוב", sources: [] })
    }

    setLoading(false)
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      direction: "rtl"
    }}>
      {/* כותרת */}
      <div style={{
        background: "#1a73e8",
        color: "white",
        padding: "16px 20px",
        fontSize: "1.1rem",
        fontWeight: "bold"
      }}>
        📚 חיפוש מדריכים טכניים
      </div>

      {/* חיפוש */}
      <div style={{ padding: "16px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            placeholder="חפשי במדריכי המוצרים..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "24px",
              border: "1px solid #ddd",
              fontSize: "0.95rem",
              outline: "none",
              direction: "rtl"
            }}
          />
          <button
            onClick={search}
            disabled={loading}
            style={{
              background: "#1a73e8",
              color: "white",
              border: "none",
              borderRadius: "24px",
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            🔍 חפש
          </button>
        </div>
      </div>

      {/* תוצאות */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {loading && (
          <div style={{ textAlign: "center", color: "#888", marginTop: "40px" }}>
            ⏳ מחפש במדריכים...
          </div>
        )}

        {!loading && !result && (
          <div style={{
            textAlign: "center",
            color: "#aaa",
            marginTop: "60px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <span style={{ fontSize: "3rem" }}>📚</span>
            <p>חפשי שאלה טכנית במדריכי המוצרים</p>
            <p style={{ fontSize: "0.85rem" }}>לדוגמה: "איך מתקינים SDK" או "קודי GPIO"</p>
          </div>
        )}

        {result && (
          <div>
            {/* תשובה */}
            <div style={{
              background: "#f0f7ff",
              border: "1px solid #c2d8f5",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              lineHeight: "1.6",
              whiteSpace: "pre-wrap"
            }}>
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>

            {/* מקורות */}
            {result.sources?.length > 0 && (
              <div>
                <p style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginBottom: "8px"
                }}>
                  📄 מקורות:
                </p>
                {result.sources.map((src, i) => (
                  <div key={i} style={{
                    background: "#f9f9f9",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    marginBottom: "8px",
                    fontSize: "0.82rem",
                    color: "#555"
                  }}>
                    {src}...
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}