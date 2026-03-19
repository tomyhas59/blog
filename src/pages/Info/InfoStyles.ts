import styled from "styled-components";

// ===== 컨테이너 =====
export const Container = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  gap: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px 16px;
    gap: 20px;
  }
`;

// ===== 사이드바 =====
export const Sidebar = styled.aside`
  width: 240px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: flex;
    overflow-x: auto;
    border-radius: 8px;

    /* 스크롤바 숨김 */
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const MenuItem = styled.li`
  border-bottom: 1px solid ${(props) => props.theme.borderColor};

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    border-bottom: none;
    border-right: 1px solid ${(props) => props.theme.borderColor};
    flex-shrink: 0;

    &:last-child {
      border-right: none;
    }
  }
`;

export const MenuButton = styled.button<{ active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background-color: ${(props) =>
    props.active ? props.theme.activeColor : "transparent"};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;

  ${(props) =>
    props.active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(
        135deg,
        ${props.theme.mainColor},
        ${props.theme.subColor}
      );
    }
  `}

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 12px 16px;
    gap: 6px;
    white-space: nowrap;

    ${(props) =>
      props.active &&
      `
      &::before {
        left: 0;
        right: 0;
        top: auto;
        bottom: 0;
        width: auto;
        height: 3px;
      }
    `}
  }
`;

export const MenuIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 18px;
    color: ${(props) => props.theme.mainColor};
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;

    i {
      font-size: 16px;
    }
  }
`;

export const MenuLabel = styled.span`
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const Badge = styled.span`
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff4757, #ff6348);
  border-radius: 11px;
  font-size: 12px;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    position: absolute;
    top: 6px;
    right: 6px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    font-size: 10px;
  }
`;

// ===== 콘텐츠 =====
export const Content = styled.main`
  flex: 1;
  min-width: 0;
`;

// ===== 기존 InfoStyles와의 호환성을 위한 추가 스타일 =====
export const InfoContainer = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 8px;
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 2px solid ${(props) => props.theme.borderColor};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    border-color: ${(props) => props.theme.mainColor};
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 14px;
  }
`;
