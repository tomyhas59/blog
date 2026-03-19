import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
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

  // 모바일 메뉴 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <S.HeaderContainer ref={ref}>
      <S.HeaderInner>
        {/* 왼쪽: 로고 */}
        <S.LeftSection>
          <S.Logo onClick={goToHome}>
            <S.LogoIcon>
              <i className="fas fa-comment-dots"></i>
            </S.LogoIcon>
            <S.LogoText>TMS</S.LogoText>
          </S.Logo>
        </S.LeftSection>

        {/* 중앙: 검색 (데스크톱) */}
        <S.CenterSection>
          <Search />
        </S.CenterSection>

        {/* 오른쪽: 네비게이션 (데스크톱) */}
        <S.RightSection>
          {!isLoggedIn ? (
            <>
              <S.NavList className="desktop-only">
                <S.NavItem>
                  <S.NavLink to="/signup">
                    <i className="fas fa-user-plus"></i>
                    <span>회원가입</span>
                  </S.NavLink>
                </S.NavItem>
                <S.NavItem>
                  <S.NavLink to="/login">
                    <i className="fas fa-sign-in-alt"></i>
                    <span>로그인</span>
                  </S.NavLink>
                </S.NavItem>
              </S.NavList>
            </>
          ) : (
            <>
              <S.NavList className="desktop-only">
                {/* 채팅 */}
                <S.NavItem onClick={goToChat}>
                  <S.IconButton>
                    <i className="fas fa-comments"></i>
                    {chatNotification && <S.NotificationBadge />}
                  </S.IconButton>
                </S.NavItem>

                {/* 로그아웃 */}
                <S.NavItem>
                  <S.TextButton onClick={handleLogout}>로그아웃</S.TextButton>
                </S.NavItem>

                {/* 프로필 */}
                <S.NavItem>
                  <S.ProfileWrapper onClick={() => navigator("/info")}>
                    <S.ProfileImage
                      src={
                        me?.Image
                          ? `${baseURL}/${me?.Image?.src}`
                          : DEFAULT_PROFILE_IMAGE
                      }
                      alt="프로필"
                    />
                    {(followNotification || commentNotification) && (
                      <S.NotificationBadge />
                    )}
                  </S.ProfileWrapper>
                </S.NavItem>
              </S.NavList>
            </>
          )}

          {/* 다크모드 토글 */}
          <S.DarkModeToggle onClick={toggleDarkMode}>
            {isDarkMode ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </S.DarkModeToggle>

          {/* 모바일 메뉴 버튼 */}
          <S.MobileMenuButton
            onClick={toggleMobileMenu}
            isOpen={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </S.MobileMenuButton>
        </S.RightSection>
      </S.HeaderInner>

      {/* 모바일 메뉴 */}
      <S.MobileMenu isOpen={isMobileMenuOpen}>
        <S.MobileMenuOverlay onClick={closeMobileMenu} />
        <S.MobileMenuContent>
          {!isLoggedIn ? (
            <S.MobileNavList>
              <S.MobileNavItem>
                <S.MobileNavLink to="/signup" onClick={closeMobileMenu}>
                  <i className="fas fa-user-plus"></i>
                  <span>회원가입</span>
                </S.MobileNavLink>
              </S.MobileNavItem>
              <S.MobileNavItem>
                <S.MobileNavLink to="/login" onClick={closeMobileMenu}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span>로그인</span>
                </S.MobileNavLink>
              </S.MobileNavItem>
            </S.MobileNavList>
          ) : (
            <S.MobileNavList>
              {/* 프로필 */}
              <S.MobileNavItem>
                <S.MobileNavButton
                  onClick={() => {
                    navigator("/info");
                    closeMobileMenu();
                  }}
                >
                  <S.MobileProfileSection>
                    <S.ProfileImage
                      src={
                        me?.Image
                          ? `${baseURL}/${me?.Image?.src}`
                          : DEFAULT_PROFILE_IMAGE
                      }
                      alt="프로필"
                    />
                    <div>
                      <S.MobileProfileName>{me?.nickname}</S.MobileProfileName>
                      <S.MobileProfileEmail>{me?.email}</S.MobileProfileEmail>
                    </div>
                  </S.MobileProfileSection>
                  {(followNotification || commentNotification) && (
                    <S.NotificationBadge />
                  )}
                </S.MobileNavButton>
              </S.MobileNavItem>

              <S.MobileDivider />

              {/* 채팅 */}
              <S.MobileNavItem>
                <S.MobileNavButton
                  onClick={() => {
                    goToChat();
                    closeMobileMenu();
                  }}
                >
                  <i className="fas fa-comments"></i>
                  <span>채팅</span>
                  {chatNotification && <S.NotificationBadge />}
                </S.MobileNavButton>
              </S.MobileNavItem>

              <S.MobileDivider />

              {/* 로그아웃 */}
              <S.MobileNavItem>
                <S.MobileNavButton
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="logout"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>로그아웃</span>
                </S.MobileNavButton>
              </S.MobileNavItem>
            </S.MobileNavList>
          )}
        </S.MobileMenuContent>
      </S.MobileMenu>
    </S.HeaderContainer>
  );
});

export default Header;
