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
} from "../../reducer/post";
import moment from "moment";
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
  Button,
} from "./Post";
import Like from "../ui/Like";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PostEditForm from "./PostEditForm";

const CommonPost = () => {
  const socket = useRef<Socket | null>(null);
  const me = useSelector((state: RootState) => state.user.me);
  const dispatch = useDispatch();

  const { setSearchedCurrentPage } = usePagination();

  const { postId } = useParams();

  const { post, totalComments } = useSelector((state: RootState) => state.post);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (postId) {
      dispatch({
        type: GET_POST_REQUEST,
        postId: postId,
      });
    }
    setAllImagesLoaded(true);
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
  const [content, setContent] = useState("");
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
        setContent(post.content);
      } else {
        dispatch({
          type: "CANCEL_MODIFY",
        });
      }
      return !prev;
    });
  }, [dispatch, post.content, setContent]);

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
    params.set("searchText", post.User?.nickname);
    params.set("searchOption", "author");
    params.set("page", "1");

    navigator({
      pathname: `/search`,
      search: params.toString(),
    });
  }, [navigator, post.User?.nickname]);

  //이미지 로딩
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

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

  //슬라이더 세팅
  const settings = {
    infinite: true,
    dots: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

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
                <Button onClick={searchByNickname}>작성 글 보기</Button>
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
            <Date>{moment(post.createdAt).format("l")}</Date>
            <Like itemType="post" item={post} />
            <ViewCount>조회 수 {post.viewCount}</ViewCount>
          </PostMetaInfo>
        </PostHeader>
        <PostContent>
          {editPost ? (
            <PostEditForm
              content={content}
              setContent={setContent}
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
                  <ImageCount className={allImagesLoaded ? "loaded" : ""}>
                    {currentImageIndex + 1}/{post.Images?.length || 0}
                  </ImageCount>
                  <StyledSlider
                    className={allImagesLoaded ? "loaded" : ""}
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
            </ContentWrapper>
          )}
          {id === post.User?.id || nickname === "admin" ? (
            <div>
              {!editPost && (
                <EditToggle onClick={toggleShowOptions}>
                  ⋮
                  {showOptions && (
                    <PostOptions ref={postOptionsRef}>
                      <Button onClick={toggleEditPostForm}>수정</Button>
                      <Button onClick={handleRemovePost}>삭제</Button>
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
  border-bottom: 1px solid silver;
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
  position: relative;
  width: 97%;
`;

const CommentsCount = styled.span`
  font-size: 15px;
  font-weight: bold;
  margin: 5px;
  color: ${(props) => props.theme.textColor};
`;

const CommentContainer = styled.div`
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
  object-fit: fill;
  cursor: pointer;
  @media (max-width: 768px) {
    height: 250px;
  }
`;

const StyledSlider = styled(Slider)`
  visibility: hidden;

  &.loaded {
    visibility: visible;
  }

  .slick-prev,
  .slick-next {
    z-index: 10;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }

  .slick-prev:hover,
  .slick-next:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .slick-prev:before,
  .slick-next:before {
    font-size: 20px;
    color: white;
    opacity: 1;
  }

  .slick-prev {
    left: 10px;
  }

  .slick-next {
    right: 10px;
  }
  @media (max-width: 768px) {
    .slick-prev,
    .slick-next {
      width: 30px;
      height: 30px;
    }

    .slick-prev:before,
    .slick-next:before {
      font-size: 16px;
    }

    .slick-prev {
      left: 5px;
    }

    .slick-next {
      right: 5px;
    }
  }
  margin-bottom: 40px;
`;

const ImageCount = styled.div`
  visibility: hidden;
  &.loaded {
    visibility: visible;
  }
  position: absolute;
  top: 8px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  z-index: 10;
`;
