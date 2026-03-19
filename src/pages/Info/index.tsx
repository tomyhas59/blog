import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io, Socket } from "socket.io-client";

import { RootState } from "../../reducer";
import MyInfo from "./MyInfo";
import MyPosts from "./MyPosts";
import MyComments from "./MyComments";
import MyLikes from "./MyLikes";
import MyFollow from "./MyFollow";
import * as S from "./InfoStyles";

const Info = () => {
  const [activeSection, setActiveSection] = useState("myInfo");
  const { me } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useRef<Socket | null>(null);

  const [newFollowersCount, setNewFollowersCount] = useState<number>();
  const params = new URLSearchParams(location.search);
  const categoryParam = params.get("category");

  // Socket 및 초기 데이터 로직
  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app", {
            withCredentials: true,
          })
        : io("http://localhost:3075", { withCredentials: true });

    if (me) {
      socket.current.emit("loginUser", { id: me.id, nickname: me.nickname });
    }
    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/user/setUser");
        dispatch({ type: "SET_USER", data: response.data });
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
        const res = await axios.get(
          `/user/getNewFollowersCount?userId=${me?.id}`,
        );
        if (res.data > 0) setNewFollowersCount(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNewFollowers();
  }, [me]);

  const notRead = me?.Notifications?.filter((n) => n.type === "SYSTEM").some(
    (n) => !n.isRead,
  );

  const sections = [
    {
      menu: "myInfo",
      label: "내 정보",
      icon: "fas fa-user-circle",
    },
    {
      menu: "myPosts",
      label: "내가 쓴 글",
      badge: notRead ? "🔔" : null,
      icon: "fas fa-edit",
    },
    {
      menu: "myComments",
      label: "댓글",
      icon: "fas fa-comments",
    },
    {
      menu: "myLikes",
      label: "좋아요",
      icon: "fas fa-heart",
    },
    {
      menu: "myFollow",
      label: "팔로우",
      badge: newFollowersCount,
      icon: "fas fa-user-friends",
    },
  ];

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
      case "myFollow":
        return <MyFollow />;
      default:
        return <MyInfo />;
    }
  };

  return (
    <S.Container>
      <S.Sidebar>
        <S.MenuList>
          {sections.map(({ menu, label, badge, icon }) => (
            <S.MenuItem key={menu}>
              <S.MenuButton
                onClick={() => handleSetActiveSection(menu)}
                active={activeSection === menu}
              >
                <S.MenuIcon>
                  <i className={icon}></i>
                </S.MenuIcon>
                <S.MenuLabel>{label}</S.MenuLabel>
                {badge && <S.Badge>{badge}</S.Badge>}
              </S.MenuButton>
            </S.MenuItem>
          ))}
        </S.MenuList>
      </S.Sidebar>

      <S.Content>{renderSection()}</S.Content>
    </S.Container>
  );
};

export default Info;
