import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Wrap = styled.form`
  width: 480px;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 20px 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const H1 = styled.h1`
  font-size: 28px;
  font-weight: 900;
  margin: 0;
`;

const Label = styled.label`
  font-weight: 900;
`;

const Required = styled.span`
  color: #d00;
  margin-left: 4px;
`;

const Lead = styled.p`
  color: #444; 
  line-height: 1.5;
  white-space: pre-line;
`;

const Steps = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Dot = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 900;
  background: ${p=>p["data-active"]?"#955FDC":"#eee"};
  color: ${p=>p["data-active"]?"#fff":"#777"};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  > * { flex:1 }
`;

const Input = styled.input`
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1.5px solid #d5d5d5;
  font-size: 16px;
`;

const Select = styled.select`
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1.5px solid #d5d5d5;
  font-size: 16px;
  background: #fff;
`;

const TextArea = styled.textarea`
  min-height: 96px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid #d5d5d5;
  font-size: 16px;
`;

const BtnBar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding-top: 12px;
  background: #fff;
`;

const Btn = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 28px;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  &.gray { background: #e6e6e6; color: #777; }
  &.purple { background: #955FDC; color: #fff; }
  &.disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Badge = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f1f1f1;
  color: #555;
  align-self: flex-start;
`;

const client = axios.create({
  baseURL: (import.meta.env.VITE_API_URL).replace(/\/+$/, ""), // '/'없게 하기
});

