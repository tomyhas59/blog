import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import PostForm from "../../components/post/PostForm";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";

const AppLayout = ({ children }: any) => {
  const { me } = useSelector((state: RootState) => state.user);
  const titleRef = useRef<HTMLInputElement>(null);
  const [togglePostForm, setTogglePostForm] = useState<boolean>(false);
  const location = useLocation();

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
          <Overlay />
          <PostForm titleRef={titleRef} setTogglePostForm={setTogglePostForm} />
        </>
      )}
      <Header />
      <ContentWrapper>{children}</ContentWrapper>
      {me &&
        (location.pathname === "/" ||
          location.pathname.includes("post") ||
          location.pathname.includes("search")) && (
          <ShowPostFormButton onClick={showPostForm}>글쓰기</ShowPostFormButton>
        )}
      <Footer />
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.main`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  padding: 5px;
  min-height: 80vh;
  @media (max-width: 768px) {
    margin-top: 10vh;
    min-height: 90vh;
  }
`;

const ShowPostFormButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  text-align: center;
  border-radius: 50%;
  background: ${(props) => props.theme.mainColor};
  color: #fff;
  position: fixed;
  bottom: 15%;
  right: 5%;
  cursor: pointer;
  transition: all 0.5s ease;
  z-index: 98;
  overflow: hidden;
  &:hover {
    transform: translateY(-2px);
    border: 1px solid;
    color: ${(props) => props.theme.textColor};
  }
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 12px;
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
`;

export default AppLayout;
