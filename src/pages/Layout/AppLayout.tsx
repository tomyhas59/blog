import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PostForm from "../../components/post/Forms/PostForm";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";

import styled, { keyframes } from "styled-components";

const AppLayout = ({ children }: any) => {
  const { me } = useSelector((state: RootState) => state.user);
  const titleRef = useRef<HTMLInputElement>(null);
  const [togglePostForm, setTogglePostForm] = useState<boolean>(false);
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, []);

  const showPostForm = useCallback(() => {
    setTogglePostForm(true);
  }, []);

  useEffect(() => {
    if (togglePostForm && titleRef.current) {
      titleRef.current.focus();
    }
  }, [togglePostForm]);

  return (
    <LayoutContainer>
      {togglePostForm && (
        <>
          <Overlay onClick={() => setTogglePostForm(false)} />
          <PostForm titleRef={titleRef} setTogglePostForm={setTogglePostForm} />
        </>
      )}
      <Header ref={headerRef} />
      <ContentWrapper headerHeight={headerHeight}>{children}</ContentWrapper>
      {me &&
        (location.pathname === "/" ||
          location.pathname.includes("post") ||
          location.pathname.includes("search")) && (
          <FloatingButton onClick={showPostForm}>
            <FloatingButtonIcon>
              <i className="fas fa-pen"></i>
            </FloatingButtonIcon>
            <FloatingButtonText>글쓰기</FloatingButtonText>
          </FloatingButton>
        )}
      <Footer />
    </LayoutContainer>
  );
};

export default AppLayout;

// ===== 애니메이션 =====
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// ===== 레이아웃 컨테이너 =====
export const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${(props) => props.theme.backgroundColor};
`;

// ===== 콘텐츠 래퍼 =====
export const ContentWrapper = styled.main<{ headerHeight: number }>`
  flex: 1;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  padding: 20px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.3s ease;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

// ===== 플로팅 버튼 (글쓰기) =====
export const FloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.mainColor},
    ${(props) => props.theme.subColor}
  );
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow:
    0 4px 12px rgba(29, 161, 242, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 98;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: ${scaleIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  /* Ripple 효과를 위한 가상 요소 */
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 8px 20px rgba(29, 161, 242, 0.4),
      0 4px 8px rgba(0, 0, 0, 0.15);
    animation: ${float} 2s ease-in-out infinite;

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  &:active {
    transform: translateY(-1px);
    box-shadow:
      0 4px 12px rgba(29, 161, 242, 0.3),
      0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    padding: 0;
    border-radius: 50%;
    justify-content: center;
  }
`;

export const FloatingButtonIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  position: relative;
  z-index: 1;

  i {
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }
`;

export const FloatingButtonText = styled.span`
  position: relative;
  z-index: 1;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  letter-spacing: -0.3px;

  @media (max-width: 768px) {
    display: none;
  }
`;

// ===== 오버레이 (모달 배경) =====
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99;
  animation: ${fadeIn} 0.2s ease;
  cursor: pointer;
`;
