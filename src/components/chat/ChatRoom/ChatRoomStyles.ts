import styled from "styled-components";

// ===== 채팅방 컨테이너 =====
export const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${(props) => props.theme.backgroundColor};
`;

// ===== 헤더 =====
export const RoomHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.backgroundColor};

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  transition: all 0.2s ease;

  i {
    font-size: 16px;
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.mainColor};
  }

  @media (min-width: 481px) {
    display: none;
  }
`;

export const PartnerInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PartnerAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

export const PartnerName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

export const ExitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    font-size: 14px;
  }

  &:hover {
    background-color: #fff5f5;
    border-color: #ff4757;
    color: #ff4757;
  }

  span {
    @media (max-width: 640px) {
      display: none;
    }
  }
`;
