import { useState } from "react";
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
`

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const H1 = styled.h1`
    font-size: 28px;
    font-weight: 900;
    margin: 0;
`

const Label = styled.label`
    font-weight: 900;
`

const Lead = styled.p`
    color: #444;
    line-height: 1.5;
    white-space: pre-line;
`

const Steps = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`

const Dot = styled.span`
    width: 22px;
    height: 22px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
`

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Input = styled.input`
    height: 48px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1.5px solid #d5d5d5;
    font-size: 16px;
`

const Select = styled.select`
    height: 48px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1.5px solid #d5d5d5;
    font-size: 16px;
    background-color: #fff;
`

const TextArea = styled.textarea`
    min-height: 96px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1.5px solid #d5d5d5;
    font-size: 16px;
`

const BtnBar = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding-top: 12px;
`

const Btn = styled.button`
    flex: 1;
    height: 56px;
    border-radius: 28px;
    font-weight: 900;
    font-size: 16px;
    cursor: pointer;

    &.gray {
        background: #e6e6e6;
        color: #777;
    }
    &.purple {
        background: #955FDC;
        color: #fff;
    }
    &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

function FestivalReg() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        title: "",
        category: "축제",
        startDate: "",
        endDate: "",
        address: "",
        detail: "",
        price: "",
        image: null, //첨부파일 사용 예정
    });

    const update = (patch) => setForm((f) => ({...f, ...patch})); // 특정 필드만 바꿀 수 있게 해주는 함수

    const canNext = () => { //다음 버튼 활성화 여부
        if (step === 1)
            return form.title.trim() !== "" && form.category;
        if (step === 2)
            return !!form.startDate && !!form.endDate;
        if (step === 3)
            return form.address.trim() !== "";
        if (step === 4)
            return true;
        return false;
    };

    const onPrev = (e) => {
        e.preventDefault();
        if (step > 1)
            setStep(step - 1);
    };

    const onNext = (e) => {
        e.preventDefault();
        if (step < 4 && canNext())
            setStep(step + 1);
    };

    const onSubmit = async (e) => { // API 확인 후 작업 예정
        e.preventDefault();
        
    }

    return (
        <Wrap onSubmit={step <4 ? onNext : onSubmit}>
            <Header>
                <Steps>
                    {[1, 2, 3, 4].map((num) => (
                        <Dot>
                            {num}
                        </Dot>
                    ))}
                </Steps>
                <H1>콘텐츠 등록</H1>
                <Lead>
                    {"당신의 축제 또는 전시가\n더 넓은 관객을 만날 수 있도록,\n지금 바로 등록해 보세요!"}
                </Lead>
            </Header>

            {/* 1단계 */}
            {step === 1 && (
                <>
                    <Field>
                        <Label htmlFor="title">콘텐츠 이름</Label>
                        <Input
                            id="title"
                            placeholder="예시: 00축제"
                            value={form.title}
                            onChange={(e) => update({title: e.target.value})}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="category">분류</Label>
                        <Select
                            id="category"
                            value={form.category}
                            onChange={(e) => update({category: e.target.value})}
                        >
                            <option value="축제">축제</option>
                            <option value="전시">전시</option>
                            <option value="공연">공연</option>
                            {/*옵션 더 추가해야함*/}
                        </Select>
                    </Field>
                </>
            )}
            {/* 2단계 */}
            {step === 2 && (
                <>
                    <Field>
                        <Label>시작 날짜</Label>
                        <Input
                            type="date"
                            value={form.startDate}
                            onChange={(e) => update({startDate: e.target.value})}
                        />
                    </Field>
                    <Field>
                        <Label>마감 날짜</Label>
                        <Input
                            type="date"
                            value={form.endDate}
                            onChange={(e) => update({endDate: e.target.value})}
                        />
                    </Field>
                </>
            )}
            {/* 3단계 */}
            {step === 3 && (
                <>
                    <Field>
                        <Label>상세 주소</Label>
                        <Input
                            placeholder="예시: 서울시 00구 00로 / 00체육관"
                            value={form.address}
                            onChange={(e) => update({address: e.target.value})}
                        />
                    </Field>
                    <Field>
                        <Label>상세 정보</Label>
                        <TextArea
                            placeholder="상세 정보를 적어주세요"
                            value={form.detail}
                            onChange={(e) => update({detail: e.target.value})}
                        />
                    </Field>
                </>
            )}
            {/* 4단계 */}
            {step === 4 && (
                <>
                    <Field>
                        <Label>가격</Label>
                        <Input
                            placeholder="예시: 무료 or 10000원"
                            value={form.price}
                            onChange={(e) => update({price: e.target.value})}
                        />
                    </Field>
                    <Field>
                        <Label>포스터/장소 이미지 (선택)</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => update({image: e.target.files?.[0] ?? null})}
                        />
                    </Field>
                </>
            )}
            {/* 버튼 */}
            <BtnBar>
                <Btn type="button" className="gray" onClick={onPrev} disabled={step ===1}>
                    뒤로
                </Btn>
                {step < 4 ? (
                    <Btn type="submit" className="purple" disabled={!canNext()}>
                        다음
                    </Btn>
                ) : (
                    <Btn type="submit" className="purple">
                        등록
                    </Btn>
                )}
            </BtnBar>
        </Wrap>
    );
}

export default FestivalReg;