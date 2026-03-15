import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import axios from "axios";

import Search from "../../../components/search/Search";
import { usePagination } from "../../../hooks/PaginationProvider";
import { RootState } from "../../../reducer";
import { LOG_OUT_REQUEST } from "../../../reducer/user";
import { baseURL } from "../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../Info/MyInfo";
import { NotificationType, UserType } from "../../../types";
import { UserRoomList } from "../../Chat";

// 스타일 컴포넌트 임포트
import * as S from "./HeaderStyles";

interface HeaderProps {
  ref?: React.Ref<HTMLDivElement>;
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const socket = useRef<Socket | null>(null);

  // Redux State
  const { isLoggedIn, logOutDone, me, logInError } = useSelector(
    (state: RootState) => state.user,
  );
  const { isDarkMode } = useSelector((state: RootState) => state.post);

  // Local State (알림 관련)
  const [chatNotification, setChatNotification] = useState<boolean>(false);
  const [followNotification, setFollowNotification] = useState<boolean>(false);
  const [commentNotification, setCommentNotification] =
    useState<boolean>(false);

  const { setCurrentPage } = usePagination();

  // 1. 소켓 초기화
  useEffect(() => {
    const socketUrl =
      process.env.NODE_ENV === "production"
        ? "https://patient-marina-tomyhas59-8c3582f9.koyeb.app"
        : "http://localhost:3075";

    socket.current = io(socketUrl, { withCredentials: true });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  // 2. 유저 정보 복구 (로그인 유지)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/user/setUser");
        dispatch({ type: "SET_USER", data: response.data });
      } catch (error: any) {
        if (error.response?.status !== 401) {
          console.error(error);
        }
      }
    };
    getUserData();
  }, [dispatch]);

  // 3. 채팅방 읽지 않은 메시지 체크 로직
  const fetchUserChatRooms = useCallback(async () => {
    if (!me) return;
    try {
      const response = await axios.get(`/post/findChat?userId=${me.id}`);
      const hasUnRead = response.data.some(
        (room: UserRoomList) =>
          room.UnReadMessages.filter((message) => message.UserId !== me?.id)
            .length > 0,
      );
      setChatNotification(hasUnRead);
    } catch (error) {
      console.error("Error fetching user chat rooms:", error);
    }
  }, [me]);

  // 4. 초기 알림 데이터 및 소켓 리스너 등록
  useEffect(() => {
    if (!me) return;

    // 새 팔로워 카운트 체크
    const fetchNewFollowersCount = async () => {
      try {
        const response = await axios.get(
          `/user/getNewFollowersCount?userId=${me?.id}`,
        );
        setFollowNotification(response.data > 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNewFollowersCount();

    // 댓글 알림 체크 (me 데이터 기준)
    const notReadComment =
      me?.Notifications?.some(
        (Notification: NotificationType) => Notification.isRead === false,
      ) || false;
    setCommentNotification(notReadComment);

    // 채팅 상태 체크
    fetchUserChatRooms();

    // 소켓 이벤트 리스너
    socket.current?.on("unReadMessages", fetchUserChatRooms);
    socket.current?.on("joinRoom", fetchUserChatRooms);

    const checkNotRead = (user: UserType, type: string) => {
      return (
        user?.Notifications?.filter(
          (notification) => notification.type === type,
        ).some((notification) => notification.isRead === false) || false
      );
    };

    socket.current?.on("updateNotification", (user) => {
      setFollowNotification(checkNotRead(user, "FOLLOW"));
      setCommentNotification(checkNotRead(user, "SYSTEM"));
    });

    return () => {
      socket.current?.off("unReadMessages");
      socket.current?.off("joinRoom");
    };
  }, [me, fetchUserChatRooms]);

  // 5. 로그인 에러 및 로그아웃 후처리
  useEffect(() => {
    if (logInError) alert(logInError);
  }, [logInError]);

  useEffect(() => {
    if (logOutDone) {
      dispatch({ type: "INITIALIZE_STATE" });
      navigator("/login");
    }
  }, [dispatch, logOutDone, navigator]);

  // 6. 핸들러 함수들
  const handleLogout = useCallback(() => {
    socket.current?.emit("logoutUser", me?.id);
    dispatch({ type: LOG_OUT_REQUEST });
    setChatNotification(false);
  }, [dispatch, me?.id]);

  const goToHome = useCallback(() => {
    setCurrentPage(1);
    navigator("/");
    window.location.reload();
  }, [navigator, setCurrentPage]);

  const goToChat = () => {
    if (!me) return alert("로그인이 필요합니다");
    navigator("/chat");
  };

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  }, [dispatch]);

  return (
    <S.HeaderContainer ref={ref}>
      <S.HeaderLogoBtn onClick={goToHome}>TMS</S.HeaderLogoBtn>
      <Search />

      {!isLoggedIn && (
        <S.SignList>
          <S.ListItem>
            <Link to="/signup">회원가입</Link>
          </S.ListItem>
          <S.ListItem>
            <Link to="/login">로그인</Link>
          </S.ListItem>
        </S.SignList>
      )}

      {isLoggedIn && (
        <S.SignList>
          <S.ListItem onClick={goToChat}>
            <span>채팅</span>
            {chatNotification && <S.Notification>🔔</S.Notification>}
          </S.ListItem>
          <S.ListItem>
            <button onClick={handleLogout}>로그아웃</button>
          </S.ListItem>
          <S.ProfileImageWrapper>
            <S.ProfileImage
              onClick={() => navigator("/info")}
              src={
                me?.Image
                  ? `${baseURL}/${me?.Image?.src}`
                  : `${DEFAULT_PROFILE_IMAGE}`
              }
            />
            {(followNotification || commentNotification) && (
              <S.Notification>🔔</S.Notification>
            )}
          </S.ProfileImageWrapper>
        </S.SignList>
      )}

      <S.DarkModeButton onClick={toggleDarkMode}>
        {isDarkMode ? "🌙" : "☀️"}
      </S.DarkModeButton>
    </S.HeaderContainer>
  );
});

export default Header;
