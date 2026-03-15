import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import axios from "axios";

// Reducer & Types
import { RootState } from "../../../reducer";

// Hooks & Utils
import { formatDate } from "../../../utils/date";
import { baseURL } from "../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../../pages/Info/MyInfo";

// Components
import Like from "../../ui/Like";
import ContentRenderer from "../../renderer/ContentRenderer";

import * as S from "./Top3CommentStyles";

const Top3Comment = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // --- Global State ---
  const { top3Comments } = useSelector((state: RootState) => state.post);

  // 좋아요 3개 이상 체크 로직 유지
  const hasLikersInTop3 = top3Comments.some(
    (comment) => comment.Likers.length > 2,
  );

  // --- Scroll & Navigation Logic (기본 로직 보존) ---
  const handleMoveToComment = useCallback(
    async (postId: number, commentId: number) => {
      const target = document.getElementById(`comment-${commentId}`);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.style.backgroundColor = theme.activeColor;
        setTimeout(() => {
          target.style.backgroundColor = "";
        }, 3000);
      } else {
        // 페이지를 이동해야 하는 경우의 API 호출 및 파라미터 로직 유지
        const res = await axios.get("/post/getCommentPage", {
          params: { postId, commentId },
        });
        const targetCommentPage = res.data.page;

        const params = new URLSearchParams();
        const page = params.get("page") || "1";
        const sortBy = params.get("sortBy") || "comment";

        params.set("page", page.toString());
        params.set("sortBy", sortBy.toString());
        params.set("cPage", targetCommentPage.toString());
        params.set("commentId", commentId.toString());

        navigate(`/post/${postId}?${params.toString()}`);
      }
    },
    [theme.activeColor, navigate],
  );

  if (!hasLikersInTop3) return null;

  return (
    <S.BestCommentContainer>
      {top3Comments.map((comment, i) => (
        <S.BestCard key={comment.id}>
          <S.CardHeader>
            <S.UserInfo>
              <S.RankBadge>Top {i + 1}</S.RankBadge>
              <img
                src={
                  comment.User.Image
                    ? `${baseURL}/${comment.User.Image.src}`
                    : DEFAULT_PROFILE_IMAGE
                }
                alt="profile"
              />
              <span>{comment.User.nickname.slice(0, 5)}</span>
            </S.UserInfo>
            <S.Timestamp>{formatDate(comment.createdAt)}</S.Timestamp>
            <Like itemType="comment" item={comment} isTop3Comments={true} />
          </S.CardHeader>

          <S.ContentArea>
            <ContentRenderer content={comment.content} />
          </S.ContentArea>

          <S.NavigationLink
            onClick={() => handleMoveToComment(comment.PostId, comment.id)}
          >
            댓글로 이동
          </S.NavigationLink>
        </S.BestCard>
      ))}
    </S.BestCommentContainer>
  );
};

export default Top3Comment;
