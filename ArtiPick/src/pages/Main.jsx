import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FiSun } from "react-icons/fi";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const Container = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  font-family: sans-serif;
`;

const Weather = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const Temp = styled.span`
  font-weight: bold;
  margin: 0 0.5rem;
`;

const WeatherText = styled.span`
  flex: 1;
`;

const Section = styled.div`
  margin-top: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
`;

const CardRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Card = styled.div`
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
`;

const FullCard = styled(Card)`
  margin-bottom: 0.8rem;
  background: ${(props) => props.$bg || "#fff"};
`;

const Badge = styled.span`
  display: inline-block;
  background: ${(props) => props.color || "#ccc"};
  color: white;
  font-size: 0.75rem;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CardInfo = styled.div`
  font-size: 0.85rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.2rem;
`;

// 환경 변수 안전하게 사용
const API_BASE_URL = import.meta.env.VITE_API_URL;

function Main() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (!navigator.geolocation) return console.error("위치 서비스 미지원");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        try {
          const res = await axios.get(`${API_BASE_URL}/api/weather/current`, {
            params: { longitude, latitude }, // 순서 바꿔보기
          });
          console.log(res.data);
          setWeather(res.data.data); // data 안에 실제 날씨가 있음
        } catch (err) {
          console.error("날씨 정보 가져오기 실패:", err.response || err);
        }
      },
      (err) => console.error("위치 정보 가져오기 실패:", err)
    );
  }, []);

  return (
    <Container>
      {/* 날씨 */}
      {weather && (
        <Weather>
          <FiSun size={24} color="#FFD700" />
          <Temp>{weather.temperature}</Temp>
          <WeatherText>{weather.skyCondition}</WeatherText>
        </Weather>
      )}

      {/* 오늘의 추천 */}
      <Section>
        <SectionTitle>오늘의 추천</SectionTitle>
        <CardRow>
          <Card>
            <Badge color="#B197FC">전시</Badge>
            <CardTitle>디지털 아트 페스티벌</CardTitle>
            <CardInfo>
              <FaCalendarAlt /> 12월 20일
            </CardInfo>
            <CardInfo>
              <FaMapMarkerAlt /> 동대문 DDP
            </CardInfo>
          </Card>
          <Card>
            <Badge color="#FDA7DF">축제</Badge>
            <CardTitle>서울 라이트 페스티벌</CardTitle>
            <CardInfo>
              <FaCalendarAlt /> ~12월 30일
            </CardInfo>
            <CardInfo>
              <FaMapMarkerAlt /> 청계천 일대
            </CardInfo>
          </Card>
        </CardRow>
      </Section>

      {/* 이달의 추천 */}
      <Section>
        <SectionTitle>이달의 추천</SectionTitle>
        <FullCard $bg="#EDE7FF">
          <Badge color="#B197FC">콘서트</Badge>
          <CardTitle>윈터 클래식 콘서트</CardTitle>
          <CardInfo>
            <FaCalendarAlt /> 12월 25일
          </CardInfo>
          <CardInfo>
            <FaMapMarkerAlt /> 세종문화회관
          </CardInfo>
        </FullCard>
        <FullCard>
          <Badge color="#FDA7DF">축제</Badge>
          <CardTitle>독서의 밤 - 작가와의 만남</CardTitle>
          <CardInfo>
            <FaCalendarAlt /> 12월 18일
          </CardInfo>
          <CardInfo>
            <FaMapMarkerAlt /> 교보문고 광화문점
          </CardInfo>
        </FullCard>
        <FullCard>
          <Badge color="#FDA7DF">축제</Badge>
          <CardTitle>서울 라이트 페스티벌</CardTitle>
          <CardInfo>
            <FaCalendarAlt /> ~12월 30일
          </CardInfo>
          <CardInfo>
            <FaMapMarkerAlt /> 청계천 일대
          </CardInfo>
        </FullCard>
      </Section>
    </Container>
  );
}

export default Main;
