import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";

const Page = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  background: #fff;
`;

const HeaderArea = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  line-height: 1.3;
  text-align: center;
  font-weight: 800;
  margin: 8px 0 0;
`;

const Accent = styled.span`
  color: #955FDCCC;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  border: 2px solid #955FDCCC;
  border-radius: 16px;
  padding: 12px 14px;
`;

const SearchIcon = styled.span`
  font-size: 18px;
  line-height: 0;
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  width: 100%;
  ::placeholder { color: #a39bb5; }
`;

const Chips = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-bottom: 2px;
`;

const Chip = styled.button`
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1.5px solid ${(p) => (p.$active ? "#955FDCCC" : "#e5e0f5")};
  background: ${(p) => (p.$active ? "#f2ecff" : "#fff")};
  color: ${(p) => (p.$active ? "#3a2a55" : "#3a2f55")};
  font-weight: 700;
  cursor: pointer;
`;

const Filters = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const SelectGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  color: #6d6781;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 10px;
  border: 1.5px solid #e9e6f5;
  border-radius: 12px;
  font-size: 15px;
  background: #fff;
`;

const CardsArea = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 10px;
`;

const Card = styled.article`
  padding: 14px;
  border: 1px solid #eee9ff;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(149, 95, 220, 0.1);
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  padding: 5px 8px;
  border-radius: 999px;
  margin-bottom: 8px;
`;

const CardTitle = styled.h2`
  font-size: 15px;
  font-weight: 900;
  margin: 2px 0 8px;
  color: #241e38;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`;

const MetaIcon = styled.span`
  font-size: 14px;
`;

const MetaText = styled.span`
  font-size: 13px;
  color: #3a2f55;
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  border: 1px dashed #e2d9ff;
  border-radius: 16px;
  padding: 24px 16px;
  text-align: center;
  color: #6d6781;
  display: grid;
  gap: 8px;
  span { font-size: 24px; }
`;

const Retry = styled.button`
  justify-self: center;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1.5px solid #955FDCCC;
  background: #f2ecff;
  color: #3a2a55;
  font-weight: 700;
`;

const shimmer = keyframes`
  0% { background-position: -300px 0 }
  100% { background-position: 300px 0 }
`;

const SkeletonBox = styled.div`
  height: 130px;
  border-radius: 14px;
  background: linear-gradient(90deg, #f6f3ff 25%, #efeaff 50%, #f6f3ff 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.1s infinite;
  border: 1px solid #eee9ff;
`;

const SkeletonCard = () => <SkeletonBox />;

const Pagination = styled.nav`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  margin: 18px 0 4px;
`;

const PageBtn = styled.button`
  border: 1px solid #e6e0ff;
  background: #fff;
  padding: 8px 10px;
  border-radius: 12px;
  font-weight: 700;
  color: #3a2a55;
  &:disabled { opacity: 0.4; }
`;

const PageNumber = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1.5px solid ${(p) => (p.$active ? "#955FDCCC" : "#ece8ff")};
  background: ${(p) => (p.$active ? "#f2ecff" : "#fff")};
  color: ${(p) => (p.$active ? "#3a2a55" : "#342a50")};
  font-weight: 800;
`;

const Ellipsis = styled.span`
  padding: 0 6px;
  color: #9a90bf;
  user-select: none;
