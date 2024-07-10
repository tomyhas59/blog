import React, { SyntheticEvent, useCallback, useEffect } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { LOG_IN_REQUEST } from "../reducer/user";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";
import Spinner from "../components/Spinner";

function Login() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { paginate } = usePagination();

  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();

  const { logInLoading, logInDone } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (logInDone) {
      dispatch({
        type: "GO_HOME",
      });
      paginate(1);
      navigator("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [dispatch, logInDone, , navigator, paginate]);

  const onLogin = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!email || !password) {
        alert("빈 칸을 확인하세요");
      } else {
        dispatch({
          type: LOG_IN_REQUEST,
          data: {
            email: email,
            password: password,
          },
        });
      }
    },
    [dispatch, email, password]
  );

  const onEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onLogin(e);
      }
    },
    [onLogin]
  );
  return (
    <>
      {logInLoading ? <Spinner /> : null}
      <LoginContainer>
        <form onSubmit={onLogin}>
          <InputGroup>
            <Label>이메일:</Label>
            <Input
              type="text"
              value={email}
              onChange={onChangeEmail}
              placeholder="이메일을 입력해주세요"
            />
          </InputGroup>
          <InputGroup>
            <Label>비밀번호:</Label>
            <Input
              type="password"
              value={password}
              onChange={onChangePassword}
              placeholder="비밀번호를 입력해주세요"
              onKeyUp={onEnterKeyPress}
            />
          </InputGroup>
          <Button type="submit">로그인</Button>
        </form>
      </LoginContainer>
    </>
  );
}
export default Login;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 150px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  @media (max-width: 480px) {
    transform: scale(0.7) translateY(-50px);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.3s ease, color 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;
