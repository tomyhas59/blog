import React, { SyntheticEvent, useCallback, useEffect } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { LOG_IN_REQUEST } from "../reducer/user";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { usePagination } from "./PaginationProvider";
import { RootState } from "../reducer";

function Login() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { paginate } = usePagination();

  const [email, emailOnChange] = useInput();
  const [password, PasswordOnChange] = useInput();

  const { logInDone } = useSelector((state: RootState) => state.user);

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

  const cookie = document.cookie;
  console.log("--------", cookie);

  const handleLogin = useCallback(
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

  const LoginEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin(e);
      }
    },
    [handleLogin]
  );
  return (
    <LoginContainer>
      <form onSubmit={handleLogin}>
        <InputGroup>
          <Label>이메일:</Label>
          <Input
            type="text"
            value={email}
            onChange={emailOnChange}
            placeholder="이메일을 입력해주세요"
          />
        </InputGroup>
        <InputGroup>
          <Label>비밀번호:</Label>
          <Input
            type="password"
            value={password}
            onChange={PasswordOnChange}
            placeholder="비밀번호를 입력해주세요"
            onKeyUp={LoginEnter}
          />
        </InputGroup>
        <Button type="submit">로그인</Button>
      </form>
    </LoginContainer>
  );
}
export default Login;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
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

  &:hover {
    background-color: ${(props) => props.theme.subColor};
  }
`;
