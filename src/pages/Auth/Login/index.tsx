import React, { SyntheticEvent, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import { LOG_IN_REQUEST } from "../../../reducer/user";
import { usePagination } from "../../../hooks/PaginationProvider";
import { RootState } from "../../../reducer";
import Spinner from "../../../components/ui/Spinner";
import * as A from "../AuthStyles";

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
        <A.AuthCard>
          {/* 로고 섹션 */}
          <A.LogoSection>
            <A.LogoIcon>
              <i className="fas fa-comment-dots"></i>
            </A.LogoIcon>
            <A.LogoText>TMS</A.LogoText>
            <A.LogoSubtext>Connect with people</A.LogoSubtext>
          </A.LogoSection>

          {/* 로그인 폼 */}
          <A.AuthForm onSubmit={handleLogin}>
            <A.Title>로그인</A.Title>
            <A.Subtitle>계정에 로그인하세요</A.Subtitle>

            <A.FormGroup>
              <A.InputWrapper>
                <A.InputIcon>
                  <i className="fas fa-envelope"></i>
                </A.InputIcon>
                <A.Input
                  type="text"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="이메일을 입력해주세요"
                  autoComplete="email"
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
                  placeholder="비밀번호를 입력해주세요"
                  onKeyUp={handleEnterKeyPress}
                  autoComplete="current-password"
                />
              </A.InputWrapper>
            </A.FormGroup>

            <A.ForgotPassword href="/forgot-password">
              비밀번호를 잊으셨나요?
            </A.ForgotPassword>

            <A.SubmitButton type="submit" disabled={logInLoading}>
              {logInLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  로그인 중...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i>
                  로그인
                </>
              )}
            </A.SubmitButton>

            <A.Divider>
              <span>또는</span>
            </A.Divider>

            <A.SignupPrompt>
              계정이 없으신가요?{" "}
              <A.SignupLink onClick={() => navigate("/signup")}>
                회원가입
              </A.SignupLink>
            </A.SignupPrompt>
          </A.AuthForm>
        </A.AuthCard>
      </A.AuthContainer>
    </>
  );
}

export default Login;
