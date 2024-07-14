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
  const [nickname, nickNameOnChange] = useInput();
  const [email, onChangeEmail] = useInput();
  const [password, onChagngePassword] = useInput();
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [passwordError, setpasswordError] = useState(false);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const { signUpDone, signUpLoading } = useSelector(
    (state: RootState) => state.user
  );

  const PasswordConfirmOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setpasswordConfirm(e.target.value);
      setpasswordError(e.target.value !== password);
    },
    [password, setpasswordConfirm]
  );

  useEffect(() => {
    if (signUpDone) {
      alert("회원가입이 완료되었습니다");
      navigator("/login");
      dispatch({
        type: "INITIALIZE_STATE",
      });
    }
  }, [signUpDone, navigator, dispatch]);

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      if (!email || !nickname || !password || !passwordConfirm) {
        alert("빈 칸을 확인하세요");
        return;
      }
      if (password !== passwordConfirm) {
        setpasswordError(true);
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
        <RegistrationContainer onSubmit={onSubmit}>
          <FormGroup>
            <Label>Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="형식 aa@aa.com"
            />
          </FormGroup>
          <FormGroup>
            <Label>닉네임:</Label>
            <Input type="text" value={nickname} onChange={nickNameOnChange} />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호:</Label>
            <Input
              type="password"
              value={password}
              onChange={onChagngePassword}
            />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호 확인:</Label>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={PasswordConfirmOnChange}
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
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;

  @media (max-width: 480px) {
    margin-top: -50px;
    transform: scale(0.7);
  }
`;

const FormGroup = styled.div`
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

const CheckMessage = styled.div`
  color: red;
`;
