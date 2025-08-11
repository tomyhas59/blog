import React from "react";
import styled from "styled-components";

const PostInfo = () => {
  return (
    <PostInfoWrapper>
      <PostMainInfo>
        <span>작성자</span>
        <strong>제목</strong>
      </PostMainInfo>
      <PostMetaInfo>
        <span>작성 날짜 &nbsp;&nbsp;</span>
        <span>❤️</span>
        <span>조회</span>
      </PostMetaInfo>
    </PostInfoWrapper>
  );
};

export default PostInfo;

const PostInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  padding: 10px;
`;

const PostMainInfo = styled.div`
  display: flex;
  width: 80%;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  font-size: 12px;
  gap: 60px;
  * {
    color: ${(props) => props.theme.textColor};
    font-weight: bold;
  }
  @media (max-width: 768px) {
    width: 40%;
  }
`;

const PostMetaInfo = styled.div`
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  align-self: flex-end;
  gap: 5px;
  * {
    color: ${(props) => props.theme.textColor};
    font-weight: bold;
  }
`;
