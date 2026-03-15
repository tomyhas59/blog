import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../../../../reducer";
import {
  GET_POST_REQUEST,
  REMOVE_POST_REQUEST,
  SEARCH_POSTS_REQUEST,
} from "../../../../reducer/post";
import { baseURL } from "../../../../config";
import { DEFAULT_PROFILE_IMAGE } from "../../../../pages/Info/MyInfo";
import { usePagination } from "../../../../hooks/PaginationProvider";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import { formatDate } from "../../../../utils/date";

import * as S from "./PostDetailStyles";
import * as CS from "../../PostCommonStyles";
import ContentRenderer from "../../../renderer/ContentRenderer";
import PostEditForm from "../../Forms/PostEditForm"; // 이전 단계에서 만든 폼
import Like from "../../../ui/Like";
import Comment from "../../../comment/Comment";
import CommentForm from "../../../comment/CommentForm";
import UserPageButton from "../../../ui/UserPageButton";
import FollowButton from "../../../ui/FollowButton";

const PostDetail = () => {
  const socket = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { postId } = useParams();
  const { setSearchedCurrentPage } = usePagination();

  const me = useSelector((state: RootState) => state.user.me);
  const { post, totalCommentsCount } = useSelector(
    (state: RootState) => state.post,
  );

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editPost, setEditPost] = useState(false);
  const [showAuthorMenu, setShowAuthorMenu] = useState<boolean | {}>(false);

  const [showOptions, setShowOptions] = useState(false);

  const authorMenuRef = useRef<HTMLDivElement>(null);
  const postOptionsRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef, postOptionsRef], () => {
    setShowOptions(false);
    setShowAuthorMenu(false);
  });

  useEffect(() => {
    if (postId) dispatch({ type: GET_POST_REQUEST, postId });
  }, [dispatch, postId]);

  useEffect(() => {
    socket.current =
      process.env.NODE_ENV === "production"
        ? io("https://patient-marina-tomyhas59-8c3582f9.koyeb.app")
        : io("http://localhost:3075");
    return () => {
      socket.current?.disconnect();
    };
  }, [me]);

  useEffect(() => {
    if (post.userIdx === me?.id) {
      socket.current?.emit("readComment", [Number(postId), me?.id]);
    }
  }, [me?.id, post.userIdx, postId]);

  const toggleEditPostForm = useCallback(() => {
    setEditPost((prev) => {
      if (prev) dispatch({ type: "RESET_IMAGE_PATHS" });
      return !prev;
    });
  }, [dispatch]);

  const handleRemovePost = useCallback(() => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      dispatch({ type: REMOVE_POST_REQUEST, data: post.id });
      navigator("/");
    }
  }, [dispatch, navigator, post.id]);

  const searchByNickname = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: post.User.nickname,
        searchOption: "author",
      });
      setSearchedCurrentPage(1);
      navigator(
        `/search?searchText=${post.User.nickname}&searchOption=author&page=1`,
      );
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch, post.User?.nickname, setSearchedCurrentPage, navigator],
  );

  const getHashtagPosts = (hashtagName: string) => {
    navigator(`/hashtag?hashtagName=${hashtagName}&page=1`);
  };

  const sliderSettings = {
    infinite: true,
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (index: number) => setCurrentImageIndex(index),
  };

  if (!post.id) return null;

  return (
    <S.DetailContainer>
      <S.DetailHeader>
        <CS.PostHeaderLeftSection>
          <div style={{ position: "relative" }}>
            <CS.NicknameButton
              onClick={() => setShowAuthorMenu(!showAuthorMenu)}
            >
              <img
                src={
                  post.User?.Image
                    ? `${baseURL}/${post.User.Image.src}`
                    : DEFAULT_PROFILE_IMAGE
                }
                alt="프로필"
              />
              <CS.Nickname>{post.User?.nickname}</CS.Nickname>
            </CS.NicknameButton>
            {showAuthorMenu && (
              <CS.AuthorMenu ref={authorMenuRef} style={{ top: "45px" }}>
                <CS.StyledButton onClick={searchByNickname}>
                  작성 글 보기
                </CS.StyledButton>
                <UserPageButton userId={post.User.id} />
                {me?.id !== post.User.id && (
                  <FollowButton
                    userId={post.User.id}
                    setShowAuthorMenu={setShowAuthorMenu}
                  />
                )}
              </CS.AuthorMenu>
            )}
          </div>
          <S.DetailTitle>{post.title}</S.DetailTitle>
        </CS.PostHeaderLeftSection>

        <CS.PostMetaInfo>
          <CS.Date>{formatDate(post.createdAt)}</CS.Date>
          <Like itemType="post" item={post} />
          <CS.ViewCount>조회 {post.viewCount}</CS.ViewCount>
          {(me?.id === post.User?.id || me?.nickname === "admin") &&
            !editPost && (
              <S.OptionToggle onClick={() => setShowOptions(!showOptions)}>
                ⋮
                {showOptions && (
                  <CS.AuthorMenu
                    ref={postOptionsRef}
                    style={{ right: 0, left: "auto" }}
                  >
                    <CS.StyledButton onClick={toggleEditPostForm}>
                      수정
                    </CS.StyledButton>
                    <CS.StyledButton onClick={handleRemovePost}>
                      삭제
                    </CS.StyledButton>
                  </CS.AuthorMenu>
                )}
              </S.OptionToggle>
            )}
        </CS.PostMetaInfo>
      </S.DetailHeader>

      <S.DetailContentArea>
        {editPost ? (
          <PostEditForm
            post={post}
            setEditPost={setEditPost}
            toggleEditPostForm={toggleEditPostForm}
          />
        ) : (
          <>
            {post.Images?.length > 0 && (
              <S.ImageSection>
                {post.Images.length > 1 && (
                  <S.ImageCountBadge>
                    {currentImageIndex + 1} / {post.Images.length}
                  </S.ImageCountBadge>
                )}
                <S.StyledSlider {...sliderSettings}>
                  {post.Images.map((img) => (
                    <div key={img.id}>
                      <S.FullImage src={`${baseURL}/${img.src}`} alt="post" />
                    </div>
                  ))}
                </S.StyledSlider>
              </S.ImageSection>
            )}
            <ContentRenderer content={post.content} />
            <S.HashtagGroup>
              {post.Hashtags?.map((tag) => (
                <S.HashtagBadge
                  key={tag.id}
                  onClick={() => getHashtagPosts(tag.name)}
                >
                  #{tag.name}
                </S.HashtagBadge>
              ))}
            </S.HashtagGroup>
          </>
        )}
      </S.DetailContentArea>

      <S.CommentSection>
        <div
          style={{ marginBottom: "20px", fontWeight: 800, fontSize: "18px" }}
        >
          댓글 {totalCommentsCount}
        </div>
        <Comment post={post} />
        <CommentForm post={post} />
      </S.CommentSection>
    </S.DetailContainer>
  );
};

export default PostDetail;
