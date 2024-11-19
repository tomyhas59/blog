import React, { useRef, useState } from "react";
import styled from "styled-components";
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
  const fetchUserData = useCallback(async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");

    if (!accessToken && refreshToken) {
      dispatch({ type: REFRESH_TOKEN_REQUEST });
      return;
    }

    try {
      const response = await axios.get("/user/setUser", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch({ type: "SET_USER", data: response.data });
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (me) fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);
  const { paginate } = usePagination();

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

    return () => {
      socket.current?.off("unReadMessages");
      socket.current?.off("joinRoom");
    };
  }, [me, socket]);

  console.log(me);

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
          <ProfileImage
            onClick={() => navigator("/info")}
            src={
              me?.Image
                ? `${baseURL}/${me?.Image?.src}`
                : `${DEFAULT_PROFILE_IMAGE}`
            }
          />
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
    margin-left: 3px;
    font-size: 1rem;
    font-weight: bold;
    transition: transform 0.3s ease, color 0.3s ease;

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

const Notification = styled.span`
  position: absolute;
  background-color: red;
  border-radius: 50%;
  color: #fff;
  top: -10px;
  right: -10px;
  font-size: 1rem;
`;

const ProfileImage = styled.img`
  width: 20px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #cccccc;
  transition: transform 0.3s ease, color 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
    border-color: gray;
    color: ${(props) => props.theme.charColor};
  }
`;
