import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST } from "../../reducer/user";

const Header = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone } = useSelector((state) => state.user);
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    if (logOutDone) {
      dispatch({
        type: "INITIALIZE_STATE", // 초기화 액션 타입
      });
      navigator("/signup");
    }
  }, [dispatch, logOutDone, navigator]);

  const handleLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, [dispatch]);

  return (
    <HeaderWrapper>
      <HeaderWidth id="container">
        <HeaderLogo>
          <Link to="/">Y BLOG </Link>
        </HeaderLogo>
        <HeaderList>
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
              <Nickname>{me.nickname}님 환영합니다</Nickname>
              <li>
                <Button onClick={handleLogout}>로그아웃</Button>
              </li>
              <li>
                <Button>
                  <Link to="/chat">채팅</Link>
                </Button>
              </li>
            </>
          )}
        </HeaderList>
      </HeaderWidth>
    </HeaderWrapper>
  );
};

export default Header;

const Nickname = styled.div`
  margin-right: 5px;
  font-size: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 4rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  top: 0;
  z-index: 1000;
  position: fixed;
  background-color: ${(props) => props.theme.subColor};
`;

export const HeaderWidth = styled.div`
  width: 700px;
  margin: 0 auto;
  position: relative;
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
  position: absolute;
  cursor: pointer;
  font-size: 1.5rem;
  color: #ffffff;
  background-color: ${(props) => props.theme.mainColor};
  border: none;
  border-radius: 8px;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.6);
  animation: ${shadowAnimation} 2s infinite;
  border: 1px solid;
`;

export const HeaderList = styled.ul`
  display: flex;
  align-content: auto;
  flex-direction: auto;
  flex-wrap: auto;
  float: right;
  color: ${(props) => props.theme.mainColor};
  position: relative;
  align-items: center;
  height: 2.5rem;
  font-size: 0.825rem;

  & > li {
    cursor: pointer;
    margin: 5px;
    font-weight: bold;
  }

  & > a > li {
    cursor: pointer;

    ::after {
      content: "|";
      clear: both;
      margin: 0 0.5rem;
    }
  }

  & > a:last-child > li {
    ::after {
      content: "";
      clear: both;
    }
  }
`;
