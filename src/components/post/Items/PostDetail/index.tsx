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
import ContentRenderer from "../../../renderer/ContentRenderer";
import PostEditForm from "../../Forms/PostEditForm";
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
      {/* 헤더 */}
      <S.DetailHeader>
        <S.AuthorInfo>
          <S.AuthorWrapper>
            <S.AuthorButton onClick={() => setShowAuthorMenu(!showAuthorMenu)}>
              <S.ProfileImage
                src={
                  post.User?.Image
                    ? `${baseURL}/${post.User.Image.src}`
                    : DEFAULT_PROFILE_IMAGE
                }
                alt={post.User?.nickname}
              />
              <S.AuthorName>{post.User?.nickname}</S.AuthorName>
            </S.AuthorButton>

            {showAuthorMenu && (
              <S.AuthorMenu ref={authorMenuRef}>
                <S.MenuButton onClick={searchByNickname}>
                  <i className="fas fa-search"></i>
                  <span>작성 글 보기</span>
                </S.MenuButton>
                <UserPageButton userId={post.User.id} />
                {me?.id !== post.User.id && (
                  <FollowButton
                    userId={post.User.id}
                    setShowAuthorMenu={setShowAuthorMenu}
                  />
                )}
              </S.AuthorMenu>
            )}
          </S.AuthorWrapper>

          <S.PostDate>{formatDate(post.createdAt)}</S.PostDate>
        </S.AuthorInfo>

        <S.HeaderActions>
          <Like itemType="post" item={post} />
          <S.ViewCount>
            <i className="far fa-eye"></i>
            <span>{post.viewCount}</span>
          </S.ViewCount>
          {(me?.id === post.User?.id || me?.nickname === "admin") &&
            !editPost && (
              <S.OptionButton onClick={() => setShowOptions(!showOptions)}>
                <i className="fas fa-ellipsis-v"></i>
                {showOptions && (
                  <S.OptionsMenu ref={postOptionsRef}>
                    <S.MenuButton onClick={toggleEditPostForm}>
                      <i className="fas fa-edit"></i>
                      <span>수정</span>
                    </S.MenuButton>
                    <S.MenuButton onClick={handleRemovePost} className="danger">
                      <i className="fas fa-trash"></i>
                      <span>삭제</span>
                    </S.MenuButton>
                  </S.OptionsMenu>
                )}
              </S.OptionButton>
            )}
        </S.HeaderActions>
      </S.DetailHeader>

      {/* 제목 */}
      <S.TitleSection>
        <S.Title>{post.title}</S.Title>
      </S.TitleSection>

      {/* 본문 */}
      <S.ContentArea>
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
                  <S.ImageCounter>
                    {currentImageIndex + 1} / {post.Images.length}
                  </S.ImageCounter>
                )}
                <S.StyledSlider {...sliderSettings}>
                  {post.Images.map((img) => (
                    <div key={img.id}>
                      <S.PostImage
                        src={`${baseURL}/${img.src}`}
                        alt="게시물 이미지"
                      />
                    </div>
                  ))}
                </S.StyledSlider>
              </S.ImageSection>
            )}

            <S.TextContent>
              <ContentRenderer content={post.content} />
            </S.TextContent>

            {post.Hashtags?.length > 0 && (
              <S.HashtagSection>
                {post.Hashtags.map((tag) => (
                  <S.Hashtag
                    key={tag.id}
                    onClick={() => getHashtagPosts(tag.name)}
                  >
                    #{tag.name}
                  </S.Hashtag>
                ))}
              </S.HashtagSection>
            )}
          </>
        )}
      </S.ContentArea>

      {/* 댓글 */}
      <S.CommentSection>
        <S.CommentHeader>
          <i className="fas fa-comments"></i>
          <span>댓글</span>
          <S.CommentCount>{totalCommentsCount}</S.CommentCount>
        </S.CommentHeader>
        <Comment post={post} />
        <CommentForm post={post} />
      </S.CommentSection>
    </S.DetailContainer>
  );
};

export default PostDetail;
