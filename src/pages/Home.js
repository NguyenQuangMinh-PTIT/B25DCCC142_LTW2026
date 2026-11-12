import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState(playerName);

  const handlePlay = () => {
    setPlayerName(nameInput.trim());
    navigate("/play");
  };

  const isBtnDisabled = !nameInput.trim();
  const maxScore = history.length > 0 ? Math.max(...history.map(h => h.finalScore)) : null;
  const topPlayer = history.find(h => h.finalScore === maxScore)?.name;

  return (
    <div className="card-container">
      <h2>Đặt cược kiến thức</h2>
      <p>Bắt đầu với 1.000 điểm. Trải qua 12 câu hỏi trắc nghiệm, bạn phải đặt cược từ 100 đến 500 điểm trước mỗi câu.</p>
      <ul>
        <li>Trả lời <b>đúng</b>: + (Mức cược × Hệ số)</li>
        <li>Trả lời <b>sai / hết 25s</b>: - Mức cược</li>
        <li>Dưới 100 điểm: <b>Cháy túi</b> (Thua cuộc ngay)</li>
      </ul>
      
      {maxScore !== null && <p style={{ color: "#d93025", fontWeight: "bold", fontSize: "18px" }}>Kỷ lục: {maxScore.toLocaleString("vi-VN")} điểm – {topPlayer}</p>}

      <div style={{ marginTop: "20px", marginBottom: "15px" }}>
        <label style={{ fontWeight: "600" }}>Tên người chơi: </label>
        <input type="text" className="search-box" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Nhập tên của bạn..." />
      </div>
      
      <button onClick={handlePlay} disabled={isBtnDisabled} style={{ backgroundColor: isBtnDisabled ? "#ccc" : "#1a73e8", color: "white", padding: "10px 24px", fontSize: "16px", fontWeight: "bold" }}>
        Vào chơi
      </button>
    </div>
  );
};
export default Home;