import styled from "styled-components";

// ===== 컨테이너 =====
export const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 20px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

// ===== 탭 헤더 =====
export const TabHeader = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    margin-bottom: 20px;
    gap: 6px;
  }
`;

export const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background-color: ${(props) =>
    props.active ? props.theme.activeColor : "transparent"};
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.active ? props.theme.mainColor : "transparent")};
  font-size: 15px;
  font-weight: ${(props) => (props.active ? "700" : "600")};
  color: ${(props) =>
    props.active ? props.theme.mainColor : props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  i {
    font-size: 16px;
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;

    i {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    span {
      display: none;
    }

    gap: 4px;
  }
`;

export const TabCount = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

// ===== 빈 상태 =====
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

export const EmptyIcon = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.activeColor},
    ${(props) => props.theme.borderColor}
  );
  border-radius: 50%;
  margin-bottom: 20px;

  i {
    font-size: 44px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;

    i {
      font-size: 36px;
    }
  }
`;

export const EmptyText = styled.p`
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

// ===== 더 보기 버튼 =====
export const LoadMoreButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  margin-top: 24px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    font-size: 16px;
    color: ${(props) => props.theme.mainColor};
  }

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    border-color: ${(props) => props.theme.mainColor};
    color: white;
    transform: translateY(-2px);

    i {
      color: white;
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 14px;
    margin-top: 20px;
  }
`;
