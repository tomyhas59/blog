import React, { useCallback, useState } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";

const Registration = () => {
  const [name, NameOnChange] = useInput("");
  const [email, EmailOnChange] = useInput("");
  const [password, PasswordOnChange] = useInput("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [passwordError, setpasswordError] = useState(false);

  const PasswordConfirmOnChange = useCallback(
    (e) => {
      setpasswordConfirm(e.target.value);
      setpasswordError(e.target.value !== password);
    },
    [password, setpasswordConfirm]
  );

  const handleSubmit = useCallback(
    (e) => {
      if (password !== passwordConfirm) {
        return setpasswordError(true);
      } else {
        console.log("회원가입 성공");
      }
      e.preventDefault();
      // Handle registration logic here
    },
    [password, passwordConfirm]
  );

  return (
    <RegistrationContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email:</Label>
          <Input type="email" value={email} onChange={EmailOnChange} />
        </FormGroup>
        <FormGroup>
          <Label>닉네임:</Label>
          <Input type="text" value={name} onChange={NameOnChange} />
        </FormGroup>
        <FormGroup>
          <Label>비밀번호:</Label>
          <Input type="password" value={password} onChange={PasswordOnChange} />
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
      </form>
    </RegistrationContainer>
  );
};

export default Registration;

const RegistrationContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
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
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CheckMessage = styled.div`
  color: red;
`;
