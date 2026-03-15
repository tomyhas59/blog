import React from "react";
import * as S from "./PostInfoStyles";

const PostInfo = () => {
  return (
    <S.PostInfoWrapper>
      <S.PostMainInfo>
        <span className="label-author">작성자</span>
        <strong className="label-title">제목</strong>
      </S.PostMainInfo>

      <S.PostMetaInfo>
        <span className="meta-date">작성일</span>
        <span className="meta-like">추천</span>
        <span className="meta-view">조회</span>
      </S.PostMetaInfo>
    </S.PostInfoWrapper>
  );
};

export default PostInfo;
