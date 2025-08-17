import React, { useState } from "react";
import styled from "styled-components";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FiPhone, FiGlobe } from "react-icons/fi";

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  font-family: sans-serif;
`;

const Category = styled.span`
  display: inline-block;
  background: #e9d5ff;
  color: #7c3aed;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.75rem 0 1.5rem;
  text-align: center;
`;

const Info = styled.div`
  padding-left: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.9rem;
  align-items: flex-start;
  text-align: center;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  justify-content: center;

  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
  }

  div {
    text-align: start; // 서브 텍스트 포함
  }
`;

const SubText = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
`;

const WebLink = styled.a`
  color: #2563eb;
  text-decoration: underline;
  &:hover {
    color: #1d4ed8;
  }
`;

const SaveButton = styled.button`
  padding: 0.6rem 0.8rem;
  margin: 1.5rem 0;
  background: #e5e7eb;
  border: none;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: center;
  display: block;
  margin: 1.5rem auto;
`;

const ReviewInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
`;

const ReviewInput = styled.input`
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;

  &:focus {
    outline: 2px solid #a78bfa;
  }
`;

const ReviewButton = styled.button`
  background: #a78bfa;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0 1rem;
  cursor: pointer;

  &:hover {
    background: #8b5cf6;
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`;

const ReviewCard = styled.div`
  border-bottom: 1px solid #b6b6b6;
  padding: 0.5rem;
  font-size: 0.875rem;
  max-width: 400px; // 카드 최대 크기 제한
  text-align: center;
`;

const Reviewer = styled.p`
  padding-left: 0.4rem;
  font-weight: bold;
  margin-bottom: 0.2rem;
  text-align: left;
`;

function DetailPage() {
  const [reviews, setReviews] = useState([
    "너무 즐거운 시간이었어요! 배우들 연기가 인상적이고 재해석한 부분이 흥미로웠습니다. 대만족 추천! 간단한 감탄 가득합니다.",
    "대학로에서 보기 좋은 연극이에요. 연출이 색다르고 배우들의 연기도 뛰어났습니다.",
  ]);
  const [input, setInput] = useState("");

  const handleAddReview = () => {
    if (!input.trim()) return;
    setReviews([input, ...reviews]);
    setInput("");
  };

  return (
    <Container>
      <Category>연극</Category>
      <Title>햄릿 - 현대적 재해석</Title>

      <Info>
        <InfoItem>
          <FaCalendarAlt color="#EF4444" />
          <span>기간: 12월 15일</span>
        </InfoItem>

        <InfoItem>
          <FaMapMarkerAlt color="#EF4444" />
          <div>
            <p>위치: 대학로 소극장</p>
            <SubText>03086 서울시 종로구 대학로 10길 17 대학로예술극장</SubText>
          </div>
        </InfoItem>

        <InfoItem>
          <FiPhone />
          <span>TEL: 02-3668-0007</span>
        </InfoItem>

        <InfoItem>
          <FiGlobe />
          <WebLink
            href="https://theater.arko.or.kr"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://theater.arko.or.kr
          </WebLink>
        </InfoItem>
      </Info>

      <SaveButton>저장하기</SaveButton>

      <ReviewInputWrapper>
        <ReviewInput
          type="text"
          placeholder="리뷰 작성"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <ReviewButton onClick={handleAddReview}>등록</ReviewButton>
      </ReviewInputWrapper>

      <ReviewList>
        {reviews.map((review, idx) => (
          <ReviewCard key={idx}>
            <Reviewer>하윤</Reviewer>
            <p>{review}</p>
          </ReviewCard>
        ))}
      </ReviewList>
    </Container>
  );
}

export default DetailPage;
