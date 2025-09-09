import { useState, useEffect } from 'react';
import axios from 'axios';

import NewsItem from './NewsItem'; // 개별 뉴스 아이템 컴포넌트
import styled from 'styled-components'; // CSS-in-JS 스타일링

// 스타일 정의: 반응형 디자인 적용
const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const NewsList = ({ category, fromDate }) => {
  const [articles, setArticles] = useState(null); // 기사 데이터 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 데이터 로딩 시작
      setError(null); // 오류 초기화

      try {
        // 서버에 요청 보내기
        const response = await axios.get(
          `https://newsapi-68cj.onrender.com/news?category=${category}&fromDate=${fromDate}`
        );

        setArticles(response.data.articles); // API에서 가져온 기사 데이터를 상태에 저장
      } catch (e) {
        console.error('뉴스 데이터를 가져오는 중 오류 발생:', e); // 오류 로그 출력
        setError('뉴스 데이터를 불러오는 중 오류가 발생했습니다.');
      }
      setLoading(false); // 데이터 로딩 완료
    };

    fetchData(); // 데이터 가져오기 함수 호출
  }, [category, fromDate]); // category와 fromDate가 변경될 때마다 데이터 다시 가져오기

  // 로딩 상태일 때 표시
  if (loading) {
    return <NewsListBlock>뉴스 데이터를 불러오는 중입니다...</NewsListBlock>;
  }

  // 오류 발생 시 메시지 표시
  if (error) {
    return <NewsListBlock>{error}</NewsListBlock>;
  }

  // 데이터가 없을 경우 메시지 표시
  if (!articles || articles.length === 0) {
    return <NewsListBlock>표시할 뉴스가 없습니다.</NewsListBlock>;
  }

  // 기사 데이터를 화면에 렌더링
  return (
    <NewsListBlock>
      {articles.slice(0, 5).map((article) => (
        <NewsItem key={article.url} article={article} /> // NewsItem 컴포넌트에 기사 데이터 전달
      ))}
    </NewsListBlock>
  );
};

export default NewsList;
