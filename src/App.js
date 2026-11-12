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
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";

const Layout = () => (
  <div className="app-container">
    <div className="sidebar"><div className="sidebar-logo">Lập Trình Web</div><NavBar /></div>
    <div className="main-content"><Outlet /></div>
  </div>
);

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [playerName, setPlayerName] = useState("");

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("ltw_cuoc_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("ltw_cuoc_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const controller = new AbortController();
    axios.get("/data/questions.json", { signal: controller.signal })
      .then(res => { setQuestions(res.data); setLoading(false); })
      .catch(err => { if (!axios.isCancel(err)) { setError("Không tải được câu hỏi"); setLoading(false); } });
    return () => controller.abort();
  }, []);

  useEffect(() => { localStorage.setItem("ltw_cuoc_bookmarks", JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem("ltw_cuoc_history", JSON.stringify(history)); }, [history]);

  const toggleBookmark = (id) => setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  const clearHistory = () => setHistory([]);

  if (loading) return <div>Đang tải câu hỏi...</div>;
  if (error) return <div>{error}</div>;

  const _forceUseBuildTag = BUILD_TAG;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />} />
        <Route path="play" element={<Play playerName={playerName} questions={questions} history={history} setHistory={setHistory} />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History history={history} clearHistory={clearHistory} />} />
        <Route path="questions" element={<QuestionBank questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
export default App;