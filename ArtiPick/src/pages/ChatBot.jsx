import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import AvatarImage from "../assets/avatar.png";

const Wrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DayDivider = styled.div`
  align-self: center;
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 96px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 320px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NameTime = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  strong { font-size: 14px; }
  span { font-size: 12px; color: #9ca3af; }
`;

const Avatar = styled.div`
  inline-size: 36px;
  aspect-ratio: 1 / 1;
  flex: 0 0 36px;
  border-radius: 50%;
  overflow: hidden;
  background: #eee;
  display: grid;
  place-items: center;
  box-sizing: border-box;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: inherit;
`;

const Bubble = styled.div`
  background: #eeeeee;
  color: #111827;
  border-radius: 14px;
  padding: 10px 12px;
  line-height: 1.45;
  max-width: 80%;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  white-space: pre-line;
`;

const RowUser = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UserBubble = styled(Bubble)`
  background: #955fdccc;
  color: #fff;
  white-space: pre-line;
`;

const InputBar = styled.div`
  position: sticky; bottom: 0; left: 0; right: 0;
  padding: 12px 16px 16px;
  background: #fff;
  display: grid; grid-template-columns: 1fr 52px; gap: 12px;
`;

const Input = styled.input`
  height: 44px;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  padding: 0 14px;
  background: #fff;
  outline: none;
  font-size: 15px;
  &:focus { border-color: #955fdccc; box-shadow: 0 0 0 3px rgba(124,58,237,.14); }
`;

const SendBtn = styled.button`
  width: 52px; height: 52px; border-radius: 50%; border: none;
  background: #955fdccc; color: #fff; display: grid; place-items: center;
  cursor: pointer;
  &:disabled { opacity: .5; cursor: default; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const SkelRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const SkelRowRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SkelAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e9e9e9;
`;

const SkelBubble = styled.div`
  width: 62%;
  height: 46px;
  border-radius: 14px;
  background: #eee;
  background-image: linear-gradient(90deg, #eee 0px, #f5f5f5 40px, #eee 80px);
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s linear infinite;
`;
const ErrorBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  background: #ef4444;
  color: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
