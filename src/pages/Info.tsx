import React, { useEffect, useMemo, useRef, useState } from "react";
import MyInfo from "./Info/MyInfo";
import MyPosts from "./Info/MyPosts";
import MyComments from "./Info/MyComments";
import MyLikes from "./Info/MyLikes";
import MyFollow from "./Info/MyFollow";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";

const Info = () => {
  const [activeSection, setActiveSection] = useState("myInfo");
  const { me } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [newFollowersCount, setNewFollowersCount] = useState<number>();
  const navigate = useNavigate();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app", {
            withCredentials: true,
          })
        : io("http://localhost:3075", { withCredentials: true });

    if (me) {
      const userInfo = { id: me.id, nickname: me.nickname };
      socket.current.emit("loginUser", userInfo);
    }

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/user/setUser");
        const userData = response.data;
        dispatch({
          type: "SET_USER",
          data: userData,
        });
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, [dispatch]);

  useEffect(() => {
    if (!me) navigate("/");
  }, [me, navigate]);

  useEffect(() => {
    const fetchNewFollowers = async () => {
      if (!me) return;

      try {
        const followResponse = await axios.get(
          `/user/getNewFollowersCount?userId=${me?.id}`
        );
        if (followResponse.data > 0) setNewFollowersCount(followResponse.data);
      } catch (error) {
        console.error("Error fetching user chat rooms:", error);
      }
    };
    if (me) {
      fetchNewFollowers();
    }
  }, [me]);

  const renderSection = useMemo(() => {
    switch (activeSection) {
      case "myInfo":
        return <MyInfo />;
      case "myPosts":
        return <MyPosts />;
      case "myComments":
        return <MyComments />;
      case "myLikes":
        return <MyLikes />;
      case "myFollow":
        return <MyFollow />;
      default:
        return <MyInfo />;
    }
  }, [activeSection]);

  const goToMyFollow = () => {
    setNewFollowersCount(undefined);
    setActiveSection("myFollow");
    socket.current?.emit("followNotiRead", me?.id);
  };

  const notRead = me?.Notifications.filter(
    (noti) => noti.type === "SYSTEM"
  ).some((noti) => noti.isRead === false);

  return (
    <Container>
      <Nav>
        <NavList>
          <NavItem>
            <NavLink
              onClick={() => setActiveSection("myInfo")}
              active={activeSection === "myInfo"}
            >
              내 정보
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => setActiveSection("myPosts")}
              active={activeSection === "myPosts"}
            >
              내가 쓴 글
              {notRead && <NotificationMessage>New</NotificationMessage>}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => setActiveSection("myComments")}
              active={activeSection === "myComments"}
            >
              내가 쓴 댓글
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={() => setActiveSection("myLikes")}
              active={activeSection === "myLikes"}
            >
              좋아요 글
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              onClick={goToMyFollow}
              active={activeSection === "myFollow"}
            >
              {newFollowersCount && newFollowersCount > 0 && (
                <NewFollowersCount>{newFollowersCount}</NewFollowersCount>
              )}
              팔로우
            </NavLink>
          </NavItem>
        </NavList>
      </Nav>
      <SectionWrapper>{renderSection}</SectionWrapper>
    </Container>
  );
};

export default Info;

const Container = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    flex-direction: column;
    width: 95%;
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 20px;
  border-right: 1px solid #eaeaea;
  @media (max-width: 480px) {
    max-width: 100%;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
  }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  @media (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const NavItem = styled.li`
  margin-bottom: 15px;
  @media (max-width: 480px) {
    margin-bottom: 0;
  }
`;

interface NavLinkProps {
  active?: boolean;
}
const NavLink = styled.button<NavLinkProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${(props) => (props.active ? "#007bff" : props.theme.charColor)};
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease, background-color 0.3s ease;
  padding: 10px;
  border-radius: 4px;
  &:hover {
    color: #0056b3;
    background-color: ${(props) => props.theme.backgroundColor};
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    text-align: center;
  }
`;

const SectionWrapper = styled.div`
  flex: 3;
  padding: 20px;
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const NewFollowersCount = styled.div`
  position: absolute;
  top: 0;
  right: -10px;
  background-color: red;
  width: 20px;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
`;

const blinkBackground = keyframes`
  0% {
    background-color: red;
    opacity:1
  }
  50% {
    background-color: darkred;
    opacity:0.5
  }
  100% {
    background-color: red;
    opacity:1
  }
`;

const NotificationMessage = styled.div`
  position: absolute;
  top: 0;
  right: -20px;
  background-color: red;
  border-radius: 50%;
  padding: 2px;
  text-align: center;
  font-weight: bold;
  animation: ${blinkBackground} 1s infinite;
`;
