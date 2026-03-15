import React, { SyntheticEvent, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { LOG_IN_REQUEST } from "../../../reducer/user";
import { usePagination } from "../../../hooks/PaginationProvider";
import { RootState } from "../../../reducer";
import Spinner from "../../../components/ui/Spinner";
import * as A from "../AuthStyles"; // 스타일 임포트

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setCurrentPage } = usePagination();

  const [email, handleEmailChange] = useInput();
  const [password, handlePasswordChange] = useInput();

  const { logInLoading, logInDone, logInError } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    if (logInDone) {
      dispatch({ type: "GO_HOME" });
      setCurrentPage(1);
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (logInError) alert(logInError);
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
    [dispatch, email, password],
  );

  const handleEnterKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleLogin(e);
    },
    [handleLogin],
  );

  return (
    <>
      {logInLoading && <Spinner />}
      <A.AuthContainer>
        <A.AuthForm onSubmit={handleLogin}>
          <A.Title>로그인</A.Title>
          <A.FormGroup>
            <A.Label>이메일</A.Label>
            <A.Input
              type="text"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일을 입력해주세요"
              autoComplete="email"
            />
          </A.FormGroup>
          <A.FormGroup>
            <A.Label>비밀번호</A.Label>
            <A.Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요"
              onKeyUp={handleEnterKeyPress}
              autoComplete="current-password"
            />
          </A.FormGroup>
          <A.SubmitButton type="submit">로그인</A.SubmitButton>
        </A.AuthForm>
      </A.AuthContainer>
    </>
  );
}

export default Login;
