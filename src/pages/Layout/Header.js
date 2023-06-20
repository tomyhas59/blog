import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOG_OUT_REQUEST } from "../../reducer/user";

const Header = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { isLoggedIn, logOutDone } = useSelector((state) => state.user);

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
      <HeaderWidth>
        <HeaderLogo>
          <Link to="/">Y BLOG</Link>
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
            <li>
              <Button onClick={handleLogout}>로그아웃</Button>
            </li>
          )}
        </HeaderList>
      </HeaderWidth>
    </HeaderWrapper>
  );
};

export default Header;

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
  background-color: ${(props) => props.theme.subColor};
`;

export const HeaderWidth = styled.div`
  width: 70%;
  margin: 0 auto;
`;

export const HeaderLogo = styled.div`
  float: left;
  margin-left: 3rem;
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
  font-size: 1.5rem;
  cursor: pointer;
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
