import React from "react";
import * as S from "./PostInfoStyles";

const PostInfo = () => {
  return (
    <S.PostInfoWrapper>
      <S.PostMainInfo>
        <S.InfoLabel className="label-author">
          <i className="fas fa-user"></i>
          <span>작성자</span>
        </S.InfoLabel>
        <S.InfoLabel className="label-title">
          <i className="fas fa-file-alt"></i>
          <span>제목</span>
        </S.InfoLabel>
      </S.PostMainInfo>

      <S.PostMetaInfo>
        <S.MetaLabel className="meta-date">
          <i className="far fa-calendar"></i>
          <span>작성일</span>
        </S.MetaLabel>
        <S.MetaLabel className="meta-like">
          <i className="far fa-heart"></i>
          <span>추천</span>
        </S.MetaLabel>
        <S.MetaLabel className="meta-view">
          <i className="far fa-eye"></i>
          <span>조회</span>
        </S.MetaLabel>
      </S.PostMetaInfo>
    </S.PostInfoWrapper>
  );
};

export default PostInfo;
