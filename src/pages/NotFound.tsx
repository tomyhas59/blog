import React from "react";
import styled from "styled-components";

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
  color: #343a40;

  h1 {
    font-size: 3rem;
    margin: 0;
  }

  p {
    font-size: 1.5rem;
  }

  a {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const NotFound: React.FC = () => {
  return (
    <NotFoundContainer>
      <h1>404 Not Found</h1>
      <p>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>
      <a href="/">홈으로 돌아가기</a>
    </NotFoundContainer>
  );
};

export default NotFound;
