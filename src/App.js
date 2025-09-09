import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

import News from './routes/News';

function App() {
  return (
    <div className="App">
      {/* 네비게이션 메뉴 */}
      <nav>
        <ul>
          <li>
            <Link to="/">홈</Link> {/* 홈 페이지로 이동 */}
          </li>
          <li>
            <Link to="/news">뉴스</Link> {/* 뉴스 페이지로 이동 */}
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<div>홈 페이지</div>} />
        <Route path="/news" element={<News />} />
      </Routes>
    </div>
  );
}

export default App;
