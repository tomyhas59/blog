import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { SIGN_UP_REQUEST } from "../../../reducer/user";
import { RootState } from "../../../reducer";
import Spinner from "../../../components/ui/Spinner";
import * as A from "../AuthStyles"; // 스타일 임포트

const Sign = () => {
  const [nickname, handleNicknameChange] = useInput();
  const [email, handleEmailChange] = useInput();
  const [password, handlePasswordChange] = useInput();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signUpDone, signUpLoading, signUpError } = useSelector(
    (state: RootState) => state.user,
  );

  const handlePasswordConfirmChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordConfirm(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );

  useEffect(() => {
    if (signUpDone) {
      alert("회원가입이 완료되었습니다");
      navigate("/login");
      dispatch({ type: "INITIALIZE_STATE" });
    }
    if (signUpError) alert(signUpError);
  }, [signUpDone, navigate, dispatch, signUpError]);

  const handleSignUp = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!email || !nickname || !password || !passwordConfirm) {
        alert("빈 칸을 확인하세요");
        return;
      }
      if (password !== passwordConfirm) {
        setPasswordError(true);
        return;
      }
      dispatch({
        type: SIGN_UP_REQUEST,
        data: { email, nickname, password },
      });
    },
    [dispatch, email, nickname, password, passwordConfirm],
  );

  return (
    <>
      {signUpLoading && <Spinner />}
      <A.AuthContainer>
        <A.AuthForm onSubmit={handleSignUp}>
          <A.Title>회원가입</A.Title>
          <A.FormGroup>
            <A.Label>Email</A.Label>
            <A.Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일"
              autoComplete="email"
            />
          </A.FormGroup>
          <A.FormGroup>
            <A.Label>닉네임</A.Label>
            <A.Input
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="닉네임"
              autoComplete="nickname"
            />
          </A.FormGroup>
          <A.FormGroup>
            <A.Label>비밀번호</A.Label>
            <A.Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              autoComplete="new-password"
            />
          </A.FormGroup>
          <A.FormGroup>
            <A.Label>비밀번호 확인</A.Label>
            <A.Input
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
            />
          </A.FormGroup>
          {passwordError && (
            <A.ErrorMessage>비밀번호가 일치하지 않습니다</A.ErrorMessage>
          )}
          <A.SubmitButton type="submit">회원가입</A.SubmitButton>
        </A.AuthForm>
      </A.AuthContainer>
    </>
  );
};

export default Sign;
