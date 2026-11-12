import { useState } from "react";
import { formatScore } from "../data";

const History = ({ history, clearHistory }) => {
  const [filterName, setFilterName] = useState("Tất cả");

  // Yêu cầu đề bài: Lọc tên không trùng lặp dùng new Set()
  const uniqueNames = ["Tất cả", ...new Set(history.map(h => h.name))];
  const filtered = history.filter(h => filterName === "Tất cả" || h.name === filterName);
  
  // Yêu cầu đề bài: Sắp xếp giảm dần trên "bản sao" của mảng
  const sortedHistory = [...filtered].sort((a, b) => b.finalScore - a.finalScore);

  const totalPlayed = sortedHistory.length;
  const highestScore = totalPlayed > 0 ? Math.max(...sortedHistory.map(h => h.finalScore)) : 0;
  
  // Yêu cầu đề bài: Dùng reduce để tính số lần cháy túi
  const bankruptCount = sortedHistory.reduce((count, h) => h.finalScore < 100 ? count + 1 : count, 0);

  return (
    <div className="card-container">
      <h2>Lịch sử các lượt chơi</h2>
      
      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <div className="filters" style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", marginRight: "10px" }}>Người chơi: </label>
            <select className="search-box" value={filterName} onChange={(e) => setFilterName(e.target.value)}>
              {uniqueNames.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <p style={{ margin: "5px 0" }}><b>Số lượt chơi:</b> {totalPlayed}</p>
            <p style={{ margin: "5px 0" }}><b>Điểm cao nhất:</b> {formatScore(highestScore)}</p>
            <p style={{ margin: "5px 0", color: "#d93025" }}><b>Số lần cháy túi:</b> {bankruptCount}</p>
          </div>

          <table>
            <thead>
              <tr><th>Người chơi</th><th>Số câu đúng</th><th>Điểm cuối</th><th>Đánh giá</th><th>Thời gian</th></tr>
            </thead>
            <tbody>
              {sortedHistory.map(h => (
                <tr key={h.id}>
                  <td style={{ fontWeight: "600", color: "#1a73e8" }}>{h.name}</td>
                  <td>{h.correctCount}/{h.played}</td>
                  <td>{formatScore(h.finalScore)}</td>
                  <td><span style={{ color: h.finalScore < 100 ? "#d93025" : "#137333", fontWeight: "500" }}>{h.result}</span></td>
                  <td style={{ fontSize: "13px", color: "#5f6368" }}>{h.playedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={clearHistory} style={{ marginTop: "20px", backgroundColor: "#dc3545", color: "white", padding: "10px 20px" }}>Xóa lịch sử</button>
        </>
      )}
    </div>
  );
};
export default History;