import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import PostForm from "../../components/PostForm";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";
import useOutsideClick from "../../hooks/useOutsideClick";

const AppLayout = ({ children }: any) => {
  const { me } = useSelector((state: RootState) => state.user);
  const titleRef = useRef<HTMLInputElement>(null);
  const [togglePostForm, setTogglePostForm] = useState<boolean>(false);
  const navigator = useNavigate();

  const showPostForm = useCallback(() => {
    navigator("/");
    setTogglePostForm(true);
  }, [navigator]);

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
      {me && <ShowPostForm onClick={showPostForm}>+</ShowPostForm>}
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
  flex-grow: 1;
  padding: 5px;
  margin-top: 70px;
  @media (max-width: 480px) {
    margin-top: 0;
    padding: 0;
    margin-bottom: 100px;
  }
`;

const ShowPostForm = styled.div`
  width: 100px;
  height: 100px;
  font-size: 100px;
  text-align: center;
  line-height: 80px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: 1px solid;
  position: fixed;
  bottom: 7%;
  right: 5%;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  z-index: 9999;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: 50px;
    line-height: 40px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

export default AppLayout;
