import styled from "styled-components";

// ===== 채팅 컨테이너 =====
export const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: calc(100vh - 56px);
    border-radius: 0;
    border: none;
  }
`;

// ===== 사이드바 =====
export const Sidebar = styled.aside`
  width: 320px;
  border-right: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.backgroundColor};

  @media (max-width: 768px) {
    width: 280px;
  }

  @media (max-width: 480px) {
    width: 100%;
    border-right: none;
  }
`;

// ===== 탭 버튼들 =====
export const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  background-color: ${(props) => props.theme.backgroundColor};
`;

export const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: ${(props) =>
    props.active ? props.theme.activeColor : "transparent"};
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.active ? props.theme.mainColor : "transparent")};
  color: ${(props) =>
    props.active ? props.theme.mainColor : props.theme.textColor};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "700" : "600")};
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
    padding: 14px;
    font-size: 13px;

    span {
      display: none;
    }
  }
`;

export const TabBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 16px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: linear-gradient(135deg, #ff4757, #ff6348);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    top: 6px;
    right: 8px;
  }
`;

// ===== 탭 콘텐츠 =====
export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.borderColor};
    border-radius: 3px;
  }
`;

// ===== 채팅 콘텐츠 =====
export const ChatContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.backgroundColor};

  @media (max-width: 480px) {
    display: none;
  }
`;

// ===== 빈 상태 =====
export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
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
`;

export const EmptyText = styled.p`
  font-size: 15px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.7;
  text-align: center;
  margin: 0;
`;
