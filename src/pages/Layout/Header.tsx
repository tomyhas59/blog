import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST } from "../../reducer/user";
import Search from "../../components/Search";
import { usePagination } from "../PaginationProvider";
import { RootState } from "../../reducer";
import io from "socket.io-client";
import axios from "axios";

const Header = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone, me, logInError } = useSelector(
    (state: RootState) => state.user
  );
  const socket =
    process.env.NODE_ENV === "production"
      ? io("https://quarrelsome-laura-tomyhas59-09167dc6.koyeb.app")
      : io("http://localhost:3075");

  //새로고침 로그인 유지
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

      if (isLoggedIn && !me) {
        getUserData();
      }
    };
  }, [dispatch]);

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
    socket.emit("logoutUser", me?.id);
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
    navigator("/chat");
  };

  return (
    <HeaderWrapper>
      <HeaderLogoBtn onClick={onGoHome}>TMS</HeaderLogoBtn>
      <Nickname>{me && me.nickname.slice(0, 5) + "님 환영합니다"}</Nickname>
      <Search />
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
          <li>
            <button onClick={onLogout}>로그아웃</button>
          </li>
          <li>
            <button onClick={onGoToChat}>채팅</button>
          </li>
        </SignList>
      )}
    </HeaderWrapper>
  );
};

export default Header;

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 5rem;
  padding: 1rem;
  top: 0;
  z-index: 1000;
  position: fixed;
  background-color: ${(props) => props.theme.subColor};
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 780px) {
    height: 9rem;
    grid-template-columns: repeat(2, 500px);
  }

  @media (max-width: 480px) {
    height: 9rem;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const HeaderLogoBtn = styled.button`
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  border: 1px solid;
  margin-left: 100px;
  width: 10rem;
  height: 3rem;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
  @media (max-width: 480px) {
    margin-left: 10px;
    margin-bottom: 10px;
  }
`;

const Nickname = styled.div`
  width: 15rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  @media (max-width: 480px) {
    transform: scale(0.5) translateX(-200px);
  }
`;

export const SignList = styled.ul`
  display: flex;
  margin-left: 5px;
  color: #fff;
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
    @media (max-width: 480px) {
      font-size: 10px;
      padding: 5px;
      width: 100px;
      margin-top: 3px;
    }
  }
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
