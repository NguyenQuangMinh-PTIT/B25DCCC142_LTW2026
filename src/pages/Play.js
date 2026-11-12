import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { formatScore, LEVELS, MULTIPLIERS, LETTERS, START_SCORE, MIN_BET } from "../data";
import { validateBet, calcChange, getResult } from "../utils";

const Supports = ({ usedPreview, onUsePreview, usedInsurance, onUseInsurance, usedHint, onUseHint, status, activeInsurance, activeHint, question }) => (
  <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
    <h4 style={{ margin: "0 0 10px 0", color: "#202124" }}>Quyền trợ giúp:</h4>
    <button disabled={usedPreview || status !== "betting"} onClick={onUsePreview} style={{ marginRight: "10px", backgroundColor: usedPreview ? "#ccc" : "#e8f0fe", color: usedPreview ? "#666" : "#1a73e8", fontWeight: "500" }}>
      Xem trước {usedPreview && "(Đã dùng)"}
    </button>
    <button disabled={usedInsurance || activeInsurance} onClick={onUseInsurance} style={{ marginRight: "10px", backgroundColor: usedInsurance ? "#ccc" : "#e8f0fe", color: usedInsurance ? "#666" : "#1a73e8", fontWeight: "500" }}>
      {activeInsurance ? "Đã bảo hiểm" : "Bảo hiểm"}
    </button>
    <button disabled={usedHint || status !== "answering"} onClick={onUseHint} style={{ backgroundColor: usedHint ? "#ccc" : "#e8f0fe", color: usedHint ? "#666" : "#1a73e8", fontWeight: "500" }}>
      Gợi ý {usedHint && "(Đã dùng)"}
    </button>
    
    {/* Chỉ hiển thị xem trước khi bấm ở câu hiện tại */}
    {usedPreview && status === "betting" && <p style={{ fontStyle: "italic", marginTop: "10px", color: "#1a73e8" }}>Nội dung câu hỏi: {question.question}</p>}
    {/* Gợi ý chỉ hiện khi đang trả lời của câu đó */}
    {activeHint && status !== "betting" && <p style={{ fontStyle: "italic", marginTop: "10px", color: "#b06000" }}>Gợi ý: {question.hint}</p>}
  </div>
);

