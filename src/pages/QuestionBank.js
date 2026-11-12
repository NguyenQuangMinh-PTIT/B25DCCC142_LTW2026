import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS, formatMultiplier, MULTIPLIERS } from "../data";

const QuestionBank = ({ questions, bookmarks, toggleBookmark }) => {
  const [levels, setLevels] = useState([1, 2, 3]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [query, setQuery] = useState("");

  const handleLookupShift = (e) => setQuery(e.target.value);

  const filtered = questions.filter(q => {
    const matchLevel = levels.includes(q.level);
    const matchBookmark = showBookmarked ? bookmarks.includes(q.id) : true;
    const matchQuery = q.question.toLowerCase().includes(query.toLowerCase()) || 
                   q.topic.toLowerCase().includes(query.toLowerCase());
    return matchLevel && matchBookmark && matchQuery;
  });

  const handleLevelChange = (lvl) => {
    setLevels(prev => prev.includes(lvl) ? prev.filter(l => l !== lvl) : [...prev, lvl]);
  };

  return (
    <div className="card-container">
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        <label><input type="checkbox" checked={levels.includes(1)} onChange={() => handleLevelChange(1)}/> Dễ</label>
        <label><input type="checkbox" checked={levels.includes(2)} onChange={() => handleLevelChange(2)}/> Trung bình</label>
        <label><input type="checkbox" checked={levels.includes(3)} onChange={() => handleLevelChange(3)}/> Khó</label>
        
        <label style={{ marginLeft: "10px", borderLeft: "1px solid #ccc", paddingLeft: "15px" }}>
           <input type="checkbox" checked={showBookmarked} onChange={(e) => setShowBookmarked(e.target.checked)}/> Chỉ hiện câu đã đánh dấu
        </label>
        
        <div style={{ marginLeft: "auto" }}> {/* Đẩy ô tìm kiếm sang góc phải */}
           <input type="text" className="search-box" placeholder="Tìm kiếm câu hỏi..." value={query} onChange={handleLookupShift} />
        </div>
      </div>
      
      <p style={{ color: "#5f6368", fontSize: "14px", marginBottom: "15px" }}>
        Có {filtered.length} câu hỏi | Đã đánh dấu: {bookmarks.length} câu
      </p>

      {filtered.length > 0 && (
        <table>
          <thead>
            <tr><th>STT</th><th>Chủ đề</th><th>Mức độ</th><th>Hệ số</th><th>Câu hỏi</th><th style={{textAlign:"center"}}>Đánh dấu</th></tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => (
              <tr key={q.id}>
                <td>{i + 1}</td>
                <td>{q.topic}</td>
                <td><span style={{ 
                  padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "500",
                  backgroundColor: q.level === 1 ? "#e6f4ea" : q.level === 2 ? "#fef7e0" : "#fce8e6",
                  color: q.level === 1 ? "#137333" : q.level === 2 ? "#b06000" : "#c5221f"
                }}>{LEVELS[q.level]}</span></td>
                <td>{formatMultiplier(MULTIPLIERS[q.level])}</td>
                <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
                <td style={{ textAlign: "center" }}>
                  <button className="star-btn" onClick={() => toggleBookmark(q.id)}>
                    {bookmarks.includes(q.id) ? "★" : "☆"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default QuestionBank;