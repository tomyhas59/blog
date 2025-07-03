import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CommentForm from "../comment/CommentForm";
import Comment from "../comment/Comment";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_POST_REQUEST,
  SEARCH_POSTS_REQUEST,
  GET_POST_REQUEST,
  GET_HASHTAG_POSTS_REQUEST,
} from "../../reducer/post";
import "moment/locale/ko";
import { RootState } from "../../reducer";
import { baseURL } from "../../config";
import ContentRenderer from "../renderer/ContentRenderer";
import useOutsideClick from "../../hooks/useOutsideClick";
import useTextareaAutoHeight from "../../hooks/useTextareaAutoHeight";
import FollowButton from "../ui/FollowButton";
import { DEFAULT_PROFILE_IMAGE } from "../../pages/Info/MyInfo";

import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { usePagination } from "../../hooks/PaginationProvider";
import {
  Date,
  PostMetaInfo,
  ViewCount,
  PostHeaderLeftSection,
  StyledButton,
} from "./Post";
import Like from "../ui/Like";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PostEditForm from "./PostEditForm";
import UserPageButton from "../ui/UserPageButton";
import { formatDate } from "../../utils/date";

const CommonPost = () => {
  const socket = useRef<Socket | null>(null);
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();

  const { setSearchedCurrentPage } = usePagination();

  const { postId } = useParams();

  const { post, totalComments } = useSelector((state: RootState) => state.post);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageCountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (postId) {
      dispatch({
        type: GET_POST_REQUEST,
        postId: postId,
      });
    }
    setTimeout(() => {
      if (imageCountRef.current) imageCountRef.current.style.opacity = "1";
    }, 500);
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

  const [editPost, setEditPost] = useState(false);

  const navigator = useNavigate();

  const id = me?.id;
  const nickname = useSelector((state: RootState) => state.user.me?.nickname);

  const editPostRef = useRef<HTMLTextAreaElement>(null);

  //---닉네임 클릭 정보 보기-------------------------------------
  const [showAuthorMenu, setShowAuthorMenu] = useState<boolean | {}>(false);
  const toggleShowAuthorMenu = useCallback(() => {
    setShowAuthorMenu((prev) => !prev);
  }, []);

  //---게시글 수정, 삭제 토글-------------------------------------
  const [showOptions, setShowOptions] = useState(false);
  const toggleShowOptions = useCallback(() => {
    setShowOptions((prev) => !prev);
  }, []);

  //수정 시 높이 조정
  useTextareaAutoHeight(editPostRef, editPost);

  //OutsideClick----------------------------------------------
  const authorMenuRef = useRef<HTMLDivElement>(null);
  const postOptionsRef = useRef<HTMLDivElement>(null);

  useOutsideClick([authorMenuRef, postOptionsRef], () => {
    setShowOptions(false);
    setShowAuthorMenu(false);
  });

  //-----게시글 수정 및 취소-------------------------
  const toggleEditPostForm = useCallback(() => {
    setEditPost((prev) => {
      if (!prev) {
        console.log("open editForm");
      } else {
        dispatch({
          type: "RESET_IMAGE_PATHS",
        });
      }
      return !prev;
    });
  }, [dispatch]);

  const handleRemovePost = useCallback(() => {
    if (!window.confirm("삭제하시겠습니까?")) return false;
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
    navigator("/");
  }, [dispatch, navigator, post.id]);

  const setParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("searchText", post?.User?.nickname);
    params.set("searchOption", "author");
    params.set("page", "1");

    navigator({
      pathname: `/search`,
      search: params.toString(),
    });
  }, [navigator, post?.User?.nickname]);

  const searchByNickname = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({
        type: SEARCH_POSTS_REQUEST,
        searchText: post.User.nickname,
        searchOption: "author",
      });
      setSearchedCurrentPage(1);
      setParams();
      window.scrollTo({ top: 0, behavior: "auto" });
    },
    [dispatch, post.User?.nickname, setSearchedCurrentPage, setParams]
  );

  useEffect(() => {
    if (post.userIdx === me?.id) {
      socket.current?.emit("readComment", [Number(postId), me?.id]);
    }
  }, [me?.id, post.userIdx, postId]);

  const [showArrows, setShowArrows] = useState(false);

  //슬라이더 세팅
  const settings = {
    infinite: true,
    dots: true,
    arrows: showArrows,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    setTimeout(() => {
      if (imageCountRef.current) {
        imageCountRef.current.style.opacity = "1";
      }
      setShowArrows(true);
    }, 500);
  }, []);

  const getHashtagPosts = useCallback(
    (hashtagName: string) => {
      dispatch({
        type: GET_HASHTAG_POSTS_REQUEST,
        data: hashtagName,
      });

      const params = new URLSearchParams();
      params.set("hashtagName", hashtagName);
      params.set("page", "1");

      navigator({
        pathname: `/hashtag`,
        search: params.toString(),
      });
    },
    [navigator, dispatch]
  );

  return (
    <PostContainer>
      <PostItem>
        <PostHeader>
          <PostHeaderLeftSection>
            <NicknameButton onClick={toggleShowAuthorMenu}>
              <img
                src={
                  post.User?.Image
                    ? `${baseURL}/${post.User.Image.src}`
                    : `${DEFAULT_PROFILE_IMAGE}`
                }
                alt="유저 이미지"
              />
              {post.User?.nickname.slice(0, 5)}
            </NicknameButton>
            {showAuthorMenu && (
              <AuthorMenu ref={authorMenuRef}>
                <StyledButton onClick={searchByNickname}>
                  작성 글 보기
                </StyledButton>
                <UserPageButton userId={post.User.id} />
                {id !== post.User.id && (
                  <FollowButton
                    userId={post.User.id}
                    setShowAuthorMenu={setShowAuthorMenu}
                  />
                )}
              </AuthorMenu>
            )}
            <PostTitle>{post.title}</PostTitle>
          </PostHeaderLeftSection>
          <PostMetaInfo>
            <Date>{formatDate(post.createdAt)}</Date>
            <Like itemType="post" item={post} />
            <ViewCount>조회 수 {post.viewCount}</ViewCount>
          </PostMetaInfo>
        </PostHeader>
        <PostContent>
          {editPost ? (
            <PostEditForm
              post={post}
              setEditPost={setEditPost}
              toggleEditPostForm={toggleEditPostForm}
            />
          ) : (
            <ContentWrapper>
              {post.Images?.length <= 1 ? (
                post.Images.length === 1 ? (
                  <SlideImage
                    src={`${baseURL}/${post.Images[0].src}`}
                    alt={post.Images[0].src}
                  />
                ) : null
              ) : (
                <>
                  <ImageCount ref={imageCountRef}>
                    {currentImageIndex + 1}/{post.Images?.length || 0}
                  </ImageCount>
                  <StyledSlider
                    {...settings}
                    afterChange={(index) => setCurrentImageIndex(index)}
                  >
                    {post.Images?.map((image) => (
                      <div key={image.id}>
                        <SlideImage
                          src={`${baseURL}/${image.src}`}
                          alt={image.src}
                        />
                      </div>
                    ))}
                  </StyledSlider>
                </>
              )}
              <ContentRenderer content={post.content} />
              <HashtagsWrapper>
                {post.Hashtags?.map((tag) => (
                  <Hashtag
                    key={tag.id}
                    onClick={() => getHashtagPosts(tag.name)}
                  >
                    #{tag.name}
                  </Hashtag>
                ))}
              </HashtagsWrapper>
            </ContentWrapper>
          )}

          {id === post.User?.id || nickname === "admin" ? (
            <div>
              {!editPost && (
                <EditToggle onClick={toggleShowOptions}>
                  ⋮
                  {showOptions && (
                    <PostOptions ref={postOptionsRef}>
                      <StyledButton onClick={toggleEditPostForm}>
                        수정
                      </StyledButton>
                      <StyledButton onClick={handleRemovePost}>
                        삭제
                      </StyledButton>
                    </PostOptions>
                  )}
                </EditToggle>
              )}
            </div>
          ) : null}
        </PostContent>
      </PostItem>
      <CommentContainer>
        <CommentHeader>
          <CommentsCount>댓글 {totalComments && totalComments}개</CommentsCount>
        </CommentHeader>
        <Comment post={post} />
        <CommentForm post={post} />
      </CommentContainer>
    </PostContainer>
  );
};

