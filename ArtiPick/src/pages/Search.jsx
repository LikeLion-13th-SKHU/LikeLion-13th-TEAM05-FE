import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";

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
  ::placeholder {
    color: #a39bb5;
  }
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

  span {
    font-size: 24px;
  }
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
  &:disabled {
    opacity: 0.4;
  }
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

const CATEGORIES = ["전체", "연극", "축제", "전시", "콘서트"];

// 목업 데이터 (API 완성되면 삭제 예정)
const SIDO = [
  "전국",
  "서울특별시",
  "부산광역시",
  "인천광역시",
  "경기도",
  "제주특별자치도",
];

const GUGUN_MAP = {
  전국: ["전체"],
  서울특별시: ["전체", "금천구", "중구", "용산구", "구로구", "중랑구"],
  부산광역시: ["전체", "해운대구", "수영구", "남구"],
  울산광역시: ["전체", "중구", "동구", "남구", "북구", "울주군"],
  경기도: ["전체", "수원시", "용인시"],
  제주특별자치도: ["전체", "제주시", "서귀포시"],
};

function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);

  const [sido, setSido] = useState("서울특별시");
  const gugunOptions = useMemo(() => GUGUN_MAP[sido] ?? ["전체"], [sido]);
  const [gugun, setGugun] = useState("전체");

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchSearchResults({ q, cat, page, sido, gugun }) {
    await new Promise((r) => setTimeout(r, 500)); // 딜레이 있는 척
    const total = 25; // 이것도 임의로 함

    // 목업 데이터 (API 완성되면 삭제 예정)
    const titles = ["디지털 아트 페스티벌", "서울 라이트 페스티벌", "창작 연극 페스티벌", "겨울 콘서트"];
    const types = ["전시", "축제", "연극", "콘서트"];

    const base = Array.from({ length: 4 }, (_, i) => {
      const t = cat !== "전체" ? cat : types[i % 4];
      const name = cat !== "전체" ? cat : titles[i % 4];
      const loc =
        sido === "전국"
          ? ["동대문 DDP", "청계천 일대", "예술의전당", "세종문화회관"][i % 4]
          : gugun !== "전체"
          ? `${sido} ${gugun}`
          : `${sido}`;
      
      return {
        id: `${page}-${i}`,
        type: t,
        title: `${name}`,
        dateText: i % 2 ? "~12월 30일" : "~12월 20일",
        place: loc,
      };
    });

    const filtered = q ? base.filter((it) => it.title.includes(q)) : base;

    return { items: filtered, totalPages: total };
  }

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { items, totalPages } = await fetchSearchResults({
        q: query,
        cat: category,
        page,
        sido,
        gugun,
      });
      setItems(items);
      setTotalPages(totalPages);
    } catch (e) {
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [query, category, page, sido, gugun]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (ignore) return;
      await load();
    })();
    return () => {
      ignore = true;
    };
  }, [load]);

  useEffect(() => {
    setGugun("전체");
    setPage(1);
  }, [sido]);

  return (
    <Page>
      <HeaderArea>
        <Title>
          내게 딱 맞는<br /> <Accent>문화 생활</Accent>을 알아보세요!
        </Title>

        <SearchBar role="search">
          <SearchIcon aria-hidden>🔍</SearchIcon>
          <Input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="키워드로 검색하기"
            aria-label="키워드로 검색하기"
          />
        </SearchBar>

        <Chips role="tablist" aria-label="카테고리 선택">
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              role="tab"
              aria-selected={c === category}
              $active={c === category}
              onClick={() => {
                setPage(1);
                setCategory(c);
              }}
            >
              {c}
            </Chip>
          ))}
        </Chips>

        <Filters>
          <SelectGroup>
            <Label htmlFor="sido">지역</Label>
            <Select
              id="sido"
              value={sido}
              onChange={(e) => setSido(e.target.value)}
            >
              {SIDO.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </SelectGroup>

          <SelectGroup>
            <Label htmlFor="gugun">상세 지역</Label>
            <Select
              id="gugun"
              value={gugun}
              onChange={(e) => {
                setGugun(e.target.value);
                setPage(1);
              }}
              disabled={gugunOptions.length === 1}
            >
              {gugunOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </SelectGroup>
        </Filters>
      </HeaderArea>

      <CardsArea aria-live="polite">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && error && (
          <Empty>
            <span>😢</span>
            <p>{error}</p>
            <Retry onClick={load}>다시 시도</Retry>
          </Empty>
        )}

        {!loading && !error && items.length === 0 && (
          <Empty>
            <span>🔎</span>
            <p>조건에 맞는 결과가 없어요.</p>
          </Empty>
        )}

        {!loading && !error &&
          items.map((it) => <ResultCard key={it.id} item={it} />)}
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
};

// 페이지네이션 개수 제한 (7개)
function renderPageNumbers(current, total, visible = 7) {
  if (total <= visible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];

  pages.push(1);

  if (current > 4) {
    pages.push("…");
  }

  let start = Math.max(2, current - 1);
  let end = Math.min(total - 1, current + 1);

  while (end - start < 2) {
    if (start > 2) start--;
    else if (end < total - 1) end++;
    else break;
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("…");
  }

  pages.push(total);

  return pages;
};

function ResultCard({ item }) {
  const badgeColor = "#955FDCCC";
  return (
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
  );
};

export default Search;