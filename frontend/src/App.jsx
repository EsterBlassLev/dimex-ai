import { useState } from "react"
import Chat from "./pages/Chat"
import DocSearch from "./pages/DocSearch"
import Dashboard from "./pages/Dashboard"
import BottomNav from "./components/BottomNav"

export default function App() {
  const [activePage, setActivePage] = useState("chat")
  const [showWelcome, setShowWelcome] = useState(true)

  if (showWelcome) {
    return (
      <>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #f0f2f5; }
          .welcome {
            max-width: 800px;
            margin: 0 auto;
            height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: white;
            padding: 32px 24px;
            text-align: center;
            direction: rtl;
          }
          .welcome-card {
            background: white;
            border-radius: 20px;
            padding: 40px 24px;
            width: 100%;
            max-width: 400px;
          }
          .btn-feature {
            width: 100%;
            padding: 14px;
            margin-bottom: 12px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 12px;
            direction: rtl;
            transition: transform 0.1s;
          }
          .btn-feature:active { transform: scale(0.98); }
        `}</style>

        <div className="welcome">
          <div className="welcome-card">
            <img src="/logo.png" alt="Boss Dimex" style={{ height: "60px", marginBottom: "24px" }} />

            <h1 style={{
              fontSize: "1.6rem",
              fontWeight: "bold",
              color: "#1a73e8",
              marginBottom: "8px"
            }}>
              Dimex AI Platform
            </h1>

            <p style={{
              color: "#666",
              fontSize: "0.95rem",
              marginBottom: "32px",
              lineHeight: "1.5"
            }}>
              עוזר AI טכני חכם למוצרי Zebra, Honeywell ו-Unitech
            </p>

            <button
              className="btn-feature"
              onClick={() => { setActivePage("chat"); setShowWelcome(false) }}
              style={{ background: "#e8f0fe", color: "#1a73e8" }}
            >
              <span style={{ fontSize: "1.5rem" }}>💬</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>צ'אט טכני</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>שאל שאלה או העלה תמונת ציוד</div>
              </div>
            </button>

            <button
              className="btn-feature"
              onClick={() => { setActivePage("search"); setShowWelcome(false) }}
              style={{ background: "#e6f4ea", color: "#1e7e34" }}
            >
              <span style={{ fontSize: "1.5rem" }}>📚</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>חיפוש מדריכים</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>חפש במדריכי המוצרים הטכניים</div>
              </div>
            </button>

            <button
              className="btn-feature"
              onClick={() => { setActivePage("dashboard"); setShowWelcome(false) }}
              style={{ background: "#fce8e6", color: "#d93025" }}
            >
              <span style={{ fontSize: "1.5rem" }}>📊</span>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold" }}>דוח ביצועים</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>סטטיסטיקות ושאלות אחרונות</div>
              </div>
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .app {
          max-width: 800px;
          margin: 0 auto;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        @media (max-width: 750px) {
          .app { box-shadow: none; }
        }
      `}</style>

      <div className="app">
        <div style={{
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div style={{ width: "32px" }} />
          <img src="/logo.png" alt="Boss Dimex" style={{ height: "40px" }} />
          <button
            onClick={() => setShowWelcome(true)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.3rem",
              cursor: "pointer",
              width: "32px"
            }}
          >🏠</button>
        </div>

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activePage === "chat"      && <Chat />}
          {activePage === "search"    && <DocSearch />}
          {activePage === "dashboard" && <Dashboard />}
        </div>
        <BottomNav active={activePage} setActive={setActivePage} />
      </div>
    </>
  )
}