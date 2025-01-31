import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import PostForm from "../../components/PostForm";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import useOutsideClick from "../../hooks/useOutsideClick";

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

  //OutsideClick----------------------------------------------
  const postFormRef = useRef<HTMLDivElement>(null);

  useOutsideClick([postFormRef], () => {
    setTogglePostForm(false);
  });

  return (
    <LayoutWrapper>
      {togglePostForm && (
        <>
          <Overlay />
          <PostForm
            postFormRef={postFormRef}
            titleRef={titleRef}
            setTogglePostForm={setTogglePostForm}
          />
        </>
      )}
      <Header />
      <ContentWrapper>{children}</ContentWrapper>
      {me &&
        (location.pathname === "/" ||
          location.pathname.includes("post") ||
          location.pathname.includes("search")) && (
          <ShowPostForm onClick={showPostForm}></ShowPostForm>
        )}
      <Footer />
    </LayoutWrapper>
  );
};

const LayoutWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  flex-grow: 1;
  padding: 5px;
  @media (max-width: 480px) {
    padding: 0;
    margin-bottom: 100px;
  }
`;

const ShowPostForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  font-size: 50px;
  text-align: center;
  border-radius: 50%;
  background: ${(props) => props.theme.mainColor};
  color: #fff;
  border: 2px solid ${(props) => props.theme.mainColor};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 15%;
  right: 5%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 98;
  overflow: hidden;
  &::before {
    content: "✚";
    position: absolute;
    font-size: 1.5rem;
    opacity: 1;
    transform: scale(1);
  }
  &:hover {
    transform: scale(1.1);
    background: ${(props) => props.theme.mainColor};
    border-radius: 15%;
    &::before {
      opacity: 0;
      transform: scale(0);
    }
  }
  &:hover::after {
    content: "✚";
    position: absolute;
    font-size: 2rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 30px;
    &::before,
    &::after {
      font-size: 1rem;
    }
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
