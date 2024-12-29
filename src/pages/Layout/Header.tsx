import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST, REFRESH_TOKEN_REQUEST } from "../../reducer/user";
import Search from "../../components/Search";
import { usePagination } from "../../hooks/PaginationProvider";
import { RootState } from "../../reducer";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { UserRoomList } from "../Chat";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../Info/MyInfo";

const Header = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone, me, logInError } = useSelector(
    (state: RootState) => state.user
  );

  const [chatNotification, setChatNotification] = useState<boolean>(false);
  const [followNotification, setFollowNotification] = useState<boolean>(false);
  const [commentNotification, setCommentNotification] =
    useState<boolean>(false);

  const { setCurrentPage } = usePagination();

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("wss://patient-marina-tomyhas59-8c3582f9.koyeb.app", {
            withCredentials: true,
          })
        : io("http://localhost:3075", { withCredentials: true });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  //새로고침 로그인 유지
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
      me?.Notifications?.some((noti) => noti.isRead === false) || false;
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

  const onLogout = useCallback(() => {
    socket.current?.emit("logoutUser", me?.id);
    dispatch({
      type: LOG_OUT_REQUEST,
    });
    setChatNotification(false);
  }, [dispatch, me?.id, socket]);

  const onGoHome = useCallback(() => {
    setCurrentPage(1);
    navigator("/");
    window.location.reload();
  }, [navigator, setCurrentPage]);

  const onGoToChat = () => {
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

    socket.current?.on("updateNotification", (user) => {
      setFollowNotification(false);
      const notRead =
        user?.Notifications?.some(
          (noti: { isRead: boolean }) => noti.isRead === false
        ) || false;
      setCommentNotification(notRead);
    });

    return () => {
      socket.current?.off("unReadMessages");
      socket.current?.off("joinRoom");
    };
  }, [me]);

  return (
    <HeaderWrapper>
      <LogoContainer>
        <HeaderLogoBtn onClick={onGoHome}>TMS</HeaderLogoBtn>

        <Search />
      </LogoContainer>
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
          <ProfileImageContainer>
            <ProfileImage
              onClick={() => navigator("/info")}
              src={
                me?.Image
                  ? `${baseURL}/${me?.Image?.src}`
                  : `${DEFAULT_PROFILE_IMAGE}`
              }
            />
            {followNotification ||
              (commentNotification && <Notification>🔔</Notification>)}
          </ProfileImageContainer>
          <ListItem onClick={onGoToChat}>
            <span>채팅</span>
            {chatNotification && <Notification>🔔</Notification>}
          </ListItem>
          <ListItem>
            <button onClick={onLogout}>로그아웃</button>
          </ListItem>
        </SignList>
      )}
    </HeaderWrapper>
  );
};
export default Header;

export const HeaderWrapper = styled.header`
  width: 100%;
  padding: 5px;
  background-color: ${(props) => props.theme.subColor};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  @media (max-width: 480px) {
    position: fixed;
    padding: 5px;
    display: grid;
    bottom: 0;
    grid-template-areas: "a b";
    z-index: 999;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 480px) {
    grid-area: b;
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
  @media (max-width: 480px) {
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
    color: ${(props) => props.theme.charColor};
  }
  z-index: 0;
  @media (max-width: 480px) {
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

const ProfileImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
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

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;

    &:hover {
      color: ${(props) => props.theme.charColor};
    }
  }
`;
