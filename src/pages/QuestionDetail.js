import { useParams, useNavigate } from "react-router-dom";
import { LEVELS, formatMultiplier, MULTIPLIERS, LETTERS } from "../data";

const QuestionDetail = ({ questions, bookmarks, toggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find(q => q.id === Number(id));

  if (!question) return <div style={{ padding: "20px" }}>Không tìm thấy câu hỏi</div>;

  const isBookmarked = bookmarks.includes(question.id);

  return (
    <div style={{ padding: "0 20px" }}>
      <h2>Câu hỏi số {question.id} – {question.topic} · {LEVELS[question.level]} ({formatMultiplier(MULTIPLIERS[question.level])})</h2>
      <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{question.question}</p>
      
      <div style={{ margin: "20px 0" }}>
        {question.options.map((opt, idx) => {
          const isCorrect = idx === question.answer;
          return (
            <div key={idx} style={{ backgroundColor: isCorrect ? 'lightgreen' : 'transparent', padding: '10px', marginBottom: '5px', borderRadius: '4px' }}>
              {LETTERS[idx]}. {opt} {isCorrect && <span> (Đáp án đúng)</span>}
            </div>
          );
        })}
      </div>
      
      <p>Gợi ý: {question.hint}</p>
      
      <button style={{ padding: "8px 15px", marginRight: "10px", cursor: "pointer" }} onClick={() => toggleBookmark(question.id)}>
        {isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
      </button>
      <button style={{ padding: "8px 15px", cursor: "pointer" }} onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};
export default QuestionDetail;