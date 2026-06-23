import { useState } from "react"
import Chat from "./pages/Chat.jsx"
import DocSearch from "./pages/DocSearch"
import Dashboard from "./pages/Dashboard"
import BottomNav from "./components/BottomNav"

export default function App() {
  const [activePage, setActivePage] = useState("chat")

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f2f5; }
        .app {
          max-width: 800px;
          margin: 0 auto;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        @media (max-width: 600px) {
          .app { box-shadow: none; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f2f5; }
        
        .app {
          max-width: 800px;
          margin: 0 auto;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .header {
          background: #1a73e8;
          color: white;
          padding: 16px 20px;
          font-size: 1.1rem;
          font-weight: bold;
          direction: rtl;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f5f5f5;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bubble-wrap {
          display: flex;
        }
        .bubble-wrap.user { justify-content: flex-start; }
        .bubble-wrap.assistant { justify-content: flex-end; }

        .bubble {
          padding: 10px 14px;
          border-radius: 16px;
          max-width: min(70%, 500px);
          white-space: pre-wrap;
          line-height: 1.5;
          font-size: 0.95rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .bubble.user { background: white; border-radius: 16px 16px 16px 4px; }
        .bubble.assistant { background: #d4e8ff; border-radius: 16px 16px 4px 16px; }

        .bubble img {
          max-width: 100%;
          border-radius: 8px;
          margin-bottom: 8px;
          display: block;
        }

        .loading {
          text-align: center;
          color: #888;
          font-size: 0.85rem;
          padding: 8px;
        }

        .image-preview {
          padding: 8px 16px;
          background: #e8f0fe;
          display: flex;
          align-items: center;
          gap: 10px;
          direction: rtl;
        }
        .image-preview img { height: 40px; border-radius: 6px; }
        .image-preview span { font-size: 0.85rem; flex: 1; }
        .image-preview button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #666;
        }

        .input-area {
          display: flex;
          padding: 10px 12px;
          gap: 8px;
          background: white;
          border-top: 1px solid #eee;
          align-items: center;
          direction: rtl;
        }

        .btn-icon {
          background: none;
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .btn-icon:hover { background: #f0f0f0; }

        .btn-send {
          background: #1a73e8;
          color: white;
          border: none;
          border-radius: 50%;
          width: 42px;
          height: 42px;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .btn-send:hover { background: #1557b0; }
        .btn-send:disabled { background: #aaa; cursor: default; }

        .text-input {
          flex: 1;
          padding: 10px 16px;
          border-radius: 24px;
          border: 1px solid #ddd;
          font-size: 0.95rem;
          outline: none;
          direction: rtl;
          font-family: Arial;
        }
        .text-input:focus { border-color: #1a73e8; }

        @media (max-width: 600px) {
          .app { box-shadow: none; }
          .bubble { max-width: 85%; }
          .header { font-size: 1rem; padding: 12px 16px; }
        }
      `}</style>

      <div className="app">
          <div style={{
    background: "#1a73e8",
    padding: "10px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}>
    <img
      src="/logo.png"
      alt="Boss Dimex"
      style={{ height: "40px" }}
    />
  </div>
        {/* עמוד נוכחי */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activePage === "chat"      && <Chat />}
          {activePage === "search"    && <DocSearch />}
          {activePage === "dashboard" && <Dashboard />}
        </div>

        {/* ניווט תחתון */}
        <BottomNav active={activePage} setActive={setActivePage} />
      </div>
    </>
  )
}