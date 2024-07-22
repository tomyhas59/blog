import React, { useEffect, useState } from "react";
import MyInfo from "./Info/MyInfo";
import MyPosts from "./Info/MyPosts";
import MyComments from "./Info/MyComments";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { useNavigate } from "react-router-dom";
import MyLikes from "./Info/MyLikes";
import MyFollow from "./Info/MyFollow";

const Info = () => {
  const [activeSection, setActiveSection] = useState("myInfo");
  const { me } = useSelector((state: RootState) => state.user);
  const navigator = useNavigate();

  console.log("me", me);

  useEffect(() => {
    if (!me) navigator("/");
  }, [me, navigator]);

  const renderSection = () => {
    switch (activeSection) {
      case "myInfo":
        return <MyInfo />;
      case "myPosts":
        return <MyPosts />;
      case "myComments":
        return <MyComments />;
      case "myLikes":
        return <MyLikes />;
      case "myfollow":
        return <MyFollow />;
      default:
        return <MyInfo />;
    }
  };

  return (
    <Container>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink onClick={() => setActiveSection("myInfo")}>
              ▮내 정보
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => setActiveSection("myPosts")}>
              ▮내가 쓴 글
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => setActiveSection("myComments")}>
              ▮내가 쓴 댓글
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => setActiveSection("myLikes")}>
              ▮좋아요 글
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => setActiveSection("myfollow")}>
              ▮팔로우
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
      <SectionWrapper>{renderSection()}</SectionWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 70%;
  margin: 0 auto;
  display: flex;
  @media (max-width: 480px) {
    flex-direction: column;
    width: 90%;
  }
`;

const Nav = styled.nav`
  flex: 1;
  max-width: 200px;
  padding: 20px;
  border-right: 1px solid #ddd;
  @media (max-width: 480px) {
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  @media (max-width: 480px) {
    display: flex;
  }
`;

const NavItem = styled.li`
  margin-bottom: 10px;
  @media (max-width: 480px) {
    margin-left: 10px;
  }
`;

const NavLink = styled.a`
  font-weight: bold;
  cursor: pointer;
  color: ${(props) => props.theme.mainColor};
  text-decoration: none;
  &:hover {
    color: darkblue;
  }
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const SectionWrapper = styled.div`
  flex: 3;
  padding: 20px;
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.8rem;
  }
`;

export default Info;