`;

const API_BASE =import.meta.env.VITE_API_URL;

const TOKEN_KEY = "accessToken"; // 로그인 해야 챗봇 이용 가능

function buildApiBase(base) { // /api 붙이는 기능
  const trimmed = (base || "").replace(/\/+$/, "");
  if (/\/api$/.test(trimmed))
    return trimmed;  // 이미 /api로 끝나면 그대로
  return `${trimmed}/api`;
}

const client = axios.create({
  baseURL: buildApiBase(API_BASE),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function fetchHistory() {
  const response = await client.get("/chat/history");
  return Array.isArray(response?.data?.data) ? response.data.data : [];
}

async function sendMessageAPI(message) {
  const response = await client.post("/chat/send", { message });
  return response?.data;
}

const uuid = () => Math.random().toString(36).slice(2) + Date.now(); // 메세지 구분용

const isAI = (t) => String(t).toUpperCase() === "AI"; // ai가 보낸 건지 확인

const fmtTime = (iso) => { // 몇 시에 보낸 건지
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

function normalizeContent(content) {
  if (typeof content !== "string")
    return String(content ?? "");
  const trimmed = content.trim();
  if (!trimmed)
    return "";

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const obj = JSON.parse(trimmed);
      if (typeof obj.answer === "string" && obj.answer.trim())
        return obj.answer.trim();
      if (typeof obj.message === "string" && obj.message.trim())
        return obj.message.trim();
      if (obj?.keywords) {
        const { when, where, Category, weather, emotion, radius_km } = obj.keywords;
        const parts = [
          when ? `when=${when}` : null,
          where ? `where=${where}` : null,
          Category ? `category=${Category}` : null,
          weather ? `weather=${weather}` : null,
          emotion ? `emotion=${emotion}` : null,
          radius_km != null ? `radius=${radius_km}km` : null,
        ].filter(Boolean);
        if (parts.length)
            return `해석된 의도: ${parts.join(", ")}`;
      }
      return JSON.stringify(obj, null, 2);
    } catch {
      return content;
    }
  }
  return content;
}

function welcomeMessage() { // 첫 메세지
  return {
    id: `welcome-${Math.random().toString(36).slice(2)}`,
    content: [
      "지금 이 동네에서 뭐 재밌는 거 없을까 고민 중이셨나요?",
      "",
      "그렇다면 잘 오셨어요 👍",
      "",
      "문화 큐레이터가 내가 원하는 축제나 전시를 추천해드릴게요!",
    ].join("\n"),
    messageType: "AI",
    timestamp: new Date().toISOString(),
    pending: false,
  };
}

function ChatBot() {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const pollTimer = useRef(null);
  const isAuthed = !!localStorage.getItem(TOKEN_KEY);

  useEffect(() => { // 로그인 안 하면 로그인 화면으로 이동시키기
    if (!isAuthed) {
      const next = encodeURIComponent(location.pathname || "/chatbot");
      navigate(`/login?next=${next}`, { replace: true });
    }
  }, [isAuthed, navigate, location.pathname]);

  if (!isAuthed) // 깜빡임 방지
    return null;

  useEffect(() => { // 대화 기록 불러오는 코드
    let mounted = true;
    (async () => {
      try {
        const data = await fetchHistory();
        if (!mounted)
          return;

        let list = data.map((m) => ({
          id: uuid(),
          content: normalizeContent(m.content),
          messageType: m.messageType,
          timestamp: m.timestamp,
          pending: false,
        }));

        if (list.length === 0)
          list = [welcomeMessage()];
        setMessages(list);
      } catch (e) {
        const status = e?.response?.status;
        if (status === 401 || status === 403) {
          const next = encodeURIComponent(location.pathname || "/chatbot");
          navigate(`/login?next=${next}`, { replace: true });
          return;
        }
        setMessages([welcomeMessage()]);
        setError("대화 기록을 불러오지 못했어요.");
      } finally {
        if (mounted)
          setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      if (pollTimer.current)
        clearInterval(pollTimer.current);
    };
  }, [navigate, location.pathname]);

  useEffect(() => { // 자동 스크롤
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const hasPendingAI = useMemo( // 답변 기다리는 상태
    () => messages.some((m) => m.pending && isAI(m.messageType)),
    [messages]
  );

  useEffect(() => { // 서버에 새로운 기록이 있는지 확인
    if (hasPendingAI && !polling) {
      setPolling(true);
      pollTimer.current = setInterval(async () => {
        try {
          const fresh = await fetchHistory();
          setMessages(
            fresh.map((m) => ({
              id: uuid(),
              content: normalizeContent(m.content),
              messageType: m.messageType,
              timestamp: m.timestamp,
              pending: false,
            }))
          );
        } catch (e) {
          const status = e?.response?.status;
          if (status === 401 || status === 403) {
            const next = encodeURIComponent(location.pathname || "/chatbot");
            navigate(`/login?next=${next}`, { replace: true });
          }
        }
      }, 2000);
    }
    if (!hasPendingAI && polling) {
      setPolling(false);
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    }
  }, [hasPendingAI, polling, navigate, location.pathname]);

  const onSend = async () => { // 전송 로직
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setError("");

    const nowISO = new Date().toISOString();
    const userMsg = {
      id: uuid(),
      content: text,
      messageType: "USER",
      timestamp: nowISO,
      pending: false,
    };
    const aiPlaceholder = {
      id: "pending-" + uuid(),
      content: "답변 생성 중…",
      messageType: "AI",
      timestamp: nowISO,
      pending: true,
    };
    setMessages((prev) => [...prev, userMsg, aiPlaceholder]);
    setInput("");

    try {
      const response = await sendMessageAPI(text);
      const aiText = normalizeContent(response?.data ?? "");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholder.id
            ? { ...m, content: aiText || "응답이 비어 있어요.", pending: false }
            : m
        )
      );

      setTimeout(async () => {
        try {
          const fresh = await fetchHistory();
          setMessages(
            fresh.map((m) => ({
              id: uuid(),
              content: normalizeContent(m.content),
              messageType: m.messageType,
              timestamp: m.timestamp,
              pending: false,
            }))
          );
        } catch (e) {
          const status = e?.response?.status;
          if (status === 401 || status === 403) {
            const next = encodeURIComponent(location.pathname || "/chatbot");
            navigate(`/login?next=${next}`, { replace: true });
          }
        }
      }, 300);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        const next = encodeURIComponent(location.pathname || "/chatbot");
        navigate(`/login?next=${next}`, { replace: true });
        return;
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiPlaceholder.id
            ? { ...m, content: "전송 실패. 잠시 후 다시 시도해 주세요.", pending: false }
            : m
        )
      );
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "메시지 전송 실패";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Wrap>
      <DayDivider>오늘</DayDivider>

      <List ref={listRef} aria-live="polite" aria-busy={loading}>
        {loading ? (
          <>
            <SkelRow><SkelAvatar /><SkelBubble /></SkelRow>
            <SkelRowRight><SkelBubble /></SkelRowRight>
          </>
        ) : (
          messages.map((m) =>
            isAI(m.messageType) ? (
              <Row key={m.id}>
                <Avatar>
                    <AvatarImg src={AvatarImage} alt="AI 아바타" />
                </Avatar>
                <Col>
                  <NameTime>
                    <strong>ARTIPICK_Flag</strong>
                    <span>{fmtTime(m.timestamp)}</span>
                  </NameTime>
                  <Bubble>{m.content}</Bubble>
                </Col>
              </Row>
            ) : (
              <RowUser key={m.id}>
                <UserBubble>{m.content}</UserBubble>
              </RowUser>
            )
          )
        )}
      </List>

      {/* 입력 바 */}
      <InputBar>
        <Input
          placeholder="메시지를 입력하세요…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={sending}
        />
        <SendBtn onClick={onSend} disabled={!input.trim() || sending} aria-label="전송">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"> 
            <path d="M3 11l18-8-8 18-2-7-8-3z" fill="white" />
          </svg>
        </SendBtn>
      </InputBar>

      {error && <ErrorBar role="status">{error}</ErrorBar>}
    </Wrap>
  );
}

export default ChatBot;