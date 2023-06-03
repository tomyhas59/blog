import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const TodoTitle = ({ state }) => {
  return (
    <>
      <Title>
        할 일 목록 리스트{" "}
        <span style={{ color: "red", background: "yellowgreen" }}>
          {state.length}
        </span>
        개
      </Title>
      <Link to="/login">
        <Login>로그인</Login>
      </Link>
    </>
  );
};

export default TodoTitle;

const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;

const Title = styled.div`
  background-color: yellowgreen;
  border-radius: 5px;
  width: 500px;
  font-size: 32px;
  padding-left: 20px;
  position: relative;
  display: inline-block;
`;

const Login = styled.button`
  display: inline-block;
  border-radius: 5px;
  height: 35px;
  background-color: yellowgreen;
  color: white;
  cursor: pointer;
  :hover {
    background: rgb(200, 50, 70);
    animation: ${jump} 0.2s ease-out forwards;
  }
`;