`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000, // 무한 대기 방지
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API ERROR]", error?.response?.status, error?.message, error?.response?.data);
    throw error;
  }
);

const DEBUG = import.meta.env.DEV; // 배포 때 삭제할 예정

const CATEGORY_CHIPS = [
  { key: "ALL",          label: "전체" },
  { key: "EXHIBITION",   label: "전시" },
  { key: "THEATER",      label: "연극" },
  { key: "EDUCATION",    label: "교육/체험" },
  { key: "MUSICAL",      label: "뮤지컬/오페라" },
  { key: "MUSIC",        label: "음악/콘서트" },
  { key: "TRADITIONAL",  label: "국악" },
  { key: "FESTIVAL",     label: "행사/축제" },
  { key: "DANCE",        label: "무용/발레" },
  { key: "FAMILY",       label: "아동/가족" },
  { key: "ETC",          label: "기타" },
];

const CATEGORY_LABEL_BY_KEY = CATEGORY_CHIPS.reduce((accumulator, current) => {
  accumulator[current.key] = current.label;
  return accumulator;
}, {});

const SIDO = [
  "전국",
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const GUGUN_MAP = {
  전국: ["전체"],
  서울: ["전체", "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구",
    "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
  부산: ["전체", "중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구",
    "연제구", "수영구", "사상구", "기장군"],
  대구: ["전체", "중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  인천: ["전체", "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  광주: ["전체", "동구", "서구", "남구", "북구", "광산구"],
  대전: ["전체", "동구", "중구", "서구", "유성구", "대덕구"],
  울산: ["전체", "중구", "남구", "동구", "북구", "울주군"],
  세종: ["전체"],
  경기: ["전체", "수원시", "용인시", "고양시", "화성시", "성남시", "부천시", "남양주시", "안산시", "평택시", "안양시", "시흥시", "파주시",
    "김포시", "의정부시", "광주시", "하남시", "양주시", "광명시", "군포시", "오산시", "이천시", "안성시", "구리시", "포천시", "의왕시",
    "양평군", "여주시", "동두천시", "과천시", "가평군", "연천군"],
  강원: ["전체", "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군",
    "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  충북: ["전체", "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  충남: ["전체", "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군",
    "홍성군", "예산군", "태안군"],
  전북: ["전체", "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군",
    "고창군", "부안군"],
  전남: ["전체", "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군",
    "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  경북: ["전체", "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군",
    "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  경남: ["전체", "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군",
    "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  제주: ["전체", "제주시", "서귀포시"],
};

function normalizeItem(raw) { // 데이터 불러오기
  const id = raw.id;
  const catKey = raw.category;
  const typeLabel = CATEGORY_LABEL_BY_KEY[catKey] ?? "기타";

  const start = raw.startDate ?? "";
  const end   = raw.endDate ?? "";
  const dateText = raw.dateText ?? (start && end ? `${start} ~ ${end}` : start || end || "");
  
  const place = 
    (typeof raw.placeAddr === "string" && raw.placeAddr.trim()) ||
    (typeof raw.place === "string" && raw.place.trim()) ||
    [raw.area, raw.sigungu].filter(Boolean).join(" ");

  const title = raw.title;

  return { id, type: typeLabel, title, dateText, place };
}

async function fetchSearchResultsAxios({ keyword, area, sigungu, categories, page0, size }) {
  const params = new URLSearchParams(); // 쿼리스트링
  // 공백 제거 후 반환
  if (keyword?.trim())
    params.set("keyword", keyword.trim());
  if (area && area !== "전국")
    params.set("area", area);
  if (sigungu && sigungu !== "전체")
    params.set("sigungu", sigungu);
  if (Array.isArray(categories) && categories.length) {
    categories.forEach((c) => params.append("category", c));
  }
  params.set("page", String(page0));
  params.set("size", String(size));

  if (DEBUG) // api 디버깅용 확인 코드 (삭제 예정)
    console.log("[API][REQUEST] GET /api/search", params.toString());

  const { data } = await api.get("/api/search", { params });

  const pageObj = data.data;
  const list = pageObj.content || [];
  const totalPages = Number(pageObj.totalPages ?? 1);

  return {
    items: list.map(normalizeItem),
    totalPages,
  };
}

function Search() {
  const [query, setQuery] = useState("");

  const [selectedCats, setSelectedCats] = useState([]); // 다중 선택

  const [page, setPage] = useState(1);
  const [size] = useState(4);

  const [sido, setSido] = useState("전국");
  const gugunOptions = useMemo(() => GUGUN_MAP[sido] ?? ["전체"], [sido]);
  const [gugun, setGugun] = useState("전체");

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const areaParam = useMemo(() => (sido === "전국" ? undefined : sido), [sido]);
  const sigunguParam = useMemo(
    () => (sido !== "전국" && gugun !== "전체" ? gugun : undefined),
    [sido, gugun]
  );

  const toggleCategory = (key) => {
    setPage(1);
    if (key === "ALL") {
      setSelectedCats([]); // "전체" 누르면 모두 해제
      return;
    }
    setSelectedCats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const load = useCallback(async () => {
    setLoading(true); // 로딩 중 표시 (스피너)
    setError(""); // 에러 메시지
    try {
      const page0 = Math.max(0, page - 1);
      if (DEBUG) // 파라미터 확인용 디버깅 코드 (배포시 삭제 예정)
        console.log("[LOAD]", { 
          keyword: query,
          area: areaParam,
          sigungu: sigunguParam,
          categories: selectedCats,
          page0,
          size
        });

      const { items, totalPages } = await fetchSearchResultsAxios({ // api 호출
        keyword: query,
        area: areaParam,
        sigungu: sigunguParam,
        categories: selectedCats,
        page0,
        size,
      });

      setItems(items); // 값을 여기에 저장
      setTotalPages(totalPages || 1); // 페이지 기본값 1
    } catch (e) {
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false); // 스피너 제거
    }
  }, [query, areaParam, sigunguParam, selectedCats, page, size]);

  useEffect(() => { // 컴포넌트 사라지면 응답 와도 무시  -> 경고 발생 안하게끔
    let ignore = false;
    (async () => { if (!ignore) await load(); })();
    return () => { ignore = true; };
  }, [load]);

  useEffect(() => { // 지역 바뀌면 페이지 새로고침
    setGugun("전체");
    setPage(1);
  }, [sido]);

  return (
    <Page>
      <HeaderArea>
        <Title>
          내게 딱 맞는<br /> <Accent>문화 생활</Accent>을 알아보세요!
        </Title>

        {/* 검색 */}
        <SearchBar role="search">
          <SearchIcon aria-hidden>🔍</SearchIcon>
          <Input
            value={query}
            onChange={(e) => { setPage(1); setQuery(e.target.value); }}
            placeholder="키워드로 검색하기"
            aria-label="키워드로 검색하기"
          />
        </SearchBar>

        {/* 카테고리 */}
        <Chips role="tablist" aria-label="카테고리 선택">
          {CATEGORY_CHIPS.map((c) => {
            const isAll = c.key === "ALL";
            const active = isAll ? selectedCats.length === 0 : selectedCats.includes(c.key);
            return (
              <Chip
                key={c.key}
                role="tab"
                aria-selected={active}
                $active={active}
                onClick={() => toggleCategory(c.key)}
              >
                {c.label}
              </Chip>
            );
          })}
        </Chips>

        {/* 지역 필터 */}
        <Filters>
          <SelectGroup>
            <Label htmlFor="sido">지역</Label>
            <Select id="sido" value={sido} onChange={(e) => setSido(e.target.value)}>
              {SIDO.map((s) => (<option key={s} value={s}>{s}</option>))}
            </Select>
          </SelectGroup>

          <SelectGroup>
            <Label htmlFor="gugun">상세 지역</Label>
            <Select
              id="gugun"
              value={gugun}
              onChange={(e) => { setGugun(e.target.value); setPage(1); }}
              disabled={gugunOptions.length === 1}
            >
              {gugunOptions.map((g) => (<option key={g} value={g}>{g}</option>))}
            </Select>
          </SelectGroup>
        </Filters>
      </HeaderArea>

      {/* 게시물 */}    
      <CardsArea aria-live="polite">
        {loading && (
          <>
          <SkeletonCard /><SkeletonCard />
          <SkeletonCard /><SkeletonCard />
          </>)}

        {/* 오류 */}  
        {!loading && error && (
          <Empty>
            <span>😢</span>
            <p>{error}</p>
            <Retry onClick={load}>다시 시도</Retry>
          </Empty>
        )}

        {/* 없는 결과 */}
        {!loading && !error && items.length === 0 && (
          <Empty>
            <span>🔎</span>
            <p>조건에 맞는 결과가 없어요.</p>
          </Empty>
        )}

        {!loading && !error && items.map((it) => (
          <ResultCard key={it.id} item={it} />
        ))}
      </CardsArea>

      {/* 페이지네이션 */}
      <Pagination>
        <PageBtn
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="이전 페이지"
        >
          ◀
        </PageBtn>

        {renderPageNumbers(page, totalPages, 7).map((p, i) =>
          typeof p === "number" ? (
            <PageNumber
              key={i}
              onClick={() => setPage(p)}
              $active={p === page}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </PageNumber>
          ) : (
            <Ellipsis key={i}>…</Ellipsis>
          )
        )}

        <PageBtn
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="다음 페이지"
        >
          ▶
        </PageBtn>
      </Pagination>
    </Page>
  );
}

function renderPageNumbers(current, total, visible = 7) {
  if (total <= visible) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 4) pages.push("…");
  let start = Math.max(2, current - 1);
  let end   = Math.min(total - 1, current + 1);
  while (end - start < 2) {
    if (start > 2) start--;
    else if (end < total - 1) end++;
    else break;
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 3) pages.push("…");
  pages.push(total);
  return pages;
}

function ResultCard({ item }) {
  const badgeColor = "#955FDCCC";
  return (
    <Link to={`/detail/${item.id}`} style={{textDecoration: "none"}} >
      <Card role="article">
        <Badge style={{ background: badgeColor }}>{item.type}</Badge>
        <CardTitle>{item.title}</CardTitle>
        <MetaRow>
          <MetaIcon aria-hidden>📅</MetaIcon>
          <MetaText>{item.dateText}</MetaText>
        </MetaRow>
        <MetaRow>
          <MetaIcon aria-hidden>📍</MetaIcon>
          <MetaText>{item.place}</MetaText>
        </MetaRow>
      </Card>
    </Link>
  );
}

export default Search;