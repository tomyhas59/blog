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
import * as A from "../AuthStyles";

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
        <A.AuthCard>
          {/* 로고 섹션 */}
          <A.LogoSection>
            <A.LogoIcon>
              <i className="fas fa-user-plus"></i>
            </A.LogoIcon>
            <A.LogoText>TMS</A.LogoText>
            <A.LogoSubtext>Join our community</A.LogoSubtext>
          </A.LogoSection>

          {/* 회원가입 폼 */}
          <A.AuthForm onSubmit={handleSignUp}>
            <A.Title>회원가입</A.Title>
            <A.Subtitle>새로운 계정을 만드세요</A.Subtitle>

            <A.FormGroup>
              <A.InputWrapper>
                <A.InputIcon>
                  <i className="fas fa-envelope"></i>
                </A.InputIcon>
                <A.Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="이메일"
                  autoComplete="email"
                />
              </A.InputWrapper>
            </A.FormGroup>

            <A.FormGroup>
              <A.InputWrapper>
                <A.InputIcon>
                  <i className="fas fa-user"></i>
                </A.InputIcon>
                <A.Input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임"
                  autoComplete="username"
                />
              </A.InputWrapper>
            </A.FormGroup>

            <A.FormGroup>
              <A.InputWrapper>
                <A.InputIcon>
                  <i className="fas fa-lock"></i>
                </A.InputIcon>
                <A.Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호"
                  autoComplete="new-password"
                />
              </A.InputWrapper>
            </A.FormGroup>

            <A.FormGroup>
              <A.InputWrapper hasError={passwordError}>
                <A.InputIcon>
                  <i className="fas fa-lock"></i>
                </A.InputIcon>
                <A.Input
                  type="password"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  placeholder="비밀번호 확인"
                  autoComplete="new-password"
                  hasError={passwordError}
                />
                {passwordConfirm && !passwordError && (
                  <A.SuccessIcon>
                    <i className="fas fa-check-circle"></i>
                  </A.SuccessIcon>
                )}
              </A.InputWrapper>
              {passwordError && passwordConfirm && (
                <A.ErrorMessage>
                  <i className="fas fa-exclamation-circle"></i>
                  비밀번호가 일치하지 않습니다
                </A.ErrorMessage>
              )}
            </A.FormGroup>

            <A.SubmitButton type="submit" disabled={signUpLoading}>
              {signUpLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  가입 중...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  회원가입
                </>
              )}
            </A.SubmitButton>

            <A.Divider>
              <span>또는</span>
            </A.Divider>

            <A.SignupPrompt>
              이미 계정이 있으신가요?{" "}
              <A.SignupLink onClick={() => navigate("/login")}>
                로그인
              </A.SignupLink>
            </A.SignupPrompt>
          </A.AuthForm>
        </A.AuthCard>
      </A.AuthContainer>
    </>
  );
};

export default Sign;
