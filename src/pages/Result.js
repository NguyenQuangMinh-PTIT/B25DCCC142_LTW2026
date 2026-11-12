import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { formatScore } from "../data";

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to="/" replace />;

  const { name, rounds, score, correctCount, reason, resultTitle } = state;
  const maxScoreChart = Math.max(...rounds.map(r => r.scoreAfter), 100);

  return (
    <div className="card-container">
      <h2 style={{ color: score === 0 ? "#d93025" : "#137333" }}>{reason}</h2>
      <p style={{ fontSize: "16px" }}><b>Người chơi:</b> {name}</p>
      <p style={{ fontSize: "16px" }}><b>Số câu trả lời đúng:</b> {correctCount}/{rounds.length}</p>
      <p style={{ fontSize: "16px" }}><b>Điểm cuối:</b> {formatScore(score)}</p>
      <p style={{ fontSize: "16px" }}><b>Đánh giá:</b> {resultTitle}</p>

      {/* Vẽ biểu đồ điểm bằng inline style theo đúng yêu cầu đề */}
      <div style={{ marginTop: "40px", marginBottom: "40px", display: "flex", alignItems: "flex-end", height: "250px", borderBottom: "2px solid #ccc", gap: "10px", paddingBottom: "10px" }}>
        {rounds.map((r, i) => {
          const heightPx = (r.scoreAfter / maxScoreChart) * 200;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <span style={{ fontSize: "12px", marginBottom: "5px", color: "#5f6368" }}>{r.scoreAfter}</span>
              <div style={{ 
                width: "100%", maxWidth: "40px", height: `${heightPx}px`, 
                backgroundColor: r.correct ? "#34a853" : "#ea4335",
                borderRadius: "4px 4px 0 0", transition: "height 0.5s ease"
              }}></div>
              <span style={{ fontSize: "14px", fontWeight: "bold", marginTop: "8px" }}>C{i + 1}</span>
            </div>
          );
        })}
      </div>

      <button onClick={() => navigate("/play")} style={{ backgroundColor: "#1a73e8", color: "white", padding: "10px 20px", marginRight: "10px", fontSize: "16px" }}>Chơi lại</button>
      <button onClick={() => navigate("/")} style={{ padding: "10px 20px", fontSize: "16px" }}>Về trang chủ</button>
    </div>
  );
};
export default Result;