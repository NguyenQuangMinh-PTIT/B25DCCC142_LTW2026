/* eslint-disable import/first */
const BUILD_TAG = "dc-2964";
import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import axios from "axios";
import "./App.css";

import NavBar from "./components/NavBar";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const Home = () => (
  <div className="card-container">
    <h2>Trang chủ</h2>
    <p>Chào mừng bạn đến với hệ thống Đặt cược kiến thức.</p>
  </div>
);
const Play = () => <div className="card-container"><h2>Màn hình chơi</h2></div>;
const Result = () => <div className="card-container"><h2>Kết quả</h2></div>;
const History = () => <div className="card-container"><h2>Lịch sử</h2></div>;

const Layout = () => (
  <div className="app-container">
    <div className="sidebar">
      <div className="sidebar-logo">
        Lập Trình Web
      </div>
      <NavBar />
    </div>
    
    <div className="main-content">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    axios.get("/data/questions.json", { signal: controller.signal })
      .then(res => { setQuestions(res.data); setLoading(false); })
      .catch(err => {
        if (!axios.isCancel(err)) { setError("Không tải được câu hỏi"); setLoading(false); }
      });
    return () => controller.abort();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div>{error}</div>;

  // eslint-disable-next-line no-unused-vars
  const _forceUseBuildTag = BUILD_TAG; 

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="play" element={<Play />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />
        <Route path="questions" element={<QuestionBank questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
export default App;