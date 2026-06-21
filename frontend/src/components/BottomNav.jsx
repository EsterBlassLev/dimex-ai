export default function BottomNav({ active, setActive }) {
  const tabs = [
    { id: "chat",      icon: "💬", label: "צ'אט" },
    { id: "search",    icon: "📚", label: "מדריכים" },
    { id: "dashboard", icon: "📊", label: "ביצועים" },
  ]

  return (
    <div style={{
      display: "flex",
      borderTop: "1px solid #eee",
      background: "white",
      direction: "rtl"
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          style={{
            flex: 1,
            padding: "10px 0",
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            color: active === tab.id ? "#1a73e8" : "#888",
            borderTop: active === tab.id ? "2px solid #1a73e8" : "2px solid transparent",
            fontSize: "0.75rem",
            fontWeight: active === tab.id ? "bold" : "normal",
            transition: "all 0.2s"
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  )
}