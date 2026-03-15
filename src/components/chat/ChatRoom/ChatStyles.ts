import styled from "styled-components";

export const RoomContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${(props) => props.theme.backgroundColor || "#fff"};
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  height: 600px; // 기본 높이 설정

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
    z-index: 2000;
  }
`;

// 상단 드래그바 형태의 닫기 핸들
export const CloseHandle = styled.button`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #d1d1d1;
  width: 60px;
  height: 6px;
  border-radius: 0 0 10px 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 10px;
`;

export const PartnerInfo = styled.h2`
  color: ${(props) => props.theme.mainColor};
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const ExitActionBtn = styled.button`
  border-radius: 6px;
  padding: 6px 12px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
`;