client.interceptors.request.use((config) => { // 로그인 해야 할 수 있게 하는 기능
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const CATEGORY_OPTIONS = [
  { enum: "EXHIBITION", label: "전시" },
  { enum: "THEATER", label: "연극" },
  { enum: "EDUCATION", label: "교육/체험" },
  { enum: "MUSICAL", label: "뮤지컬/오페라" },
  { enum: "MUSIC", label: "음악/콘서트" },
  { enum: "TRADITIONAL", label: "국악" },
  { enum: "FESTIVAL", label: "행사/축제" },
  { enum: "DANCE", label: "무용/발레" },
  { enum: "FAMILY", label: "아동/가족" },
  { enum: "ETC", label: "기타" },
];

const LABEL_TO_ENUM = Object.fromEntries(CATEGORY_OPTIONS.map(c => [c.label, c.enum]));

const AREA_OPTIONS = [
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

const SIGUNGU_MAP = {
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

const OFFICIAL_AREA_MAP = { // 공식 명칭으로 바꾸는 코드 (좌표 불러올 때 필요함)
  서울: "서울특별시", 부산: "부산광역시", 대구: "대구광역시", 인천: "인천광역시",
  광주: "광주광역시", 대전: "대전광역시", 울산: "울산광역시", 세종: "세종특별자치시",
  경기: "경기도", 강원: "강원특별자치도", 충북: "충청북도", 충남: "충청남도",
  전북: "전북특별자치도", 전남: "전라남도", 경북: "경상북도", 경남: "경상남도",
  제주: "제주특별자치도",
};

const toOfficialArea = (short) => OFFICIAL_AREA_MAP[short] ?? short;

function FestivalReg() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",  // 필수
    category: "전시",
    startDate: "", // 필수
    endDate: "", // 필수

    // 3단계 (필수)
    area: "",        // 필수
    place: "",       // 필수
    sigungu: "",     // 필수
    price: "",
    address: "",     // 필수
    detail: "",

    // 좌표(숨김)
    gpsX: "", // longitude
    gpsY: "", // latitude
  });

  const [geoStatus, setGeoStatus] = useState(""); // 위치 상태
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const sigunguOptions = useMemo( // area 값에 따라서 자동으로 시군구 배열이 바뀌게 하는 역할
    () => (form.area && SIGUNGU_MAP[form.area]) ? SIGUNGU_MAP[form.area] : [],
    [form.area]
  );

  const validDateRange = // 날짜 선택 후 넘기는 역할
    !form.startDate || !form.endDate || new Date(form.startDate) <= new Date(form.endDate);

  const canNext = () => { // 넘어갈 수 있는지의 여부
    if (step === 1)
      return form.title.trim() !== "" && form.category;
    if (step === 2)
      return !!form.startDate && !!form.endDate && validDateRange;
    if (step === 3) {
      return (
        form.place.trim() !== "" &&
        form.area.trim() !== "" &&
        form.sigungu.trim() !== "" &&
        form.address.trim() !== ""
      );
    }
    if (step === 4)
      return true;
    return false;
  };

  const onPrev = (e) => { // 이전 버튼
    e.preventDefault();
    if (step > 1)
      setStep(step - 1);
  };

  const fetchCoords = async () => { // 주소를 좌표로 바꾸는 코드
    const officialArea = toOfficialArea(form.area); // 행정명(area)

    const sigungu = form.sigungu && form.sigungu !== "전체" ? form.sigungu : ""; // 행정명(sigungu)

    const clean = (s) => // 중복 제거 함수
      s.replace(/\s+/g, " ").trim()
       .replace(officialArea, "").replace(sigungu, "").trim();

    const addrOnly = clean(form.address);
    const placeOnly = clean(form.place);

    const candidates = [ // 주소 3가지 경우의 수
      `${officialArea} ${sigungu} ${addrOnly}`,
      `${officialArea} ${sigungu} ${placeOnly}`,
      `${officialArea} ${addrOnly}`,
    ].map(clean).filter(Boolean);

    for (const addr of candidates) { // 좌표 요청
      try {
        const response = await client.get("/api/location/coordinates", {
          params: { address: addr },
          headers: { Accept: "*/*" },
        });
        const { longitude, latitude } = response?.data?.data || {};
        if (longitude && latitude) {
          update({ gpsX: String(longitude), gpsY: String(latitude) });
          setGeoStatus("위치 확인 완료");
          return { longitude, latitude, used: addr };
        }
      } catch {
        // try에서 오류나면 다음 주소 후보로 넘기기
      }
    }
    setGeoStatus("위치 확인 실패");
    return null;
  };

  const onNext = async (e) => {
    e.preventDefault();
    if (step === 3 && canNext()) {
      setGeoStatus("위치 확인 중…");
      await fetchCoords(); // 실패해도 다음으로 진행
    }
    if (step < 4 && canNext()) setStep(step + 1);
  };

  const onSelectArea = (value) => { // 지역 바꾸면 시군구 초기화
    setForm((f) => ({ ...f, area: value, sigungu: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!validDateRange) {
      alert("마감 날짜는 시작 날짜 이후여야 해요.");
      return;
    }
    if (!form.place.trim() || !form.address.trim()) {
      alert("장소명(place)과 상세 주소(placeAddr)는 반드시 입력해야 합니다.");
      return;
    }
    if (!form.gpsX || !form.gpsY) {
      setGeoStatus("위치 확인 중…");
      await fetchCoords();
    }

    const payload = {
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate,
      place: form.place, // 필수
      placeAddr: form.address, // 필수
      category: LABEL_TO_ENUM[form.category] ?? "FESTIVAL",
      area: form.area, // 짧은 표기 저장
      sigungu: form.sigungu,
      price: form.price || "무료",
      placeUrl: form.placeUrl || "",
      phone: form.phone || "",
      contents: form.detail || "",
      ...(form.gpsX && form.gpsY ? { gpsX: form.gpsX, gpsY: form.gpsY } : {}),
    };

    setSubmitting(true);

    try { // 제출 성공 페이지로 이동
      const response = await client.post("/api/cultures", payload, {
        headers: { "Content-Type": "application/json", Accept: "*/*" },
      });
      const createdId = response?.data?.data?.id;
      navigate("/festivalreg/success", {
        state: { festivalId: createdId, title: form.title },
        replace: true,
      });
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrap onSubmit={step < 4 ? onNext : onSubmit}>
      <Header>
        <Steps aria-label="등록 단계">
          {[1, 2, 3, 4].map((num) => (
            <Dot key={num} data-active={num === step}>{num}</Dot>
          ))}
        </Steps>
        <H1>콘텐츠 등록</H1>
        <Lead>{"당신의 축제 또는 전시가\n더 넓은 관객을 만날 수 있도록,\n지금 바로 등록해 보세요!"}</Lead>
      </Header>

      {/* 1단계 */}
      {step === 1 && (
        <>
          <Field>
            <Label htmlFor="title">콘텐츠 이름<Required>*</Required></Label>
            <Input
              id="title"
              placeholder="예시: 00축제"
              value={form.title}
              onChange={(e) => update({ title: e.target.value })}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="category">분류</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => update({ category: e.target.value })}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.enum} value={opt.label}>{opt.label}</option>
              ))}
            </Select>
          </Field>
        </>
      )}

      {/* 2단계 */}
      {step === 2 && (
        <>
          <Row>
            <Field>
              <Label htmlFor="startDate">시작 날짜<Required>*</Required></Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => update({ startDate: e.target.value })}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="endDate">마감 날짜<Required>*</Required></Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) => update({ endDate: e.target.value })}
                required
              />
            </Field>
          </Row>
          {!validDateRange && (
            <Lead style={{ color: "#d00" }}>시작 날짜보다 빠른 마감 날짜는 선택할 수 없어요.</Lead>
          )}
        </>
      )}

      {/* 3단계 */}
      {step === 3 && (
        <>
          <Row>
            <Field>
              <Label htmlFor="area">지역<Required>*</Required></Label>
              <Select
                id="area"
                value={form.area}
                onChange={(e) => onSelectArea(e.target.value)}
                required
                aria-required="true"
              >
                <option value="" disabled>지역 선택</option>
                {AREA_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </Select>
            </Field>
            <Field>
              <Label htmlFor="sigungu">시군구<Required>*</Required></Label>
              <Select
                id="sigungu"
                value={form.sigungu}
                onChange={(e) => update({ sigungu: e.target.value })}
                disabled={!form.area}
                required
                aria-required="true"
              >
                <option value="" disabled>{form.area ? "시군구 선택" : "먼저 지역을 선택하세요"}</option>
                {sigunguOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </Select>
            </Field>
          </Row>

          <Row>
            <Field>
              <Label htmlFor="place">장소명<Required>*</Required></Label>
              <Input
                id="place"
                placeholder="예: 경복궁 / 00체육관"
                value={form.place}
                onChange={(e) => update({ place: e.target.value })}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="price">가격</Label>
              <Input
                id="price"
                placeholder="예: 무료 또는 10000원"
                value={form.price}
                onChange={(e) => update({ price: e.target.value })}
              />
            </Field>
          </Row>

          <Field>
            <Label htmlFor="address">상세 주소<Required>*</Required></Label>
            <Input
              id="address"
              placeholder="예: 00로 00 (지역/시군구는 위에서 선택)"
              value={form.address}
              onChange={(e) => update({ address: e.target.value })}
              required
            />
            {geoStatus && <Badge>{geoStatus}</Badge>}
          </Field>

          <Field>
            <Label htmlFor="detail">상세 정보(contents)</Label>
            <TextArea
              id="detail"
              placeholder="상세 정보를 적어주세요"
              value={form.detail}
              onChange={(e) => update({ detail: e.target.value })}
            />
          </Field>
        </>
      )}

      {/* 4단계 */}
      {step === 4 && (
        <>
          <Row>
            <Field>
              <Label htmlFor="placeUrl">홈페이지Url</Label>
              <Input
                id="placeUrl"
                placeholder="https://example.com"
                value={form.placeUrl}
                onChange={(e) => update({ placeUrl: e.target.value })}
              />
            </Field>
            <Field>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                placeholder="예: 02-1234-5678"
                value={form.phone}
                onChange={(e) => update({ phone: e.target.value })}
              />
            </Field>
          </Row>
        </>
      )}

      {/* 버튼 */}
      <BtnBar>
        <Btn type="button" className="gray" onClick={onPrev} disabled={step === 1 || submitting}>
          뒤로
        </Btn>
        {step < 4 ? (
          <Btn type="submit" className={`purple ${!canNext() ? "disabled" : ""}`} disabled={!canNext() || submitting}>
            다음
          </Btn>
        ) : (
          <Btn type="submit" className={`purple ${submitting ? "disabled" : ""}`} disabled={submitting}>
            {submitting ? "등록 중..." : "등록"}
          </Btn>
        )}
      </BtnBar>
    </Wrap>
  );
}

export default FestivalReg;