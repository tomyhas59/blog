import styled from "styled-components";

// ===== 채팅 전체 컨테이너 =====
export const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px); /* 헤더 높이 제외 */
  max-width: 1200px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    height: calc(100vh - 60px);
    border-radius: 0;
    border: none;
  }
`;

// ===== 사이드바 (채팅/친구 목록) =====
export const Sidebar = styled.aside<{ isChatOpen: boolean }>`
  width: 320px;
  border-right: 1px solid ${(props) => props.theme.borderColor};
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.backgroundColor};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 100%;
    /* 모바일에서 채팅창이 열리면 목록을 숨김 */
    display: ${(props) => (props.isChatOpen ? "none" : "flex")};
  }
`;

// ===== 채팅창 영역 =====
export const ChatContent = styled.main<{ isOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.backgroundColor};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    /* 모바일에서 채팅창이 닫혀있으면 영역 숨김 */
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    position: fixed;
    top: 60px; /* 헤더 바로 아래부터 시작 */
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    z-index: 100;
  }
`;

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${(props) => props.theme.mainColor};
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;

  i {
    font-size: 20px;
  }
`;

// ===== 탭 관련 스타일 =====
export const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
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
  position: relative;
`;

export const TabBadge = styled.span<{ active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  padding: 2px 8px;
  background-color: ${(props) => props.theme.borderColor};
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;

  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  min-width: 20px;
  height: 18px;

  ${(props) =>
    props.active &&
    `
    background-color: ${props.theme.mainColor}20; /* 메인컬러의 아주 투명한 배경 */
    color: ${props.theme.mainColor};
    opacity: 1;
  `}

  @media (max-width: 768px) {
    margin-left: 4px;
    padding: 1px 6px;
    font-size: 10px;
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.borderColor};
    border-radius: 2px;
  }
`;

// ===== 빈 상태 스크린 =====
export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.activeColor};
  border-radius: 50%;
  margin-bottom: 16px;
  i {
    font-size: 32px;
    color: ${(props) => props.theme.textColor};
    opacity: 0.3;
  }
`;

export const EmptyText = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
`;