const Play = ({ playerName, questions, history, setHistory }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("betting"); // betting | answering | revealed
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [bet, setBet] = useState(100);
  const [betError, setBetError] = useState("");
  const [timer, setTimer] = useState(25);
  const [rounds, setRounds] = useState([]);
  const [selectedAns, setSelectedAns] = useState(null);
  
  // Trạng thái quyền trợ giúp trong lượt chơi
  const [usedPreview, setUsedPreview] = useState(false);
  const [usedInsurance, setUsedInsurance] = useState(false);
  const [activeInsurance, setActiveInsurance] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [activeHint, setActiveHint] = useState(false);

  // Phím tắt ở bước đặt cược (Bài 3)
  useEffect(() => {
    if (status !== "betting") return;
    const handleKey = (e) => {
      const maxValid = Math.floor(Math.min(500, score) / 100) * 100;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setBet(b => Math.min(b + 100, maxValid));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setBet(b => Math.max(b - 100, 100));
      } else if (e.key === "Enter") {
        const err = validateBet(bet, score);
        if (!err) handleStartAnswering();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, bet, score]);

  // Tiêu đề Tab (Bài 3)
  useEffect(() => {
    if (status === "betting") document.title = `Câu ${currentIdx + 1}/12 – đặt cược`;
    else document.title = `Câu ${currentIdx + 1}/12 – cược ${bet}`;
    return () => { document.title = "Đặt cược kiến thức"; };
  }, [status, currentIdx, bet]);

  // Đồng hồ đếm ngược 25 giây (Bài 2)
  useEffect(() => {
    if (status !== "answering") return;
    if (timer === 0) { handleAnswer(-1); return; }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [status, timer]);

  // Chờ 2 giây sang câu tiếp theo hoặc kết thúc (Bài 2)
  useEffect(() => {
    if (status !== "revealed") return;
    const timeout = setTimeout(() => {
      if (currentIdx === 11 || score < MIN_BET) {
        finishGame();
      } else {
        setCurrentIdx(c => c + 1);
        setStatus("betting");
        setBet(100);
        setBetError("");
        // RESET TRẠNG THÁI GỢI Ý RIÊNG CHO CÂU MỚI (Tránh bị dồn dính)
        setActiveHint(false);
        setUsedHint(false);
        // Bảo hiểm giữ nguyên nếu đã kích hoạt hoặc đã dùng hết trong lượt? Đề bài: "mỗi nút chỉ dùng được một lần trong một lượt chơi" -> Bảo hiểm dùng rồi thì giữ nguyên trạng thái usedInsurance.
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [status, currentIdx, score]);

  if (!playerName) return <Navigate to="/" replace />;
  
  const q = questions[currentIdx];

  const handleStartAnswering = () => {
    const err = validateBet(bet, score);
    if (err) { setBetError(err); return; }
    setBetError("");
    setTimer(25);
    setSelectedAns(null);
    if (usedInsurance && !activeInsurance) setActiveInsurance(true);
    setStatus("answering");
  };

  const handleAnswer = (ansIdx) => {
    const isCorrect = ansIdx === q.answer;
    const change = calcChange(bet, q.level, isCorrect, activeInsurance);
    const newScore = score + change;
    setSelectedAns(ansIdx);
    setScore(newScore);
    setRounds([...rounds, { id: q.id, bet, correct: isCorrect, change, scoreAfter: newScore }]);
    setStatus("revealed");
  };

  const finishGame = () => {
    const correctCount = rounds.filter(r => r.correct).length;
    const finalResult = getResult(score);
    const reason = score < MIN_BET ? "Bạn đã cháy túi!" : "Bạn đã hoàn thành 12 câu.";
    
    const newRecord = {
      id: Date.now(),
      name: playerName,
      finalScore: score,
      correctCount,
      played: rounds.length,
      result: finalResult.title,
      playedAt: new Date().toLocaleString("vi-VN")
    };
    setHistory([newRecord, ...history]);

    navigate("/result", { 
      replace: true, 
      state: { name: playerName, rounds, score, correctCount, reason, resultTitle: finalResult.title } 
    });
  };

  const isRevealed = status === "revealed";

  return (
    <div className="card-container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <h3 style={{ margin: 0 }}>Câu {currentIdx + 1}/12 · {q.topic} · {LEVELS[q.level]} ({MULTIPLIERS[q.level] === 1 ? 'x1' : `x${MULTIPLIERS[q.level]}`})</h3>
        <h3 style={{ margin: 0, color: "#1a73e8" }}>Điểm hiện có: {formatScore(score)}</h3>
      </div>

      <Supports 
        usedPreview={usedPreview} 
        onUsePreview={() => setUsedPreview(true)} 
        usedInsurance={usedInsurance} 
        onUseInsurance={() => { setUsedInsurance(true); setActiveInsurance(true); }} 
        usedHint={usedHint} 
        onUseHint={() => { setUsedHint(true); setActiveHint(true); }} 
        status={status} 
        activeInsurance={activeInsurance} 
        activeHint={activeHint} 
        questions={q} 
      />

      {status === "betting" && (
        <div>
          <label style={{ fontWeight: "bold" }}>Mức cược: </label>
          <input type="number" step="100" value={bet} onChange={(e) => setBet(Number(e.target.value))} className="search-box" style={{ width: "120px", marginLeft: "10px" }} />
          <button onClick={handleStartAnswering} style={{ marginLeft: "10px", backgroundColor: "#1a73e8", color: "white", padding: "8px 16px" }}>Đặt cược</button>
          {betError && <p style={{ color: "#d93025", fontWeight: "500", marginTop: "10px" }}>{betError}</p>}
        </div>
      )}

      {status !== "betting" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold", color: timer <= 5 ? "#d93025" : "#333" }}>Còn {timer} giây</span>
            <span style={{ fontWeight: "600", color: "#b06000" }}>Đang cược: {formatScore(bet)}</span>
          </div>

          <h2 style={{ marginBottom: "20px" }}>{q.question}</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            {q.options.map((opt, idx) => {
              let bg = "transparent";
              if (isRevealed) {
                if (idx === q.answer) bg = "#d4edda"; 
                else if (idx === selectedAns) bg = "#f8d7da"; 
              }
              return (
                <button key={idx} disabled={isRevealed} onClick={() => handleAnswer(idx)} style={{ backgroundColor: bg, padding: "15px", textAlign: "left", fontSize: "16px", border: "1px solid #ccc", borderRadius: "8px", cursor: isRevealed ? "default" : "pointer" }}>
                  {LETTERS[idx]}. {opt}
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold", textAlign: "center", color: rounds[rounds.length-1].change > 0 ? "#137333" : "#d93025" }}>
              {activeInsurance && !rounds[rounds.length-1].correct 
                ? "Bảo hiểm: không bị trừ điểm" 
                : `${rounds[rounds.length-1].change > 0 ? "+" : ""}${rounds[rounds.length-1].change} điểm`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Play;