export default CommonPost;

const PostContainer = styled.div`
  max-width: 800px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
  margin: 10px auto;
`;

const PostItem = styled.div`
  margin: 10px auto;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;
  border-bottom: 3px solid silver;
  padding: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PostTitle = styled.div`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 2px;
`;

const PostContent = styled.div`
  border-radius: 5px;
  margin: 10px auto;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 97%;
  min-height: 300px;
`;

const HashtagsWrapper = styled.div`
  margin-top: auto; /*위쪽 마진을 자동으로 채워 아래쪽으로 붙게 함*/
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Hashtag = styled.div`
  background-color: ${(props) => props.theme.subColor || "#f0f0f0"};
  color: ${(props) => props.theme.textColor || "#333"};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.mainColor || "#333"};
    color: #fff;
  }
`;

const CommentsCount = styled.span`
  font-size: 15px;
  font-weight: bold;
  margin: 5px;
  color: ${(props) => props.theme.textColor};
`;

const CommentContainer = styled.div`
  border-top: 3px solid silver;
  padding: 10px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 5px;
  margin-bottom: 10px;
  color: #333;
`;

const NicknameButton = styled.button`
  display: flex;
  justify-content: space-around;
  border-radius: 30%;
  align-items: center;
  min-width: 70px;
  color: ${(props) => props.theme.textColor};
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  img {
    display: inline;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
  &:hover {
    transform: translateY(-2px);
    color: ${(props) => props.theme.charColor};
  }
`;

const AuthorMenu = styled.div`
  position: absolute;
  top: 30px;
  left: 50px;
  display: flex;
  flex-direction: column;
`;

const PostOptions = styled.div`
  position: absolute;
  top: 20px;
  left: -30px;
  width: 40px;
  display: flex;
  flex-direction: column;
`;

const EditToggle = styled.div`
  position: relative;
  font-size: 19px;
  cursor: pointer;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 500px;
  border-radius: 20px;
  object-fit: fill;
  cursor: pointer;
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const StyledSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 50px;
    height: 50px;
  }

  .slick-prev:before,
  .slick-next::before {
    font-size: 50px;
    color: ${(props) => props.theme.mainColor};
    transition: color 0.3s;
  }

  .slick-prev::before:hover,
  .slick-next::before:hover {
    color: ${(props) => props.theme.subColor};
  }

  @media (max-width: 768px) {
    .slick-prev,
    .slick-next {
      width: 30px;
      height: 30px;
    }

    .slick-prev:before,
    .slick-next:before {
      font-size: 25px;
    }
  }
  margin-bottom: 40px;
`;

const ImageCount = styled.div`
  position: absolute;
  top: 8px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.5s;
`;
