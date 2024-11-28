import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST, REFRESH_TOKEN_REQUEST } from "../../reducer/user";
import Search from "../../components/Search";
import { usePagination } from "../PaginationProvider";
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
  const [notification, setNotification] = useState<boolean>(false);
  const [followNotification, setFollowNotification] = useState<boolean>(false);
  const { paginate } = usePagination();

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");

    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

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
    setNotification(false);
  }, [dispatch, me?.id, socket]);

  const onGoHome = useCallback(() => {
    dispatch({
      type: "REFRESH",
    });
    paginate(1);
    navigator("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, navigator, paginate]);

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

        setNotification(hasUnRead);
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

    socket.current?.on("updateNotification", () => {
      setFollowNotification(false);
    });

    return () => {
      socket.current?.off("unReadMessages");
      socket.current?.off("joinRoom");
    };
  }, [me, socket]);

  return (
    <HeaderWrapper>
      <LogoContainer>
        <HeaderLogoBtn onClick={onGoHome}>TMS</HeaderLogoBtn>
        <GoToChat onClick={onGoToChat}>
          <span>채팅</span>
          {notification && <Notification>🔔</Notification>}
        </GoToChat>
        <Search />
      </LogoContainer>
      {!isLoggedIn && (
        <SignList>
          <li>
            <Link to="/signup">회원가입</Link>
          </li>
          <li>
            <Link to="/login">로그인</Link>
          </li>
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
            {followNotification && <Notification>🔔</Notification>}
          </ProfileImageContainer>
          <li>
            <button onClick={onLogout}>로그아웃</button>
          </li>
        </SignList>
      )}
    </HeaderWrapper>
  );
};
export default Header;

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 4rem;
  padding: 5px;
  top: 0;
  z-index: 1000;
  position: fixed;
  background-color: ${(props) => props.theme.subColor};
  display: flex;
  gap: 10px;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 480px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 5px;

  @media (max-width: 480px) {
    width: 250px;
    flex-wrap: wrap;
  }
`;
export const HeaderLogoBtn = styled.button`
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  border: 1px solid;
  width: 6rem;
  height: 2.5rem;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 480px) {
    font-size: 1rem;
    width: 7rem;
    height: 1.5rem;
    grid-area: a;
  }
`;

const GoToChat = styled(HeaderLogoBtn)`
  position: relative;
`;

export const SignList = styled.ul`
  display: flex;
  color: #fff;

  > img {
    width: 50px;
  }

  > li {
    background-color: ${(props) => props.theme.mainColor};
    text-align: center;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 13px;
    font-size: 1rem;
    font-weight: bold;
    transition: transform 0.3s ease, color 0.3s ease;
    display: flex;
    &:hover {
      transform: translateY(-2px);
      color: ${(props) => props.theme.charColor};
    }
  }
  @media (max-width: 480px) {
    flex-direction: column;
    > li {
      margin-top: 1px;
      width: 60px;
      height: 30px;
      font-size: 0.6rem;
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
  top: -10px;
  right: -10px;
  font-size: 1rem;
  color: #fff;
  background-color: red;
  padding: 2px;
  border-radius: 50%;
  z-index: 999;

  animation: ${blinkBackground} 1s infinite;
`;

const ProfileImageContainer = styled.div`
  position: relative;
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
`;
