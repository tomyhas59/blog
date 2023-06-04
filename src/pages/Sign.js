import React, { useState } from "react";
import { useCallback } from "react";
import useInput from "../hooks/useInput";
import { SIGN_UP } from "../reducer/user";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useInput();
  const [password, onChangePassword] = useInput();
  const [nickname, onChangenickname] = useInput();

  const [term, setTerm] = useState();
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const [passwordCheck, setPasswordCheck] = useState();
  const [passwordError, setPasswordError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );

  const onSubmitSignup = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    dispatch({
      type: SIGN_UP,
      data: { email, password, nickname },
    });
  }, [dispatch, email, nickname, password, passwordCheck, term]);

  return (
    <form onFinish={onSubmitSignup}>
      <div>
        <label>이메일</label>
        <br />
        <input value={email} onChange={onChangeEmail} type="email" />
      </div>
      <div>
        <label>닉네임</label>
        <br />
        <input value={nickname} onChange={onChangenickname} />
      </div>
      <div>
        <label>비밀번호</label>
        <br />
        <input type="password" value={password} onChange={onChangePassword} />
      </div>
      <div>
        <label>비밀번호 체크</label>
        <br />
        <input
          type="password"
          value={passwordCheck}
          onChange={onChangePasswordCheck}
        />
        {passwordError && <div>비밀번호가 일치하지 않습니다.</div>}
      </div>
      <div>
        <input type="checkbox" onChange={onChangeTerm} checked={term} />
        <span>동의합니까?</span>
        {termError && <div>약관에 동의하셔야 합니다</div>}
      </div>
      <div>
        <button type="primary" htmlType="submit">
          회원가입
        </button>
        <Link to="/" style={{ background: "yellowgreen" }}>
          <button>홈으로</button>
        </Link>
      </div>
    </form>
  );
};

export default Signup;
