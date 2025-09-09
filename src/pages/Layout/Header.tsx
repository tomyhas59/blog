import React, { forwardRef, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST, REFRESH_TOKEN_REQUEST } from "../../reducer/user";
import Search from "../../components/search/Search";
import { usePagination } from "../../hooks/PaginationProvider";
import { RootState } from "../../reducer";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { UserRoomList } from "../Chat";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../Info/MyInfo";
import { NotificationType, UserType } from "../../types";

interface HeaderProps {
  ref: React.Ref<HTMLDivElement>;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone, me, logInError } = useSelector(
    (state: RootState) => state.user
  );

  const { isDarkMode } = useSelector((state: RootState) => state.post);
  const [chatNotification, setChatNotification] = useState<boolean>(false);
  const [followNotification, setFollowNotification] = useState<boolean>(false);
  const [commentNotification, setCommentNotification] =
    useState<boolean>(false);

  const { setCurrentPage } = usePagination();

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app", {
            withCredentials: true,
          })
        : io("http://localhost:3075", { withCredentials: true });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  //새로고침 로그인 유지 및 헤더 클릭 유저 정보 반환
  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");

    const getUserData = async () => {
      try {
        const response = await axios.get("/user/setUser", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = response.data;
        dispatch({
          type: "SET_USER",
          data: userData,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (accessToken) {
      getUserData();
    }
    if (!accessToken && refreshToken) {
      dispatch({ type: REFRESH_TOKEN_REQUEST });
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchNewFollowersCount = async () => {
      try {
        const response = await axios.get(
          `/user/getNewFollowersCount?userId=${me?.id}`
        );

        const hasNewFollowers = response.data > 0;

        setFollowNotification(hasNewFollowers);
      } catch (err) {
        console.error(err);
      }
    };

    if (me?.id) {
      fetchNewFollowersCount();
    }
  }, [me]);

  useEffect(() => {
    const notRead =
      me?.Notifications?.some(
        (Notification: NotificationType) => Notification.isRead === false
      ) || false;
    setCommentNotification(notRead);
  }, [me?.Notifications]);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  useEffect(() => {
    if (logOutDone) {
      dispatch({
        type: "INITIALIZE_STATE", // 초기화 액션 타입
      });
      navigator("/login");
    }
  }, [dispatch, logOutDone, navigator]);

  const handleLogout = useCallback(() => {
    socket.current?.emit("logoutUser", me?.id);
    dispatch({
      type: LOG_OUT_REQUEST,
    });
    setChatNotification(false);
  }, [dispatch, me?.id, socket]);

  const goToHome = useCallback(() => {
    setCurrentPage(1);
    navigator("/");
    window.location.reload();
  }, [navigator, setCurrentPage]);

  const goToChat = () => {
    if (!me) return alert("로그인이 필요합니다");
    navigator("/chat");
  };

  useEffect(() => {
    const fetchUserChatRooms = async () => {
      if (!me) return;

      try {
        const response = await axios.get(`/post/findChat?userId=${me.id}`);
        const hasUnRead = response.data.some(
          (room: UserRoomList) =>
            room.UnReadMessages.filter((message) => message.UserId !== me?.id)
              .length > 0
        );

        setChatNotification(hasUnRead);
      } catch (error) {
        console.error("Error fetching user chat rooms:", error);
      }
    };
    if (me) {
      fetchUserChatRooms();
    }

    socket.current?.on("unReadMessages", () => {
      fetchUserChatRooms();
    });

    socket.current?.on("joinRoom", () => {
      fetchUserChatRooms();
    });

    const notRead = (user: UserType, type: string) => {
      return (
        user?.Notifications?.filter(
          (notification) => (notification.type = type)
        ).some((notification) => notification.isRead === false) || false
      );
    };

    socket.current?.on("updateNotification", (user) => {
      const followerNotRead = notRead(user, "FOLLOW");
      setFollowNotification(followerNotRead);
      const commentNotRead = notRead(user, "SYSTEM");
      setCommentNotification(commentNotRead);
    });

    return () => {
      socket.current?.off("unReadMessages");
      socket.current?.off("joinRoom");
    };
  }, [me]);

  const toggleDarkMode = useCallback(() => {
    dispatch({
      type: "TOGGLE_DARK_MODE",
    });
  }, [dispatch]);

  return (
    <HeaderContainer ref={ref}>
      <HeaderLogoBtn onClick={goToHome}>TMS</HeaderLogoBtn>
      <Search />
      {!isLoggedIn && (
        <SignList>
          <ListItem>
            <Link to="/signup">회원가입</Link>
          </ListItem>
          <ListItem>
            <Link to="/login">로그인</Link>
          </ListItem>
        </SignList>
      )}

      {isLoggedIn && (
        <SignList>
          <ListItem onClick={goToChat}>
            <span>채팅</span>
            {chatNotification && <Notification>🔔</Notification>}
          </ListItem>
          <ListItem>
            <button onClick={handleLogout}>로그아웃</button>
          </ListItem>
          <ProfileImageWrapper>
            <ProfileImage
              onClick={() => navigator("/info")}
              src={
                me?.Image
                  ? `${baseURL}/${me?.Image?.src}`
                  : `${DEFAULT_PROFILE_IMAGE}`
              }
            />
            {(followNotification || commentNotification) && (
              <Notification>🔔</Notification>
            )}
          </ProfileImageWrapper>
        </SignList>
      )}
      <DarkModeButton onClick={toggleDarkMode}>
        {isDarkMode ? "🌙" : "☀️"}
      </DarkModeButton>
    </HeaderContainer>
  );
});

export default Header;

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${(props) => props.theme.subColor};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px;
  @media (max-width: 768px) {
    position: fixed;
    display: grid;
    grid-template-areas:
      "a b c"
      "d d d";
    top: 0;
    left: 0;
    z-index: 1000;
    gap: 2px;
  }
`;

export const HeaderLogoBtn = styled.button`
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  border: 1px solid;
  padding: 5px 15px;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 768px) {
    grid-area: a;
    font-size: 14px;
    font-weight: bold;
    background: none;
    cursor: pointer;
    text-align: center;
  }
`;

export const SignList = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  gap: 10px;
  @media (max-width: 768px) {
    grid-area: b;
  }
`;

const ListItem = styled.li`
  position: relative;
  background-color: ${(props) => props.theme.mainColor};
  text-align: center;
  padding: 5px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    background-color: ${(props) => props.theme.hoverMainColor};
    color: ${(props) => props.theme.charColor};
  }
  z-index: 0;
  @media (max-width: 768px) {
    font-size: 14px;
    background: none;
    position: relative;
    border: 1px solid;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
`;

const blinkBackground = keyframes`
  0% {
    background-color: red;
  }
  50% {
    background-color: darkred;
  }
  100% {
    background-color: red;
  }
`;

const Notification = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 0.7rem;
  color: #fff;
  background-color: red;
  padding: 2px;
  border-radius: 50%;
  z-index: 999;
  animation: ${blinkBackground} 1s infinite;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #cccccc;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
  &:hover {
    transform: scale(1.1);
    border-color: gray;
  }

  @media (max-width: 768px) {
    &:hover {
      color: ${(props) => props.theme.charColor};
    }
  }
`;

const DarkModeButton = styled.button`
  font-size: 20px;
  transition: transform 0.3s ease, border-color 0.3s ease;
  &:hover {
    transform: scale(1.3);
  }
  @media (max-width: 768px) {
    grid-area: c;
  }
`;
