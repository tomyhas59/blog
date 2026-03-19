import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

// ===== 애니메이션 =====
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

// ===== 헤더 컨테이너 =====
export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: ${(props) => props.theme.backgroundColor};
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  z-index: 1000;
  animation: ${slideDown} 0.3s ease-out;
  backdrop-filter: blur(10px);
  background-color: ${(props) => props.theme.backgroundColor}f5;
`;

export const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 0 12px;
    height: 56px;
  }
`;

// ===== 왼쪽 섹션 (로고) =====
export const LeftSection = styled.div`
  flex-shrink: 0;
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 50px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  border-radius: 50%;
  color: white;
  font-size: 16px;

  i {
    animation: ${fadeIn} 0.5s ease;
  }
`;

export const LogoText = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: ${(props) => props.theme.charColor};
  letter-spacing: -0.5px;
  font-family:
    "Poppins",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  @media (max-width: 480px) {
    display: none;
  }
`;

// ===== 중앙 섹션 (검색) =====
export const CenterSection = styled.div`
  flex: 1;
  max-width: 600px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

// ===== 오른쪽 섹션 (네비게이션) =====
export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;

  &.desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

export const NavItem = styled.li`
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.4s ease;

  &:nth-child(1) {
    animation-delay: 0.1s;
  }
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }
`;

// ===== 네비게이션 링크 (회원가입/로그인) =====
export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  transition: all 0.2s ease;

  i {
    font-size: 14px;
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.mainColor};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    span {
      display: none;
    }
    padding: 8px 12px;
  }
`;

// ===== 아이콘 버튼 (채팅 등) =====
export const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.mainColor};
  }

  &:active {
    transform: scale(0.9);
  }
`;

// ===== 텍스트 버튼 (로그아웃) =====
export const TextButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: transparent;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
    color: ${(props) => props.theme.mainColor};
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

// ===== 프로필 래퍼 =====
export const ProfileWrapper = styled.div`
  position: relative;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${(props) => props.theme.borderColor};
  transition: border-color 0.2s ease;

  ${ProfileWrapper}:hover & {
    border-color: ${(props) => props.theme.mainColor};
  }
`;

// ===== 알림 뱃지 =====
export const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #ff4757, #ff6348);
  border-radius: 50%;
  border: 2px solid ${(props) => props.theme.backgroundColor};
  animation: ${pulse} 2s ease-in-out infinite;
`;

// ===== 다크모드 토글 =====
export const DarkModeToggle = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background-color: ${(props) => props.theme.activeColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => props.theme.mainColor};
  font-size: 16px;
  transition: all 0.3s ease;
  margin-left: 4px;

  &:hover {
    background-color: ${(props) => props.theme.mainColor};
    color: white;
    transform: rotate(20deg) scale(1.1);
  }

  &:active {
    transform: rotate(20deg) scale(0.95);
  }

  i {
    transition: transform 0.3s ease;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== 모바일 메뉴 버튼 (햄버거) =====
export const MobileMenuButton = styled.button<{ isOpen: boolean }>`
  display: none;
  width: 40px;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: 4px;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 24px;
    height: 2px;
    background-color: ${(props) => props.theme.textColor};
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;

    &:nth-child(1) {
      transform: ${(props) =>
        props.isOpen ? "translateY(7px) rotate(45deg)" : "none"};
    }

    &:nth-child(2) {
      opacity: ${(props) => (props.isOpen ? "0" : "1")};
      transform: ${(props) => (props.isOpen ? "translateX(-10px)" : "none")};
    }

    &:nth-child(3) {
      transform: ${(props) =>
        props.isOpen ? "translateY(-7px) rotate(-45deg)" : "none"};
    }
  }

  &:hover span {
    background-color: ${(props) => props.theme.mainColor};
  }
`;

// ===== 모바일 메뉴 =====
export const MobileMenu = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: calc(100vh - 60px);
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const MobileMenuOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
`;

export const MobileMenuContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background-color: ${(props) => props.theme.backgroundColor};
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  animation: ${slideInFromRight} 0.3s ease;
  transform: translateX(0);
`;

export const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px 0;
`;

export const MobileNavItem = styled.li`
  /* 스타일은 자식 요소에서 처리 */
`;

export const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;

  i {
    font-size: 18px;
    width: 24px;
    text-align: center;
    color: ${(props) => props.theme.mainColor};
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  &:active {
    background-color: ${(props) => props.theme.borderColor};
  }
`;

export const MobileNavButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.textColor};
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  position: relative;

  i {
    font-size: 18px;
    width: 24px;
    text-align: center;
    color: ${(props) => props.theme.mainColor};
  }

  &:hover {
    background-color: ${(props) => props.theme.activeColor};
  }

  &:active {
    background-color: ${(props) => props.theme.borderColor};
  }

  &.logout {
    color: #ff4757;

    i {
      color: #ff4757;
    }
  }
`;

export const MobileProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  ${ProfileImage} {
    width: 48px;
    height: 48px;
  }
`;

export const MobileProfileName = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => props.theme.charColor};
  margin-bottom: 2px;
`;

export const MobileProfileEmail = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  opacity: 0.6;
`;

export const MobileDivider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.borderColor};
  margin: 8px 0;
`;
