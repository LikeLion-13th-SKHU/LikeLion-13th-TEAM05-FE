import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FiSun, FiCloud } from "react-icons/fi";
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

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Main() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [todayRecs, setTodayRecs] = useState([]);
  const [monthlyRecs, setMonthlyRecs] = useState([]);

  useEffect(() => {
    if (!navigator.geolocation) return console.error("위치 서비스 미지원");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        try {
          const res = await axios.get(`${API_BASE_URL}/api/weather/current`, {
            params: { longitude, latitude },
          });
          console.log(res.data);
          setWeather(res.data.data);
        } catch (err) {
          console.error("날씨 정보 가져오기 실패:", err.response || err);
        }
      },
      (err) => console.error("위치 정보 가져오기 실패:", err)
    );

    const token = localStorage.getItem("accessToken");
    const axiosConfig = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        Accept: "application/json",
      },
      withCredentials: true,
    };

    const fetchToday = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/recommendations/today`,
          axiosConfig
        );
        const recs = Array.isArray(res.data?.data?.recommendations)
          ? res.data.data.recommendations
          : [];
        setTodayRecs(recs);
      } catch (err) {
        console.error("오늘의 추천 가져오기 실패:", err.response || err);
      }
    };

    const fetchMonthly = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/recommendations/monthly`,
          axiosConfig
        );
        const recs = Array.isArray(res.data?.data?.recommendations)
          ? res.data.data.recommendations
          : [];
        setMonthlyRecs(recs);
      } catch (err) {
        console.error("이달의 추천 가져오기 실패:", err.response || err);
      }
    };

    fetchToday();
    fetchMonthly();
  }, []);

  const formatDateRange = (start, end) => {
    if (!start && !end) return "";
    if (start === end) return start;
    return `${start || ""} ~ ${end || ""}`;
  };

  return (
    <Container>
      {weather && (
        <Weather>
          {weather.skyCondition === "1" && <FiSun size={24} color="#FFD700" />}
          {(weather.skyCondition === "3" || weather.skyCondition === "4") && (
            <FiCloud size={24} color="#A9A9A9" />
          )}

          <Temp>{weather.temperature}</Temp>

          <WeatherText>
            {weather.skyCondition === "1"
              ? "맑음"
              : weather.skyCondition === "3" || weather.skyCondition === "4"
              ? "흐림"
              : ""}
          </WeatherText>
        </Weather>
      )}

      <Section>
        <SectionTitle>오늘의 추천</SectionTitle>
        <CardRow>
          {todayRecs.slice(0, 2).map((rec) => (
            <Card key={rec.id}>
              <Badge color="#B197FC">{rec.category}</Badge>
              <CardTitle>{rec.title}</CardTitle>
              <CardInfo>
                <FaCalendarAlt /> {formatDateRange(rec.startDate, rec.endDate)}
              </CardInfo>
              <CardInfo>
                <FaMapMarkerAlt /> {rec.place}
              </CardInfo>
            </Card>
          ))}
        </CardRow>
      </Section>

      <Section>
        <SectionTitle>이달의 추천</SectionTitle>
        {monthlyRecs.map((rec, idx) => (
          <FullCard key={rec.id} $bg={idx === 0 ? "#EDE7FF" : undefined}>
            <Badge color="#FDA7DF">{rec.category}</Badge>
            <CardTitle>{rec.title}</CardTitle>
            <CardInfo>
              <FaCalendarAlt /> {formatDateRange(rec.startDate, rec.endDate)}
            </CardInfo>
            <CardInfo>
              <FaMapMarkerAlt /> {rec.place}
            </CardInfo>
          </FullCard>
        ))}
      </Section>
    </Container>
  );
}

export default Main;
