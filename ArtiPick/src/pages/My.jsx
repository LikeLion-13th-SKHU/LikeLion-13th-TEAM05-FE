import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    console.log("헤더로 보낼 토큰:", token);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUserInfo = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const res = await axios.get(`${API_BASE_URL}/auth/me`, { headers });
      const user = res.data.data;
      setUserName(user?.name || "사용자");
      setEmail(user?.email || "");
    } catch (err) {
      console.error("사용자 정보 가져오기 실패:", err);
    }
  };

  const fetchBookmarkedEvents = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const res = await axios.get(`${API_BASE_URL}/api/me/location`, {
        headers,
      });
      setEvents(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("북마크 행사 불러오기 실패:", err);
      setEvents([]);
    }
  };

  const fetchInterestCategories = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      const res = await axios.get(`${API_BASE_URL}/api/me`, { headers });
      const categories = res.data.data?.interestedCategories;
      setSelectedCategories(Array.isArray(categories) ? categories : []);
    } catch (err) {
      console.error("관심 카테고리 불러오기 실패:", err);
      setSelectedCategories([]);
    }
  };

  const handleSaveCategories = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) return;

      await axios.post(
        `${API_BASE_URL}/api/interest-categories`,
        { categoryNames: selectedCategories },
        { headers }
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

// Styled Components
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
  margin-left: 0;
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
    gap: 0.5rem;
    font-size: 0.9rem;
    cursor: pointer;

    input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border: 2px solid #ccc;
      border-radius: 50%; /* 원 모양 */
      position: relative;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;

      &:checked {
        background-color: #955fdc;
        border-color: #955fdc;
      }

      &:checked::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: white;
      }
    }
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
