import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import checkImg from "../assets/check.png";

const Page = styled.div`
  width: 480px;
  max-width: 480px;
  margin: 0 auto;
  padding: 40px 20px 100px;
  text-align: center;
`;

const Check = styled.img`
  width: 96px; 
  height: 96px;
  margin: 80px auto 24px;
  display: block;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 12px;
`;

const Lead = styled.p`
  color:#666; margin: 0 0 40px;
`;

const BtnBar = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
`;

const Btn = styled.button`
  flex: 1;
  height: 56px;
  border-radius: 28px;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  &.gray { background:#e6e6e6; color:#777; }
  &.purple { background:#955FDC; color:#fff; }
`;

function FestivalRegSuccess() {
  const { state } = useLocation(); // { festivalId, title }
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.festivalId)
        navigate("/", { replace: true });
  }, [state, navigate]);

  return (
    <Page>
      <Check src={checkImg} alt="등록 완료" />
      <Title>등록 완료</Title>
      <Lead>이제 많은 사람들이 이 콘텐츠를 만날 수 있어요!</Lead>
      <BtnBar>
        <Btn className="gray" onClick={() => navigate("/")}>홈으로 가기</Btn>
        <Btn className="purple" onClick={() => navigate(`/festivals/${state?.festivalId}`)}>
          축제상세 보기
        </Btn>
      </BtnBar>
    </Page>
  );
}
export default FestivalRegSuccess;