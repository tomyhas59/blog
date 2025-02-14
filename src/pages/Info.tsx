import React, { useEffect, useRef, useState } from "react";
import MyInfo from "./Info/MyInfo";
import MyPosts from "./Info/MyPosts";
import MyComments from "./Info/MyComments";
import MyLikes from "./Info/MyLikes";
import MyFollow from "./Info/MyFollow";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../reducer";
import { useLocation, useNavigate } from "react-router-dom";
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

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get("category");

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
    fetchNewFollowers();
  }, [me]);

  const notRead = me?.Notifications.filter(
    (notification) => notification.type === "SYSTEM"
  ).some((notification) => notification.isRead === false);

  const sections = [
    { menu: "myInfo", label: "내 정보" },
    { menu: "myPosts", label: "내가 쓴 글", notRead },
    { menu: "myComments", label: "내가 쓴 댓글" },
    { menu: "myLikes", label: "좋아요 글" },
    { menu: "myFollow", label: "팔로우", newFollowersCount },
  ];

  const renderSection = () => {
    const sections: { [menu: string]: JSX.Element } = {
      myInfo: <MyInfo />,
      myPosts: <MyPosts />,
      myComments: <MyComments />,
      myLikes: <MyLikes />,
      myFollow: <MyFollow />,
    };
    return sections[activeSection] || <MyInfo />;
  };

  const handleSetActiveSection = (category: string) => {
    if (category === "myFollow") {
      setNewFollowersCount(undefined);
      socket.current?.emit("followNotificationRead", me?.id);
    }
    navigate(`/info?category=${category}`);
  };

  useEffect(() => {
    if (categoryParam) setActiveSection(categoryParam);
  }, [categoryParam]);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const menuListRef = useRef<HTMLUListElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (menuListRef.current) {
      const scrollAmount = 200; // 스크롤 이동 거리
      const currentScroll = menuListRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      menuListRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsMouseDown(true);
    setStartX(e.touches[0].clientX);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown) return;
    const distance = e.touches[0].clientX - startX;
    e.currentTarget.scrollLeft = scrollLeft - distance;
  };

  const handleTouchEnd = () => {
    setIsMouseDown(false);
  };

  return (
    <InfoContainer>
      <Menu>
        <div>
          <ScrollButton onClick={() => handleScroll("left")}>◀</ScrollButton>
        </div>
        <MenuList
          ref={menuListRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {sections.map(({ menu, label, notRead, newFollowersCount }) => (
            <MenuItem key={menu}>
              <MenuButton
                onClick={() => handleSetActiveSection(menu)}
                active={activeSection === menu}
              >
                {label}
                {notRead && <NotificationMessage>🔔</NotificationMessage>}
                {newFollowersCount && newFollowersCount > 0 && (
                  <NewFollowersCount>{newFollowersCount}</NewFollowersCount>
                )}
              </MenuButton>
            </MenuItem>
          ))}
        </MenuList>
        <div>
          <ScrollButton onClick={() => handleScroll("right")}>▶</ScrollButton>
        </div>
      </Menu>
      <SectionWrapper>{renderSection()}</SectionWrapper>
    </InfoContainer>
  );
};

export default Info;

const InfoContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Menu = styled.nav`
  position: relative;
  flex: 1;
  padding: 20px;
  border-right: 1px solid #eaeaea;
  @media (max-width: 480px) {
    border-right: none;
    display: flex;
    border-bottom: 1px solid #eaeaea;
  }
`;

const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  width: 90%;
  margin: 0 5px;
  @media (max-width: 480px) {
    flex-direction: row;
    overflow-x: hidden;
  }
`;

const MenuItem = styled.li`
  margin-bottom: 15px;
  @media (max-width: 480px) {
    margin-bottom: 0;
  }
`;

const MenuButton = styled.button<{ active: boolean }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${(props) =>
    props.active ? props.theme.activeColor : props.theme.textColor};
  background-size: 0 4px;
  margin-right: 10px;
  ${(props) =>
    props.active &&
    `
    background-repeat: no-repeat;
    background-size: 100% 4px;
    background-image: linear-gradient(to right, ${props.theme.activeColor}, ${props.theme.activeColor});
    background-position: bottom;

`}
  cursor: pointer;
  transition: background-size 0.4s ease;
  padding-bottom: 10px;
  &:hover {
    color: ${(props) => props.theme.activeColor};
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    text-align: center;
  }
`;

const ScrollButton = styled.button`
  display: none;
  @media (max-width: 480px) {
    display: inline;
    color: ${(props) => props.theme.textColor};
    &:hover {
      color: ${({ theme }) => theme.hoverMainColor};
    }
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
  color: #fff;
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
