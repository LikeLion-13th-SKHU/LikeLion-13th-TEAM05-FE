import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  const categories = [
    "전시",
    "연극",
    "교육/체험",
    "뮤지컬/오페라",
    "음악/콘서트",
    "국악",
    "행사/축제",
    "무용/발레",
    "아동/가족",
  ];

  // 로그인한 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.data;
      setUserName(user.name || "사용자");
      setEmail(user.email || "");
    } catch (err) {
      console.error("사용자 정보 가져오기 실패:", err);
    }
  };

  // 북마크한 행사 가져오기
  const fetchBookmarkedEvents = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/me/location`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(res.data.data || []);
    } catch (err) {
      console.error("북마크 행사 불러오기 실패:", err);
    }
  };

  // 서버에서 관심 카테고리 가져오기
  const fetchInterestCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/interest-categories`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 서버에서 가져온 관심 카테고리 배열
      setSelectedCategories(res.data.data || []);
    } catch (err) {
      console.error("관심 카테고리 불러오기 실패:", err);
    }
  };

  // 관심 카테고리 저장
  const handleSaveCategories = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interest-categories`,
        { categoryNames: selectedCategories },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("관심 카테고리가 저장되었습니다!");
    } catch (err) {
      console.error("관심 카테고리 저장 실패:", err);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleEventClick = (cultureId) => {
    navigate(`/api/cultures/${cultureId}`);
  };

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 페이지 로드 시 사용자 정보, 북마크, 관심 카테고리 모두 가져오기
  useEffect(() => {
    fetchUserInfo();
    fetchBookmarkedEvents();
    fetchInterestCategories();
  }, []);

  return (
    <Container>
      <ProfileSection>
        <ProfileInfo>
          <UserName>{userName}</UserName>
          <UserEmail>{email}</UserEmail>
        </ProfileInfo>
      </ProfileSection>

      <SectionTitle>내가 저장한 행사</SectionTitle>
      <EventsList>
        {events.length === 0 ? (
          <NoEventMessage>저장한 행사가 없습니다</NoEventMessage>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.eventId}
              onClick={() => handleEventClick(event.eventId)}
            >
              <Badge>{event.categoryName}</Badge>
              <EventName>{event.eventName}</EventName>
              <EventInfo>
                <FaCalendarAlt /> {event.date}
              </EventInfo>
              <EventInfo>
                <FaMapMarkerAlt /> {event.location}
              </EventInfo>
            </EventCard>
          ))
        )}
      </EventsList>

      <SectionTitle>관심 카테고리</SectionTitle>
      <CategoryList>
        {categories.map((category) => (
          <CategoryItem key={category}>
            <label>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange(category)}
              />
              {category}
            </label>
          </CategoryItem>
        ))}
      </CategoryList>
      <SaveButton onClick={handleSaveCategories}>저장하기</SaveButton>
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  font-family: "Pretendard", sans-serif;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const ProfileInfo = styled.div`
  margin-left: 1rem;
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  margin: 0;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #666;
`;

const SectionTitle = styled.h3`
  margin: 1rem 0 0.5rem;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const EventCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  color: #fff;
  background: #8a5cf6;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const EventName = styled.h4`
  font-size: 1rem;
  margin: 0.2rem 0;
`;

const EventInfo = styled.p`
  font-size: 0.9rem;
  color: #444;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0.2rem 0;
`;

const NoEventMessage = styled.p`
  color: #aaa;
  text-align: center;
  padding: 1rem 0;
`;

const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const CategoryItem = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.9rem;
  }
`;

const SaveButton = styled.button`
  margin-top: 1rem;
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 8px;
  background: #8a5cf6;
  color: white;
  font-size: 1rem;
  cursor: pointer;
`;
