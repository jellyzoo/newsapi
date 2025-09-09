require('dotenv').config(); // .env 파일에서 환경 변수 로드
const axios = require('axios'); // HTTP 요청을 위한 라이브러리
const express = require('express'); // 서버 프레임워크
const path = require('path'); // 파일 경로 조작을 위한 Node.js 기본 모듈
const cors = require('cors'); // CORS 설정을 위한 미들웨어
const app = express(); // Express 앱 초기화

// 환경 변수 검증
if (!process.env.API_KEY) {
  console.error('API_KEY 환경 변수가 설정되지 않았습니다.');
  process.exit(1); // 필수 환경 변수가 없으면 서버 종료
}

if (!process.env.PORT) {
  console.warn(
    'PORT 환경 변수가 설정되지 않았습니다. 기본 포트 5000을 사용합니다.'
  );
}

// 미들웨어 설정
app.use(cors()); // CORS 활성화
app.use(express.static(path.join(__dirname, 'build'))); // React 빌드 파일 제공

// 요청 로깅
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // 다음 미들웨어로 넘어감
});

// 기본 경로 ("/") 처리
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html')); // React 앱의 메인 페이지 제공
});

// /news 경로 처리 (뉴스 API 요청)
app.get('/news', async (req, res) => {
  const { category, fromDate } = req.query; // 클라이언트에서 전달된 쿼리 파라미터
  let apiUrl;

  // 카테고리에 따라 API URL 생성
  if (category === 'flowers') {
    apiUrl = `https://newsapi.org/v2/everything?q=꽃 OR 화초 OR 정원 OR 화환 OR 화분&language=ko&sortBy=publishedAt${
      fromDate ? `&from=${fromDate}` : ''
    }&apiKey=${process.env.API_KEY}`;
  } else {
    const query = category === 'all' ? '' : `&category=${category}`;
    apiUrl = `https://newsapi.org/v2/top-headlines?country=us${query}${
      fromDate ? `&from=${fromDate}` : ''
    }&apiKey=${process.env.API_KEY}`;
  }

  try {
    // API 요청
    const response = await axios.get(apiUrl);
    res.json(response.data); // 응답 데이터를 클라이언트에 전달
  } catch (error) {
    console.error('뉴스 API 요청 오류:', error.response?.data || error.message);
    res.status(500).send('뉴스 데이터를 불러오는 중 오류가 발생했습니다.');
  }
});

// React 앱의 모든 경로 처리
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html')); // React 앱의 SPA 라우팅 처리
});

// 글로벌 에러 핸들러
app.use((err, req, res, next) => {
  console.error('서버 에러:', err.message || err);
  res.status(500).send('서버에서 문제가 발생했습니다.');
});

// 서버 실행
app.listen(process.env.PORT || 5000, () => {
  console.log(
    `프록시 서버가 포트 ${process.env.PORT || 5000}에서 실행 중입니다.`
  );
});
