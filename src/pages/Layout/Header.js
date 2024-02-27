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
      <HeaderLogoBtn onClick={handleGoHome}>Y BLOG</HeaderLogoBtn>
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
  font-weight: bold;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 10px;
  background-color: #3498db;
  color: #fff;
  margin-left: -120px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;
const Button = styled.button`
  cursor: pointer;
  font-size: 1rem;
  margin: 5px;
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.subColor};
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

export const HeaderLogoBtn = styled.button`
  position: relative;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 8px;
  border: 1px solid;
  padding: 5px 10px;
  transition: background-color 0.3s ease;
  width: 170px;
  margin-left: 100px;
  &:hover {
    color: ${(props) => props.theme.charColor};
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
      color: ${(props) => props.theme.charColor};
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
