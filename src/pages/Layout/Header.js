import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST } from "../../reducer/user";
import Search from "../../components/Search";
import { usePagination } from "../PaginationProvider";

const Header = () => {
  const [searchOption, setSearchOption] = useState("author");
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone } = useSelector((state) => state.user);

  const { me } = useSelector((state) => state.user);
  const { paginate } = usePagination();

  useEffect(() => {
    if (logOutDone) {
      dispatch({
        type: "INITIALIZE_STATE", // 초기화 액션 타입
      });
      navigator("/login");
    }
  }, [dispatch, logOutDone, navigator]);

  const handleLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, [dispatch]);

  const handleGoHome = useCallback(() => {
    dispatch({
      type: "GO_HOME",
    });
    paginate(1);
    navigator("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dispatch, navigator, paginate]);

  return (
    <HeaderWrapper>
      <HeaderLogo>
        <button onClick={handleGoHome}>Y BLOG </button>
      </HeaderLogo>
      <HeaderWidth>
        {isLoggedIn && <Nickname>{me.nickname}님 환영합니다</Nickname>}
        <Select
          value={searchOption}
          onChange={(e) => setSearchOption(e.target.value)}
        >
          <option value="author">글쓴이</option>
          <option value="content">내용</option>
          <option value="both">글쓴이+내용</option>
        </Select>
        <div style={{ marginLeft: "5px" }}>
          <Search searchOption={searchOption} />
        </div>
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
                <Button onClick={handleLogout}>로그아웃</Button>
              </li>
              <li>
                <Link to="/chat">채팅</Link>
              </li>
            </>
          )}
        </SignList>
      </HeaderWidth>
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
  display: flex;
  justify-content: space-evenly;
`;

const Nickname = styled.div`
  font-size: 1.5rem;
  margin-left: -120px;
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
`;

const Button = styled.button`
  cursor: pointer;
  font-size: 1rem;
  margin: 5px;
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: #ff8c00;
  }
`;

const Select = styled.select`
  margin-left: 30px;
  height: 44px;
  text-align: center;
  border: none;
`;

export const HeaderWidth = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;

const shadowAnimation = keyframes`
  0% {
    transform: translateY(0);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.6);
  }
  50% {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }
  100% {
    transform: translateY(0);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.6);
  }
`;

export const HeaderLogo = styled.div`
  cursor: pointer;
  font-size: 2.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.6);
  animation: ${shadowAnimation} 2s infinite;
  border: 1px solid;
  padding: 5px 10px;
  transition: background-color 0.3s ease;
  width: 170px;
  height: 70px;
  margin-left: 100px;
  &:hover {
    background-color: #ff8c00;
  }
`;
export const SignList = styled.ul`
  display: flex;
  background-color: ${(props) => props.theme.mainColor};
  margin-left: 20px;
  color: #fff;
  border-radius: 8px;
  position: relative;
  align-items: center;
  height: 2.5rem;
  font-size: 0.825rem;

  & > li {
    cursor: pointer;
    font-size: 1rem;
    margin: 5px;
    font-weight: bold;
    transition: transform 0.3s ease, color 0.3s ease;
    &:hover {
      transform: translateY(-2px);
      color: #ff8c00;
    }
  }

  & > a > li {
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #ff8c00;
    }
  }
`;
