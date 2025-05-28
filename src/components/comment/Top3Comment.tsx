import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducer";

import Like from "../ui/Like";
import {
  Author,
  CommentHeader,
  CommentItem,
  Content,
  ContentWrapper,
  Date,
} from "./Comment";
import ContentRenderer from "../renderer/ContentRenderer";
import { baseURL } from "../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../pages/Info/MyInfo";
import moment from "moment";
import styled, { useTheme } from "styled-components";

const Top3Comment = () => {
  //좋아요 3개 이상이 있을 때 Top3 표시
  const { top3Comments } = useSelector((state: RootState) => state.post);

  const theme = useTheme();

  const hasLikersInTop3 = top3Comments.some(
    (comment) => comment.Likers.length > 2
  );

  const scrollToComment = (commentId: number) => {
    const target = document.getElementById(`comment-${commentId}`);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.style.backgroundColor = theme.activeColor;
      setTimeout(() => {
        target.style.backgroundColor = "";
      }, 3000);
    }
  };

  return (
    <div>
      {hasLikersInTop3 &&
        top3Comments.map((comment, i) => (
          <CommentItem key={comment.id} isTop3Comments={true}>
            <CommentHeader>
              <RankLabel>Top {i + 1}</RankLabel>
              <Author style={{ cursor: "default" }}>
                <img
                  src={
                    comment.User.Image
                      ? `${baseURL}/${comment.User.Image.src}`
                      : `${DEFAULT_PROFILE_IMAGE}`
                  }
                  alt="유저 이미지"
                />
                <span>{comment.User.nickname.slice(0, 5)}</span>
              </Author>
              <Date>{moment(comment.createdAt).format("l")}</Date>
              <Like itemType="comment" item={comment} isTop3Comments={true} />
            </CommentHeader>
            <ContentWrapper>
              <Content>
                <ContentRenderer content={comment.content} />
              </Content>
              <MoveButton onClick={() => scrollToComment(comment.id)}>
                댓글로 이동
              </MoveButton>
            </ContentWrapper>
          </CommentItem>
        ))}
    </div>
  );
};

export default Top3Comment;

const RankLabel = styled.div`
  font-weight: bold;
  color: #ff6f61;
  border-radius: 5px;
  text-align: center;
  align-self: start;
`;

const MoveButton = styled.button`
  color: ${(props) => props.theme.mainColor};
  border: none;
  position: absolute;
  bottom: 1%;
  right: 1%;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;
