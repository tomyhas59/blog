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

// ===== 헤더 =====
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${(props) => props.theme.borderColor};

  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding-bottom: 14px;
  }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  i {
    font-size: 26px;
    color: #ff4757;
  }

  @media (max-width: 768px) {
    font-size: 20px;

    i {
      font-size: 22px;
    }
  }
`;

export const Count = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #ff4757;
  padding: 6px 14px;
  background-color: ${(props) => props.theme.activeColor};
  border-radius: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 5px 12px;
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
  background: linear-gradient(135deg, #ffe5e9, #ffd5dc);
  border-radius: 50%;
  margin-bottom: 20px;

  i {
    font-size: 44px;
    color: #ff4757;
    opacity: 0.5;
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
    color: #ff4757;
  }

  &:hover {
    background: linear-gradient(135deg, #ff4757, #ff6348);
    border-color: #ff4757;
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
