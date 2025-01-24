import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { SIGN_UP_REQUEST } from "../reducer/user";
import { useNavigate } from "react-router-dom";
import { RootState } from "../reducer";
import Spinner from "../components/Spinner";

const Sign = () => {
  const [nickname, onChangeNickname] = useInput();
  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { signUpDone, signUpLoading } = useSelector(
    (state: RootState) => state.user
  );

  const handlePasswordConfirmChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordConfirm(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  useEffect(() => {
    if (signUpDone) {
      alert("회원가입이 완료되었습니다");
      navigate("/login");
      dispatch({ type: "INITIALIZE_STATE" });
    }
  }, [signUpDone, navigate, dispatch]);

  const handleSubmit = useCallback(
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
    [dispatch, email, nickname, password, passwordConfirm]
  );

  return (
    <>
      {signUpLoading ? (
        <Spinner />
      ) : (
        <RegistrationContainer onSubmit={handleSubmit}>
          <Title>회원가입</Title>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="이메일"
              autoComplete="email"
            />
          </FormGroup>
          <FormGroup>
            <Label>닉네임</Label>
            <Input
              type="text"
              value={nickname}
              onChange={onChangeNickname}
              placeholder="닉네임"
              autoComplete="nickname"
            />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={onChangePassword}
              placeholder="비밀번호"
              autoComplete="new-password"
            />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
            />
          </FormGroup>
          {passwordError && (
            <CheckMessage>비밀번호가 일치하지 않습니다</CheckMessage>
          )}
          <Button type="submit">회원가입</Button>
        </RegistrationContainer>
      )}
    </>
  );
};

export default Sign;

const RegistrationContainer = styled.form`
  display: flex;
  flex-direction: column;

  max-width: 400px;
  width: 90%;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  @media (max-width: 480px) {
    padding: 20px;
    transform: scale(0.9);
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 1.8rem;
  text-align: center;
  color: ${(props) => props.theme.mainColor};
`;

export const FormGroup = styled.div`
  margin-bottom: 10px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  font-weight: 500;
  color: ${(props) => props.theme.textColor};
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    outline: none;
  }
`;

export const Button = styled.button`
  padding: 12px;
  font-size: 16px;
  background-color: ${(props) => props.theme.mainColor};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.hoverColor};
    transform: translateY(-2px);
  }
`;

export const CheckMessage = styled.div`
  color: red;
  margin-top: 10px;
  text-align: center;
  font-size: 14px;
`;
