import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST, REFRESH_TOKEN_REQUEST } from "../../reducer/user";
import { RootState } from "../../reducer";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { UserRoomList } from "../Chat";

const MobileFooter = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone, me, logInError } = useSelector(
    (state: RootState) => state.user
  );

  const [notification, setNotification] = useState<boolean>(false);
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
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  useEffect(() => {
    if (logOutDone) {
      dispatch({
        type: "INITIALIZE_STATE",
      });
      navigator("/login");
    }
  }, [dispatch, logOutDone, navigator]);

  const onLogout = useCallback(() => {
    socket.current?.emit("logoutUser", me?.id);
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, [dispatch, me?.id, socket]);

  const onGoHome = useCallback(() => {
    dispatch({
      type: "REFRESH",
    });
    navigator("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, navigator]);

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

    return () => {
      socket.current?.off("unReadMessages");
      socket.current?.off("joinRoom");
    };
  }, [me, socket]);

  return (
    <MobileFooterWrapper>
      <SignList>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/signup">회원가입</Link>
            </li>
            <li>
              <Link to="/login">로그인</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <>
            <li>
              <Link to="/info">내 정보</Link>
            </li>
            <li>
              <button onClick={onLogout}>로그아웃</button>
            </li>
          </>
        )}
      </SignList>

      <MobileFooterLogoBtn onClick={onGoHome}>TMS</MobileFooterLogoBtn>

      <GoToChat onClick={onGoToChat}>
        채팅
        {notification && <Notification>🔔</Notification>}
      </GoToChat>
    </MobileFooterWrapper>
  );
};

export default MobileFooter;

export const MobileFooterWrapper = styled.footer`
  display: none;
  @media (max-width: 480px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: ${(props) => props.theme.subColor};
    position: fixed;
    bottom: 0;
    width: 100%;
    color: #fff;
    z-index: 1000;
  }
`;

export const SignList = styled.ul`
  list-style: none;
  display: flex;
  gap: 5px;
  li a,
  li button {
    font-size: 14px;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    border: 1px solid;
    padding: 5px;
    border-radius: 10px;
  }
`;

const Notification = styled.div`
  position: absolute;
  color: #fff;
  top: -10px;
  right: -10px;
  font-size: 1rem;
`;

export const MobileFooterLogoBtn = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  border: 1px solid;
  padding: 5px;
  border-radius: 10px;
`;

const GoToChat = styled.button`
  font-size: 14px;
  font-weight: bold;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  border: 1px solid;
  padding: 5px;
  border-radius: 10px;
`;
