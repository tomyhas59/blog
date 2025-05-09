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
import styled from "styled-components";

const Top3Comment = () => {
  //좋아요 3개 이상이 있을 떄 Top3 표시
  const { top3Comments } = useSelector((state: RootState) => state.post);

  const hasLikersInTop3 = top3Comments.some(
    (comment) => comment.Likers.length > 2
  );

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
