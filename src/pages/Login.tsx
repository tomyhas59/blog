import React, { SyntheticEvent, useCallback, useEffect } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { LOG_IN_REQUEST } from "../reducer/user";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { usePagination } from "../hooks/PaginationProvider";
import { RootState } from "../reducer";
import Spinner from "../components/Spinner";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setCurrentPage } = usePagination();

  const [email, handleEmailChange] = useInput();
  const [password, handlePasswordChange] = useInput();

  const { logInLoading, logInDone, logInError } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (logInDone) {
      dispatch({ type: "GO_HOME" });
      setCurrentPage(1);
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (logInError) {
      alert(logInError);
    }
  }, [dispatch, logInDone, navigate, setCurrentPage, logInError]);

  const handleLogin = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!email || !password) {
        alert("빈 칸을 확인하세요");
      } else {
        dispatch({
          type: LOG_IN_REQUEST,
          data: { email, password },
        });
      }
    },
    [dispatch, email, password]
  );

  const handleEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin(e);
      }
    },
    [handleLogin]
  );

  return (
    <>
      {logInLoading ? <Spinner /> : null}
      <LoginContainer>
        <Form onSubmit={handleLogin}>
          <Title>로그인</Title>
          <InputGroup>
            <Label>이메일</Label>
            <Input
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력해주세요"
              autoComplete="email"
            />
          </InputGroup>
          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요"
              onKeyUp={handleEnterKeyPress}
              autoComplete="current-password"
            />
          </InputGroup>
          <Button type="submit">로그인</Button>
        </Form>
      </LoginContainer>
    </>
  );
}

export default Login;

const LoginContainer = styled.div`
  max-width: 360px;
  width: 100%;
  margin: 5% auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 20px;
    transform: scale(0.9);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
  color: ${(props) => props.theme.mainColor};
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: ${(props) => props.theme.mainColor};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  color: ${(props) => props.theme.mainColor};
  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.hoverMainColor};
    transform: translateY(-2px);
  }
`;
