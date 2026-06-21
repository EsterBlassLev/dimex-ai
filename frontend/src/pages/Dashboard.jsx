import { useState, useEffect } from "react"
import axios from "axios"
import API_URL from "../config"

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/stats`)
        setStats(res.data)
      } catch {
        console.error("שגיאה בטעינת סטטיסטיקות")
      }
    }
    fetchStats()
    // רענון כל 10 שניות
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const cards = stats ? [
    { icon: "💬", label: "שאלות בצ'אט", value: stats.total_questions },
    { icon: "📚", label: "חיפושים במדריכים", value: stats.total_searches },
    { icon: "📷", label: "תמונות שנותחו", value: stats.total_images },
    { icon: "⚡", label: "זמן תגובה ממוצע", value: `${stats.avg_latency}s` },
  ] : []

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", direction: "rtl" }}>
      {/* כותרת */}
      <div style={{
        background: "#1a73e8",
        color: "white",
        padding: "16px 20px",
        fontSize: "1.1rem",
        fontWeight: "bold"
      }}>
        📊 דוח ביצועים
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {!stats ? (
          <div style={{ textAlign: "center", color: "#aaa", marginTop: "60px" }}>
            ⏳ טוען נתונים...
          </div>
        ) : (
          <>
            {/* כרטיסי סטטיסטיקה */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "20px"
            }}>
              {cards.map((card, i) => (
                <div key={i} style={{
                  background: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  textAlign: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                }}>
                  <div style={{ fontSize: "1.8rem" }}>{card.icon}</div>
                  <div style={{
                    fontSize: "1.6rem",
                    fontWeight: "bold",
                    color: "#1a73e8",
                    margin: "4px 0"
                  }}>
                    {card.value}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>
                    {card.label}
                  </div>
                </div>
              ))}
            </div>

            {/* שאלות אחרונות */}
            <div style={{
              background: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "16px"
            }}>
              <h3 style={{ marginBottom: "12px", fontSize: "0.95rem", color: "#444" }}>
                🕐 שאלות אחרונות
              </h3>
              {stats.recent_questions.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: "0.85rem" }}>אין שאלות עדיין</p>
              ) : (
                stats.recent_questions.reverse().map((q, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "0.85rem"
                  }}>
                    <span style={{ color: "#333" }}>{q.question}...</span>
                    <span style={{ color: "#888", flexShrink: 0, marginRight: "8px" }}>
                      {q.time} | {q.latency}s
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}